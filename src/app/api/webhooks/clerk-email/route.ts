import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

// In-memory idempotency cache for deduplication (retained across warm serverless invocations)
const processedEvents = new Set<string>();

export async function POST(req: Request) {
  try {
    const rawPayload = await req.text();
    const svixId = req.headers.get("svix-id");
    const svixTimestamp = req.headers.get("svix-timestamp");
    const svixSignature = req.headers.get("svix-signature");

    const webhookSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

    let evt: any;

    if (webhookSecret) {
      if (!svixId || !svixTimestamp || !svixSignature) {
        return NextResponse.json(
          { error: "Missing required svix headers" },
          { status: 400 }
        );
      }

      const wh = new Webhook(webhookSecret);
      try {
        evt = wh.verify(rawPayload, {
          "svix-id": svixId,
          "svix-timestamp": svixTimestamp,
          "svix-signature": svixSignature,
        });
      } catch (err: any) {
        console.error("[Clerk Webhook] Signature verification failed:", err.message);
        return NextResponse.json(
          { error: "Webhook signature verification failed" },
          { status: 400 }
        );
      }
    } else {
      // In development / initial setup before webhook secret is configured
      console.warn(
        "[Clerk Webhook] CLERK_WEBHOOK_SIGNING_SECRET is not set. Processing unverified payload."
      );
      try {
        evt = JSON.parse(rawPayload);
      } catch {
        return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
      }
    }

    const eventId = svixId || evt?.data?.id || `evt_${Date.now()}`;
    const eventType = evt?.type;

    // Idempotency check: prevent duplicate deliveries on retried webhooks
    if (processedEvents.has(eventId)) {
      console.log(`[Clerk Webhook] Event ${eventId} already processed, skipping duplicate.`);
      return NextResponse.json({ success: true, duplicate: true });
    }

    // 1. Handle Transactional Email Delivery (Custom Delivery via Resend)
    if (eventType === "email.created" || eventType === "emails.created") {
      const data = evt.data || {};
      const recipient = data.to_email_address || data.email_address || data.to;
      const subject = data.subject || "Signal by Veqlo notification";
      const bodyHtml = data.body || data.html;
      const bodyPlain = data.body_plain || data.text;
      const slug = data.slug || "custom_template";

      if (!recipient) {
        console.error("[Clerk Email Webhook] Missing recipient email address in payload:", data);
        return NextResponse.json({ error: "Missing recipient" }, { status: 400 });
      }

      const resendApiKey = process.env.RESEND_API_KEY;
      if (!resendApiKey) {
        console.error("[Clerk Email Webhook] RESEND_API_KEY is not configured.");
        return NextResponse.json({ error: "Resend API key missing" }, { status: 500 });
      }

      const resend = new Resend(resendApiKey);

      console.log(`[Clerk Email Webhook] Dispatching [${slug}] to ${recipient} via Resend...`);

      const { data: resendData, error: resendError } = await resend.emails.send({
        from: "Signal by Veqlo <no-reply@veqlo.me>",
        to: recipient,
        subject,
        html: bodyHtml || `<p>${bodyPlain || "You have a new notification from Signal."}</p>`,
        text: bodyPlain,
      });

      if (resendError) {
        console.error("[Clerk Email Webhook] Resend delivery failed:", resendError);
        return NextResponse.json({ error: resendError.message }, { status: 502 });
      }

      processedEvents.add(eventId);
      // Keep memory cache constrained
      if (processedEvents.size > 5000) {
        const first = processedEvents.values().next().value;
        if (first) processedEvents.delete(first);
      }

      console.log(`[Clerk Email Webhook] Successfully sent email [${slug}] (Resend ID: ${resendData?.id})`);
      return NextResponse.json({
        success: true,
        messageId: resendData?.id,
        slug,
      });
    }

    // 2. Handle User Synchronization Events
    if (eventType === "user.created" || eventType === "user.updated") {
      const data = evt.data || {};
      const clerkUserId = data.id;
      const primaryEmail =
        data.email_addresses?.find((e: any) => e.id === data.primary_email_address_id)
          ?.email_address ||
        data.email_addresses?.[0]?.email_address;
      const fullName = `${data.first_name || ""} ${data.last_name || ""}`.trim();
      const avatarUrl = data.image_url || data.profile_image_url || "";

      console.log(`[Clerk User Webhook] User sync event: ${clerkUserId} (${primaryEmail})`);

      processedEvents.add(eventId);
      return NextResponse.json({ success: true, userSynced: clerkUserId });
    }

    // Acknowledge other Clerk events
    return NextResponse.json({ success: true, unhandledEvent: eventType });
  } catch (error: any) {
    console.error("[Clerk Webhook] Internal server error:", error);
    return NextResponse.json({ error: error.message || "Internal error" }, { status: 500 });
  }
}
