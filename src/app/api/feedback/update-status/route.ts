import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const ALLOWED_STATUSES = new Set(["new", "flagged", "resolved", "read"]);

export async function PATCH(req: Request) {
  const { userId, has, getToken } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const payload = body as { id?: unknown; status?: unknown; note?: unknown };
  if (
    typeof payload.id !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(payload.id) ||
    typeof payload.status !== "string" ||
    !ALLOWED_STATUSES.has(payload.status)
  ) {
    return NextResponse.json({ error: "Invalid feedback update" }, { status: 400 });
  }

  if (payload.note !== undefined) {
    if (typeof payload.note !== "string" || payload.note.length > 5000) {
      return NextResponse.json({ error: "Invalid internal note" }, { status: 400 });
    }
    if (!has({ feature: "feedback_triage" })) {
      return NextResponse.json({ error: "The Pro plan is required for internal notes" }, { status: 403 });
    }
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const token = await getToken();

  if (!supabaseUrl || !supabaseAnonKey || !token) {
    return NextResponse.json({ error: "Supabase session is not configured" }, { status: 503 });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const update: { status: string; internal_notes?: string } = {
    status: payload.status,
  };
  if (payload.note !== undefined) update.internal_notes = payload.note;

  const { data, error } = await supabase
    .from("feedback")
    .update(update)
    .eq("id", payload.id)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("[Feedback API] Update failed:", error.code);
    return NextResponse.json({ error: "Could not update feedback" }, { status: 403 });
  }
  if (!data) {
    return NextResponse.json({ error: "Feedback not found or access denied" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
