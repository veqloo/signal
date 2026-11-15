import { createClient } from "@supabase/supabase-js";
import { CONFIG } from "../config";
import { useSession } from "@clerk/nextjs";
import { useMemo } from "react";

let standardClient: ReturnType<typeof createClient> | null = null;

/**
 * Standard Supabase client (anon key)
 */
export function getSupabaseClient(token?: string | null) {
  if (token) {
    return createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey, {
      accessToken: async () => token,
    });
  }

  if (typeof window === "undefined") {
    return createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey);
  }

  if (!standardClient) {
    standardClient = createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey);
  }

  return standardClient;
}

/**
 * Hook for React components to get a Supabase client that automatically
 * attaches the active Clerk JWT session token on every fetch request.
 * This works natively with Supabase Third-Party Auth / JWKS verification.
 */
export function useClerkSupabaseClient() {
  const { session } = useSession();

  return useMemo(() => {
    return createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey, {
      accessToken: async () => (await session?.getToken()) ?? null,
    });
  }, [session]);
}
