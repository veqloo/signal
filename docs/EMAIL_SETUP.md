# Signal by Veqlo — Custom Domain Email Setup (`no-reply@veqlo.me`)

This document outlines the step-by-step procedure to configure custom sender email addresses (`no-reply@veqlo.me`) for **Signal**, powered by **Resend** and **Supabase Auth Custom SMTP**.

---

## 1. Architecture Overview

```
[ Customer / Business User ]
           │
           ▼
[ Supabase Auth (Sign up / Password Reset) ]
           │
           │ (via Custom SMTP - TLS port 587)
           ▼
[ Resend Transactional Mailer (smtp.resend.com) ]
           │
           │ (DKIM & SPF verified on veqlo.me)
           ▼
[ Recipient Inbox ] (From: "Signal by Veqlo <no-reply@veqlo.me>")
```

---

## 2. Cloudflare DNS Configuration for `veqlo.me`

To authenticate `veqlo.me` with Resend and achieve optimal deliverability (avoiding spam folders), add the following DNS records in your Cloudflare dashboard:

### A. SPF (Sender Policy Framework)
If you do not have an existing TXT record for SPF:
- **Type:** `TXT`
- **Name:** `@` (or `veqlo.me`)
- **Content:** `v=spf1 include:amazonses.com ~all`
- **TTL:** Auto

*(If you already have an SPF record, add `include:amazonses.com` before `~all`)*

### B. DKIM (DomainKeys Identified Mail)
Resend provides 3 CNAME or TXT records during domain registration in the Resend dashboard:
- **Type:** `CNAME`
- **Name:** `resend._domainkey` (or the 3 unique selector subdomains provided by Resend)
- **Target:** Provided in Resend (e.g. `feedback-veqlo.dkim.amazonses.com`)
- **Proxy Status:** DNS Only (Grey Cloud) — **Crucial**: DKIM records must not be proxied through Cloudflare CDN!

### C. DMARC (Domain-based Message Authentication)
- **Type:** `TXT`
- **Name:** `_dmarc`
- **Content:** `v=DMARC1; p=none; rua=mailto:security@veqlo.me`
- **TTL:** Auto

---

## 3. Resend Setup

1. Log into your Resend dashboard: [https://resend.com/domains](https://resend.com/domains)
2. Click **Add Domain** and enter `veqlo.me` (region: EU - Frankfurt `eu-west-1` or US).
3. Copy the DNS verification records into Cloudflare.
4. Click **Verify Records**. Once verified, status displays `Verified`.
5. Go to [https://resend.com/api-keys](https://resend.com/api-keys) and generate an API key with sending permissions.
   - Example key: `re_123456789_abcdef...`

---

## 4. Supabase Auth Custom SMTP Configuration

Configure Supabase Auth to route all system emails through your verified `veqlo.me` domain:

1. Open your Supabase Dashboard:
   - Project: `hdwptihsatasnhazldmk` (Signal)
   - Go to: **Project Settings** → **Authentication** → **SMTP Settings**
2. Toggle **Enable Custom SMTP** to **ON**.
3. Fill in the following credentials:
   - **Sender Email:** `no-reply@veqlo.me`
   - **Sender Name:** `Signal by Veqlo`
   - **Host:** `smtp.resend.com`
   - **Port:** `587` (or `465` for SSL)
   - **Minimum TLS Version:** `1.2`
   - **Username:** `resend`
   - **Password:** `re_...` *(Your Resend API Key)*
4. Click **Save Changes**.

---

## 5. Supabase Email Templates

Customize the email templates in Supabase under:
**Authentication** → **Email Templates**

### A. "Confirm your signup" Template
**Subject:** `Verify your email address — Signal`

**Body:**
```html
<table width="100%" cellpadding="0" cellspacing="0" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 40px 16px;">
  <tr>
    <td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; text-align: left;">
        <tr>
          <td style="padding: 28px 36px 20px 36px; border-bottom: 1px solid #f1f5f9;">
            <span style="font-size: 20px; font-weight: 700; color: #0f172a;">signal<span style="color: #2563eb;">.</span></span>
            <span style="font-size: 10px; font-weight: 600; text-transform: uppercase; color: #64748b; background-color: #f1f5f9; padding: 2px 6px; border-radius: 4px; margin-left: 8px;">by Veqlo</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 36px;">
            <h1 style="font-size: 19px; font-weight: 700; color: #0f172a; margin: 0 0 16px 0;">Verify your email address</h1>
            <p style="font-size: 14px; line-height: 22px; color: #475569; margin: 0 0 24px 0;">
              Thank you for registering your business on Signal. Please verify your email address to activate your account and access your feedback dashboard.
            </p>
            <div style="margin: 24px 0;">
              <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #0f172a; color: #ffffff; font-size: 13px; font-weight: 600; text-decoration: none; padding: 12px 24px; border-radius: 6px;">Verify Email Address</a>
            </div>
            <p style="font-size: 12px; color: #94a3b8; margin: 24px 0 0 0; border-top: 1px solid #f1f5f9; padding-top: 16px;">
              If you did not sign up for Signal, you can safely disregard this email.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px 36px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8;">
            &copy; Veqlo &bull; signal.veqlo.me &bull; Sent from no-reply@veqlo.me
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
```

### B. "Reset Password" Template
**Subject:** `Reset your password — Signal`

**Body:**
```html
<table width="100%" cellpadding="0" cellspacing="0" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 40px 16px;">
  <tr>
    <td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; text-align: left;">
        <tr>
          <td style="padding: 28px 36px 20px 36px; border-bottom: 1px solid #f1f5f9;">
            <span style="font-size: 20px; font-weight: 700; color: #0f172a;">signal<span style="color: #2563eb;">.</span></span>
            <span style="font-size: 10px; font-weight: 600; text-transform: uppercase; color: #64748b; background-color: #f1f5f9; padding: 2px 6px; border-radius: 4px; margin-left: 8px;">by Veqlo</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 36px;">
            <h1 style="font-size: 19px; font-weight: 700; color: #0f172a; margin: 0 0 16px 0;">Reset your password</h1>
            <p style="font-size: 14px; line-height: 22px; color: #475569; margin: 0 0 24px 0;">
              We received a request to reset your password. Click the button below to specify a new password for your account.
            </p>
            <div style="margin: 24px 0;">
              <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #0f172a; color: #ffffff; font-size: 13px; font-weight: 600; text-decoration: none; padding: 12px 24px; border-radius: 6px;">Reset Password</a>
            </div>
            <p style="font-size: 12px; color: #94a3b8; margin: 24px 0 0 0; border-top: 1px solid #f1f5f9; padding-top: 16px;">
              This link is valid for 1 hour. If you did not initiate this request, no action is needed.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px 36px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8;">
            &copy; Veqlo &bull; signal.veqlo.me &bull; Sent from no-reply@veqlo.me
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
```

---

## 6. Verification and Testing

1. In Supabase Dashboard, use the **Send test email** button to verify connectivity with `smtp.resend.com`.
2. Check that the test email arrives in your inbox with:
   - Header: `From: Signal by Veqlo <no-reply@veqlo.me>`
   - Security status: SPF `PASS`, DKIM `PASS`, DMARC `PASS`.
