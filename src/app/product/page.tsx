import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  QrCode,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  MapPin,
  CheckCircle2,
  XCircle,
  Smartphone,
  Lock,
  Layers,
  FileSpreadsheet,
} from "lucide-react";

export const metadata = {
  title: "Product Overview — Signal by Veqlo",
  description:
    "Explore how Signal works: from instant QR customer feedback to real-time sentiment intelligence and multi-branch management.",
};

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 md:py-28 bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
            <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Product Overview
            </span>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
              A complete system for <br />
              <span className="text-slate-900">customer intelligence.</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Signal bridges the gap between your physical patrons and operational decisions. Turn everyday table visits and checkout interactions into continuous, actionable insights.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 px-5 py-2.5 rounded-lg transition shadow-sm"
              >
                <span>Get started free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-5 py-2.5 rounded-lg transition"
              >
                <span>Explore Live Dashboard</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 3-Step Lifecycle */}
        <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
              How Signal Works
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              The three-stage intelligence loop
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Stage 1 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-card space-y-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Frictionless Touchpoint
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Customers scan a QR code on receipts, table tents, or checkout counters with their smartphone camera. A lightweight, instant interface opens in mobile safari or chrome. Zero account creation, zero app store redirection.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-medium text-slate-500">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>10 seconds average completion time</span>
              </div>
            </div>

            {/* Stage 2 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-card space-y-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Real-Time Aggregation
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Feedback flows directly into your private business dashboard. Metrics like average satisfaction, rating distribution, and sentiment indicators update immediately. Multi-location operators see branch attribution automatically.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-medium text-slate-500">
                <BarChart3 className="w-4 h-4 text-slate-400" />
                <span>Live KPI &amp; Net Promoter calculation</span>
              </div>
            </div>

            {/* Stage 3 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-card space-y-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Action &amp; Reputation
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Critical ratings trigger in-app alerts so managers can resolve operational snags before public reviews appear. Concurrently, all patrons receive an unbiased voluntary invitation to review your business publicly on Google.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-medium text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>FTC-compliant Google Reviews invitation</span>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-20 bg-white border-y border-slate-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                Why Signal Wins
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Old-school surveys vs. Signal
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden shadow-card">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-4 px-6">Metric / Capability</th>
                    <th className="py-4 px-6 text-slate-400">Legacy Surveys &amp; Forms</th>
                    <th className="py-4 px-6 bg-slate-900 text-white font-bold">Signal by Veqlo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-4 px-6 font-semibold text-slate-900">Customer Friction</td>
                    <td className="py-4 px-6 text-slate-500">5-10 minute long forms with forced email collection</td>
                    <td className="py-4 px-6 bg-slate-50/70 font-semibold text-slate-900">10 seconds, zero registration</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-semibold text-slate-900">Response Rate</td>
                    <td className="py-4 px-6 text-slate-500">1% – 3% average drop-off</td>
                    <td className="py-4 px-6 bg-slate-50/70 font-semibold text-emerald-600">20% – 35% table scan completion</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-semibold text-slate-900">Multi-Location Branch Tracking</td>
                    <td className="py-4 px-6 text-slate-500">Requires separate expensive licenses</td>
                    <td className="py-4 px-6 bg-slate-50/70 font-semibold text-slate-900">Native multi-location benchmarking included</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-semibold text-slate-900">Public Review Integration</td>
                    <td className="py-4 px-6 text-slate-500">Either disconnected or illegal review gating</td>
                    <td className="py-4 px-6 bg-slate-50/70 font-semibold text-slate-900">100% compliant, unbiased Google Reviews invitation</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-semibold text-slate-900">Executive PDF &amp; CSV Export</td>
                    <td className="py-4 px-6 text-slate-500">Enterprise add-on fee</td>
                    <td className="py-4 px-6 bg-slate-50/70 font-semibold text-slate-900">Instant vector PDF &amp; RFC-compliant CSV</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-slate-900 text-white text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Ready to see what your customers really think?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
              Launch your business profile and generate your first table tent QR stand in under 3 minutes.
            </p>
            <div className="pt-2">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 px-6 py-3 rounded-lg transition shadow-sm"
              >
                <span>Get started free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
