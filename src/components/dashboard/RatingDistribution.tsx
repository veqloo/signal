import { Star } from "lucide-react";

interface DistributionItem {
  rating: number;
  count: number;
  percentage: number;
}

export function RatingDistribution({
  distribution,
  total,
  onSelectRating,
  selectedRating,
}: {
  distribution: DistributionItem[];
  total: number;
  onSelectRating?: (rating: number | null) => void;
  selectedRating?: number | null;
}) {
  return (
    <div className="p-5 rounded-lg border border-slate-200 bg-white shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Rating Distribution</h3>
          <p className="text-xs text-slate-500">Customer score breakdown</p>
        </div>
        {selectedRating && (
          <button
            onClick={() => onSelectRating?.(null)}
            className="text-[11px] text-blue-600 hover:underline"
          >
            Clear filter
          </button>
        )}
      </div>

      <div className="space-y-2.5">
        {distribution.map((item) => {
          const isSelected = selectedRating === item.rating;
          return (
            <div
              key={item.rating}
              onClick={() => onSelectRating?.(isSelected ? null : item.rating)}
              className={`group flex items-center gap-3 text-xs cursor-pointer py-1 px-2 rounded-md transition ${
                isSelected ? "bg-slate-100" : "hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-1 w-14 font-medium text-slate-700">
                <span>{item.rating}</span>
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              </div>

              <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.rating >= 4
                      ? "bg-emerald-500"
                      : item.rating === 3
                      ? "bg-amber-400"
                      : "bg-red-400"
                  }`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>

              <div className="w-12 text-right font-medium text-slate-500 group-hover:text-slate-900">
                {item.count}{" "}
                <span className="text-[10px] text-slate-400">({item.percentage}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
