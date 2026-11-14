"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import { ArrowRight, Lock, Mail, Building, AlertCircle, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessCategory, setBusinessCategory] = useState("Café & Restaurant");

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Password strength calculation
  const hasMinLength = password.length >= 8;
  const hasMixedCase = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const hasNumberOrSymbol = /[0-9!@#$%^&*]/.test(password);
  const strengthScore = [hasMinLength, hasMixedCase, hasNumberOrSymbol].filter(Boolean).length;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters.");
      return;
    }

    if (!businessName.trim()) {
      setErrorMsg("Business name is required.");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = getSupabaseClient();
      const origin = typeof window !== "undefined" ? window.location.origin : "https://signal.veqlo.me";

      const slug = `${slugify(businessName)}-${Math.random().toString(36).slice(2, 6)}`;

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${origin}/auth/callback`,
          data: {
            business_name: businessName.trim(),
            business_slug: slug,
            business_category: businessCategory,
          },
        },
      });

      if (authError) throw authError;

      // If session exists immediately (e.g. autoconfirm enabled), create business and go to onboarding
      if (authData.session && authData.user) {
        await supabase.from("businesses").insert({
          owner_id: authData.user.id,
          name: businessName.trim(),
          slug,
          category: businessCategory,
          onboarding_completed: false,
        });

        router.push("/onboarding");
      } else {
        // Redirect to dedicated email verification screen
        router.push(`/verify-email?email=${encodeURIComponent(email.trim())}`);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
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
          Create your business account
        </h2>
        <p className="mt-1.5 text-xs text-slate-500">
          Start understanding what your customers really think in under 3 minutes.
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

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Business Details */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Business Name *
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Northside Roasters, Bistro 18"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Industry Category
              </label>
              <select
                value={businessCategory}
                onChange={(e) => setBusinessCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
              >
                <option>Café & Restaurant</option>
                <option>Retail & Specialty Shop</option>
                <option>Health & Wellness</option>
                <option>Hospitality & Hotel</option>
                <option>Professional Services</option>
                <option>Other</option>
              </select>
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Work Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="owner@yourcompany.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Password (min. 8 characters) *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              {/* Password strength bar */}
              {password && (
                <div className="mt-1.5 space-y-1">
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
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-md text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              <span>{isLoading ? "Creating account..." : "Create Account & Workspace"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-blue-600 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
