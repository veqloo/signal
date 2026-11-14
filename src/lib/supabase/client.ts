import { createBrowserClient } from "@supabase/ssr";
import { CONFIG } from "../config";

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseClient() {
  if (typeof window === "undefined") {
    return createBrowserClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey);
  }

  if (!browserClient) {
    browserClient = createBrowserClient(
      CONFIG.supabaseUrl,
      CONFIG.supabaseAnonKey
    );
  }

  return browserClient;
}
