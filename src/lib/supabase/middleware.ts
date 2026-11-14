import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { CONFIG } from "../config";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    CONFIG.supabaseUrl,
    CONFIG.supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Always validate the user with Supabase; never trust client-side demo flags.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  const isProtectedRoute =
    path.startsWith("/dashboard") || path.startsWith("/onboarding");

  const isAuthRoute =
    path === "/login" ||
    path === "/signup" ||
    path === "/forgot-password";

  // Supabase returns null for both confirmation timestamps when the email
  // has not been verified. Check truthiness, not undefined-ness.
  const isEmailVerified = Boolean(user?.email_confirmed_at || user?.confirmed_at);

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  if (isProtectedRoute && user && !isEmailVerified) {
    const url = request.nextUrl.clone();
    url.pathname = "/verify-email";
    if (user.email) {
      url.searchParams.set("email", user.email);
    }
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && user && isEmailVerified) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
