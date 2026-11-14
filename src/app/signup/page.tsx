"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import {
  ArrowRight,
  Lock,
  Mail,
  Building,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [businessName, setBusinessName] = useState("");
  const [businessCategory, setBusinessCategory] = useState("Café & Restaurant");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Password strength rules
  const hasMinLength = password.length >= 8;
  const hasMixedCase = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const hasNumberOrSymbol = /[0-9!@#$%^&*]/.test(password);
  const isStrong = hasMinLength && hasMixedCase && hasNumberOrSymbol;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!businessName.trim()) {
      setErrorMsg("Please enter your business or venue name.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Please provide a valid work email address.");
      return;
    }

    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Password confirmation does not match.");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = getSupabaseClient();
      const origin =
        typeof window !== "undefined"
          ? window.location.origin
          : "https://signal.veqlo.me";

      const slug = `${slugify(businessName)}-${Math.random().toString(36).substring(2, 6)}`;

      const { data, error } = await supabase.auth.signUp({
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

      if (error) {
        throw error;
      }

      // Route unconditionally to verify-email to enforce strict email confirmation
      router.push(`/verify-email?email=${encodeURIComponent(email.trim())}`);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create account. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-6">
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
            Create your business account
          </h1>
          <p className="text-xs text-zinc-500">
            Start capturing frictionless customer feedback in under two minutes.
          </p>
        </div>

        {/* Signup Card */}
        <div className="bg-white border border-zinc-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Business Info Group */}
            <div className="space-y-3 pb-3 border-b border-zinc-100">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-700">
                  Business / Venue Name
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Blue Bottle Specialty Coffee"
                    className="w-full text-xs rounded-lg border border-zinc-200 pl-9 pr-3 py-2 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-700">
                  Business Category
                </label>
                <select
                  value={businessCategory}
                  onChange={(e) => setBusinessCategory(e.target.value)}
                  className="w-full text-xs rounded-lg border border-zinc-200 px-3 py-2 text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition"
                >
                  <option value="Café & Restaurant">Café, Bakery & Restaurant</option>
                  <option value="Retail & Boutique">Retail & Boutique Store</option>
                  <option value="Hospitality & Hotel">Hospitality, Hotel & Lodge</option>
                  <option value="Health & Wellness">Health, Spa & Wellness Studio</option>
                  <option value="Professional Services">Professional & Financial Services</option>
                  <option value="Other">Other Customer Business</option>
                </select>
              </div>
            </div>

            {/* Account Credentials */}
            <div className="space-y-3">
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
                <label className="text-xs font-medium text-zinc-700">
                  Password
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

                {/* Password Strength Checklist */}
                {password.length > 0 && (
                  <div className="pt-1.5 grid grid-cols-3 gap-2 text-[10px] text-zinc-500">
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
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full text-xs rounded-lg border border-zinc-200 pl-9 pr-3 py-2 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition font-mono"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-300 py-2.5 rounded-lg transition shadow-sm mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Registering workspace...</span>
                </>
              ) : (
                <>
                  <span>Create business account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-zinc-100 text-[11px] text-zinc-400 text-center flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
            <span>Strict privacy standards &bull; Zero tracking cookies &bull; GDPR ready</span>
          </div>
        </div>

        {/* Footer Login Prompt */}
        <div className="text-center text-xs text-zinc-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-zinc-900 hover:underline inline-flex items-center gap-0.5"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
