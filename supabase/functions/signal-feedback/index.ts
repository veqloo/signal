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

function cors(origin: string | null) {
  return {
    "Access-Control-Allow-Origin": origin && allowedOrigins.has(origin) ? origin : "https://signal.veqlo.me",
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
  if (!origin || !allowedOrigins.has(origin)) return json({ error: "Origin not allowed" }, 403, origin);

  const url = new URL(req.url);
  if (req.method === "GET") {
    const slug = url.searchParams.get("slug") ?? "";
    if (!validSlug(slug)) return json({ error: "Invalid business link" }, 400, origin);
    const { data, error } = await supabase
      .from("businesses")
      .select("id,name,slug,welcome_message,google_review_url")
      .eq("slug", slug)
      .maybeSingle();
    if (error) return json({ error: "Could not load business" }, 500, origin);
    if (!data) return json({ error: "Business not found" }, 404, origin);
    return json({ business: { ...data, google_review_url: safeReviewUrl(data.google_review_url) } }, 200, origin);
  }

  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405, origin);
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return json({ error: "Invalid JSON" }, 400, origin); }

  const slug = typeof body.slug === "string" ? body.slug : "";
  const rating = Number(body.rating);
  const category = typeof body.category === "string" ? body.category.trim().slice(0, 80) : null;
  const comment = typeof body.comment === "string" ? body.comment.trim().slice(0, 4000) : null;

  if (!validSlug(slug) || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return json({ error: "Please provide a valid business link and rating from 1 to 5." }, 400, origin);
  }

  const { data: business, error: lookupError } = await supabase
    .from("businesses")
    .select("id,google_review_url")
    .eq("slug", slug)
    .maybeSingle();
  if (lookupError) return json({ error: "Could not find business" }, 500, origin);
  if (!business) return json({ error: "Business not found" }, 404, origin);

  const { error: insertError } = await supabase.from("feedback").insert({
    business_id: business.id,
    rating,
    category: category || null,
    comment: comment || null,
  });
  if (insertError) return json({ error: "Could not save feedback" }, 500, origin);

  // The same optional review invitation is returned for every rating.
  return json({ success: true, google_review_url: safeReviewUrl(business.google_review_url) }, 201, origin);
});
