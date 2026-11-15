import { createClient } from "npm:@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing required Supabase function environment variables.");
}
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
    const { data: locations, error: locationsError } = await supabase
      .from("locations")
      .select("id,name,slug,address")
      .eq("business_id", data.id)
      .eq("is_active", true)
      .order("name", { ascending: true });
    if (locationsError) return json({ error: "Could not load business locations" }, 500, origin);

    return json({
      business: {
        ...data,
        google_review_url: safeReviewUrl(data.google_review_url),
        locations: locations || [],
      },
    }, 200, origin);
  }

  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405, origin);
  const contentLength = Number(req.headers.get("content-length") || 0);
  if (contentLength > 12_000) return json({ error: "Request is too large." }, 413, origin);

  let body: Record<string, unknown>;
  try {
    const rawBody = await req.text();
    if (rawBody.length > 12_000) return json({ error: "Request is too large." }, 413, origin);
    const parsed: unknown = JSON.parse(rawBody);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return json({ error: "Invalid request body." }, 400, origin);
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return json({ error: "Invalid JSON" }, 400, origin);
  }

  const slug = typeof body.slug === "string" ? body.slug : "";
  const rating = Number(body.rating);
  const allowedCategories = new Set(["Service", "Quality", "Speed", "Atmosphere", "Cleanliness", "Value", "Other"]);
  const rawCategory = typeof body.category === "string" ? body.category.trim() : "";
  if (rawCategory && !allowedCategories.has(rawCategory)) {
    return json({ error: "Please select a valid feedback category." }, 400, origin);
  }
  const category = rawCategory || null;
  const comment = typeof body.comment === "string" ? body.comment.trim().slice(0, 4000) : null;
  const locationSlug = typeof body.location_slug === "string" ? body.location_slug.trim().slice(0, 80) : null;
  const rawLocationId = typeof body.location_id === "string" && body.location_id.trim() ? body.location_id.trim() : null;
  const locationId = rawLocationId && /^[0-9a-f-]{36}$/i.test(rawLocationId) ? rawLocationId : null;

  if (!validSlug(slug) || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return json({ error: "Please provide a valid business link and rating from 1 to 5." }, 400, origin);
  }

  // Supabase Edge Functions may be reached directly rather than through the
  // user's Cloudflare zone. Prefer Cloudflare's client IP when present, then
  // use the gateway-provided forwarding headers.
  const forwardedFor = req.headers.get("x-forwarded-for");
  const clientIp =
    req.headers.get("cf-connecting-ip")?.trim() ||
    req.headers.get("x-real-ip")?.trim() ||
    forwardedFor?.split(",")[0]?.trim();
  if (!clientIp) {
    return json({ error: "Could not verify request origin. Please try again." }, 503, origin);
  }

  const rateLimitKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(serviceRoleKey),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const digest = await crypto.subtle.sign(
    "HMAC",
    rateLimitKey,
    new TextEncoder().encode(clientIp),
  );
  const ipHash = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, "0")).join("");
  const { error: limitInsertError } = await supabase.from("feedback_rate_limits").insert({ ip_hash: ipHash });
  if (limitInsertError) {
    console.error("Feedback rate-limit insert failed:", limitInsertError.message);
    return json({ error: "Feedback is temporarily unavailable. Please try again." }, 503, origin);
  }

  // Keep the private rate-limit table bounded.
  await supabase.from("feedback_rate_limits").delete()
    .lt("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
  const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { count, error: limitCountError } = await supabase.from("feedback_rate_limits")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", since);
  if (limitCountError) {
    console.error("Feedback rate-limit lookup failed:", limitCountError.message);
    return json({ error: "Feedback is temporarily unavailable. Please try again." }, 503, origin);
  }
  if ((count ?? 0) > 20) {
    return json({ error: "Too many submissions. Please try again later." }, 429, origin);
  }

  const { data: business, error: lookupError } = await supabase
    .from("businesses")
    .select("id,name,google_review_url")
    .eq("slug", slug)
    .maybeSingle();
  if (lookupError) return json({ error: "Could not find business" }, 500, origin);
  if (!business) return json({ error: "Business not found" }, 404, origin);

  // A supplied location must belong to the business in the URL. Never trust a
  // client-provided UUID without checking tenant ownership.
  if (rawLocationId && !locationId) {
    return json({ error: "Invalid location." }, 400, origin);
  }
  if (locationSlug && !validSlug(locationSlug)) {
    return json({ error: "Invalid location." }, 400, origin);
  }

  let resolvedLocationId: string | null = null;
  if (locationId || locationSlug) {
    let locationQuery = supabase
      .from("locations")
      .select("id")
      .eq("business_id", business.id)
      .eq("is_active", true);
    locationQuery = locationId
      ? locationQuery.eq("id", locationId)
      : locationQuery.eq("slug", locationSlug!);
    const { data: location, error: locationError } = await locationQuery.maybeSingle();
    if (locationError) return json({ error: "Could not verify this location." }, 500, origin);
    if (!location) return json({ error: "This location does not belong to the selected business." }, 400, origin);
    resolvedLocationId = location.id;
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
    console.error("Feedback insert failed:", insertError.message);
    return json({ error: "Could not save feedback. Please try again." }, 500, origin);
  }

  // Create notification for critical ratings (1 or 2 stars)
  if (rating <= 2) {
    try {
      const { error: notificationError } = await supabase.from("notifications").insert({
        business_id: business.id,
        feedback_id: savedFeedback?.id || null,
        title: `Low Rating Alert (${rating}/5)`,
        message: comment ? `"${comment.slice(0, 140)}"` : `Customer left a ${rating}-star rating in category: ${category || "General"}`,
        severity: rating === 1 ? "critical" : "warning",
      });
      if (notificationError) console.error("Could not create low-rating notification:", notificationError.message);
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
