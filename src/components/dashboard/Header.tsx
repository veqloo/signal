"use client";

import Link from "next/link";
import { useWorkspace } from "@/lib/workspace-context";
import { DateRange } from "@/types";
import { Calendar, MapPin, QrCode, ArrowUpRight, Menu } from "lucide-react";

export function Header({
  title,
  subtitle,
  actions,
  onToggleMobileNav,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  onToggleMobileNav?: () => void;
}) {
  const {
    locations,
    selectedLocationId,
    setLocationFilter,
    selectedDateRange,
    setDateRange,
  } = useWorkspace();

  const dateOptions: { id: DateRange; label: string }[] = [
    { id: "today", label: "24h" },
    { id: "7d", label: "7d" },
    { id: "30d", label: "30d" },
    { id: "90d", label: "90d" },
    { id: "all", label: "All" },
  ];

  return (
    <header className="border-b border-zinc-200/80 bg-white sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Left: Mobile trigger & Breadcrumbs */}
        <div className="flex items-center gap-3 min-w-0">
          {onToggleMobileNav && (
            <button
              type="button"
              onClick={onToggleMobileNav}
              className="md:hidden p-1.5 -ml-1 text-zinc-600 hover:text-zinc-900 rounded-md hover:bg-zinc-100"
            >
              <Menu className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span>Signal</span>
            <span>/</span>
            <span className="font-semibold text-zinc-900 truncate font-sans text-sm">
              {title}
            </span>
          </div>

          {subtitle && (
            <span className="hidden lg:inline text-xs text-zinc-400 truncate pl-2 border-l border-zinc-200">
              {subtitle}
            </span>
          )}
        </div>

        {/* Right: Operational Controls & Filters */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Branch / Location Filter */}
          {locations.length > 0 && (
            <div className="relative hidden sm:block">
              <select
                value={selectedLocationId}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="text-xs font-medium border border-zinc-200 rounded-md pl-2 pr-7 py-1.5 bg-zinc-50 text-zinc-700 hover:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900 transition appearance-none cursor-pointer"
              >
                <option value="all">All Branches ({locations.length})</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
              <MapPin className="w-3 h-3 text-zinc-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          )}

          {/* Date Range Segmented Control */}
          <div className="inline-flex rounded-md border border-zinc-200 p-0.5 bg-zinc-100 text-[11px] font-mono">
            {dateOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setDateRange(opt.id)}
                className={`px-2 py-0.5 rounded transition ${
                  selectedDateRange === opt.id
                    ? "bg-white text-zinc-900 font-semibold shadow-xs"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Page-Specific Actions */}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </div>
    </header>
  );
}
