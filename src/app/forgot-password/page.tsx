"use client";

import { useState } from "react";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabase/client";
import { ArrowRight, Mail, AlertCircle, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const supabase = getSupabaseClient();
      const origin =
        typeof window !== "undefined"
          ? window.location.origin
          : "https://signal.veqlo.me";

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${origin}/auth/callback?type=recovery`,
      });

      if (error) throw error;
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Could not dispatch password reset instructions.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm space-y-6">
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
            Reset your password
          </h1>
          <p className="text-xs text-zinc-500">
            Enter your account email to receive a secure password recovery link.
          </p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isSuccess ? (
            <div className="py-4 text-center space-y-4">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-zinc-900">Recovery email sent</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  We dispatched password reset instructions to{" "}
                  <strong className="text-zinc-900 font-mono">{email}</strong> from{" "}
                  <span className="font-mono text-zinc-900">no-reply@veqlo.me</span>.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/login"
                  className="w-full inline-flex items-center justify-center gap-2 text-xs font-semibold text-zinc-900 bg-zinc-100 hover:bg-zinc-200 py-2.5 rounded-lg transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to sign in</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-700">
                  Account Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@business.com"
                    className="w-full text-xs rounded-lg border border-zinc-200 pl-9 pr-3 py-2 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-300 py-2.5 rounded-lg transition shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Sending recovery link...</span>
                  </>
                ) : (
                  <>
                    <span>Send recovery link</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <Link
                  href="/login"
                  className="text-xs text-zinc-500 hover:text-zinc-900 transition inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Back to sign in</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
