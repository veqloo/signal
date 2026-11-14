"use client";

import { useState } from "react";

interface ActivityDay {
  date: Date;
  dateStr: string;
  label: string;
  count: number;
  avgRating: number;
}

export function ActivityChart({ days }: { days: ActivityDay[] }) {
  const [hoveredDay, setHoveredDay] = useState<ActivityDay | null>(null);

  const maxCount = Math.max(1, ...days.map((d) => d.count));

  return (
    <div className="p-5 rounded-lg border border-slate-200 bg-white shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Response Volume</h3>
          <p className="text-xs text-slate-500">Daily customer feedback activity</p>
        </div>
        {hoveredDay && (
          <div className="text-xs bg-slate-900 text-white px-2 py-0.5 rounded shadow-sm">
            {hoveredDay.label}: <span className="font-semibold">{hoveredDay.count} responses</span>
            {hoveredDay.count > 0 && ` (avg ${hoveredDay.avgRating}★)`}
          </div>
        )}
      </div>

      <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2">
        {days.map((day) => {
          const heightPercent = Math.max(8, Math.round((day.count / maxCount) * 100));
          return (
            <div
              key={day.dateStr}
              onMouseEnter={() => setHoveredDay(day)}
              onMouseLeave={() => setHoveredDay(null)}
              className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
            >
              <div className="w-full relative flex items-end justify-center h-full">
                <div
                  className="w-full max-w-[28px] rounded-t transition-all duration-300 bg-slate-200 group-hover:bg-blue-600"
                  style={{ height: `${heightPercent}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 group-hover:text-slate-900 font-medium mt-2 truncate w-full text-center">
                {day.date.toLocaleDateString("en-US", { weekday: "narrow" })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
