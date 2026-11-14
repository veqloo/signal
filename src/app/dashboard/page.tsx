"use client";

import { useState } from "react";
import { useWorkspace } from "@/lib/workspace-context";
import { Header } from "@/components/dashboard/Header";
import { MetricsCards } from "@/components/dashboard/MetricsCards";
import { RatingDistribution } from "@/components/dashboard/RatingDistribution";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { SatisfactionTrendChart } from "@/components/dashboard/SatisfactionTrendChart";
import { CategoryBreakdown } from "@/components/dashboard/CategoryBreakdown";
import { RecentFeedback } from "@/components/dashboard/RecentFeedback";
import { filterFeedback, computeMetrics, computeDailyActivity } from "@/lib/analytics-helper";
import { Feedback } from "@/types";
import { Star, MessageSquare, X, Check, Flag, MapPin, Tag } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function DashboardOverviewPage() {
  const {
    business,
    feedback,
    selectedDateRange,
    selectedLocationId,
    updateFeedbackStatus,
  } = useWorkspace();

  const [activeRatingFilter, setActiveRatingFilter] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<Feedback | null>(null);
  const [internalNote, setInternalNote] = useState("");

  // Filter feedback
  let filtered = filterFeedback(feedback, selectedDateRange, selectedLocationId);
  if (activeRatingFilter !== null) {
    filtered = filtered.filter((f) => f.rating === activeRatingFilter);
  }

  const metrics = computeMetrics(filtered, feedback);
  const activityDays = computeDailyActivity(filtered, selectedDateRange === "7d" ? 7 : 14);

  // Generate trend points for satisfaction trend chart
  const trendPoints = activityDays.map((d) => ({
    label: d.label,
    avg: d.avgRating > 0 ? d.avgRating : 4.5,
  }));

  const handleOpenDetail = (item: Feedback) => {
    setSelectedItem(item);
    setInternalNote(item.internal_notes || "");
  };

  const handleSaveNote = async () => {
    if (!selectedItem) return;
    await updateFeedbackStatus(selectedItem.id, selectedItem.status, internalNote);
    setSelectedItem({ ...selectedItem, internal_notes: internalNote });
  };

  const handleStatusChange = async (status: Feedback["status"]) => {
    if (!selectedItem) return;
    await updateFeedbackStatus(selectedItem.id, status, internalNote);
    setSelectedItem({ ...selectedItem, status });
  };

  return (
    <div className="flex-1 pb-16">
      <Header
        title="Overview"
        subtitle={`Real-time satisfaction intelligence for ${business?.name || "your business"}`}
      />

      <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
        {/* Top Metric Cards */}
        <MetricsCards
          averageRating={metrics.averageRating}
          totalResponses={metrics.totalResponses}
          positivePercentage={metrics.positivePercentage}
          attentionNeeded={metrics.attentionNeeded}
          npsEstimate={metrics.npsEstimate}
        />

        {/* Charts & Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Response Volume */}
          <ActivityChart days={activityDays} />

          {/* Satisfaction Trend Over Time */}
          <SatisfactionTrendChart points={trendPoints} />
        </div>

        {/* Distribution and Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RatingDistribution
            distribution={metrics.distribution}
            total={metrics.totalResponses}
            selectedRating={activeRatingFilter}
            onSelectRating={setActiveRatingFilter}
          />

          <CategoryBreakdown categories={metrics.categories} />
        </div>

        {/* Recent Feedback Feed */}
        <div>
          <RecentFeedback
            items={filtered}
            onSelectFeedback={handleOpenDetail}
          />
        </div>
      </div>

      {/* Slide-over Feedback Detail & Notes Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/30 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                  Feedback Detail
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        s <= selectedItem.rating
                          ? selectedItem.rating <= 2
                            ? "text-red-500 fill-red-500"
                            : "text-amber-500 fill-amber-500"
                          : "text-slate-200"
                      }`}
                    />
                  ))}
                  <span className="text-xs font-bold text-slate-900 ml-1">
                    {selectedItem.rating}.0 / 5.0
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              {/* Meta */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div>
                  <span className="text-slate-400 block mb-1">Category</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1">
                    <Tag className="w-3 h-3 text-slate-400" />
                    {selectedItem.category || "General"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Location</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {selectedItem.location_name || "Main location"}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block mb-1">Received At</span>
                  <span className="text-slate-700">{formatDate(selectedItem.created_at)}</span>
                </div>
              </div>

              {/* Comment text */}
              <div>
                <label className="text-xs font-semibold text-slate-900 block mb-2">
                  Customer Comment
                </label>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed italic">
                  {selectedItem.comment ? `"${selectedItem.comment}"` : "No written comment provided."}
                </div>
              </div>

              {/* Status Action Buttons */}
              <div>
                <label className="text-xs font-semibold text-slate-900 block mb-2">
                  Response Status
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    onClick={() => handleStatusChange("read")}
                    className={`py-2 px-3 rounded-md font-medium border transition ${
                      selectedItem.status === "read"
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    Mark as Read
                  </button>
                  <button
                    onClick={() => handleStatusChange("flagged")}
                    className={`py-2 px-3 rounded-md font-medium border transition flex items-center justify-center gap-1 ${
                      selectedItem.status === "flagged"
                        ? "bg-red-600 text-white border-red-600"
                        : "bg-white text-red-700 border-red-200 hover:bg-red-50"
                    }`}
                  >
                    <Flag className="w-3 h-3" />
                    Flag Alert
                  </button>
                  <button
                    onClick={() => handleStatusChange("resolved")}
                    className={`py-2 px-3 rounded-md font-medium border transition flex items-center justify-center gap-1 ${
                      selectedItem.status === "resolved"
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                    }`}
                  >
                    <Check className="w-3 h-3" />
                    Resolved
                  </button>
                </div>
              </div>

              {/* Internal Team Notes */}
              <div>
                <label className="text-xs font-semibold text-slate-900 block mb-2">
                  Internal Team Notes
                </label>
                <textarea
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  placeholder="Add notes for your team (e.g. 'Addressed with morning shift manager, replaced beverage on return')..."
                  className="w-full h-24 p-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
                <button
                  onClick={handleSaveNote}
                  className="mt-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-md transition shadow-sm"
                >
                  Save Internal Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
