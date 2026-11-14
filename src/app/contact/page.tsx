"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Mail,
  MessageSquare,
  ShieldCheck,
  Building2,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    businessName: "",
    category: "sales",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    // Validate email format
    if (!formData.email.includes("@") || !formData.email.includes(".")) {
      setErrorMsg("Please provide a valid business email address.");
      setIsSubmitting(false);
      return;
    }

    if (formData.message.trim().length < 10) {
      setErrorMsg("Please include a brief message (at least 10 characters).");
      setIsSubmitting(false);
      return;
    }

    // Simulate sending / logging inquiry
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="py-16 md:py-20 bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Get in Touch
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900">
              We are here to help.
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
              Have questions about multi-location deployment, enterprise integrations, or custom QR hardware? Reach out directly to the Veqlo team.
            </p>
          </div>
        </section>

        {/* Contact Form & Info Grid */}
        <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Direct Inquiries */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Direct channels</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We maintain fast direct response times during European and Americas business hours.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-white border border-slate-200 flex items-start gap-3 shadow-sm">
                  <div className="w-8 h-8 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900">General & Sales</h4>
                    <p className="text-xs text-slate-500 mb-1">Product inquiries, pricing, custom setups</p>
                    <a
                      href="mailto:hello@veqlo.me"
                      className="text-xs font-medium text-blue-600 hover:underline"
                    >
                      hello@veqlo.me
                    </a>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-white border border-slate-200 flex items-start gap-3 shadow-sm">
                  <div className="w-8 h-8 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900">Technical Support</h4>
                    <p className="text-xs text-slate-500 mb-1">Account troubleshooting and Supabase sync</p>
                    <a
                      href="mailto:support@veqlo.me"
                      className="text-xs font-medium text-blue-600 hover:underline"
                    >
                      support@veqlo.me
                    </a>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-white border border-slate-200 flex items-start gap-3 shadow-sm">
                  <div className="w-8 h-8 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900">Security & Compliance</h4>
                    <p className="text-xs text-slate-500 mb-1">GDPR data requests, security disclosures</p>
                    <a
                      href="mailto:security@veqlo.me"
                      className="text-xs font-medium text-blue-600 hover:underline"
                    >
                      security@veqlo.me
                    </a>
                  </div>
                </div>
              </div>

              {/* Veqlo parent note */}
              <div className="p-4 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-600 space-y-2">
                <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Veqlo Technology Studio</span>
                </div>
                <p>
                  Signal is a product of Veqlo. You can learn more about our other tools and initiatives at{" "}
                  <a
                    href="https://veqlo.me"
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-900 underline font-medium inline-flex items-center gap-0.5"
                  >
                    veqlo.me
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  .
                </p>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                {isSubmitted ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Message dispatched</h3>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                      Thank you for contacting us, {formData.name || "friend"}. We have received your inquiry regarding{" "}
                      <span className="font-medium text-slate-900">{formData.businessName || "your business"}</span> and will reply to{" "}
                      <span className="font-medium text-slate-900">{formData.email}</span> within 4 business hours.
                    </p>
                    <div className="pt-4">
                      <button
                        onClick={() => {
                          setIsSubmitted(false);
                          setFormData({
                            name: "",
                            email: "",
                            businessName: "",
                            category: "sales",
                            message: "",
                          });
                        }}
                        className="text-xs font-semibold text-blue-600 hover:underline"
                      >
                        Send another message
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-1">Send a message</h3>
                      <p className="text-xs text-slate-500">
                        Fill out the form below and an engineer or product specialist will get back to you.
                      </p>
                    </div>

                    {errorMsg && (
                      <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">Your Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Sarah Jenkins"
                          className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">Work Email *</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="sarah@cafekitchen.com"
                          className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">Business Name</label>
                        <input
                          type="text"
                          value={formData.businessName}
                          onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                          placeholder="The Roastery Co."
                          className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">Topic</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                          <option value="sales">Enterprise & Multi-Location Sales</option>
                          <option value="support">Technical Support & Configuration</option>
                          <option value="hardware">QR Hardware & Table Tents</option>
                          <option value="privacy">Security & GDPR Compliance</option>
                          <option value="general">General Feedback</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Message *</label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us about your locations, expected response volume, or any specific requirements..."
                        className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center gap-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 py-2.5 rounded-lg transition shadow-sm"
                    >
                      {isSubmitting ? (
                        <span>Sending message...</span>
                      ) : (
                        <>
                          <span>Send message</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
