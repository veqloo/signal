"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client";
import {
  Mail,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Building2,
  ExternalLink,
} from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  const errorParam = searchParams.get("error");
  const resentParam = searchParams.get("resent") === "true";

  const [email, setEmail] = useState(emailParam);
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<"idle" | "success" | "error">(
    resentParam ? "success" : "idle"
  );
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleResend = async () => {
    if (!email || countdown > 0) return;
    setIsResending(true);
    setResendStatus("idle");

    try {
      const supabase = getSupabaseClient();
      const origin =
        typeof window !== "undefined"
          ? window.location.origin
          : "https://signal.veqlo.me";

      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email.trim(),
        options: {
          emailRedirectTo: `${origin}/auth/callback`,
        },
      });

      if (error) throw error;
      setResendStatus("success");
      setCountdown(60);
    } catch (err: any) {
      setResendStatus("error");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Brand */}
      <div className="text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <span className="font-semibold text-2xl tracking-tight text-zinc-900">
            signal<span className="text-blue-600">.</span>
          </span>
          <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded border border-zinc-200 text-zinc-500 bg-zinc-50">
            by Veqlo
          </span>
        </Link>
        <h1 className="text-xl font-bold tracking-tight text-zinc-900">
          Confirm your email address
        </h1>
        <p className="text-xs text-zinc-500">
          We dispatched a secure activation link to protect your account.
        </p>
      </div>

      {/* Main Container Card */}
      <div className="bg-white border border-zinc-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-5">
        {errorParam === "invalid_or_expired_code" && (
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Link expired or invalid.</span>
              <p className="mt-0.5 text-[11px] text-amber-700">
                Please request a fresh confirmation link using the button below.
              </p>
            </div>
          </div>
        )}

        <div className="text-center py-2 space-y-3">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100">
            <Mail className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <p className="text-xs text-zinc-600">
              Activation email sent to:
            </p>
            <p className="text-sm font-semibold text-zinc-900 font-mono break-all px-3 py-1 bg-zinc-50 rounded border border-zinc-100 inline-block">
              {email || "your email address"}
            </p>
          </div>
        </div>

        {/* Sender details badge */}
        <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200 space-y-1.5 text-xs text-zinc-600">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-medium text-zinc-700">Expected Sender:</span>
            <span className="font-mono font-semibold text-zinc-900">Signal by Veqlo</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-medium text-zinc-700">Sender Address:</span>
            <span className="font-mono text-blue-600 font-medium">no-reply@veqlo.me</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-medium text-zinc-700">Subject:</span>
            <span className="text-zinc-800">Confirm your Signal account</span>
          </div>
        </div>

        {/* Resend actions */}
        <div className="pt-2 space-y-3">
          {resendStatus === "success" && (
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Fresh verification link dispatched to your inbox.</span>
            </div>
          )}

          {resendStatus === "error" && (
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>Could not resend email. Please verify the address and try again.</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleResend}
            disabled={isResending || countdown > 0 || !email}
            className="w-full inline-flex items-center justify-center gap-2 text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 disabled:opacity-50 py-2.5 rounded-lg transition"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isResending ? "animate-spin" : ""}`} />
            <span>
              {countdown > 0
                ? `Resend available in ${countdown}s`
                : isResending
                ? "Sending link..."
                : "Resend confirmation email"}
            </span>
          </button>
        </div>

        <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
          <Link href="/login" className="hover:text-zinc-900 transition">
            &larr; Back to sign in
          </Link>
          <Link href="/signup" className="hover:text-zinc-900 transition">
            Change email
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-center items-center p-4">
      <Suspense fallback={<div className="text-xs text-zinc-400">Loading...</div>}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
