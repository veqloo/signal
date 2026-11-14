import { Resend } from "resend";
import fs from "fs";

function loadEnv() {
  const envContent = fs.readFileSync(".env.local", "utf8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const idx = trimmed.indexOf("=");
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();
      process.env[key] = val;
    }
  }
}

loadEnv();

const RESEND_API_KEY = process.env.RESEND_API_KEY;
if (!RESEND_API_KEY) {
  console.error("Missing RESEND_API_KEY in .env.local");
  process.exit(1);
}

console.log("Simulating Clerk 'email.created' webhook dispatch via Resend SDK...");

const resend = new Resend(RESEND_API_KEY);

const testPayload = {
  to: "nastasiagar123@gmail.com",
  from: "Signal by Veqlo <no-reply@veqlo.me>",
  subject: "Signal by Veqlo — Verification Code (Clerk Webhook Test)",
  html: `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; background: #ffffff; border: 1px solid #e4e4e7; border-radius: 12px;">
      <div style="margin-bottom: 24px;">
        <span style="display: inline-block; width: 32px; height: 32px; line-height: 32px; text-align: center; background: #18181b; color: #ffffff; border-radius: 8px; font-weight: 700; font-size: 16px;">S</span>
        <span style="margin-left: 8px; font-size: 18px; font-weight: 600; color: #18181b; letter-spacing: -0.02em;">Signal</span>
      </div>
      <h2 style="font-size: 20px; font-weight: 600; color: #18181b; margin: 0 0 12px 0;">Verification code</h2>
      <p style="font-size: 14px; color: #52525b; line-height: 1.5; margin: 0 0 24px 0;">Enter the following code to sign in to your Signal workspace:</p>
      <div style="background: #f4f4f5; border: 1px solid #e4e4e7; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 24px;">
        <span style="font-family: monospace; font-size: 28px; font-weight: 700; letter-spacing: 6px; color: #18181b;">849201</span>
      </div>
      <p style="font-size: 12px; color: #71717a; line-height: 1.5; margin: 0 0 24px 0;">This code was dispatched via Signal's Clerk Custom Email Webhook using Resend and verified domain <strong>veqlo.me</strong>.</p>
      <div style="border-top: 1px solid #f4f4f5; padding-top: 16px; font-size: 11px; color: #a1a1aa;">
        Signal by Veqlo &bull; Listen beyond the rating. &bull; <a href="https://veqlo.me" style="color: #71717a; text-decoration: underline;">veqlo.me</a>
      </div>
    </div>
  `,
  text: "Your Signal verification code is: 849201. This code expires in 10 minutes.",
};

async function run() {
  try {
    const { data, error } = await resend.emails.send(testPayload);
    if (error) {
      console.error("Resend error:", error);
      process.exit(1);
    }
    console.log("Success! Email dispatched via Resend with ID:", data.id);
  } catch (err) {
    console.error("Execution error:", err);
    process.exit(1);
  }
}

run();
