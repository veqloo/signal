"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client";
import { Lock, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Password strength check
  const hasMinLength = password.length >= 8;
  const hasMixedCase = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const hasNumberOrSymbol = /[0-9!@#$%^&*]/.test(password);
  const strengthScore = [hasMinLength, hasMixedCase, hasNumberOrSymbol].filter(Boolean).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters.");
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.message || "Could not update password. Please ensure recovery link is valid.");
    } finally {
      setIsSubmitting(false);
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
          Create new password
        </h2>
        <p className="mt-1.5 text-xs text-slate-500">
          Choose a secure password for your Signal business account.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 border border-slate-200 shadow-sm rounded-xl space-y-6">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {success ? (
            <div className="text-center py-4 space-y-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">Password Updated</h3>
              <p className="text-xs text-slate-600">
                Your password has been changed. Redirecting you to your dashboard...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                {/* Password strength bar */}
                {password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1 h-1">
                      <div
                        className={`flex-1 rounded-full ${
                          strengthScore >= 1 ? "bg-amber-400" : "bg-slate-200"
                        }`}
                      />
                      <div
                        className={`flex-1 rounded-full ${
                          strengthScore >= 2 ? "bg-blue-500" : "bg-slate-200"
                        }`}
                      />
                      <div
                        className={`flex-1 rounded-full ${
                          strengthScore >= 3 ? "bg-emerald-500" : "bg-slate-200"
                        }`}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      {strengthScore === 1 && "Weak password"}
                      {strengthScore === 2 && "Good password"}
                      {strengthScore === 3 && "Strong password"}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-md text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{isSubmitting ? "Updating..." : "Update Password"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
