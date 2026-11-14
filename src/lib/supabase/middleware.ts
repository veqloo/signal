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

  // Refresh auth token
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // Protect /dashboard and /onboarding
  const isProtectedRoute = path.startsWith("/dashboard") || path.startsWith("/onboarding");
  const isAuthRoute = path === "/login" || path === "/signup" || path === "/forgot-password";

  // Allow demo access cookie or query param
  const hasDemoCookie = request.cookies.get("signal_demo_mode")?.value === "1";
  const hasDemoQuery = request.nextUrl.searchParams.get("demo") === "1";

  if (isProtectedRoute && !user && !hasDemoCookie && !hasDemoQuery) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  // Redirect logged-in users away from auth pages
  if (isAuthRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
