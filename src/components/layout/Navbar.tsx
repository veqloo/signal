"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3, Menu, X } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Lockup */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-semibold text-xl tracking-tight text-slate-900 group-hover:text-slate-700 transition">
              signal<span className="text-blue-600">.</span>
            </span>
            <span className="text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded border border-slate-200 text-slate-500 bg-slate-50">
              by Veqlo
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600">
            <Link href="/product" className="hover:text-slate-900 transition">
              Product
            </Link>
            <Link href="/features" className="hover:text-slate-900 transition">
              Features
            </Link>
            <Link href="/pricing" className="hover:text-slate-900 transition">
              Pricing
            </Link>
            <Link href="/about" className="hover:text-slate-900 transition">
              About
            </Link>
            <Link href="/contact" className="hover:text-slate-900 transition">
              Contact
            </Link>
          </nav>
        </div>

        {/* Action CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-xs font-medium text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-md hover:bg-slate-100 transition inline-flex items-center gap-1.5"
          >
            <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
            Dashboard
          </Link>
          <Link
            href="/sign-in"
            className="text-xs font-medium text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-md hover:bg-slate-100 transition"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 px-3.5 py-1.5 rounded-md transition shadow-sm inline-flex items-center gap-1.5"
          >
            Get started
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/sign-in"
            className="text-xs font-medium text-slate-700 hover:text-slate-900 px-2 py-1 rounded-md"
          >
            Sign in
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 py-4 space-y-3">
          <div className="flex flex-col space-y-2 text-sm font-medium text-slate-700">
            <Link
              href="/product"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-slate-900"
            >
              Product
            </Link>
            <Link
              href="/features"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-slate-900"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-slate-900"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-slate-900"
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-slate-900"
            >
              Contact
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-slate-900"
            >
              Live Dashboard
            </Link>
          </div>
          <div className="pt-3 border-t border-slate-100">
            <Link
              href="/sign-up"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 py-2.5 rounded-lg transition"
            >
              <span>Get started free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
