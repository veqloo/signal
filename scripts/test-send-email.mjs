import fs from "fs";

const envContent = fs.readFileSync(".env.local", "utf-8");
let resendKey = "";
for (const line of envContent.split("\n")) {
  if (line.startsWith("RESEND_API_KEY=")) {
    resendKey = line.replace("RESEND_API_KEY=", "").trim();
  }
}

async function testSend() {
  const recipient = "nastasiagar123@gmail.com";
  console.log(`Testing direct delivery from no-reply@veqlo.me to ${recipient}...`);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Signal by Veqlo <no-reply@veqlo.me>",
      to: [recipient],
      subject: "Confirm your Signal account (Infrastructure Test)",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e4e4e7; border-radius: 8px;">
          <h2 style="color: #09090b; margin-top: 0;">Signal by Veqlo</h2>
          <p style="color: #52525b; font-size: 14px; line-height: 20px;">
            This email verifies that <strong>no-reply@veqlo.me</strong> is fully authorized and delivering transactional authentication messages via Resend.
          </p>
          <div style="margin: 20px 0;">
            <span style="display: inline-block; background-color: #09090b; color: #ffffff; padding: 10px 18px; border-radius: 6px; font-size: 13px; font-weight: 600;">
              Infrastructure Verified
            </span>
          </div>
          <p style="color: #a1a1aa; font-size: 11px; margin-bottom: 0;">
            Sent from no-reply@veqlo.me &bull; Region: eu-west-1 &bull; Resend SMTP Relay
          </p>
        </div>
      `,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("Resend Send Error:", data);
  } else {
    console.log("Resend Send SUCCESS!");
    console.log("Email ID:", data.id);
  }
}

testSend();
