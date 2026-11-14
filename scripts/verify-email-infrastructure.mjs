import dns from "dns/promises";

async function runEmailAudit() {
  console.log("==========================================================");
  console.log(" SIGNAL BY VEQLO — EMAIL INFRASTRUCTURE AUDIT (veqlo.me) ");
  console.log("==========================================================\n");

  const domain = "veqlo.me";
  const checks = {
    domain,
    spfConfigured: false,
    resendInSpf: false,
    zohoInSpf: false,
    dkimResendFound: false,
    dmarcConfigured: false,
    mxConfigured: false,
  };

  // 1. Audit SPF
  try {
    const txts = await dns.resolveTxt(domain);
    const spfRecord = txts.map((r) => r.join("")).find((t) => t.startsWith("v=spf1"));
    if (spfRecord) {
      checks.spfConfigured = true;
      checks.resendInSpf = spfRecord.includes("amazonses.com") || spfRecord.includes("resend.com");
      checks.zohoInSpf = spfRecord.includes("zoho.eu");
      console.log(`[SPF Record]: Found`);
      console.log(`  Raw: "${spfRecord}"`);
      console.log(`  Includes Zoho EU: ${checks.zohoInSpf ? "YES" : "NO"}`);
      console.log(`  Includes Resend/SES: ${checks.resendInSpf ? "YES" : "NO (REQUIRED FOR RESEND)"}`);
    } else {
      console.log(`[SPF Record]: MISSING on ${domain}`);
    }
  } catch (err) {
    console.log(`[SPF Record]: Error querying DNS (${err.message})`);
  }

  // 2. Audit Resend DKIM
  try {
    const dkimSelector = `resend._domainkey.${domain}`;
    const dkimTxt = await dns.resolveTxt(dkimSelector).catch(() => null);
    const dkimCname = await dns.resolveCname(dkimSelector).catch(() => null);
    if (dkimTxt || dkimCname) {
      checks.dkimResendFound = true;
      console.log(`\n[DKIM Selector (resend._domainkey)]: FOUND`);
      console.log(`  Target: ${JSON.stringify(dkimCname || dkimTxt)}`);
    } else {
      console.log(`\n[DKIM Selector (resend._domainkey)]: NOT FOUND (REQUIRED FOR RESEND)`);
    }
  } catch (err) {
    console.log(`\n[DKIM Selector (resend._domainkey)]: NOT FOUND`);
  }

  // 3. Audit DMARC
  try {
    const dmarcRecords = await dns.resolveTxt(`_dmarc.${domain}`);
    const dmarc = dmarcRecords.map((r) => r.join("")).find((t) => t.startsWith("v=DMARC1"));
    if (dmarc) {
      checks.dmarcConfigured = true;
      console.log(`\n[DMARC Record]: FOUND`);
      console.log(`  Raw: "${dmarc}"`);
    } else {
      console.log(`\n[DMARC Record]: MISSING`);
    }
  } catch (err) {
    console.log(`\n[DMARC Record]: NOT FOUND`);
  }

  // 4. Audit MX (Zoho)
  try {
    const mx = await dns.resolveMx(domain);
    if (mx.length > 0) {
      checks.mxConfigured = true;
      console.log(`\n[MX Records (Incoming Mail)]: Active (${mx.length} records)`);
      mx.forEach((m) => console.log(`  - ${m.exchange} (priority ${m.priority})`));
    }
  } catch (err) {
    console.log(`\n[MX Records]: NOT FOUND`);
  }

  // 5. Audit Environment Variables
  console.log(`\n[Application Environment]:`);
  const hasResendKey = Boolean(process.env.RESEND_API_KEY);
  console.log(`  RESEND_API_KEY in environment: ${hasResendKey ? "CONFIGURED" : "MISSING (Required for programmatic sending)"}`);

  // 6. Actionable Verdict
  console.log("\n==========================================================");
  console.log(" AUDIT VERDICT & ACTIONABLE REQUIREMENTS ");
  console.log("==========================================================");

  if (!checks.resendInSpf || !checks.dkimResendFound) {
    console.log("STATUS: RESEND DOMAIN VERIFICATION PENDING IN DNS");
    console.log("\nTo send authentication emails from 'no-reply@veqlo.me' via Resend:");
    console.log("1. Add 'veqlo.me' in the Resend Dashboard: https://resend.com/domains");
    console.log("2. In Cloudflare DNS, add the DKIM CNAME record from Resend (resend._domainkey.veqlo.me, DNS Only - Grey Cloud).");
    console.log("3. In Cloudflare DNS, update the SPF TXT record to:");
    console.log('   "v=spf1 include:zoho.eu include:amazonses.com ~all"');
    console.log("4. In Supabase Dashboard (Project hdwptihsatasnhazldmk -> Authentication -> SMTP Settings):");
    console.log("   - Toggle 'Enable Custom SMTP' to ON");
    console.log("   - Sender Email: no-reply@veqlo.me");
    console.log("   - Sender Name: Signal by Veqlo");
    console.log("   - Host: smtp.resend.com");
    console.log("   - Port: 587");
    console.log("   - Username: resend");
    console.log("   - Password: <YOUR_RESEND_API_KEY>");
  } else {
    console.log("STATUS: DNS RECORDS CONFIGURED FOR RESEND.");
  }
  console.log("==========================================================\n");
}

runEmailAudit();
