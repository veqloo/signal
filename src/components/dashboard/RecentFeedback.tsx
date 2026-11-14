import Link from "next/link";
import { Feedback } from "@/types";
import { formatRelativeTime } from "@/lib/utils";
import { Star, ArrowRight, MapPin, Tag, QrCode } from "lucide-react";

export function RecentFeedback({
  items,
  onSelectFeedback,
}: {
  items: Feedback[];
  onSelectFeedback?: (item: Feedback) => void;
}) {
  if (!items || items.length === 0) {
    return (
      <div className="p-8 text-center border border-zinc-200/90 rounded-lg bg-white shadow-xs space-y-3">
        <div className="w-9 h-9 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center mx-auto">
          <QrCode className="w-4 h-4" />
        </div>
        <p className="text-xs text-zinc-500 font-mono">No customer responses recorded for this window.</p>
        <div>
          <Link
            href="/dashboard/qr-codes"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
          >
            <span>Print QR kits to collect responses</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-zinc-200/90 rounded-lg bg-white shadow-xs overflow-hidden">
      <div className="p-4 sm:px-6 border-b border-zinc-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900">Recent Customer Voices</h3>
          <p className="text-xs text-zinc-500">Latest direct responses</p>
        </div>
        <Link
          href="/dashboard/feedback"
          className="text-xs font-semibold text-zinc-700 hover:text-zinc-900 inline-flex items-center gap-1 group"
        >
          <span>Open inbox ({items.length})</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
        </Link>
      </div>

      <div className="divide-y divide-zinc-100">
        {items.slice(0, 6).map((item) => {
          const isLow = item.rating <= 2;
          return (
            <div
              key={item.id}
              onClick={() => onSelectFeedback?.(item)}
              className="p-4 sm:px-6 hover:bg-zinc-50/70 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
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
                            : "text-zinc-200"
                        }`}
                      />
                    ))}
                  </div>

                  {item.category && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200 flex items-center gap-1 font-mono">
                      <Tag className="w-2.5 h-2.5 text-zinc-400" />
                      {item.category}
                    </span>
                  )}

                  {item.location_name && (
                    <span className="text-[10px] text-zinc-500 flex items-center gap-0.5 font-mono">
                      <MapPin className="w-2.5 h-2.5 text-zinc-400" />
                      {item.location_name}
                    </span>
                  )}

                  {item.status === "flagged" && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-red-100 text-red-700 font-mono">
                      Attention Needed
                    </span>
                  )}
                  {item.status === "resolved" && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-mono">
                      Resolved
                    </span>
                  )}
                </div>

                {item.comment ? (
                  <p className="text-xs text-zinc-700 line-clamp-2 leading-relaxed">
                    &ldquo;{item.comment}&rdquo;
                  </p>
                ) : (
                  <p className="text-xs text-zinc-400 italic">
                    Rating submitted with no written comment.
                  </p>
                )}
              </div>

              <div className="text-[11px] text-zinc-400 whitespace-nowrap self-start sm:self-auto font-mono">
                {formatRelativeTime(item.created_at)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
