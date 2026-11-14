import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { CONFIG } from "../config";

let browserClient: ReturnType<typeof createSupabaseClient> | null = null;

export function getSupabaseClient() {
  if (typeof window === "undefined") {
    return createSupabaseClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey);
  }

  if (!browserClient) {
    browserClient = createSupabaseClient(
      CONFIG.supabaseUrl,
      CONFIG.supabaseAnonKey,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      }
    );
  }

  return browserClient;
}
