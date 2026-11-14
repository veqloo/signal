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

  // Authenticate user via Supabase server-side session token
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // Protected application routes
  const isProtectedRoute = path.startsWith("/dashboard") || path.startsWith("/onboarding");
  const isAuthRoute =
    path === "/login" ||
    path === "/signup" ||
    path === "/forgot-password";

  // Unauthenticated access to protected routes -> redirect to /login
  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  // If email verification is enabled and user has not confirmed their email
  // Prevent unconfirmed users from accessing the private dashboard
  if (isProtectedRoute && user && !user.email_confirmed_at && user.confirmed_at === undefined) {
    const url = request.nextUrl.clone();
    url.pathname = "/verify-email";
    if (user.email) {
      url.searchParams.set("email", user.email);
    }
    return NextResponse.redirect(url);
  }

  // Authenticated & verified users accessing login/signup -> redirect to /dashboard
  if (isAuthRoute && user && (user.email_confirmed_at || user.confirmed_at !== undefined)) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
