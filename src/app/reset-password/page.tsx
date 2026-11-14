"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client";
import {
  ArrowRight,
  Lock,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const hasMinLength = password.length >= 8;
  const hasMixedCase = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const hasNumberOrSymbol = /[0-9!@#$%^&*]/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update password. Recovery link may have expired.");
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
            Set new password
          </h1>
          <p className="text-xs text-zinc-500">
            Choose a strong password to secure your Signal workspace.
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
                <h3 className="text-sm font-semibold text-zinc-900">Password updated</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Your password has been changed successfully. You can now access your dashboard.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/dashboard"
                  className="w-full inline-flex items-center justify-center gap-2 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 py-2.5 rounded-lg transition shadow-sm"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-700">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
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

                {password.length > 0 && (
                  <div className="pt-1.5 grid grid-cols-3 gap-1.5 text-[10px] text-zinc-500">
                    <span className={hasMinLength ? "text-emerald-600 font-medium" : ""}>
                      {hasMinLength ? "✓" : "•"} 8+ chars
                    </span>
                    <span className={hasMixedCase ? "text-emerald-600 font-medium" : ""}>
                      {hasMixedCase ? "✓" : "•"} A-Z & a-z
                    </span>
                    <span className={hasNumberOrSymbol ? "text-emerald-600 font-medium" : ""}>
                      {hasNumberOrSymbol ? "✓" : "•"} Number/symbol
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-700">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full text-xs rounded-lg border border-zinc-200 pl-9 pr-3 py-2 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition font-mono"
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
                    <span>Updating password...</span>
                  </>
                ) : (
                  <>
                    <span>Set new password</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
