import { createClient } from "npm:@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const allowedOrigins = new Set([
  "https://signal.veqlo.me",
  "https://signal-two-blue.vercel.app",
  "https://signal-extonzs-projects.vercel.app",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]);

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (allowedOrigins.has(origin)) return true;
  // Allow all Vercel preview deployments for the project
  if (/^https:\/\/signal-[a-z0-9-]+\.vercel\.app$/.test(origin)) return true;
  return false;
}

function cors(origin: string | null) {
  return {
    "Access-Control-Allow-Origin": isAllowedOrigin(origin) ? (origin as string) : "https://signal.veqlo.me",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Vary": "Origin",
    "Content-Type": "application/json",
  };
}

function json(data: unknown, status = 200, origin: string | null = null) {
  return new Response(JSON.stringify(data), { status, headers: cors(origin) });
}

function validSlug(value: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length <= 80;
}

function safeReviewUrl(value: unknown): string | null {
  if (typeof value !== "string" || value.length > 2048) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors(origin) });
  if (!isAllowedOrigin(origin)) return json({ error: "Origin not allowed" }, 403, origin);

  const url = new URL(req.url);
  if (req.method === "GET") {
    const slug = url.searchParams.get("slug") ?? "";
    if (!validSlug(slug)) return json({ error: "Invalid business link" }, 400, origin);
    const { data, error } = await supabase
      .from("businesses")
      .select("id,name,slug,category,welcome_message,google_review_url")
      .eq("slug", slug)
      .maybeSingle();
    if (error) return json({ error: "Could not load business" }, 500, origin);
    if (!data) return json({ error: "Business not found" }, 404, origin);

    // Optionally fetch active locations for this business if locations table exists
    const { data: locations } = await supabase
      .from("locations")
      .select("id,name,slug,address")
      .eq("business_id", data.id)
      .eq("is_active", true)
      .order("name", { ascending: true });

    return json({
      business: {
        ...data,
        google_review_url: safeReviewUrl(data.google_review_url),
        locations: locations || [],
      },
    }, 200, origin);
  }

  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405, origin);
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return json({ error: "Invalid JSON" }, 400, origin); }

  const slug = typeof body.slug === "string" ? body.slug : "";
  const rating = Number(body.rating);
  const category = typeof body.category === "string" ? body.category.trim().slice(0, 80) : null;
  const comment = typeof body.comment === "string" ? body.comment.trim().slice(0, 4000) : null;
  const locationSlug = typeof body.location_slug === "string" ? body.location_slug.trim().slice(0, 80) : null;
  const locationId = typeof body.location_id === "string" && /^[0-9a-f-]{36}$/i.test(body.location_id) ? body.location_id : null;

  if (!validSlug(slug) || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return json({ error: "Please provide a valid business link and rating from 1 to 5." }, 400, origin);
  }

  const forwardedFor = req.headers.get("x-forwarded-for") ?? req.headers.get("cf-connecting-ip");
  const clientIp = forwardedFor?.split(",")[0]?.trim();
  if (clientIp) {
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(clientIp));
    const ipHash = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, "0")).join("");
    const { error: limitInsertError } = await supabase.from("feedback_rate_limits").insert({ ip_hash: ipHash });
    if (!limitInsertError) {
      // Keep the private rate-limit table bounded.
      await supabase.from("feedback_rate_limits").delete()
        .lt("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
      const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
      const { count } = await supabase.from("feedback_rate_limits")
        .select("id", { count: "exact", head: true })
        .eq("ip_hash", ipHash)
        .gte("created_at", since);
      if ((count ?? 0) > 20) return json({ error: "Too many submissions. Please try again later." }, 429, origin);
    }
  }

  const { data: business, error: lookupError } = await supabase
    .from("businesses")
    .select("id,name,google_review_url")
    .eq("slug", slug)
    .maybeSingle();
  if (lookupError) return json({ error: "Could not find business" }, 500, origin);
  if (!business) return json({ error: "Business not found" }, 404, origin);

  // Resolve location id if provided
  let resolvedLocationId: string | null = locationId;
  if (!resolvedLocationId && locationSlug) {
    const { data: loc } = await supabase
      .from("locations")
      .select("id")
      .eq("business_id", business.id)
      .eq("slug", locationSlug)
      .maybeSingle();
    if (loc?.id) resolvedLocationId = loc.id;
  }

  const feedbackPayload: Record<string, unknown> = {
    business_id: business.id,
    rating,
    category: category || null,
    comment: comment || null,
    status: rating <= 2 ? "flagged" : "new",
  };
  if (resolvedLocationId) {
    feedbackPayload.location_id = resolvedLocationId;
  }

  const { data: savedFeedback, error: insertError } = await supabase
    .from("feedback")
    .insert(feedbackPayload)
    .select("id")
    .maybeSingle();

  if (insertError) {
    // Fallback without new columns in case migration is still pending
    const { error: fallbackError } = await supabase.from("feedback").insert({
      business_id: business.id,
      rating,
      category: category || null,
      comment: comment || null,
    });
    if (fallbackError) return json({ error: "Could not save feedback" }, 500, origin);
  }

  // Create notification for critical ratings (1 or 2 stars)
  if (rating <= 2) {
    try {
      await supabase.from("notifications").insert({
        business_id: business.id,
        feedback_id: savedFeedback?.id || null,
        title: `Low Rating Alert (${rating}/5)`,
        message: comment ? `"${comment.slice(0, 140)}"` : `Customer left a ${rating}-star rating in category: ${category || "General"}`,
        severity: rating === 1 ? "critical" : "warning",
      });
    } catch {
      // Notifications table might not exist yet, ignore
    }
  }

  // The same optional review invitation is returned for every rating.
  return json({
    success: true,
    google_review_url: safeReviewUrl(business.google_review_url),
  }, 201, origin);
});
