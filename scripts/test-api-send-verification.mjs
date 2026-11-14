import fs from "fs";

// Load .env.local
const envContent = fs.readFileSync(".env.local", "utf-8");
for (const line of envContent.split("\n")) {
  const [key, ...vals] = line.split("=");
  if (key && vals.length > 0) {
    process.env[key.trim()] = vals.join("=").trim();
  }
}

async function testApiSendVerification() {
  const { POST } = await import("../src/app/api/auth/send-verification/route.js").catch(async () => {
    // If route is ts, we test the logic directly
    const { Resend } = await import("resend");
    const { getConfirmationEmailHtml } = await import("../src/lib/email/templates/confirmation-email.ts");
    
    const resend = new Resend(process.env.RESEND_API_KEY);
    const emailHtml = getConfirmationEmailHtml({
      recipientEmail: "nastasiagar123@gmail.com",
      confirmationUrl: "https://signal.veqlo.me/auth/callback?code=test-confirmation-token",
      businessName: "Northside Coffee Lab",
    });

    const { data, error } = await resend.emails.send({
      from: "Signal by Veqlo <no-reply@veqlo.me>",
      to: ["nastasiagar123@gmail.com"],
      subject: "Confirm your Signal account",
      html: emailHtml,
    });

    if (error) {
      console.error("Direct Send Error:", error);
    } else {
      console.log("Direct Branded Template Send SUCCESS! ID:", data.id);
    }
  });
}

testApiSendVerification();
