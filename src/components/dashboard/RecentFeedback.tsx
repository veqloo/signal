import Link from "next/link";
import { Feedback } from "@/types";
import { formatRelativeTime } from "@/lib/utils";
import { Star, ArrowRight, MapPin, Tag } from "lucide-react";

export function RecentFeedback({
  items,
  onSelectFeedback,
}: {
  items: Feedback[];
  onSelectFeedback?: (item: Feedback) => void;
}) {
  if (!items || items.length === 0) {
    return (
      <div className="p-8 text-center border border-slate-200 rounded-lg bg-white">
        <p className="text-xs text-slate-500">No feedback responses recorded for this period.</p>
        <Link
          href="/dashboard/qr"
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
        >
          Share your QR code to collect responses <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="border border-slate-200 rounded-lg bg-white shadow-card overflow-hidden">
      <div className="p-4 sm:px-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Recent Customer Voices</h3>
          <p className="text-xs text-slate-500">Latest direct responses</p>
        </div>
        <Link
          href="/dashboard/feedback"
          className="text-xs font-semibold text-slate-700 hover:text-slate-900 inline-flex items-center gap-1 group"
        >
          View all inbox <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
        </Link>
      </div>

      <div className="divide-y divide-slate-100">
        {items.slice(0, 6).map((item) => {
          const isLow = item.rating <= 2;
          return (
            <div
              key={item.id}
              onClick={() => onSelectFeedback?.(item)}
              className="p-4 sm:px-6 hover:bg-slate-50/70 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= item.rating
                            ? isLow
                              ? "text-red-500 fill-red-500"
                              : "text-amber-500 fill-amber-500"
                            : "text-slate-200 fill-slate-200"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Category Pill */}
                  {item.category && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                      <Tag className="w-2.5 h-2.5 text-slate-400" />
                      {item.category}
                    </span>
                  )}

                  {/* Location Pill */}
                  {item.location_name && (
                    <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
                      <MapPin className="w-2.5 h-2.5 text-slate-400" />
                      {item.location_name}
                    </span>
                  )}

                  {/* Status Badge */}
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

                {/* Comment Text */}
                <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed">
                  {item.comment || (
                    <span className="italic text-slate-400">Rating submitted without text comment.</span>
                  )}
                </p>
              </div>

              {/* Time */}
              <div className="text-[11px] text-slate-400 whitespace-nowrap self-start sm:self-center">
                {formatRelativeTime(item.created_at)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
