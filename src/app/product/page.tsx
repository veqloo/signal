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
  Inbox,
} from "lucide-react";

export const metadata = {
  title: "Product Architecture — Signal by Veqlo",
  description:
    "Explore how Signal works: from instant QR customer feedback to real-time sentiment intelligence and multi-branch management.",
};

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 md:py-24 bg-white border-b border-zinc-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Product Walkthrough
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 leading-tight">
              A complete system for in-person customer intelligence.
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 max-w-2xl mx-auto leading-relaxed">
              Signal bridges the gap between your physical patrons and operational decisions. Turn everyday table visits and checkout interactions into continuous, actionable insights.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 px-5 py-2.5 rounded-lg transition shadow-sm"
              >
                <span>Get started free</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 px-5 py-2.5 rounded-lg transition"
              >
                <BarChart3 className="w-3.5 h-3.5 text-zinc-500" />
                <span>Open Workbench</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 3-Step Lifecycle */}
        <section className="py-16 md:py-20 max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] uppercase font-mono font-semibold tracking-widest text-zinc-400">
              Operational Pipeline
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
              The three-stage intelligence loop
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stage 1 */}
            <div className="bg-white border border-zinc-200/90 rounded-lg p-6 shadow-xs space-y-4">
              <div className="w-8 h-8 rounded-md bg-zinc-100 text-zinc-900 flex items-center justify-center font-mono font-bold text-xs">
                01
              </div>
              <h3 className="text-sm font-bold text-zinc-900">
                Zero-Friction In-Person Scan
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Customers scan a QR code on receipts, table tents, or checkout counters with their native smartphone camera. Instant mobile web interface. Zero account creation, zero app store redirection.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-mono text-zinc-500">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                <span>8 seconds average submission</span>
              </div>
            </div>

            {/* Stage 2 */}
            <div className="bg-white border border-zinc-200/90 rounded-lg p-6 shadow-xs space-y-4">
              <div className="w-8 h-8 rounded-md bg-zinc-100 text-zinc-900 flex items-center justify-center font-mono font-bold text-xs">
                02
              </div>
              <h3 className="text-sm font-bold text-zinc-900">
                Real-Time Triage & Intelligence
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Feedback arrives instantly in your private workbench. Anomaly alerts automatically flag low satisfaction (1-2 stars) for operational response, while moving averages show day-of-week trends.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-mono text-zinc-500">
                <Inbox className="w-3.5 h-3.5 text-zinc-400" />
                <span>Instant dispatch via Supabase</span>
              </div>
            </div>

            {/* Stage 3 */}
            <div className="bg-white border border-zinc-200/90 rounded-lg p-6 shadow-xs space-y-4">
              <div className="w-8 h-8 rounded-md bg-zinc-100 text-zinc-900 flex items-center justify-center font-mono font-bold text-xs">
                03
              </div>
              <h3 className="text-sm font-bold text-zinc-900">
                Unbiased Public Reputation
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                After submitting honest feedback, customers are invited to share their experience on Google Reviews. No gating, no coercion. Complies strictly with FTC and search engine platform guidelines.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-mono text-zinc-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Google policy compliant</span>
              </div>
            </div>
          </div>
        </section>

        {/* Traditional Surveys vs Signal Comparison Table */}
        <section className="py-16 bg-white border-y border-zinc-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
                Why traditional review systems fail
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600">
                Legacy surveys only hear from the furious or the incentivized. Signal captures the quiet 95%.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 text-zinc-900">
                    <th className="py-3 px-4 font-semibold w-1/3">Criteria</th>
                    <th className="py-3 px-4 font-semibold text-zinc-400 w-1/3">Traditional Public Reviews</th>
                    <th className="py-3 px-4 font-semibold text-zinc-900 bg-zinc-50 w-1/3">Signal System</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-zinc-600">
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-zinc-900">Customer Friction</td>
                    <td className="py-3.5 px-4 text-red-600">High (Sign-in required, apps)</td>
                    <td className="py-3.5 px-4 bg-zinc-50 font-semibold text-emerald-700">Zero (Native camera scan)</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-zinc-900">Completion Rate</td>
                    <td className="py-3.5 px-4">Under 2% of visits</td>
                    <td className="py-3.5 px-4 bg-zinc-50 font-semibold text-zinc-900">18% – 32% of in-person tables</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-zinc-900">Negative Feedback Handling</td>
                    <td className="py-3.5 px-4 text-red-600">Public damage before manager knows</td>
                    <td className="py-3.5 px-4 bg-zinc-50 font-semibold text-emerald-700">Instant triage alert to staff</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-zinc-900">Location Benchmarking</td>
                    <td className="py-3.5 px-4">Fragmented profiles</td>
                    <td className="py-3.5 px-4 bg-zinc-50 font-semibold text-zinc-900">Unified multi-branch dashboard</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-zinc-900">Customer Privacy</td>
                    <td className="py-3.5 px-4 text-red-600">Ad cookies & cross-site tracking</td>
                    <td className="py-3.5 px-4 bg-zinc-50 font-semibold text-emerald-700">Zero ad pixels, no tracking cookies</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
