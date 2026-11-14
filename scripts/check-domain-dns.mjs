import dns from "dns/promises";

async function inspectDomainDNS(domain) {
  console.log(`=== DNS Audit for ${domain} ===\n`);

  try {
    const txtRecords = await dns.resolveTxt(domain);
    console.log(`[TXT Records for ${domain}]:`);
    txtRecords.forEach((r) => console.log(`  - ${r.join("")}`));
  } catch (err) {
    console.log(`  [TXT error]: ${err.message}`);
  }

  try {
    const dkimDomain = `resend._domainkey.${domain}`;
    const dkimRecords = await dns.resolveTxt(dkimDomain).catch(() => dns.resolveCname(dkimDomain));
    console.log(`\n[DKIM records for ${dkimDomain}]:`);
    console.log(`  - ${JSON.stringify(dkimRecords)}`);
  } catch (err) {
    console.log(`\n[DKIM records for resend._domainkey.${domain}]: Not found (${err.message})`);
  }

  try {
    const dmarcDomain = `_dmarc.${domain}`;
    const dmarcRecords = await dns.resolveTxt(dmarcDomain);
    console.log(`\n[DMARC records for ${dmarcDomain}]:`);
    dmarcRecords.forEach((r) => console.log(`  - ${r.join("")}`));
  } catch (err) {
    console.log(`\n[DMARC records for _dmarc.${domain}]: Not found (${err.message})`);
  }

  try {
    const mxRecords = await dns.resolveMx(domain);
    console.log(`\n[MX records for ${domain}]:`);
    mxRecords.forEach((r) => console.log(`  - ${r.exchange} (priority ${r.priority})`));
  } catch (err) {
    console.log(`\n[MX records for ${domain}]: Not found (${err.message})`);
  }
}

inspectDomainDNS("veqlo.me");
