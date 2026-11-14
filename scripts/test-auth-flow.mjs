import { createClient } from "@supabase/supabase-js";
import fs from "fs";

// Load .env.local
const envContent = fs.readFileSync(".env.local", "utf-8");
const env = {};
for (const line of envContent.split("\n")) {
  const [k, ...v] = line.split("=");
  if (k && v.length) env[k.trim()] = v.join("=").trim();
}

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testAuthSignup() {
  const testEmail = `test-verify-${Date.now()}@veqlo.me`;
  const testPassword = "SecurePassword123!";

  console.log(`Testing Supabase Auth signUp for: ${testEmail}...`);

  const { data, error } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: {
      emailRedirectTo: "https://signal.veqlo.me/auth/callback",
      data: {
        business_name: "Test Roastery Lab",
        business_category: "Café & Restaurant",
      },
    },
  });

  if (error) {
    console.error("SignUp Error:", error.message);
    return;
  }

  console.log("SignUp SUCCESS!");
  console.log("User ID:", data.user?.id);
  console.log("User Email:", data.user?.email);
  console.log("Email Confirmed At:", data.user?.email_confirmed_at);
  console.log("Session present immediately?:", Boolean(data.session));

  if (!data.user?.email_confirmed_at) {
    console.log("VERDICT: Email confirmation is REQUIRED by Supabase Auth.");
    console.log("A confirmation link was dispatched to the email.");
  } else {
    console.log("VERDICT: Autoconfirm is enabled on this Supabase project.");
  }
}

testAuthSignup();
