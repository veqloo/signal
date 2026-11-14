import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";
  const type = requestUrl.searchParams.get("type");

  if (code) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // If recovery link, redirect directly to reset-password
      if (type === "recovery") {
        return NextResponse.redirect(new URL("/reset-password", request.url));
      }

      // Check if user has an existing business with onboarding completed
      const { data: businesses } = await supabase
        .from("businesses")
        .select("id, onboarding_completed")
        .eq("owner_id", data.user.id)
        .limit(1);

      if (!businesses || businesses.length === 0 || !businesses[0].onboarding_completed) {
        return NextResponse.redirect(new URL("/onboarding", request.url));
      }

      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  // If error or code invalid, redirect to verify-email with error notice
  return NextResponse.redirect(
    new URL("/verify-email?error=invalid_or_expired_code", request.url)
  );
}
