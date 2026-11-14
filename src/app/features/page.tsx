import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  QrCode,
  MapPin,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Search,
  FileText,
  Users,
  Lock,
  ArrowRight,
  Printer,
  Sparkles,
  BarChart3,
  Calendar,
  MessageSquare,
} from "lucide-react";

export const metadata = {
  title: "Features & Capabilities — Signal by Veqlo",
  description:
    "Discover the full suite of customer feedback, multi-branch tracking, trend analytics, and printable QR features in Signal.",
};

export default function FeaturesPage() {
  const features = [
    {
      icon: QrCode,
      title: "QR Code Studio & Print Generator",
      desc: "Generate high-resolution vector QR codes for tables, counters, windows, and receipts. Includes pre-formatted table tent and sticker templates ready for cardstock printing with native print stylesheets.",
      badge: "Core",
    },
    {
      icon: MapPin,
      title: "Multi-Location Branch Benchmarking",
      desc: "Add multiple stores, cafés, or table sections under one business profile. Track response volume, average customer satisfaction, and detractor counts side-by-side per location.",
      badge: "Locations",
    },
    {
      icon: TrendingUp,
      title: "Satisfaction Trends & Moving Averages",
      desc: "Monitor your customer rating curve over time. View daily response volume distributions and day-of-week patterns to spot operational dips on specific shifts or weekdays.",
      badge: "Intelligence",
    },
    {
      icon: AlertTriangle,
      title: "Critical Feedback & Low Rating Alerts",
      desc: "Automatic triage whenever a 1 or 2-star rating is logged. In-app notification center highlights urgent incidents so managers can review customer comments and resolve issues promptly.",
      badge: "Triage",
    },
    {
      icon: ShieldCheck,
      title: "Compliant Google Reviews Invitation",
      desc: "Voluntary invitation shown to all customers after submitting feedback. In strict adherence to FTC and Google policies, positive ratings are never gated or conditioned, preserving customer trust.",
      badge: "Reputation",
    },
    {
      icon: Search,
      title: "Multi-Dimensional Inbox & CSV Export",
      desc: "Search comments, filter by rating stars, category, location, or status (New, Read, Flagged, Resolved). Download RFC-compliant CSV files with one click for spreadsheet analysis.",
      badge: "Management",
    },
    {
      icon: FileText,
      title: "Downloadable Executive PDF Reports",
      desc: "Export formatted vector PDF summaries with KPIs, rating distribution, category performance, and highlighted customer feedback for leadership or stakeholder presentations.",
      badge: "Reports",
    },
    {
      icon: MessageSquare,
      title: "Internal Team & Shift Notes",
      desc: "Attach private internal operational notes directly to customer responses (e.g. 'Addressed with morning shift supervisor, replaced beverage upon next visit').",
      badge: "Collaboration",
    },
    {
      icon: Lock,
      title: "Database Isolation & Anti-Spam Security",
      desc: "Strict PostgreSQL Row Level Security guarantees data isolation between businesses. Public endpoints enforce sliding-window SHA-256 IP rate limiting with zero service-role keys in frontend code.",
      badge: "Security",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="py-20 bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-5">
            <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Features &amp; Capabilities
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
              Every tool your team needs to <br />
              <span className="text-slate-900">listen and improve.</span>
            </h1>
            <p className="text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
              Thoughtfully engineered capabilities designed for cafés, restaurants, retail shops, and local business operators.
            </p>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="p-6 bg-white border border-slate-200 rounded-2xl shadow-card space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {f.badge}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">{f.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-20 bg-slate-900 text-white text-center">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Try all features in our interactive demo
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Explore the full executive dashboard populated with 50+ real customer responses.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 px-5 py-2.5 rounded-lg transition shadow-sm"
              >
                <span>Launch Interactive Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white border border-slate-700 px-5 py-2.5 rounded-lg transition"
              >
                <span>Create Free Account</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
