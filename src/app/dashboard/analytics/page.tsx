"use client";

import { useWorkspace } from "@/lib/workspace-context";
import { Header } from "@/components/dashboard/Header";
import { filterFeedback, computeMetrics, computeDailyActivity } from "@/lib/analytics-helper";
import { Star, TrendingUp, AlertCircle, MapPin, BarChart3, CheckCircle2 } from "lucide-react";

export default function AnalyticsPage() {
  const {
    business,
    locations,
    feedback,
    selectedDateRange,
    selectedLocationId,
  } = useWorkspace();

  const filtered = filterFeedback(feedback, selectedDateRange, selectedLocationId);
  const metrics = computeMetrics(filtered, feedback);
  const activityDays = computeDailyActivity(filtered, 14);

  // Day-of-week volume aggregation
  const dayOfWeekCounts: Record<string, { count: number; sum: number }> = {
    Mon: { count: 0, sum: 0 },
    Tue: { count: 0, sum: 0 },
    Wed: { count: 0, sum: 0 },
    Thu: { count: 0, sum: 0 },
    Fri: { count: 0, sum: 0 },
    Sat: { count: 0, sum: 0 },
    Sun: { count: 0, sum: 0 },
  };

  filtered.forEach((f) => {
    const d = new Date(f.created_at);
    const day = d.toLocaleDateString("en-US", { weekday: "short" });
    if (dayOfWeekCounts[day]) {
      dayOfWeekCounts[day].count += 1;
      dayOfWeekCounts[day].sum += f.rating;
    }
  });

  const dayOfWeekList = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => {
    const data = dayOfWeekCounts[d];
    return {
      day: d,
      count: data.count,
      avg: data.count > 0 ? Number((data.sum / data.count).toFixed(1)) : 0,
    };
  });

  const maxDayCount = Math.max(1, ...dayOfWeekList.map((d) => d.count));

  // Locations benchmark aggregation
  const allLocationsInRange = filterFeedback(feedback, selectedDateRange, "all");
  const locationStats = locations.map((loc) => {
    const locItems = allLocationsInRange.filter((f) => f.location_id === loc.id);
    const count = locItems.length;
    const avg = count > 0 ? locItems.reduce((acc, f) => acc + f.rating, 0) / count : 0;
    const positive = count > 0 ? Math.round((locItems.filter((f) => f.rating >= 4).length / count) * 100) : 0;
    const issues = locItems.filter((f) => f.rating <= 2).length;

    return {
      id: loc.id,
      name: loc.name,
      address: loc.address,
      count,
      avg: Number(avg.toFixed(1)),
      positive,
      issues,
    };
  });

  return (
    <div className="flex-1 pb-16">
      <Header
        title="Analytics & Trends"
        subtitle="Customer sentiment patterns, peak hours, and location benchmarks"
      />

      <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
        {/* Top Intelligence Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-lg border border-slate-200 bg-white shadow-card">
            <span className="text-xs font-medium text-slate-500 block mb-1">
              Rating Sentiment Index
            </span>
            <div className="text-3xl font-bold tracking-tight text-slate-900">
              {metrics.ratingSentimentIndex > 0 ? "+" : ""}{metrics.ratingSentimentIndex}
            </div>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">
              5-star ratings minus 1–3-star ratings
            </p>
          </div>

          <div className="p-5 rounded-lg border border-slate-200 bg-white shadow-card">
            <span className="text-xs font-medium text-slate-500 block mb-1">
              Low-rating share
            </span>
            <div className="text-3xl font-bold tracking-tight text-slate-900">
              {metrics.totalResponses > 0
                ? Math.round((metrics.attentionNeeded / metrics.totalResponses) * 100)
                : 0}
              %
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {metrics.attentionNeeded} responses rated 1–2 stars
            </p>
          </div>

          <div className="p-5 rounded-lg border border-slate-200 bg-white shadow-card">
            <span className="text-xs font-medium text-slate-500 block mb-1">
              Positive rating share
            </span>
            <div className="text-3xl font-bold tracking-tight text-slate-900">
              {metrics.positivePercentage}%
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              All customers receive the same optional Google review invitation
            </p>
          </div>
        </div>

        {/* Day-of-week Pattern */}
        <div className="p-5 rounded-lg border border-slate-200 bg-white shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Day-of-Week Feedback Dynamics</h3>
              <p className="text-xs text-slate-500">
                Identify peak feedback days and shifts needing extra operational support
              </p>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-3 pt-4">
            {dayOfWeekList.map((d) => {
              const heightPct = d.count === 0 ? 0 : Math.max(10, Math.round((d.count / maxDayCount) * 100));
              return (
                <div key={d.day} className="flex flex-col items-center">
                  <div className="h-28 w-full flex items-end justify-center">
                    <div
                      className="w-full max-w-[36px] bg-slate-900 rounded-t hover:bg-blue-600 transition duration-200"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-800 mt-2">{d.day}</span>
                  <span className="text-[10px] text-slate-400">
                    {d.count} {d.count === 1 ? "res" : "res"}
                  </span>
                  {d.avg > 0 && (
                    <span className="text-[10px] font-bold text-amber-600 mt-0.5">
                      {d.avg} / 5
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Multi-Location Benchmarks */}
        {locations.length > 0 && (
          <div className="border border-slate-200 rounded-lg bg-white shadow-card overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Multi-Location Performance</h3>
                <p className="text-xs text-slate-500">
                  Compare customer satisfaction across your branches
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-5">Location</th>
                    <th className="py-3 px-5">Total Feedback</th>
                    <th className="py-3 px-5">Average Rating</th>
                    <th className="py-3 px-5">Satisfaction Rate</th>
                    <th className="py-3 px-5">Attention Needed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {locationStats.map((loc) => (
                    <tr key={loc.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-5">
                        <div className="font-semibold text-slate-900">{loc.name}</div>
                        {loc.address && (
                          <div className="text-[10px] text-slate-400">{loc.address}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-5 font-medium">{loc.count} responses</td>
                      <td className="py-3.5 px-5">
                        <span className="inline-flex items-center gap-1 font-bold text-slate-900">
                          {loc.avg > 0 ? loc.avg.toFixed(1) : "—"}{" "}
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        </span>
                      </td>
                      <td className="py-3.5 px-5 font-semibold text-emerald-600">
                        {loc.positive}%
                      </td>
                      <td className="py-3.5 px-5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            loc.issues > 0 ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {loc.issues}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


