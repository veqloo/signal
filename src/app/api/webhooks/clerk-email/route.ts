import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { Webhook } from "svix";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

function isUuid(value: unknown): value is string {
  return typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

export async function POST(req: Request) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook signing secret is not configured" }, { status: 503 });
  }

  const rawPayload = await req.text();
  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing required Svix headers" }, { status: 400 });
  }

  let event: any;
  try {
    event = new Webhook(webhookSecret).verify(rawPayload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    });
  } catch {
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    console.error("[Clerk Webhook] Supabase server credentials are not configured.");
    return NextResponse.json({ error: "Webhook persistence is not configured" }, { status: 503 });
  }

  const supabase = createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const eventType = event?.type;
  const eventId = svixId;

  // Claim the event before processing it so concurrent/retried deliveries cannot duplicate work.
  const { error: claimError } = await supabase
    .from("clerk_webhook_events")
    .insert({ event_id: eventId, event_type: eventType || "unknown", status: "processing" });

  if (claimError?.code === "23505") {
    return NextResponse.json({ success: true, duplicate: true });
  }
  if (claimError) {
    console.error("[Clerk Webhook] Could not claim event:", claimError.code);
    return NextResponse.json({ error: "Could not persist webhook event" }, { status: 503 });
  }

  try {
    if (eventType === "user.created" || eventType === "user.updated") {
      const user = event.data || {};
      const clerkUserId = user.id;
      const email =
        user.email_addresses?.find((item: any) => item.id === user.primary_email_address_id)?.email_address ||
        user.email_addresses?.[0]?.email_address;

      if (!clerkUserId || !email) {
        throw new Error("Clerk user event is missing an ID or primary email address");
      }

      const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ").trim();
      const legacyAuthId = user.public_metadata?.legacy_auth_id;
      const profile = {
        id: clerkUserId,
        clerk_user_id: clerkUserId,
        legacy_auth_id: isUuid(legacyAuthId) ? legacyAuthId : null,
        email,
        full_name: fullName || null,
        avatar_url: user.image_url || user.profile_image_url || null,
        updated_at: new Date().toISOString(),
      };

      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(profile, { onConflict: "id" });

      if (profileError) {
        throw new Error("Could not synchronize Clerk user profile");
      }

      // Imported users carry their previous Supabase UUID in Clerk public metadata.
      // Re-key ownership and memberships to the stable Clerk user ID without deleting business data.
      if (isUuid(legacyAuthId)) {
        const [{ error: businessError }, { error: membershipError }] = await Promise.all([
          supabase.from("businesses").update({ owner_id: clerkUserId }).eq("owner_id", legacyAuthId),
          supabase.from("business_memberships").update({ user_id: clerkUserId }).eq("user_id", legacyAuthId),
        ]);

        if (businessError || membershipError) {
          throw new Error("Could not migrate legacy business ownership to Clerk");
        }
      }
    } else if (eventType === "email.created" || eventType === "emails.created") {
      const data = event.data || {};
      const recipient = data.to_email_address || data.email_address || data.to;
      const subject = data.subject || "Signal by Veqlo notification";
      const html = data.body || data.html_body || data.html;
      const textBody = data.body_plain || data.text_body || data.text;
      const templateSlug = data.slug || data.template_slug || "transactional";

      if (typeof recipient !== "string" || !recipient.includes("@")) {
        throw new Error("Clerk email event is missing a valid recipient");
      }

      const resendApiKey = process.env.RESEND_API_KEY;
      if (!resendApiKey) {
        throw new Error("Resend API key is not configured");
      }

      const resend = new Resend(resendApiKey);
      const { error: sendError } = await resend.emails.send({
        from: "Signal by Veqlo <no-reply@veqlo.me>",
        to: [recipient],
        subject,
        html: typeof html === "string" ? html : `<p>${escapeHtml(typeof textBody === "string" ? textBody : "You have a new notification from Signal.")}</p>`,
        ...(typeof textBody === "string" ? { text: textBody } : {}),
      });

      if (sendError) {
        throw new Error("Resend could not deliver the Clerk email");
      }

      console.info("[Clerk Webhook] Transactional email delivered", { eventId, templateSlug });
    }

    const { error: completeError } = await supabase
      .from("clerk_webhook_events")
      .update({ status: "processed", processed_at: new Date().toISOString() })
      .eq("event_id", eventId);

    if (completeError) {
      throw new Error("Could not mark Clerk event as processed");
    }

    return NextResponse.json({ success: true, eventType });
  } catch (error) {
    // Delete the claim so Clerk's retry can process the event after the underlying issue is fixed.
    await supabase.from("clerk_webhook_events").delete().eq("event_id", eventId);
    console.error("[Clerk Webhook] Event processing failed:", {
      eventId,
      eventType,
      reason: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 503 });
  }
}
