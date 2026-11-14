import fs from "fs";

// Load .env.local manually
const envContent = fs.readFileSync(".env.local", "utf-8");
let resendKey = "";
for (const line of envContent.split("\n")) {
  if (line.startsWith("RESEND_API_KEY=")) {
    resendKey = line.replace("RESEND_API_KEY=", "").trim();
  }
}

if (!resendKey) {
  console.error("RESEND_API_KEY not found in .env.local");
  process.exit(1);
}

async function verifyResend() {
  console.log("Checking Resend API with configured key...");
  try {
    const res = await fetch("https://api.resend.com/domains", {
      headers: {
        Authorization: `Bearer ${resendKey}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Resend API error:", data);
      process.exit(1);
    }

    console.log("Resend API Authentication: SUCCESS");
    console.log("Domains found on Resend account:", data.data?.length || 0);
    if (data.data) {
      data.data.forEach((d) => {
        console.log(`- Domain: ${d.name} | Status: ${d.status} | Region: ${d.region} | Created: ${d.created_at}`);
      });
    }
  } catch (err) {
    console.error("Fetch error:", err.message);
  }
}

verifyResend();
