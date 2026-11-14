"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import PublicFeedbackPage from "./f/[slug]/page";
import {
  Star,
  QrCode,
  BarChart3,
  MapPin,
  FileText,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  Store,
  Coffee,
  ShoppingBag,
  Briefcase,
} from "lucide-react";

function HomePageContent() {
  const searchParams = useSearchParams();
  const legacyBusinessParam = searchParams.get("business");

  // Backwards compatibility: if accessed via /?business=slug, render public feedback form
  if (legacyBusinessParam) {
    return <PublicFeedbackPage />;
  }

  // Interactive Live Demo State
  const [demoRating, setDemoRating] = useState<number>(5);
  const [demoCategory, setDemoCategory] = useState<string>("Quality");
  const [demoCount, setDemoCount] = useState<number>(142);
  const [demoAvg, setDemoAvg] = useState<number>(4.8);
  const [demoSubmitted, setDemoSubmitted] = useState<boolean>(false);

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDemoCount((prev) => prev + 1);
    setDemoAvg(Number(((demoAvg * demoCount + demoRating) / (demoCount + 1)).toFixed(2)));
    setDemoSubmitted(true);
  };

  const handleResetDemo = () => {
    setDemoSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 border-b border-slate-200/80 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
            {/* Pill Announcement */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 bg-slate-50 text-slate-700 text-xs font-medium shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              <span>Signal 1.0 by Veqlo · Production release</span>
              <span className="text-slate-300">|</span>
              <Link href="/dashboard" className="text-blue-600 hover:underline inline-flex items-center gap-0.5">
                Explore Dashboard <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.08]">
              Customer feedback, <br className="hidden sm:inline" />
              <span className="text-slate-900">clearly understood.</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Customers scan a QR code, rate their visit in 10 seconds, and leave actionable insights. No apps or logins. Businesses monitor satisfaction, resolve problems, and listen beyond the rating.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 px-5 py-3 rounded-lg transition shadow-sm"
              >
                <span>Start free with Signal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-5 py-3 rounded-lg transition"
              >
                <BarChart3 className="w-4 h-4 text-slate-500" />
                <span>View Live Interactive Dashboard</span>
              </Link>
            </div>

            {/* Trust Points */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>No customer registration required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Unbiased Google Review invitations</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Multi-branch location tracking</span>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE DEMO SECTION */}
        <section id="interactive-demo" className="py-20 bg-slate-50 border-b border-slate-200/80">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <span className="text-[10px] font-bold tracking-widest uppercase text-blue-600">
                Live Interactive Experience
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Experience both sides in real time
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Try the customer feedback screen on the left. Watch how it immediately updates the business intelligence dashboard on the right.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Customer View Simulation (Left) */}
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-card space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="text-[11px] font-mono text-slate-400 ml-2">Customer Phone Screen</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    Mobile View
                  </span>
                </div>

                {!demoSubmitted ? (
                  <form onSubmit={handleDemoSubmit} className="space-y-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        Café & Bakery
                      </span>
                      <h3 className="text-lg font-bold text-slate-900">
                        Northside Coffee
                      </h3>
                      <p className="text-xs text-slate-500">
                        How was your coffee and service today?
                      </p>
                    </div>

                    {/* Interactive 5-star rating */}
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                        Rate your visit
                      </label>
                      <div className="flex items-center justify-between gap-1.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setDemoRating(s)}
                            className={`flex-1 py-2 rounded-lg border text-xs font-bold transition flex flex-col items-center gap-1 ${
                              demoRating >= s
                                ? "bg-amber-50 border-amber-300 text-amber-700"
                                : "bg-slate-50 border-slate-200 text-slate-400"
                            }`}
                          >
                            <Star
                              className={`w-4 h-4 ${
                                demoRating >= s ? "text-amber-500 fill-amber-500" : "text-slate-300"
                              }`}
                            />
                            <span>{s}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Category Selection */}
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Category
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {["Quality", "Service", "Speed", "Atmosphere"].map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setDemoCategory(cat)}
                            className={`text-xs px-2.5 py-1 rounded-md border font-medium transition ${
                              demoCategory === cat
                                ? "bg-slate-900 text-white border-slate-900"
                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-lg text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition flex items-center justify-center gap-1.5"
                    >
                      <span>Simulate Customer Submit</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-8 space-y-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Thank you!</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Feedback logged directly to the business dashboard.
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-600">
                      Google Review invitation displayed voluntarily.
                    </div>
                    <button
                      type="button"
                      onClick={handleResetDemo}
                      className="text-xs text-blue-600 hover:underline font-semibold"
                    >
                      Try submitting another response
                    </button>
                  </div>
                )}
              </div>

              {/* Dashboard Preview Simulation (Right) */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-card space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm tracking-tight text-slate-900">
                      Signal Intelligence
                    </span>
                    <span className="text-[10px] text-slate-400">· Live metric simulation</span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    Real-time
                  </span>
                </div>

                {/* Simulated KPI Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-medium text-slate-400 block">
                      Average Rating
                    </span>
                    <div className="text-xl font-bold text-slate-900 mt-1 flex items-baseline gap-1">
                      {demoAvg.toFixed(1)}
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 inline" />
                    </div>
                    <span className="text-[10px] text-emerald-600 font-semibold">+0.2 this week</span>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-medium text-slate-400 block">
                      Total Responses
                    </span>
                    <div className="text-xl font-bold text-slate-900 mt-1">
                      {demoCount}
                    </div>
                    <span className="text-[10px] text-slate-400">QR code scans</span>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-medium text-slate-400 block">
                      Satisfaction
                    </span>
                    <div className="text-xl font-bold text-emerald-600 mt-1">
                      94%
                    </div>
                    <span className="text-[10px] text-slate-400">4 &amp; 5 stars</span>
                  </div>
                </div>

                {/* Simulated Activity Stream */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-900 block">
                    Incoming Customer Stream
                  </span>
                  <div className="space-y-2">
                    {demoSubmitted && (
                      <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-200 text-xs flex items-center justify-between animate-in fade-in duration-300">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{demoRating}★</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                            {demoCategory}
                          </span>
                          <span className="text-slate-600">Simulated customer review just received</span>
                        </div>
                        <span className="text-[10px] text-blue-600 font-medium">just now</span>
                      </div>
                    )}
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs flex items-center justify-between text-slate-600">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">5★</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                          Service
                        </span>
                        <span>"Elena was super helpful at the register."</span>
                      </div>
                      <span className="text-[10px] text-slate-400">12m ago</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs flex items-center justify-between text-slate-600">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">5★</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                          Quality
                        </span>
                        <span>"Best flat white in town."</span>
                      </div>
                      <span className="text-[10px] text-slate-400">42m ago</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Link
                    href="/dashboard"
                    className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
                  >
                    Open full dashboard with 50+ responses <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CORE PILLARS SECTION */}
        <section id="features" className="py-20 bg-white border-b border-slate-200/80">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
              <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
                Product Architecture
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Engineered for real-world operations
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Every feature in Signal addresses an actual operational challenge faced by physical shops, cafés, and local retail businesses.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                  <QrCode className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Instant QR Feedback
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  No app download, no registration, no cumbersome survey forms. Customers scan a clean QR on their table or counter and rate their visit in 10 seconds.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Multi-Location Benchmarks
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Manage multiple stores, cafés, or table sections under one organization. Compare customer satisfaction, response volume, and staff performance per branch.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Unbiased Google Reviews
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every customer receives a voluntary invitation to leave a public Google review. Signal complies strictly with Google and FTC guidelines by never gating negative feedback.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Trend &amp; Sentiment Analytics
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Spot shifts in quality before bad public reviews appear. View customer satisfaction curves, day-of-week patterns, and category pain points (e.g. wait times).
                </p>
              </div>

              {/* Feature 5 */}
              <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Downloadable Executive Reports
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Generate professional PDF summaries and RFC-compliant CSV exports with a single click. Ideal for monthly team syncs, stakeholder reports, and staff training.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Critical Alert System
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Immediate triage for low ratings (1 or 2 stars). Flag urgent responses, assign internal resolution notes, and track resolution history with your team.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TARGET CUSTOMERS / USE CASES */}
        <section id="solutions" className="py-20 bg-slate-50 border-b border-slate-200/80">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
              <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
                Target Industries
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Built for businesses that care about craft
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-2.5">
                <div className="p-2 w-8 h-8 rounded-md bg-slate-100 text-slate-800 flex items-center justify-center">
                  <Coffee className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Cafés &amp; Coffee Roasters</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Table tents for sit-down guests and counter displays for to-go orders. Track bean quality, wait times, and barista hospitality.
                </p>
              </div>

              <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-2.5">
                <div className="p-2 w-8 h-8 rounded-md bg-slate-100 text-slate-800 flex items-center justify-center">
                  <Store className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Restaurants &amp; Bistros</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Printed bill insert cards so diners can rate their meal right as the check arrives. Catch food or service issues before they leave.
                </p>
              </div>

              <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-2.5">
                <div className="p-2 w-8 h-8 rounded-md bg-slate-100 text-slate-800 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Retail &amp; Boutiques</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Checkout counter stand or receipt QR codes. Measure customer satisfaction across fitting rooms, product selection, and checkout speed.
                </p>
              </div>

              <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-2.5">
                <div className="p-2 w-8 h-8 rounded-md bg-slate-100 text-slate-800 flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Service Businesses</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Clinics, salons, auto shops, and studios. Send a direct link after service completion to collect honest client impressions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* VEQLO ECOSYSTEM SECTION */}
        <section id="ecosystem" className="py-20 bg-white border-b border-slate-200/80">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="p-8 sm:p-10 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xl tracking-tight text-slate-900">
                    Veqlo<span className="text-emerald-500">.</span>
                  </span>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-slate-200 text-slate-600 bg-white font-medium">
                    Brand Ecosystem
                  </span>
                </div>
                <a
                  href="https://veqlo.me"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900 inline-flex items-center gap-1"
                >
                  Visit veqlo.me <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <p>
                  <strong>Signal belongs to Veqlo.</strong> Veqlo is an independent software brand focused on creating thoughtful digital products, lightweight tools, and practical software with a clear goal: build software that is simple to use, reliable in production, and respectful of people's privacy.
                </p>
                <p>
                  Signal embodies this philosophy: no tracking bloat, no forced account signups for your customers, no spammy survey funnels. Just direct, honest communication between you and the people you serve.
                </p>
              </div>

              <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Flagship Product</span>
                  <span className="text-xs font-bold text-slate-900">Signal (Feedback)</span>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Desktop Utility</span>
                  <span className="text-xs font-bold text-slate-900">Veqlo Quick</span>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Productivity</span>
                  <span className="text-xs font-bold text-slate-900">OpenInbox</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CALL TO ACTION */}
        <section className="py-20 bg-slate-900 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Listen beyond the rating today.
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
              Create your business profile, download your QR stand, and start gathering customer insights in under three minutes.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 px-6 py-3 rounded-lg transition shadow-sm"
              >
                <span>Get started free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-semibold text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 px-6 py-3 rounded-lg transition"
              >
                <span>Explore Live Dashboard</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-400">Loading Signal...</div>}>
      <HomePageContent />
    </Suspense>
  );
}
