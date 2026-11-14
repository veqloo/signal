export const CONFIG = {
  appName: "Signal",
  tagline: "Listen beyond the rating.",
  brandParent: "Veqlo",
  brandUrl: "https://veqlo.me",
  supabaseUrl:
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://hdwptihsatasnhazldmk.supabase.co",
  supabaseAnonKey:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "sb_publishable_DzgTA_gWE2s-K-ye6JnLtg_dEhnvSrp",
  appUrl:
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== "undefined"
      ? window.location.origin
      : "https://signal.veqlo.me"),
  edgeFeedbackUrl:
    "https://hdwptihsatasnhazldmk.supabase.co/functions/v1/signal-feedback",
};
