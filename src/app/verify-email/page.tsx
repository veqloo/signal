"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client";
import { Mail, CheckCircle2, AlertCircle, ArrowRight, RefreshCw, ArrowLeft } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const errorParam = searchParams.get("error");

  const [isResending, setIsResending] = useState(false);
  const [resendNotice, setResendNotice] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(
    errorParam === "invalid_or_expired_code"
      ? "The confirmation link has expired or was already used. Please request a new one."
      : null
  );

  const handleResend = async () => {
    if (!email) {
      setErrorNotice("Please enter your email on the login page to resend confirmation.");
      return;
    }
    setIsResending(true);
    setErrorNotice(null);
    setResendNotice(null);

    try {
      const supabase = getSupabaseClient();
      const origin = typeof window !== "undefined" ? window.location.origin : "https://signal.veqlo.me";
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: `${origin}/auth/callback`,
        },
      });

      if (error) throw error;
      setResendNotice("A new confirmation email has been dispatched. Please check your inbox.");
    } catch (err: any) {
      setErrorNotice(err.message || "Could not resend confirmation email. Please try again shortly.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4">
          <span className="font-bold text-2xl tracking-tight text-slate-900">
            signal<span className="text-blue-600">.</span>
          </span>
          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-slate-200 text-slate-500 bg-white font-medium">
            by Veqlo
          </span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Confirm your email address
        </h2>
        <p className="mt-1.5 text-xs text-slate-500">
          Verify your identity to activate your workspace and begin collecting customer feedback.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 border border-slate-200 shadow-sm rounded-xl space-y-6 text-center">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100">
            <Mail className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <p className="text-xs text-slate-600 leading-relaxed">
              We sent a verification link to:
            </p>
            <div className="text-sm font-semibold text-slate-900 bg-slate-50 py-2 px-3 rounded border border-slate-200 inline-block">
              {email || "your registered email"}
            </div>
            <p className="text-[11px] text-slate-400">
              Sender: <span className="font-mono text-slate-600">no-reply@veqlo.me</span>
            </p>
          </div>

          {errorNotice && (
            <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorNotice}</span>
            </div>
          )}

          {resendNotice && (
            <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs flex items-center gap-2 text-left">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{resendNotice}</span>
            </div>
          )}

          <div className="pt-2 border-t border-slate-100 space-y-3">
            <p className="text-[11px] text-slate-500">
              Did not receive the email? Check your spam/junk folder or request another link below.
            </p>
            {email && (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="w-full py-2 px-3 rounded-md text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isResending ? "animate-spin" : ""}`} />
                <span>{isResending ? "Resending..." : "Resend confirmation email"}</span>
              </button>
            )}
          </div>

          <div className="pt-2">
            <Link
              href="/login"
              className="text-xs text-blue-600 hover:underline font-semibold inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to sign in</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-400">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
