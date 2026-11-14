"use client";

import { useState } from "react";
import { useWorkspace } from "@/lib/workspace-context";
import { Header } from "@/components/dashboard/Header";
import { filterFeedback, computeMetrics } from "@/lib/analytics-helper";
import { jsPDF } from "jspdf";
import { FileText, Download, CheckCircle, Calendar, Sparkles } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ReportsPage() {
  const { business, feedback, selectedDateRange, selectedLocationId } = useWorkspace();
  const [isGenerating, setIsGenerating] = useState(false);

  const filtered = filterFeedback(feedback, selectedDateRange, selectedLocationId);
  const metrics = computeMetrics(filtered, feedback);

  const handleGeneratePDF = () => {
    setIsGenerating(true);
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;

      // 1. Header Banner
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, pageWidth, 28, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("SIGNAL · Executive Feedback Report", margin, 14);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text(`Generated for ${business?.name || "Business"} by Veqlo`, margin, 20);

      // Report metadata
      let y = 42;
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Executive Summary", margin, y);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(
        `Report Period: ${selectedDateRange.toUpperCase()} · Total Responses Analyzed: ${metrics.totalResponses}`,
        margin,
        y + 6
      );

      // 2. KPI Cards
      y += 16;
      const cardWidth = (pageWidth - 2 * margin - 15) / 4;
      const cardHeight = 22;

      const kpis = [
        { label: "Average Rating", val: `${metrics.averageRating} / 5.0` },
        { label: "Positive Sentiment", val: `${metrics.positivePercentage}%` },
        { label: "Attention Needed", val: `${metrics.attentionNeeded}` },
        { label: "Net Sentiment (NPS)", val: `+${metrics.npsEstimate}` },
      ];

      kpis.forEach((kpi, i) => {
        const x = margin + i * (cardWidth + 5);
        doc.setFillColor(248, 250, 252); // slate-50
        doc.setDrawColor(226, 232, 240); // slate-200
        doc.roundedRect(x, y, cardWidth, cardHeight, 2, 2, "FD");

        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.setFont("helvetica", "normal");
        doc.text(kpi.label, x + 4, y + 7);

        doc.setFontSize(12);
        doc.setTextColor(15, 23, 42);
        doc.setFont("helvetica", "bold");
        doc.text(kpi.val, x + 4, y + 16);
      });

      // 3. Rating Distribution
      y += cardHeight + 16;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("Rating Distribution", margin, y);

      y += 6;
      metrics.distribution.forEach((d) => {
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(71, 85, 105);
        doc.text(`${d.rating} Stars`, margin, y + 4);

        // Track bar
        const barX = margin + 20;
        const barWidth = 90;
        doc.setFillColor(241, 245, 249);
        doc.roundedRect(barX, y, barWidth, 5, 1, 1, "F");

        doc.setFillColor(d.rating >= 4 ? 34 : 220, d.rating >= 4 ? 197 : 38, d.rating >= 4 ? 94 : 38);
        const fillW = Math.max(2, (d.percentage / 100) * barWidth);
        doc.roundedRect(barX, y, fillW, 5, 1, 1, "F");

        doc.text(`${d.count} (${d.percentage}%)`, barX + barWidth + 6, y + 4);
        y += 8;
      });

      // 4. Category Insights
      y += 8;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("Category Performance Breakdown", margin, y);

      y += 8;
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, pageWidth - 2 * margin, 7, "F");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.setFont("helvetica", "bold");
      doc.text("Category", margin + 4, y + 5);
      doc.text("Responses", margin + 70, y + 5);
      doc.text("Average Rating", margin + 110, y + 5);

      y += 8;
      metrics.categories.slice(0, 5).forEach((c) => {
        doc.setFontSize(8.5);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(30, 41, 59);
        doc.text(c.name, margin + 4, y + 4);
        doc.text(`${c.count} (${c.percentage}%)`, margin + 70, y + 4);
        doc.text(`${c.average} / 5.0`, margin + 110, y + 4);

        doc.setDrawColor(241, 245, 249);
        doc.line(margin, y + 6, pageWidth - margin, y + 6);
        y += 8;
      });

      // 5. Customer Voice Highlights
      y += 8;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("Key Customer Comments", margin, y);

      y += 6;
      const topComments = filtered.filter((f) => f.comment && f.comment.length > 10).slice(0, 3);
      topComments.forEach((c) => {
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        const commentLines = doc.splitTextToSize(`"${c.comment}"`, pageWidth - 2 * margin - 12);
        const boxHeight = commentLines.length * 4.5 + 10;

        doc.roundedRect(margin, y, pageWidth - 2 * margin, boxHeight, 2, 2, "FD");

        doc.setFontSize(7.5);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(c.rating >= 4 ? 22 : 185, c.rating >= 4 ? 101 : 28, c.rating >= 4 ? 52 : 28);
        doc.text(`${c.rating} Stars · ${c.category || "General"}`, margin + 6, y + 5);

        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(51, 65, 85);
        doc.text(commentLines, margin + 6, y + 10);

        y += boxHeight + 4;
      });

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text("Signal by Veqlo · Confidential Executive Report · https://signal.veqlo.me", margin, 285);

      // Save PDF
      doc.save(`signal-executive-report-${business?.slug || "export"}.pdf`);
    } catch (err) {
      console.error("PDF generation failed", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1 pb-16">
      <Header
        title="PDF Executive Reports"
        subtitle="Generate formatted customer satisfaction summaries for leadership and investors"
        actions={
          <button
            onClick={handleGeneratePDF}
            disabled={isGenerating}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 px-3.5 py-1.5 rounded-md transition shadow-sm disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isGenerating ? "Generating..." : "Download Executive PDF"}</span>
          </button>
        }
      />

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Report Preview Document */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-card p-8 space-y-8">
          {/* Header */}
          <div className="border-b border-slate-100 pb-6 flex items-start justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                Monthly Performance Report
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
                {business?.name || "Northside Specialty Coffee"}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Evaluation Window: {selectedDateRange.toUpperCase()} · Location: All Locations
              </p>
            </div>
            <div className="text-right">
              <span className="font-semibold text-lg text-slate-900">
                signal<span className="text-blue-600">.</span>
              </span>
              <div className="text-[10px] text-slate-400">Veqlo Intelligence</div>
            </div>
          </div>

          {/* Metric Row */}
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[10px] uppercase font-semibold text-slate-400">
                Average Rating
              </span>
              <div className="text-xl font-bold text-slate-900 mt-1">
                {metrics.averageRating} <span className="text-xs text-slate-400">/ 5.0</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[10px] uppercase font-semibold text-slate-400">
                Total Feedback
              </span>
              <div className="text-xl font-bold text-slate-900 mt-1">
                {metrics.totalResponses}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[10px] uppercase font-semibold text-slate-400">
                Satisfaction Rate
              </span>
              <div className="text-xl font-bold text-emerald-600 mt-1">
                {metrics.positivePercentage}%
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[10px] uppercase font-semibold text-slate-400">
                Attention Needed
              </span>
              <div className="text-xl font-bold text-red-600 mt-1">
                {metrics.attentionNeeded}
              </div>
            </div>
          </div>

          {/* Report Sections */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Executive Highlights
            </h3>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>High positive sentiment:</strong> {metrics.positivePercentage}% of customers rated their experience 4 or 5 stars.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Top rated area:</strong> {metrics.categories[0]?.name || "Quality"} received consistent top marks across all shifts.
                </span>
              </li>
              {metrics.attentionNeeded > 0 && (
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0 mt-1.5" />
                  <span>
                    <strong>Action item:</strong> {metrics.attentionNeeded} customer responses flagged wait time or table clearing.
                  </span>
                </li>
              )}
            </ul>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Prepared automatically by Signal · Veqlo</span>
            <button
              onClick={handleGeneratePDF}
              className="text-blue-600 hover:underline font-semibold inline-flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> Download clean vector PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
