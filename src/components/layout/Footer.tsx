import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg tracking-tight text-slate-900">
                signal<span className="text-blue-600">.</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-slate-200 text-slate-500 bg-slate-50 font-medium">
                Veqlo Product
              </span>
            </div>
            <p className="text-sm text-slate-600 max-w-sm leading-relaxed">
              Listen beyond the rating. Modern, frictionless customer feedback and real-time sentiment intelligence for businesses that value customer trust.
            </p>
            <div className="pt-2 text-xs text-slate-500">
              Signal is crafted by{" "}
              <a
                href="https://veqlo.me"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-slate-900 hover:underline inline-flex items-center gap-0.5"
              >
                Veqlo
                <ArrowUpRight className="w-3 h-3" />
              </a>
              . Built with purpose, simplicity, and strict privacy by design.
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              Product
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link href="#features" className="hover:text-slate-900 transition">
                  Overview & Features
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-slate-900 transition">
                  Live Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/qr" className="hover:text-slate-900 transition">
                  QR Code Studio
                </Link>
              </li>
              <li>
                <Link href="/dashboard/analytics" className="hover:text-slate-900 transition">
                  Sentiment Analytics
                </Link>
              </li>
              <li>
                <Link href="/dashboard/reports" className="hover:text-slate-900 transition">
                  Executive PDF Reports
                </Link>
              </li>
            </ul>
          </div>

          {/* Ecosystem */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              Veqlo Ecosystem
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <a
                  href="https://veqlo.me"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-slate-900 transition inline-flex items-center gap-1"
                >
                  Veqlo Home <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li>
                <span className="text-slate-400">Veqlo Quick (Desktop)</span>
              </li>
              <li>
                <span className="text-slate-400">OpenInbox (Mail)</span>
              </li>
              <li>
                <span className="text-slate-400">Guardian (Safety)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>© {new Date().getFullYear()} Veqlo. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <span>No tracking cookies on feedback forms</span>
            <span>Unbiased Google Review invitations</span>
            <span>GDPR compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
