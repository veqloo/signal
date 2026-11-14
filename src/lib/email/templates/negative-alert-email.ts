/**
 * Signal by Veqlo - Negative Customer Feedback Alert Email Template
 * Sent to business owners/managers when a 1 or 2 star rating is recorded.
 */
export function getNegativeAlertEmailHtml({
  businessName,
  locationName,
  rating,
  category,
  comment,
  feedbackId,
  dashboardUrl,
}: {
  businessName: string;
  locationName?: string;
  rating: number;
  category?: string;
  comment?: string;
  feedbackId: string;
  dashboardUrl: string;
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Immediate Attention: Low Rating Received</title>
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
      padding: 24px 36px;
      border-bottom: 1px solid #f1f5f9;
      background-color: #fef2f2;
    }
    .alert-tag {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      color: #991b1b;
      margin-bottom: 4px;
    }
    .brand {
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
    }
    .content {
      padding: 32px 36px;
    }
    h1 {
      font-size: 18px;
      font-weight: 700;
      letter-spacing: -0.3px;
      color: #0f172a;
      margin: 0 0 16px 0;
    }
    .card {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 16px 20px;
      margin: 16px 0 24px 0;
    }
    .meta-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 12px;
    }
    .meta-label {
      color: #64748b;
      font-weight: 500;
    }
    .meta-value {
      color: #0f172a;
      font-weight: 600;
    }
    .comment-box {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #e2e8f0;
      font-size: 13px;
      line-height: 20px;
      color: #334155;
      font-style: italic;
    }
    .btn {
      display: inline-block;
      background-color: #0f172a;
      color: #ffffff !important;
      font-size: 13px;
      font-weight: 600;
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 6px;
    }
    .footer {
      padding: 20px 36px;
      background-color: #f8fafc;
      border-top: 1px solid #e2e8f0;
    }
    .footer p {
      font-size: 11px;
      color: #94a3b8;
      margin: 0;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <table class="container" align="center" width="100%">
      <tr>
        <td class="header">
          <div class="alert-tag">Triage Notice</div>
          <div class="brand">Signal &bull; ${escapeHtml(businessName)}</div>
        </td>
      </tr>
      <tr>
        <td class="content">
          <h1>Customer Rating: ${rating} / 5 Stars</h1>
          <p style="font-size: 13px; color: #475569; margin-bottom: 16px;">
            A customer just recorded low satisfaction${locationName ? ` at <strong>${escapeHtml(locationName)}</strong>` : ""}. Review the details below to evaluate operational response.
          </p>

          <div class="card">
            <table width="100%">
              <tr>
                <td style="font-size: 12px; color: #64748b; padding: 4px 0;">Rating:</td>
                <td align="right" style="font-size: 12px; font-weight: 700; color: #dc2626; padding: 4px 0;">${rating} of 5 Stars</td>
              </tr>
              ${
                locationName
                  ? `<tr>
                <td style="font-size: 12px; color: #64748b; padding: 4px 0;">Location:</td>
                <td align="right" style="font-size: 12px; font-weight: 600; color: #0f172a; padding: 4px 0;">${escapeHtml(
                  locationName
                )}</td>
              </tr>`
                  : ""
              }
              ${
                category
                  ? `<tr>
                <td style="font-size: 12px; color: #64748b; padding: 4px 0;">Category:</td>
                <td align="right" style="font-size: 12px; font-weight: 600; color: #0f172a; padding: 4px 0;">${escapeHtml(
                  category
                )}</td>
              </tr>`
                  : ""
              }
            </table>

            ${
              comment
                ? `<div class="comment-box">
              &ldquo;${escapeHtml(comment)}&rdquo;
            </div>`
                : `<div class="comment-box" style="color: #94a3b8; font-style: normal;">
              No written comment was provided.
            </div>`
            }
          </div>

          <div style="margin-top: 24px;">
            <a href="${dashboardUrl}" class="btn" target="_blank">Open Triage & Add Internal Note</a>
          </div>
        </td>
      </tr>
      <tr>
        <td class="footer">
          <p>
            You are receiving this alert because real-time alerts are enabled for ${escapeHtml(
              businessName
            )} in your Signal dashboard settings.
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
