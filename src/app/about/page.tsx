import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  ShieldCheck,
  Zap,
  Lock,
  ArrowRight,
  ExternalLink,
  Target,
  Users,
  Compass,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "About Signal & Veqlo — Listen Beyond the Rating",
  description:
    "Learn about Signal, our mission to transform customer feedback into operational truth, and our parent technology studio, Veqlo.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-28 bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
            <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Our Mission
            </span>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
              We build tools that uncover <br />
              <span className="text-blue-600">operational truth.</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Traditional public review platforms only hear from the extremes: the furious and the incentivized. Signal exists to give voice to the quiet 95% of everyday patrons.
            </p>
          </div>
        </section>

        {/* Narrative / Context */}
        <section className="py-16 md:py-24 max-w-4xl mx-auto px-4 sm:px-6">
          <div className="prose prose-slate max-w-none space-y-8 text-sm sm:text-base text-slate-700 leading-relaxed">
            <div className="bg-white rounded-xl border border-slate-200 p-8 sm:p-10 shadow-sm space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                The problem with modern reviews
              </h2>
              <p>
                When a customer sits in your café, dines at your restaurant, or shops in your boutique, their immediate reaction matters most. Did the espresso arrive cold? Was the music volume too loud? Was the cashier exceptionally welcoming?
              </p>
              <p>
                Until now, business owners had two bad choices: harass guests with lengthy 20-question emailed surveys, or wait weeks until a scathing public review appeared online after the customer had already decided never to return.
              </p>
              <p className="font-medium text-slate-900">
                Signal changes this equation by reducing feedback friction to zero. A simple scan, a single tap, an optional comment, and zero registration.
              </p>
            </div>
          </div>
        </section>

        {/* Core Principles */}
        <section className="py-16 bg-white border-y border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                Foundations
              </span>
              <h2 className="text-3xl font-bold text-slate-900 mt-2">
                Our Engineering & Product Principles
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Sub-8-Second Completion</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every millisecond matters when a customer is checking out or leaving a table. No account creation, no password setup, and no mandatory fields.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Zero Surveillance or Ad Cookies</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We refuse to track users across the web or sell behavioral data. Signal's public feedback forms carry no tracking pixels or cross-site fingerprinting.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Honest & Unbiased Standards</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We never manipulate or gate public reviews. Every patron receives identical access to public review channels, ensuring authentic reputation building.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The Veqlo Ecosystem */}
        <section className="py-20 md:py-24 max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-12 space-y-8">
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-widest text-blue-400">
                The Parent Studio
              </span>
              <h2 className="text-3xl font-bold tracking-tight">Part of the Veqlo Ecosystem</h2>
              <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                Signal is conceived, developed, and maintained by{" "}
                <a
                  href="https://veqlo.me"
                  target="_blank"
                  rel="noreferrer"
                  className="text-white underline hover:text-blue-300 font-semibold"
                >
                  Veqlo
                </a>
                , a product studio crafting focused digital utilities that prioritize precision, privacy, and minimalist design.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
              <div className="p-4 rounded-lg bg-slate-800/60 border border-slate-700/60">
                <h4 className="text-xs font-bold text-white mb-1">Signal</h4>
                <p className="text-xs text-slate-400">
                  Instant QR customer sentiment intelligence & multi-branch telemetry.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-slate-800/60 border border-slate-700/60">
                <h4 className="text-xs font-bold text-white mb-1">Veqlo Quick</h4>
                <p className="text-xs text-slate-400">
                  High-speed desktop utilities and keyboard-first productivity tools.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <a
                href="https://veqlo.me"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white transition"
              >
                <span>Visit veqlo.me</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 px-4 py-2 rounded-lg transition"
              >
                <span>Connect with our team</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
