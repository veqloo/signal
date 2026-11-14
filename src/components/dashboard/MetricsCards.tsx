import { Star, Inbox, TrendingUp, AlertCircle, Sparkles } from "lucide-react";

interface MetricsCardsProps {
  averageRating: number;
  totalResponses: number;
  positivePercentage: number;
  attentionNeeded: number;
  npsEstimate: number;
}

export function MetricsCards({
  averageRating,
  totalResponses,
  positivePercentage,
  attentionNeeded,
  npsEstimate,
}: MetricsCardsProps) {
  const hasData = totalResponses > 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* 1. Average Rating */}
      <div className="p-4 sm:p-5 rounded-lg border border-zinc-200/90 bg-white shadow-xs">
        <div className="flex items-center justify-between text-xs font-medium text-zinc-500 mb-1.5">
          <span>Customer Rating</span>
          <Star className={`w-3.5 h-3.5 ${hasData ? "text-amber-500 fill-amber-500" : "text-zinc-300"}`} />
        </div>
        <div className="flex items-baseline gap-1.5">
          <div className="text-2xl font-bold tracking-tight text-zinc-900 font-mono">
            {hasData ? averageRating.toFixed(1) : "—"}
          </div>
          {hasData && <span className="text-xs text-zinc-400 font-mono">/ 5.0</span>}
        </div>
        <div className="text-[11px] text-zinc-500 mt-2 font-mono">
          {hasData ? `${totalResponses} total verified reviews` : "Awaiting first response"}
        </div>
      </div>

      {/* 2. Total Verified Responses */}
      <div className="p-4 sm:p-5 rounded-lg border border-zinc-200/90 bg-white shadow-xs">
        <div className="flex items-center justify-between text-xs font-medium text-zinc-500 mb-1.5">
          <span>Total Feedback</span>
          <Inbox className="w-3.5 h-3.5 text-zinc-400" />
        </div>
        <div className="text-2xl font-bold tracking-tight text-zinc-900 font-mono">
          {totalResponses.toLocaleString()}
        </div>
        <div className="text-[11px] text-zinc-500 mt-2 font-mono">
          {hasData ? "Direct in-person capture" : "0 responses captured"}
        </div>
      </div>

      {/* 3. Net Promoter Score Estimate */}
      <div className="p-4 sm:p-5 rounded-lg border border-zinc-200/90 bg-white shadow-xs">
        <div className="flex items-center justify-between text-xs font-medium text-zinc-500 mb-1.5">
          <span>NPS Index</span>
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <div className="text-2xl font-bold tracking-tight text-zinc-900 font-mono">
            {hasData ? (npsEstimate > 0 ? `+${npsEstimate}` : npsEstimate) : "—"}
          </div>
          {hasData && (
            <span
              className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                npsEstimate >= 50
                  ? "bg-emerald-100 text-emerald-800"
                  : npsEstimate >= 0
                  ? "bg-blue-100 text-blue-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {npsEstimate >= 50 ? "Excellent" : npsEstimate >= 0 ? "Good" : "Needs Review"}
            </span>
          )}
        </div>
        <div className="text-[11px] text-zinc-500 mt-2 font-mono">
          {hasData ? `${positivePercentage}% promoters (4-5 stars)` : "NPS calculated on feedback"}
        </div>
      </div>

      {/* 4. Attention Needed / Low Ratings */}
      <div className="p-4 sm:p-5 rounded-lg border border-zinc-200/90 bg-white shadow-xs">
        <div className="flex items-center justify-between text-xs font-medium text-zinc-500 mb-1.5">
          <span>Low Satisfaction</span>
          <AlertCircle
            className={`w-3.5 h-3.5 ${
              attentionNeeded > 0 ? "text-red-500" : "text-zinc-400"
            }`}
          />
        </div>
        <div className="flex items-baseline gap-1.5">
          <div
            className={`text-2xl font-bold tracking-tight font-mono ${
              attentionNeeded > 0 ? "text-red-600" : "text-zinc-900"
            }`}
          >
            {attentionNeeded}
          </div>
          <span className="text-xs text-zinc-400 font-mono">items (1-2 stars)</span>
        </div>
        <div className="text-[11px] text-zinc-500 mt-2 font-mono">
          {attentionNeeded > 0
            ? "Requires operational triage"
            : "No active negative alerts"}
        </div>
      </div>
    </div>
  );
}
