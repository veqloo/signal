"use client";

import { useState } from "react";
import { useSession, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import { useWorkspace } from "@/lib/workspace-context";
import { Header } from "@/components/dashboard/Header";
import { Check, ExternalLink, ShieldCheck, AlertCircle, Save } from "lucide-react";

export default function SettingsPage() {
  const { business, updateBusiness, refreshData, isLoading, workspaceError } = useWorkspace();
  const { user } = useUser();
  const { session } = useSession();
  const router = useRouter();
  const [onboardingLocation, setOnboardingLocation] = useState("Main location");
  const [onboardingAddress, setOnboardingAddress] = useState("");
  const [onboardingSaving, setOnboardingSaving] = useState(false);
  const [onboardingError, setOnboardingError] = useState<string | null>(null);

  const [name, setName] = useState(business?.name || "");
  const [category, setCategory] = useState(business?.category || "");
  const [welcomeMessage, setWelcomeMessage] = useState(business?.welcome_message || "");
  const [googleReviewUrl, setGoogleReviewUrl] = useState(business?.google_review_url || "");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name.trim() || !onboardingLocation.trim()) {
      setOnboardingError("Business name and location name are required.");
      return;
    }
    if (googleReviewUrl.trim()) {
      try {
        const url = new URL(googleReviewUrl.trim());
        if (url.protocol !== "https:") throw new Error();
      } catch {
        setOnboardingError("Enter a valid HTTPS Google review URL, or leave it empty.");
        return;
      }
    }
    setOnboardingSaving(true);
    setOnboardingError(null);
    try {
      const token = await session?.getToken();
      if (!token) throw new Error("Your session expired. Sign in again.");
      const supabase = getSupabaseClient(token);
      const slug = `${slugify(name.trim())}-${user.id.slice(-5).toLowerCase()}`;
      const { data: created, error: createError } = await supabase.from("businesses").insert({
        owner_id: user.id,
        name: name.trim(),
        slug,
        category: category.trim() || "Other",
        welcome_message: welcomeMessage.trim() || null,
        google_review_url: googleReviewUrl.trim() || null,
        onboarding_completed: true,
      }).select().single();
      if (createError) throw createError;
      const { error: locationError } = await supabase.from("locations").insert({
        business_id: created.id,
        name: onboardingLocation.trim(),
        slug: slugify(onboardingLocation.trim()) || "main",
        address: onboardingAddress.trim() || null,
        is_active: true,
      });
      if (locationError) {
        await supabase.from("businesses").delete().eq("id", created.id);
        throw locationError;
      }
      await refreshData();
      router.replace("/dashboard");
    } catch (err) {
      console.error("Onboarding failed:", err);
      setOnboardingError(err instanceof Error ? err.message : "Could not create your workspace.");
    } finally {
      setOnboardingSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Business name is required.");
      return;
    }

    if (googleReviewUrl.trim()) {
      try {
        const u = new URL(googleReviewUrl.trim());
        if (u.protocol !== "https:") {
          setErrorMsg("Google Review URL must use HTTPS.");
          return;
        }
      } catch {
        setErrorMsg("Please enter a valid Google Reviews HTTPS link.");
        return;
      }
    }

    setErrorMsg(null);
    setIsSaving(true);
    try {
      const ok = await updateBusiness({
        name: name.trim(),
        category: category.trim() || null,
        welcome_message: welcomeMessage.trim() || null,
        google_review_url: googleReviewUrl.trim() || null,
      });

      if (ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setErrorMsg("Failed to save changes. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="min-h-[70vh] grid place-items-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-900" /></div>;

  if (!business && !workspaceError) {
    return (
      <div className="min-h-screen bg-[#f7f8fa] px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8"><p className="text-xs font-semibold uppercase tracking-[.18em] text-blue-700">Signal workspace setup</p><h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">Let's set up your business.</h1><p className="mt-2 text-sm leading-6 text-zinc-600">Add your business details and first location. Signal will create your feedback page and QR code automatically.</p></div>
          <form onSubmit={handleOnboarding} className="space-y-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            <section className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2"><h2 className="text-sm font-semibold text-zinc-900">Business profile</h2></div>
              <label className="text-xs font-semibold text-zinc-700">Business name *<input required maxLength={80} value={name} onChange={e=>setName(e.target.value)} placeholder="Your business name" className="mt-2 h-11 w-full rounded-lg border border-zinc-200 px-3 text-sm font-normal outline-none transition focus:border-zinc-500 focus:ring-4 focus:ring-zinc-100"/></label>
              <label className="text-xs font-semibold text-zinc-700">Category<input value={category} onChange={e=>setCategory(e.target.value)} placeholder="Restaurant, café, retail..." className="mt-2 h-11 w-full rounded-lg border border-zinc-200 px-3 text-sm font-normal outline-none transition focus:border-zinc-500 focus:ring-4 focus:ring-zinc-100"/></label>
              <label className="text-xs font-semibold text-zinc-700 sm:col-span-2">Welcome message<textarea rows={3} value={welcomeMessage} onChange={e=>setWelcomeMessage(e.target.value)} className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm font-normal outline-none transition focus:border-zinc-500 focus:ring-4 focus:ring-zinc-100"/></label>
            </section>
            <section className="grid gap-4 border-t border-zinc-100 pt-6 sm:grid-cols-2">
              <div className="sm:col-span-2"><h2 className="text-sm font-semibold text-zinc-900">First location</h2></div>
              <label className="text-xs font-semibold text-zinc-700">Location name *<input required value={onboardingLocation} onChange={e=>setOnboardingLocation(e.target.value)} className="mt-2 h-11 w-full rounded-lg border border-zinc-200 px-3 text-sm font-normal"/></label>
              <label className="text-xs font-semibold text-zinc-700">Address (optional)<input value={onboardingAddress} onChange={e=>setOnboardingAddress(e.target.value)} placeholder="Street, city" className="mt-2 h-11 w-full rounded-lg border border-zinc-200 px-3 text-sm font-normal"/></label>
              <label className="text-xs font-semibold text-zinc-700 sm:col-span-2">Google review link (optional)<input type="url" value={googleReviewUrl} onChange={e=>setGoogleReviewUrl(e.target.value)} placeholder="https://g.page/r/..." className="mt-2 h-11 w-full rounded-lg border border-zinc-200 px-3 text-sm font-normal"/></label>
            </section>
            {onboardingError && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700">{onboardingError}</p>}
            <button type="submit" disabled={onboardingSaving} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800 active:scale-[.99] disabled:opacity-50">{onboardingSaving ? "Creating workspace..." : "Create workspace"}</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 pb-16">
      <Header
        title="Business Settings"
        subtitle="Manage your business identity, feedback form, and public review links"
      />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {saveSuccess && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>Settings saved successfully.</span>
            </div>
          )}

          {/* 1. Business Profile */}
          <div className="p-6 bg-white border border-slate-200 rounded-lg shadow-card space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Business Profile</h3>
              <p className="text-xs text-slate-500">
                Shown to customers when they scan your QR code.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Industry / Category
                </label>
                <input
                  type="text"
                  placeholder="e.g. Specialty Café, Italian Restaurant, Boutique Retail"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Welcome Message for Customers
                </label>
                <textarea
                  rows={2}
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  placeholder="e.g. We care deeply about your experience. How was your coffee, food, and service today?"
                  className="w-full p-3 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  Appears at the top of the feedback rating form.
                </span>
              </div>
            </div>
          </div>

          {/* 2. Google Reviews Integration */}
          <div className="p-6 bg-white border border-slate-200 rounded-lg shadow-card space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Google Reviews Public Invitation
                </h3>
                <p className="text-xs text-slate-500">
                  Invite customers to also post a public review on your Google Business profile.
                </p>
              </div>
              <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Google Review URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://g.page/r/your-business/review"
                  value={googleReviewUrl}
                  onChange={(e) => setGoogleReviewUrl(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                />
                {googleReviewUrl && (
                  <a
                    href={googleReviewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 text-xs font-medium border border-slate-200 rounded-md hover:bg-slate-50 text-slate-700 inline-flex items-center gap-1"
                  >
                    Test <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            {/* Regulatory and Unbiased Guarantee Notice */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 leading-relaxed space-y-1">
              <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                <span>Unbiased Public Review Policy</span>
              </div>
              <p>
                In compliance with FTC guidelines and Google policies, Signal never gates, conditions, or hides the Google Review invitation based on customer rating. Every customer who submits feedback receives the exact same voluntary invitation.
              </p>
            </div>
          </div>

          {/* 3. Public Slug Reference */}
          <div className="p-6 bg-white border border-slate-200 rounded-lg shadow-card space-y-2">
            <h3 className="text-sm font-semibold text-slate-900">Public Feedback Slug</h3>
            <p className="text-xs text-slate-500">
              Your unique public identification path on Signal.
            </p>
            <div className="text-xs font-mono bg-slate-50 px-3 py-2 rounded border border-slate-200 text-slate-700 inline-block">
              {business?.slug || "northside-coffee"}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-md transition shadow-sm disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
