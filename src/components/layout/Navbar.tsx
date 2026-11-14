"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, QrCode } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Lockup */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-semibold text-xl tracking-tight text-slate-900 group-hover:text-slate-700 transition">
              signal<span className="text-blue-600">.</span>
            </span>
            <span className="text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded border border-slate-200 text-slate-500 bg-slate-50">
              by Veqlo
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="#features" className="hover:text-slate-900 transition">
              Features
            </Link>
            <Link href="#interactive-demo" className="hover:text-slate-900 transition">
              Live Demo
            </Link>
            <Link href="#solutions" className="hover:text-slate-900 transition">
              Solutions
            </Link>
            <Link href="#ecosystem" className="hover:text-slate-900 transition">
              Veqlo Ecosystem
            </Link>
          </nav>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-xs font-medium text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-md hover:bg-slate-100 transition hidden sm:inline-flex items-center gap-1.5"
          >
            <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
            Dashboard
          </Link>
          <Link
            href="/login"
            className="text-xs font-medium text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-md hover:bg-slate-100 transition"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 px-3.5 py-1.5 rounded-md transition shadow-sm inline-flex items-center gap-1.5"
          >
            Get started
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
