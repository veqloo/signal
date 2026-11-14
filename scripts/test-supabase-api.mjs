async function testSupabaseApi() {
  const ref = "hdwptihsatasnhazldmk";
  const anonKey = "sb_publishable_DzgTA_gWE2s-K-ye6JnLtg_dEhnvSrp";

  // Test 1: Management API with anon key
  const res1 = await fetch(`https://api.supabase.com/v1/projects/${ref}/config/auth`, {
    headers: { Authorization: `Bearer ${anonKey}` },
  });
  console.log("Management API with anonKey status:", res1.status);
  const text1 = await res1.text();
  console.log("Management API response:", text1);
}

testSupabaseApi();
