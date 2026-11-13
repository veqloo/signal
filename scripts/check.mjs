import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const match = html.match(/<script type="module">([\s\S]*?)<\/script>/i);
if (!match) throw new Error("Missing application module script.");

const moduleSource = match[1].replace(/^\s*import\s+\{[^}]+\}\s+from\s+['"][^'"]+['"];?\s*/m, "");
new Function(moduleSource);

const required = [
  "createClient",
  "SUPABASE_URL",
  "signal-feedback",
  "businesses",
  "feedback",
  "signInWithPassword",
  "signUp",
  "google_review_url",
  "downloadQR",
];
for (const token of required) {
  if (!html.includes(token)) throw new Error("Missing required app feature/config: " + token);
}
if (html.includes("service_role")) throw new Error("A service-role secret must never be shipped to the browser.");
console.log("Signal frontend checks passed.");
