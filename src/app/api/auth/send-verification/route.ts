import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getConfirmationEmailHtml } from "@/lib/email/templates/confirmation-email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, confirmationUrl, businessName } = body;

    if (!email || !confirmationUrl) {
      return NextResponse.json(
        { error: "Email and confirmationUrl are required." },
        { status: 400 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      // In development or when using Supabase built-in SMTP directly
      return NextResponse.json(
        {
          success: false,
          warning:
            "RESEND_API_KEY environment variable is not configured. When using Supabase Auth with custom SMTP, Supabase sends confirmation emails automatically via smtp.resend.com.",
        },
        { status: 200 }
      );
    }

    const resend = new Resend(resendApiKey);

    const emailHtml = getConfirmationEmailHtml({
      recipientEmail: email,
      confirmationUrl,
      businessName,
    });

    const { data, error } = await resend.emails.send({
      from: "Signal by Veqlo <no-reply@veqlo.me>",
      to: [email],
      subject: "Verify your email address — Signal",
      html: emailHtml,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message || "Failed to dispatch email via Resend." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, messageId: data?.id });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal server error." },
      { status: 500 }
    );
  }
}
