"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useWorkspace } from "@/lib/workspace-context";
import { getSupabaseClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import {
  Check,
  ArrowRight,
  Building,
  MapPin,
  Star,
  QrCode,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { business, updateBusiness, addLocation } = useWorkspace();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [businessName, setBusinessName] = useState(business?.name || "");
  const [category, setCategory] = useState(business?.category || "Café & Restaurant");
  const [welcomeMessage, setWelcomeMessage] = useState(
    business?.welcome_message || "How was your experience today? Tell us what we can improve."
  );
  const [locationName, setLocationName] = useState("Main Location");
  const [address, setAddress] = useState("");
  const [googleReviewUrl, setGoogleReviewUrl] = useState(business?.google_review_url || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) {
      setErrorMsg("Business name is required.");
      return;
    }
    setErrorMsg(null);
    setStep(2);
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setStep(3);
  };

  const handleStep3 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (googleReviewUrl.trim() && !/^https:\/\//i.test(googleReviewUrl.trim())) {
      setErrorMsg("Google Review URL must begin with https://");
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      // 1. Update business details
      await updateBusiness({
        name: businessName.trim(),
        category,
        welcome_message: welcomeMessage.trim() || null,
        google_review_url: googleReviewUrl.trim() || null,
        onboarding_completed: true,
      });

      // 2. Add initial location if provided
      if (locationName.trim()) {
        await addLocation(locationName.trim(), address.trim());
      }

      setStep(4);
    } catch (err: any) {
      setErrorMsg(err.message || "Could not save onboarding profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    router.push("/dashboard");
  };

  const stepsList = [
    { num: 1, label: "Business Profile" },
    { num: 2, label: "Primary Branch" },
    { num: 3, label: "Public Reviews" },
    { num: 4, label: "Launch" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-10 px-4 sm:px-6">
      <header className="max-w-2xl mx-auto w-full flex items-center justify-between pb-6 border-b border-slate-200">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-bold text-xl tracking-tight text-slate-900">
            signal<span className="text-blue-600">.</span>
          </span>
          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-slate-200 text-slate-500 bg-white font-medium">
            Setup Guide
          </span>
        </Link>
        <div className="text-xs text-slate-500">
          Step {step} of 4
        </div>
      </header>

      {/* Main Form Box */}
      <main className="max-w-xl mx-auto w-full my-auto py-8">
        {/* Progress pills */}
        <div className="flex items-center justify-between gap-2 mb-8">
          {stepsList.map((s) => (
            <div key={s.num} className="flex-1 flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition ${
                  step > s.num
                    ? "bg-emerald-600 text-white"
                    : step === s.num
                    ? "bg-slate-900 text-white"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {step > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
              </div>
              <span className="text-[11px] font-medium text-slate-600 hidden sm:inline">
                {s.label}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          {errorMsg && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <form onSubmit={handleStep1} className="space-y-5">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                  Step 1
                </span>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 mt-1">
                  Tell us about your business
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  These details will appear on your customer feedback page and printable QR stands.
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Business Name *
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Northside Roasters"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Business Industry
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
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

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Welcome Greeting for Customers
                </label>
                <textarea
                  rows={2}
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  placeholder="e.g. How was your coffee and service today?"
                  className="w-full p-3 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-md transition shadow-sm"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <form onSubmit={handleStep2} className="space-y-5">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                  Step 2
                </span>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 mt-1">
                  Add your primary location
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  If you have multiple branches, stores, or table areas, you can add more later.
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Location / Branch Name
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="e.g. Downtown Gran Vía, Terrace, Bar Counter"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Physical Address (optional)
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Calle Gran Vía 42, Madrid"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="pt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-md transition shadow-sm"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <form onSubmit={handleStep3} className="space-y-5">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                  Step 3
                </span>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 mt-1">
                  Configure Google Reviews link
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Invite patrons who submit feedback to also leave a public review on your Google Business profile.
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Google Review URL (optional)
                </label>
                <input
                  type="url"
                  placeholder="https://g.page/r/your-place/review"
                  value={googleReviewUrl}
                  onChange={(e) => setGoogleReviewUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 leading-relaxed space-y-1">
                <span className="font-semibold text-slate-900 block">Strict Compliance Policy:</span>
                <p>
                  Signal displays the voluntary Google Review invite to all customers equally, never gating or filtering negative ratings, in strict conformance with Google &amp; FTC terms.
                </p>
              </div>

              <div className="pt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-md transition shadow-sm disabled:opacity-50"
                >
                  <span>{isSubmitting ? "Saving..." : "Finish Setup"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: LAUNCH */}
          {step === 4 && (
            <div className="text-center py-4 space-y-6">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-bold tracking-tight text-slate-900">
                  Your Signal workspace is ready!
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Your customer feedback link is active and ready to be printed or shared.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Your Public Feedback Link
                </span>
                <div className="text-xs font-mono text-slate-800 truncate">
                  {typeof window !== "undefined"
                    ? `${window.location.origin}/f/${business?.slug || "your-slug"}`
                    : `/f/${business?.slug || "your-slug"}`}
                </div>
              </div>

              <button
                type="button"
                onClick={handleFinish}
                className="w-full py-2.5 px-4 rounded-md text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition shadow-sm flex items-center justify-center gap-2"
              >
                <span>Go to Executive Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="max-w-2xl mx-auto w-full pt-4 border-t border-slate-200 text-center text-xs text-slate-400">
        Signal by Veqlo · Listen beyond the rating
      </footer>
    </div>
  );
}
