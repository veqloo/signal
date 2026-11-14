"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Check,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Sparkles,
  QrCode,
  Building2,
  FileText,
  Mail,
  Zap,
} from "lucide-react";

export default function PricingPage() {
  const [annualBilling, setAnnualBilling] = useState<boolean>(true);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="py-20 md:py-24 bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
            <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Transparent Pricing
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
              Simple plans for businesses of any size.
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Start free with no credit card required. Upgrade when your analytics and reporting needs grow.
            </p>

            {/* Billing Toggle */}
            <div className="pt-4 flex items-center justify-center gap-3">
              <span
                className={`text-xs font-semibold cursor-pointer ${
                  !annualBilling ? "text-slate-900" : "text-slate-500"
                }`}
                onClick={() => setAnnualBilling(false)}
              >
                Monthly billing
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={annualBilling}
                onClick={() => setAnnualBilling(!annualBilling)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  annualBilling ? "bg-slate-900" : "bg-slate-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    annualBilling ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <span
                className={`text-xs font-semibold cursor-pointer flex items-center gap-1.5 ${
                  annualBilling ? "text-slate-900" : "text-slate-500"
                }`}
                onClick={() => setAnnualBilling(true)}
              >
                <span>Annual billing</span>
                <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                  Annual rate
                </span>
              </span>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 md:py-24 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Starter Plan */}
            <div className="bg-white rounded-xl border border-slate-200 p-8 flex flex-col justify-between shadow-sm hover:border-slate-300 transition">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-900">Starter</h3>
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    Free forever
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-6 min-h-[36px]">
                  Essential feedback collection for cafés, boutique shops, and studios.
                </p>
                <div className="mb-6 pb-6 border-b border-slate-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight text-slate-900">$0</span>
                    <span className="text-xs text-slate-500 font-medium">/ month</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">No credit card required</p>
                </div>

                <div className="space-y-3 mb-8">
                  <p className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                    Included features:
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>One workspace for your business</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Customer feedback collection via QR and direct link</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Standard QR code generator</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Real-time feedback dashboard</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Unbiased Google Review link prompt</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>CSV data export</span>
                    </li>
                  </ul>
                </div>
              </div>

              <Link
                href="/signup"
                className="w-full inline-flex items-center justify-center gap-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 py-2.5 rounded-lg transition"
              >
                <span>Get started free</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-white rounded-xl border-2 border-slate-900 p-8 flex flex-col justify-between shadow-md relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm">
                Most Popular
              </div>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-900">Pro</h3>
                  <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    Advanced tools
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-6 min-h-[36px]">
                  For businesses that need deeper analytics and print-ready feedback materials.
                </p>
                <div className="mb-6 pb-6 border-b border-slate-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight text-slate-900">
                      ${annualBilling ? "24" : "29"}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">/ month</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {annualBilling ? "Billed annually ($288/yr)" : "Billed monthly"}
                  </p>
                </div>

                <div className="space-y-3 mb-8">
                  <p className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                    Everything in Starter, plus:
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-medium text-slate-900">Print-ready QR Studio (Table tents, counter cards)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Private internal team notes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Advanced sentiment & day-of-week analytics</span>
                    </li>
                  </ul>
                </div>
              </div>

              <Link
                href="/pricing/subscribe"
                className="w-full inline-flex items-center justify-center gap-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 py-2.5 rounded-lg transition shadow-sm"
              >
                <span>Choose Pro plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-xl border border-slate-200 p-8 flex flex-col justify-between shadow-sm hover:border-slate-300 transition">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-900">Enterprise</h3>
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    Chains & Franchises
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-6 min-h-[36px]">
                  For multi-location operators that need consolidated reporting and branch comparisons.
                </p>
                <div className="mb-6 pb-6 border-b border-slate-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight text-slate-900">
                      ${annualBilling ? "69" : "79"}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">/ month</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {annualBilling ? "Billed annually ($828/yr)" : "Billed monthly"}
                  </p>
                </div>

                <div className="space-y-3 mb-8">
                  <p className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                    Everything in Pro, plus:
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Executive PDF summary reports</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Multi-branch comparative benchmarking</span>
                    </li>
                  </ul>
                </div>
              </div>

              <Link
                href="/pricing/subscribe"
                className="w-full inline-flex items-center justify-center gap-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 py-2.5 rounded-lg transition"
              >
                <span>Choose Enterprise plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Comparison Matrix */}
        <section className="py-16 bg-white border-y border-slate-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl font-bold text-slate-900">Detailed feature breakdown</h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">
                Every tier is backed by high-availability Supabase infrastructure and strict privacy guarantees.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-4 font-semibold text-slate-900 w-1/2">Capability</th>
                    <th className="py-3 px-4 font-semibold text-slate-900 text-center w-1/6">Starter</th>
                    <th className="py-3 px-4 font-semibold text-slate-900 text-center w-1/6 bg-slate-50">Pro</th>
                    <th className="py-3 px-4 font-semibold text-slate-900 text-center w-1/6">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-slate-900">Zero Customer Registration / Login</td>
                    <td className="py-3.5 px-4 text-center text-emerald-600">Yes</td>
                    <td className="py-3.5 px-4 text-center bg-slate-50 text-emerald-600">Yes</td>
                    <td className="py-3.5 px-4 text-center text-emerald-600">Yes</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-slate-900">Google Reviews Unbiased Invite</td>
                    <td className="py-3.5 px-4 text-center text-emerald-600">Yes</td>
                    <td className="py-3.5 px-4 text-center bg-slate-50 text-emerald-600">Yes</td>
                    <td className="py-3.5 px-4 text-center text-emerald-600">Yes</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-slate-900">Print-ready QR Studio</td>
                    <td className="py-3.5 px-4 text-center">Digital Only</td>
                    <td className="py-3.5 px-4 text-center bg-slate-50 text-emerald-600">Complete Studio</td>
                    <td className="py-3.5 px-4 text-center text-emerald-600">Complete Studio</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-slate-900">Private Internal Team Notes</td>
                    <td className="py-3.5 px-4 text-center text-slate-400">—</td>
                    <td className="py-3.5 px-4 text-center bg-slate-50 text-emerald-600">Yes</td>
                    <td className="py-3.5 px-4 text-center text-emerald-600">Yes</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-slate-900">Advanced sentiment & day-of-week analytics</td>
                    <td className="py-3.5 px-4 text-center text-slate-400">—</td>
                    <td className="py-3.5 px-4 text-center bg-slate-50 text-emerald-600">Yes</td>
                    <td className="py-3.5 px-4 text-center text-emerald-600">Yes</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-slate-900">Executive PDF Reports</td>
                    <td className="py-3.5 px-4 text-center text-slate-400">—</td>
                    <td className="py-3.5 px-4 text-center bg-slate-50 text-slate-400">—</td>
                    <td className="py-3.5 px-4 text-center text-emerald-600">Automated & On-demand</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-slate-900">Multi-branch Benchmark Analytics</td>
                    <td className="py-3.5 px-4 text-center text-slate-400">—</td>
                    <td className="py-3.5 px-4 text-center bg-slate-50 text-slate-400">—</td>
                    <td className="py-3.5 px-4 text-center text-emerald-600">Yes</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-slate-900">CSV Raw Data Export</td>
                    <td className="py-3.5 px-4 text-center text-emerald-600">Yes</td>
                    <td className="py-3.5 px-4 text-center bg-slate-50 text-emerald-600">Yes</td>
                    <td className="py-3.5 px-4 text-center text-emerald-600">Yes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-24 max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Clear answers to the most common questions about Signal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-lg bg-white border border-slate-200">
              <h4 className="text-sm font-semibold text-slate-900 mb-2">
                Can I really use Signal for free?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Yes. Starter is free forever and includes feedback collection, standard QR codes, the feedback inbox, and CSV export. No hidden fees or surprise trial expirations.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-white border border-slate-200">
              <h4 className="text-sm font-semibold text-slate-900 mb-2">
                Do customers have to download an app or create an account?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Never. Customers point their native smartphone camera at the QR code, tap the link, select their star rating, and can be done in under 8 seconds.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-white border border-slate-200">
              <h4 className="text-sm font-semibold text-slate-900 mb-2">
                Does Signal gate or restrict negative reviews from Google?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                No. Google's review policies strictly prohibit review gating. Every customer who submits feedback is offered an unbiased opportunity to post on Google Reviews.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-white border border-slate-200">
              <h4 className="text-sm font-semibold text-slate-900 mb-2">
                Can I export our feedback records?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Yes. You retain full ownership of your data. You can export RFC-compliant CSV files containing full timestamps, ratings, categories, and comments anytime.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 bg-slate-900 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Ready to listen beyond the rating?</h2>
            <p className="text-sm text-slate-300 max-w-xl mx-auto">
              Join cafés, restaurants, and retail stores capturing honest feedback from every table.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 px-5 py-2.5 rounded-lg transition"
              >
                <span>Get started free</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-semibold text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 px-5 py-2.5 rounded-lg transition"
              >
                <span>Contact sales</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
