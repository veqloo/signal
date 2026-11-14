import { createClient } from "@supabase/supabase-js";
import fs from "fs";

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

async function testQuery() {
  const { data: biz, error } = await supabase.from("businesses").select("name, slug, created_at").limit(5);
  console.log("Businesses query result:", { count: biz?.length, error: error?.message });
  if (biz) console.log(biz);
}

testQuery();
