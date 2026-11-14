"use client";

import { useState } from "react";
import Link from "next/link";
import { useWorkspace } from "@/lib/workspace-context";
import { Header } from "@/components/dashboard/Header";
import { Feedback } from "@/types";
import { filterFeedback } from "@/lib/analytics-helper";
import { exportToCSV, formatDate, formatRelativeTime } from "@/lib/utils";
import {
  Search,
  Download,
  Filter,
  Star,
  Tag,
  MapPin,
  Flag,
  Check,
  X,
  MessageSquare,
  ArrowUpDown,
  QrCode,
  ArrowRight,
} from "lucide-react";

export default function FeedbackInboxPage() {
  const {
    business,
    locations,
    feedback,
    selectedDateRange,
    selectedLocationId,
    updateFeedbackStatus,
  } = useWorkspace();

  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");
  const [selectedItem, setSelectedItem] = useState<Feedback | null>(null);
  const [internalNote, setInternalNote] = useState("");

  // Base date and location filtering
  let items = filterFeedback(feedback, selectedDateRange, selectedLocationId);

  // Search filter
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    items = items.filter(
      (item) =>
        (item.comment && item.comment.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q)) ||
        (item.location_name && item.location_name.toLowerCase().includes(q))
    );
  }

  // Rating filter
  if (ratingFilter === "positive") {
    items = items.filter((item) => item.rating >= 4);
  } else if (ratingFilter === "low") {
    items = items.filter((item) => item.rating <= 2);
  } else if (ratingFilter !== "all") {
    items = items.filter((item) => item.rating === Number(ratingFilter));
  }

  // Category filter
  if (categoryFilter !== "all") {
    items = items.filter((item) => (item.category || "General") === categoryFilter);
  }

  // Status filter
  if (statusFilter !== "all") {
    items = items.filter((item) => item.status === statusFilter);
  }

  // Sorting
  items.sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    if (sortBy === "oldest") {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
    if (sortBy === "highest") {
      return b.rating - a.rating;
    }
    if (sortBy === "lowest") {
      return a.rating - b.rating;
    }
    return 0;
  });

  const availableCategories = Array.from(
    new Set(feedback.map((f) => f.category || "General"))
  ).sort();

  const handleExportCSV = () => {
    exportToCSV(
      `signal-${business?.slug || "feedback"}-${new Date().toISOString().slice(0, 10)}`,
      items.map((i) => ({
        id: i.id,
        rating: i.rating,
        category: i.category || "General",
        location: i.location_name || "Main",
        comment: i.comment || "",
        status: i.status,
        internal_notes: i.internal_notes || "",
        created_at: i.created_at,
      })),
      [
        { key: "created_at", label: "Date Received" },
        { key: "rating", label: "Rating (1-5)" },
        { key: "category", label: "Category" },
        { key: "location", label: "Location" },
        { key: "comment", label: "Comment" },
        { key: "status", label: "Status" },
        { key: "internal_notes", label: "Team Notes" },
      ]
    );
  };

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
        title="Feedback Inbox"
        subtitle={`Search, filter, and manage ${items.length} customer responses`}
        actions={
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-md transition shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        }
      />

      <div className="max-w-6xl mx-auto px-6 py-6 space-y-4">
        {/* Filter Controls Bar */}
        <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-card space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search comments, categories, locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Rating Filter */}
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="text-xs font-medium border border-slate-200 rounded-md px-3 py-1.5 bg-white text-slate-700 focus:outline-none"
            >
              <option value="all">All Ratings</option>
              <option value="positive">Positive (4-5 stars)</option>
              <option value="low">Needs Attention (1-2 stars)</option>
              <option value="5">5 Stars only</option>
              <option value="4">4 Stars only</option>
              <option value="3">3 Stars only</option>
              <option value="2">2 Stars only</option>
              <option value="1">1 Star only</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs font-medium border border-slate-200 rounded-md px-3 py-1.5 bg-white text-slate-700 focus:outline-none"
            >
              <option value="all">All Categories</option>
              {availableCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-medium border border-slate-200 rounded-md px-3 py-1.5 bg-white text-slate-700 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="flagged">Flagged Alert</option>
              <option value="resolved">Resolved</option>
              <option value="read">Read</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-medium border border-slate-200 rounded-md px-3 py-1.5 bg-white text-slate-700 focus:outline-none"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="highest">Highest rating</option>
              <option value="lowest">Lowest rating</option>
            </select>
          </div>
        </div>

        {/* Feedback List Table */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-card overflow-hidden">
          {items.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              {feedback.length === 0 ? (
                <>
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900">No customer feedback recorded yet</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Customer feedback submitted via your table QR codes or direct URL will appear here in real-time.
                  </p>
                  <div className="pt-2 flex items-center justify-center gap-3">
                    <Link
                      href="/dashboard/qr-codes"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-900 bg-zinc-100 hover:bg-zinc-200 px-3.5 py-1.5 rounded-md transition"
                    >
                      <span>Open QR Studio</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <a
                      href={`/f/${business?.slug || "demo"}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
                    >
                      <span>Submit test feedback</span>
                    </a>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-xs text-slate-500">No customer feedback matched your current filters.</p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setRatingFilter("all");
                      setCategoryFilter("all");
                      setStatusFilter("all");
                    }}
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    Clear all filters
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {items.map((item) => {
                const isLow = item.rating <= 2;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleOpenDetail(item)}
                    className="p-4 sm:px-6 hover:bg-slate-50 transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Rating */}
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= item.rating
                                  ? isLow
                                    ? "text-red-500 fill-red-500"
                                    : "text-amber-500 fill-amber-500"
                                  : "text-slate-200 fill-slate-200"
                              }`}
                            />
                          ))}
                        </div>

                        {/* Category */}
                        {item.category && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                            <Tag className="w-2.5 h-2.5 text-slate-400" />
                            {item.category}
                          </span>
                        )}

                        {/* Location */}
                        {item.location_name && (
                          <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
                            <MapPin className="w-2.5 h-2.5 text-slate-400" />
                            {item.location_name}
                          </span>
                        )}

                        {/* Status */}
                        {item.status === "flagged" && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-red-100 text-red-700">
                            Attention Needed
                          </span>
                        )}
                        {item.status === "resolved" && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            Resolved
                          </span>
                        )}
                      </div>

                      {/* Comment */}
                      <p className="text-xs text-slate-800 leading-relaxed">
                        {item.comment || (
                          <span className="italic text-slate-400">Rating submitted without text comment.</span>
                        )}
                      </p>

                      {/* Notes snippet if present */}
                      {item.internal_notes && (
                        <p className="text-[11px] text-slate-500 bg-slate-50 p-1.5 rounded border border-slate-200 inline-block">
                          Note: {item.internal_notes}
                        </p>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-400 whitespace-nowrap self-start md:self-center">
                      {formatDate(item.created_at)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
