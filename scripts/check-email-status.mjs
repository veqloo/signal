import fs from "fs";

const envContent = fs.readFileSync(".env.local", "utf-8");
let resendKey = "";
for (const line of envContent.split("\n")) {
  if (line.startsWith("RESEND_API_KEY=")) {
    resendKey = line.replace("RESEND_API_KEY=", "").trim();
  }
}

async function checkEmailStatus(id) {
  const res = await fetch(`https://api.resend.com/emails/${id}`, {
    headers: { Authorization: `Bearer ${resendKey}` },
  });
  const data = await res.json();
  console.log("Status:", data.last_event);
  console.log("From:", data.from);
  console.log("To:", data.to);
  console.log("Subject:", data.subject);
}

checkEmailStatus("01a1dbda-4d7b-7529-94d0-53300032015c");
