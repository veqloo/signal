"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client";
import { ArrowRight, Lock, Mail, AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setNeedsVerification(false);
    setIsLoading(true);

    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        // Check for unconfirmed email error
        if (
          error.message.toLowerCase().includes("email not confirmed") ||
          error.message.toLowerCase().includes("verify your email")
        ) {
          setNeedsVerification(true);
          throw new Error("Your email address has not been verified yet.");
        }
        throw error;
      }

      if (data?.user) {
        // Enforce verified email
        if (!data.user.email_confirmed_at && data.user.confirmed_at === undefined) {
          setNeedsVerification(true);
          router.push(`/verify-email?email=${encodeURIComponent(email.trim())}`);
          return;
        }

        // Navigate to dashboard or next url
        router.push(nextUrl);
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) return;
    try {
      const supabase = getSupabaseClient();
      await supabase.auth.resend({
        type: "signup",
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      router.push(`/verify-email?email=${encodeURIComponent(email.trim())}&resent=true`);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to resend verification email.");
    }
  };

  return (
    <div className="w-full max-w-sm space-y-6">
      {/* Brand Header */}
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
          Sign in to your account
        </h1>
        <p className="text-xs text-zinc-500">
          Access customer sentiment telemetry and multi-branch management.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm space-y-5">
        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span className="font-medium">{errorMsg}</span>
            </div>
            {needsVerification && (
              <button
                type="button"
                onClick={handleResendVerification}
                className="text-left text-xs text-red-800 underline font-semibold hover:text-red-950 ml-6"
              >
                Click here to resend verification email →
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-700">
              Work Email
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

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-zinc-700">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-[11px] font-medium text-zinc-500 hover:text-zinc-900 transition"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs rounded-lg border border-zinc-200 pl-9 pr-9 py-2 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center gap-2 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-300 py-2.5 rounded-lg transition shadow-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign in</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer Register Prompt */}
      <div className="text-center text-xs text-zinc-500">
        Don&apos;t have a Signal account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-zinc-900 hover:underline inline-flex items-center gap-0.5"
        >
          Create an account
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-center items-center p-4">
      <Suspense fallback={<div className="text-xs text-zinc-400">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
