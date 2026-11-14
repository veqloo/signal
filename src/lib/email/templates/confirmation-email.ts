/**
 * Signal by Veqlo - Confirmation & Verification Email Template
 * Minimalist, dark-slate enterprise aesthetic. Mobile-responsive table layout.
 */
export function getConfirmationEmailHtml({
  recipientEmail,
  confirmationUrl,
  businessName,
}: {
  recipientEmail: string;
  confirmationUrl: string;
  businessName?: string;
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm your Signal account</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      -webkit-font-smoothing: antialiased;
    }
    table {
      border-collapse: collapse;
    }
    .wrapper {
      width: 100%;
      background-color: #f8fafc;
      padding: 40px 16px;
    }
    .container {
      max-width: 540px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
    }
    .header {
      padding: 32px 36px 20px 36px;
      border-bottom: 1px solid #f1f5f9;
    }
    .brand {
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.5px;
      color: #0f172a;
      text-decoration: none;
    }
    .brand span {
      color: #2563eb;
    }
    .badge {
      display: inline-block;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      color: #64748b;
      background-color: #f1f5f9;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      padding: 2px 6px;
      margin-left: 8px;
      vertical-align: middle;
    }
    .content {
      padding: 36px;
    }
    h1 {
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.3px;
      color: #0f172a;
      margin: 0 0 16px 0;
    }
    p {
      font-size: 14px;
      line-height: 22px;
      color: #475569;
      margin: 0 0 20px 0;
    }
    .btn-container {
      margin: 28px 0;
    }
    .btn {
      display: inline-block;
      background-color: #0f172a;
      color: #ffffff !important;
      font-size: 13px;
      font-weight: 600;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 6px;
    }
    .footnote {
      font-size: 12px;
      line-height: 18px;
      color: #94a3b8;
      border-top: 1px solid #f1f5f9;
      padding-top: 20px;
      margin-top: 28px;
      word-break: break-all;
    }
    .footer {
      padding: 24px 36px;
      background-color: #f8fafc;
      border-top: 1px solid #e2e8f0;
      text-align: left;
    }
    .footer p {
      font-size: 11px;
      line-height: 16px;
      color: #94a3b8;
      margin: 0 0 6px 0;
    }
    .footer a {
      color: #64748b;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <table class="container" align="center" width="100%">
      <tr>
        <td class="header">
          <a href="https://signal.veqlo.me" class="brand">signal<span>.</span></a>
          <span class="badge">by Veqlo</span>
        </td>
      </tr>
      <tr>
        <td class="content">
          <h1>Verify your email address</h1>
          <p>
            Welcome to Signal${businessName ? ` for <strong>${escapeHtml(businessName)}</strong>` : ""}. To activate your workspace and protect your business dashboard, please verify that <strong>${escapeHtml(recipientEmail)}</strong> belongs to you.
          </p>

          <div class="btn-container">
            <a href="${confirmationUrl}" class="btn" target="_blank">Verify Email Address</a>
          </div>

          <p>
            This verification link will expire in 24 hours. After verifying, you will be guided directly into your business onboarding flow.
          </p>

          <div class="footnote">
            If the button above does not work, copy and paste this URL into your browser:<br>
            <a href="${confirmationUrl}" style="color: #2563eb;">${confirmationUrl}</a>
          </div>
        </td>
      </tr>
      <tr>
        <td class="footer">
          <p>
            Signal is an authentic customer feedback system created by <a href="https://veqlo.me" target="_blank">Veqlo</a>.
          </p>
          <p>
            If you did not initiate this registration, no action is required and you may safely disregard this message.
          </p>
          <p>
            &copy; ${new Date().getFullYear()} Veqlo. All rights reserved. &bull; Sent from no-reply@veqlo.me
          </p>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
