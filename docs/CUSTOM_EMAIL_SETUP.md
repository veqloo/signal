# Signal by Veqlo — Custom SMTP & Sender Domain Architecture

This document provides the verified technical audit and exact configuration required to route all Supabase authentication emails through **`no-reply@veqlo.me`** using **Resend** as the transactional SMTP relay.

---

## 1. Live DNS Audit Findings for `veqlo.me`

A live DNS audit conducted via `scripts/verify-email-infrastructure.mjs` against the authoritative nameservers for `veqlo.me` revealed:

| Record Type | Current DNS Content | Status for Resend | Required Action |
| :--- | :--- | :--- | :--- |
| **SPF (`TXT @`)** | `v=spf1 include:zoho.eu ~all` | ⚠️ Incomplete | Update to: `v=spf1 include:zoho.eu include:amazonses.com ~all` |
| **DKIM (`CNAME resend._domainkey`)** | *Not Found* | ❌ Missing | Add CNAME provided by Resend dashboard (DNS Only / Grey Cloud) |
| **DMARC (`TXT _dmarc`)** | `v=DMARC1; p=none; rua=...` | ✅ Configured | Maintained by Cloudflare DMARC Management |
| **MX (Incoming)** | `mx.zoho.eu`, `mx2.zoho.eu`, `mx3.zoho.eu` | ✅ Active | Preserved for existing Zoho EU mailboxes |

> [!IMPORTANT]
> Because `veqlo.me` currently lacks the Resend DKIM record and Amazon SES SPF include in Cloudflare, Resend will reject outbound emails from `no-reply@veqlo.me` with a `domain_not_verified` error until the DNS records below are saved in Cloudflare.

---

## 2. Step-by-Step Setup Guide

### Step 1: Add Domain in Resend
1. Log into your Resend dashboard: [https://resend.com/domains](https://resend.com/domains)
2. Click **Add Domain** and enter:
   ```
   veqlo.me
   ```
   (Region: EU - Frankfurt `eu-west-1` or US).
3. Resend will display your unique DKIM record values.

### Step 2: Configure Cloudflare DNS for `veqlo.me`
Open your Cloudflare DNS panel for `veqlo.me` and configure:

1. **Update SPF Record:**
   - **Type:** `TXT`
   - **Name:** `@` (or `veqlo.me`)
   - **Content:**
     ```
     v=spf1 include:zoho.eu include:amazonses.com ~all
     ```
   - **TTL:** Auto

2. **Add DKIM CNAME Record:**
   - **Type:** `CNAME`
   - **Name:** `resend._domainkey` (or selector provided in Resend)
   - **Target:** Target value from Resend (e.g. `feedback-veqlo.dkim.amazonses.com`)
   - **Proxy Status:** **DNS Only (Grey Cloud)** *(Crucial: DKIM must bypass Cloudflare HTTP proxy)*

3. Click **Verify Records** in Resend. Once verified, the badge will change to green `Verified`.

---

### Step 3: Generate Resend API Key for SMTP
1. Navigate to: [https://resend.com/api-keys](https://resend.com/api-keys)
2. Click **Create API Key**.
3. Name: `Signal Supabase SMTP`
4. Permission: **Full access** (or Sending access).
5. Copy the generated key (`re_...`).

---

### Step 4: Configure Supabase Auth Custom SMTP
To stop Supabase from sending emails via its default `noreply@mail.app.supabase.io` address:

1. Open Supabase Dashboard for project **`hdwptihsatasnhazldmk`**:
   [https://supabase.com/dashboard/project/hdwptihsatasnhazldmk/settings/auth](https://supabase.com/dashboard/project/hdwptihsatasnhazldmk/settings/auth)
2. Scroll to **SMTP Settings** and toggle **Enable Custom SMTP** to **ON**.
3. Enter the following parameters:

| Field | Production Value |
| :--- | :--- |
| **Sender Email** | `no-reply@veqlo.me` |
| **Sender Name** | `Signal by Veqlo` |
| **Host** | `smtp.resend.com` |
| **Port** | `587` |
| **Minimum TLS** | `1.2` |
| **Username** | `resend` |
| **Password** | `re_...` *(Your Resend API Key from Step 3)* |

4. Click **Save Changes**.

---

### Step 5: Configure Supabase URL & Redirects
Under **Authentication** → **URL Configuration**:
- **Site URL:** `https://signal.veqlo.me`
- **Redirect URLs:**
  - `https://signal.veqlo.me/auth/callback`
  - `http://localhost:3000/auth/callback` (for local development)

---

### Step 6: Verify Delivery
1. In the Supabase SMTP Settings panel, click **Send test email**.
2. Enter your email address.
3. Verify in your email client that the email arrives with:
   - **From:** `Signal by Veqlo <no-reply@veqlo.me>`
   - **SPF:** `PASS`
   - **DKIM:** `PASS`
   - **DMARC:** `PASS`

---

## 3. Automated Verification Script
Run the automated diagnostic script anytime in your terminal:
```bash
node scripts/verify-email-infrastructure.mjs
```
The script performs real-time DNS queries against `veqlo.me` and reports whether SPF, DKIM, DMARC, and MX records are compliant.
