"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Star, CheckCircle2, ArrowRight, ExternalLink, MapPin, Tag } from "lucide-react";
import { CONFIG } from "@/lib/config";

interface PublicBusinessData {
  id: string;
  name: string;
  slug: string;
  category?: string | null;
  welcome_message?: string | null;
  google_review_url?: string | null;
  locations?: Array<{ id: string; name: string; slug: string; address?: string }>;
}

function PublicFeedbackContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = (params?.slug as string) || searchParams.get("business") || "";
  const locationParam = searchParams.get("loc") || "";

  const [business, setBusiness] = useState<PublicBusinessData | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [category, setCategory] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [googleReviewUrl, setGoogleReviewUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    "Service",
    "Quality",
    "Speed",
    "Atmosphere",
    "Cleanliness",
    "Value",
    "Other",
  ];

  useEffect(() => {
    if (!slug) return;
    loadBusiness();
  }, [slug]);

  async function loadBusiness() {
    setIsLoading(true);
    try {
      // Fetch via Edge Function or Supabase
      const res = await fetch(`${CONFIG.edgeFeedbackUrl}?slug=${encodeURIComponent(slug)}`, {
        headers: {
          apikey: CONFIG.supabaseAnonKey,
        },
      });

      if (!res.ok) {
        throw new Error("Could not load business feedback page");
      }

      const data = await res.json();
      if (data?.business) {
        setBusiness(data.business);
        setGoogleReviewUrl(data.business.google_review_url || null);

        // Pre-select location if passed in query param
        if (locationParam && data.business.locations?.length) {
          const match = data.business.locations.find(
            (l: any) => l.slug === locationParam || l.id === locationParam
          );
          if (match) setSelectedLocation(match.slug);
        }
      }
    } catch (err: any) {
      // Fallback for preview / demo
      if (slug === "northside-coffee" || slug === "demo" || slug.startsWith("demo")) {
        setBusiness({
          id: "demo-biz-signal-001",
          name: "Northside Specialty Coffee",
          slug: "northside-coffee",
          category: "Café & Bakery",
          welcome_message:
            "We care deeply about your experience. How was your coffee, pastry, and service today?",
          google_review_url: "https://g.page/r/northside-coffee/review",
          locations: [
            { id: "loc-01", name: "Downtown Gran Vía", slug: "downtown" },
            { id: "loc-02", name: "Uptown Roastery", slug: "uptown" },
          ],
        });
        setGoogleReviewUrl("https://g.page/r/northside-coffee/review");
      } else {
        setErrorMsg("This feedback link is not currently available.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) {
      setErrorMsg("Please select a rating from 1 to 5 stars.");
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const res = await fetch(CONFIG.edgeFeedbackUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: CONFIG.supabaseAnonKey,
        },
        body: JSON.stringify({
          slug,
          rating,
          category: category || null,
          comment: comment.trim() || null,
          location_slug: selectedLocation || null,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Submission error. Please try again.");
      }

      if (result.google_review_url) {
        setGoogleReviewUrl(result.google_review_url);
      }
      setSubmitted(true);
    } catch (err: any) {
      // In demo / fallback mode, simulate graceful submission
      if (slug === "northside-coffee" || slug === "demo") {
        setSubmitted(true);
      } else {
        setErrorMsg(err.message || "Could not submit feedback. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 p-8 shadow-sm space-y-4 animate-pulse">
          <div className="h-4 w-24 bg-slate-200 rounded" />
          <div className="h-8 w-48 bg-slate-200 rounded" />
          <div className="h-16 w-full bg-slate-100 rounded" />
          <div className="h-12 w-full bg-slate-200 rounded" />
        </div>
      </div>
    );
  }

  if (errorMsg && !business) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 p-8 shadow-sm text-center space-y-3">
          <h2 className="text-base font-bold text-slate-900">Feedback Link Unavailable</h2>
          <p className="text-xs text-slate-500 leading-relaxed">{errorMsg}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-6 md:p-8">
      {/* Brand Header */}
      <header className="max-w-lg mx-auto w-full pt-4 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-lg tracking-tight text-slate-900">
            signal<span className="text-blue-600">.</span>
          </span>
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
            Customer Feedback
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-lg mx-auto w-full my-auto">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Business Name and Welcome */}
              <div className="space-y-1.5 border-b border-slate-100 pb-5">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                  {business?.category || "Direct Feedback"}
                </span>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  {business?.name || "How was your experience?"}
                </h1>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {business?.welcome_message ||
                    "Your direct feedback helps us improve our service. It takes less than 30 seconds."}
                </p>
              </div>

              {/* Location Selector (if business has multiple branches) */}
              {business?.locations && business.locations.length > 0 && (
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Location / Branch</span>
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full text-xs font-medium border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  >
                    <option value="">General (All locations)</option>
                    {business.locations.map((loc) => (
                      <option key={loc.id} value={loc.slug}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Rating 1-5 Stars */}
              <div>
                <label className="text-xs font-semibold text-slate-900 block mb-2">
                  Your Rating *
                </label>
                <div className="flex items-center justify-between gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = (hoverRating || rating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className={`flex-1 py-3 sm:py-3.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition ${
                          active
                            ? "bg-amber-50 border-amber-300 text-amber-600 scale-[1.02]"
                            : "bg-slate-50/70 border-slate-200 text-slate-400 hover:bg-slate-100"
                        }`}
                      >
                        <Star
                          className={`w-6 h-6 transition ${
                            active ? "text-amber-500 fill-amber-500" : "text-slate-300"
                          }`}
                        />
                        <span className="text-[11px] font-bold">{star}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  <span>What is this primarily about? (optional)</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(category === cat ? "" : cat)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition font-medium ${
                        category === cat
                          ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Written Comments */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Tell us more (optional)
                  </label>
                  <span className="text-[10px] text-slate-400">{comment.length} / 4000</span>
                </div>
                <textarea
                  rows={3}
                  maxLength={4000}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share any highlights or suggestions to help us improve..."
                  className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-900 bg-slate-50/50"
                />
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs">
                  {errorMsg}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !rating}
                className="w-full py-3 px-4 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{isSubmitting ? "Submitting..." : "Send Feedback"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Confirmation View */
            <div className="text-center py-6 space-y-6 animate-in fade-in duration-300">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div className="space-y-1.5">
                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                  Thank you for your feedback
                </h2>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Your response has been delivered directly to the team at {business?.name}.
                </p>
              </div>

              {/* Google Reviews Invitation (Voluntary & Unbiased) */}
              {googleReviewUrl && (
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <p className="text-xs text-slate-600">
                    Would you also like to share your review publicly on Google?
                  </p>
                  <a
                    href={googleReviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 transition border border-slate-200"
                  >
                    <span>Leave a Google Review</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-lg mx-auto w-full pt-6 pb-2 text-center text-[11px] text-slate-400">
        <span>Powered by Signal · </span>
        <a href="https://veqlo.me" target="_blank" rel="noreferrer" className="hover:underline">
          Veqlo
        </a>
      </footer>
    </div>
  );
}

export default function PublicFeedbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-400">Loading feedback form...</div>}>
      <PublicFeedbackContent />
    </Suspense>
  );
}
