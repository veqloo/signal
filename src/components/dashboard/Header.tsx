"use client";

import Link from "next/link";
import { useWorkspace } from "@/lib/workspace-context";
import { DateRange } from "@/types";
import { Calendar, MapPin, QrCode, Plus, Sparkles } from "lucide-react";

export function Header({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  const {
    locations,
    selectedLocationId,
    setLocationFilter,
    selectedDateRange,
    setDateRange,
    isDemoMode,
  } = useWorkspace();

  const dateOptions: { id: DateRange; label: string }[] = [
    { id: "today", label: "Today" },
    { id: "7d", label: "7 days" },
    { id: "30d", label: "30 days" },
    { id: "90d", label: "90 days" },
    { id: "all", label: "All time" },
  ];

  return (
    <header className="border-b border-slate-200 bg-white">
      {/* Demo Mode Notice Banner */}
      {isDemoMode && (
        <div className="bg-amber-50 border-b border-amber-200/80 px-6 py-1.5 flex items-center justify-between text-xs text-amber-800">
          <div className="flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Interactive Demo Workspace · Realistic sample feedback loaded</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/signup"
              className="font-semibold underline hover:text-amber-950"
            >
              Create real account →
            </Link>
          </div>
        </div>
      )}

      {/* Main Bar */}
      <div className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">{title}</h1>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Location Selector */}
          {locations.length > 0 && (
            <div className="relative inline-flex items-center">
              <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              <select
                value={selectedLocationId}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-slate-900"
              >
                <option value="all">All Locations ({locations.length})</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Date Range Selector */}
          <div className="inline-flex rounded-md border border-slate-200 bg-slate-50 p-0.5 text-xs shadow-sm">
            {dateOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setDateRange(opt.id)}
                className={`px-2.5 py-1 rounded font-medium transition ${
                  selectedDateRange === opt.id
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Custom Action or Default Collect Feedback */}
          {actions ? (
            actions
          ) : (
            <Link
              href="/dashboard/qr"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-md transition shadow-sm"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Collect feedback</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
