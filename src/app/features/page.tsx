import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  QrCode,
  MapPin,
  TrendingUp,
  AlertCircle,
  ShieldCheck,
  Search,
  FileText,
  Lock,
  ArrowRight,
  MessageSquare,
  Sparkles,
  Sliders,
} from "lucide-react";

export const metadata = {
  title: "Features & Capabilities — Signal by Veqlo",
  description:
    "Discover the full suite of customer feedback, multi-branch tracking, trend analytics, and printable QR features in Signal.",
};

export default function FeaturesPage() {
  const capabilities = [
    {
      icon: QrCode,
      category: "Capture",
      title: "QR Code Studio & Print Generator",
      desc: "Generate high-resolution vector QR codes for tables, counters, windows, and receipts. Includes pre-formatted table tent and sticker templates ready for cardstock printing with native print stylesheets.",
    },
    {
      icon: MapPin,
      category: "Telemetry",
      title: "Multi-Location Branch Benchmarking",
      desc: "Add multiple stores, cafés, or table sections under one business profile. Track response volume, average customer satisfaction, and detractor counts side-by-side per location.",
    },
    {
      icon: TrendingUp,
      category: "Analytics",
      title: "Satisfaction Trends & Moving Averages",
      desc: "Monitor your customer rating curve over time. View daily response volume distributions and day-of-week patterns to spot operational dips on specific shifts or weekdays.",
    },
    {
      icon: AlertCircle,
      category: "Triage",
      title: "Critical Feedback & Low Rating Alerts",
      desc: "Immediate operational notice whenever a 1 or 2-star rating is logged. Highlights urgent incidents so managers can review customer comments and resolve issues promptly.",
    },
    {
      icon: ShieldCheck,
      category: "Reputation",
      title: "Compliant Google Reviews Invitation",
      desc: "Voluntary invitation shown to all customers after submitting feedback. In strict adherence to FTC and Google policies, positive ratings are never gated or conditioned, preserving customer trust.",
    },
    {
      icon: Search,
      category: "Data",
      title: "Multi-Dimensional Inbox & CSV Export",
      desc: "Search comments, filter by rating stars, category, location, or status (New, Read, Flagged, Resolved). Download RFC-compliant CSV files with one click for spreadsheet analysis.",
    },
    {
      icon: FileText,
      category: "Governance",
      title: "Downloadable Executive PDF Reports",
      desc: "Export formatted vector PDF summaries with KPIs, rating distribution, category performance, and highlighted customer feedback for leadership or stakeholder presentations.",
    },
    {
      icon: MessageSquare,
      category: "Operations",
      title: "Internal Team & Shift Notes",
      desc: "Attach private internal operational notes directly to customer responses (e.g. 'Addressed with morning shift supervisor, replaced beverage upon next visit').",
    },
    {
      icon: Lock,
      category: "Security",
      title: "PostgreSQL Isolation & Anti-Spam Security",
      desc: "Strict PostgreSQL Row Level Security guarantees data isolation between businesses. Public endpoints enforce sliding-window SHA-256 IP rate limiting with zero service-role keys in frontend code.",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="py-20 bg-white border-b border-zinc-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              System Capabilities
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 leading-tight">
              Precision tools for customer intelligence.
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 max-w-xl mx-auto leading-relaxed">
              Every feature in Signal is engineered to eliminate customer friction and provide business operators with actionable operational truth.
            </p>
          </div>
        </section>

        {/* Capabilities Grid */}
        <section className="py-16 md:py-20 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {capabilities.map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.title}
                  className="p-6 bg-white border border-zinc-200/90 rounded-lg shadow-xs hover:border-zinc-300 transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-md bg-zinc-900 text-white flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 bg-zinc-50 px-2 py-0.5 rounded border border-zinc-100">
                        {c.category}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-zinc-900 leading-snug">
                      {c.title}
                    </h3>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      {c.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 px-5 py-2.5 rounded-lg transition shadow-sm"
            >
              <span>Initialize your business workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
