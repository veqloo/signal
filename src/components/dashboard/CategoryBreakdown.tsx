import { Star } from "lucide-react";

interface CategoryStat {
  name: string;
  count: number;
  average: number;
  percentage: number;
}

export function CategoryBreakdown({ categories }: { categories: CategoryStat[] }) {
  if (!categories || categories.length === 0) {
    return (
      <div className="p-5 rounded-lg border border-slate-200 bg-white shadow-card flex items-center justify-center h-48 text-xs text-slate-400">
        No category breakdown available yet
      </div>
    );
  }

  return (
    <div className="p-5 rounded-lg border border-slate-200 bg-white shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Category Insights</h3>
          <p className="text-xs text-slate-500">Volume and performance by area</p>
        </div>
      </div>

      <div className="space-y-3">
        {categories.slice(0, 5).map((cat) => {
          const isLow = cat.average < 3.5;
          return (
            <div key={cat.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">{cat.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">
                    {cat.count} {cat.count === 1 ? "response" : "responses"}
                  </span>
                  <span
                    className={`inline-flex items-center gap-0.5 font-semibold text-xs px-1.5 py-0.5 rounded ${
                      isLow
                        ? "bg-red-50 text-red-700 border border-red-100"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    }`}
                  >
                    {cat.average.toFixed(1)} <Star className="w-2.5 h-2.5 fill-current" />
                  </span>
                </div>
              </div>

              {/* Bar */}
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${isLow ? "bg-red-400" : "bg-slate-700"}`}
                  style={{ width: `${Math.min(100, (cat.average / 5) * 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
