import { Star, MessagesSquare, TrendingUp, AlertTriangle, HeartHandshake } from "lucide-react";

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
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* 1. Average Rating */}
      <div className="p-5 rounded-lg border border-slate-200 bg-white shadow-card">
        <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-2">
          <span>Average Rating</span>
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
        </div>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold tracking-tight text-slate-900">
            {totalResponses > 0 ? averageRating.toFixed(1) : "—"}
          </div>
          <span className="text-xs text-slate-400">/ 5.0</span>
        </div>
        <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-2">
          <TrendingUp className="w-3 h-3" />
          <span>+0.2 vs last period</span>
        </div>
      </div>

      {/* 2. Total Responses */}
      <div className="p-5 rounded-lg border border-slate-200 bg-white shadow-card">
        <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-2">
          <span>Total Feedback</span>
          <MessagesSquare className="w-4 h-4 text-slate-400" />
        </div>
        <div className="text-2xl font-bold tracking-tight text-slate-900">
          {totalResponses.toLocaleString()}
        </div>
        <div className="text-[11px] text-slate-500 mt-2">
          Across all active channels
        </div>
      </div>

      {/* 3. Positive Satisfaction */}
      <div className="p-5 rounded-lg border border-slate-200 bg-white shadow-card">
        <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-2">
          <span>Positive Sentiment</span>
          <TrendingUp className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="text-2xl font-bold tracking-tight text-slate-900">
          {positivePercentage}%
        </div>
        <div className="text-[11px] text-slate-500 mt-2">
          Ratings of 4 or 5 stars
        </div>
      </div>

      {/* 4. Attention Needed */}
      <div className="p-5 rounded-lg border border-slate-200 bg-white shadow-card">
        <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-2">
          <span>Needs Attention</span>
          <AlertTriangle className={`w-4 h-4 ${attentionNeeded > 0 ? "text-red-500" : "text-slate-400"}`} />
        </div>
        <div className="text-2xl font-bold tracking-tight text-slate-900">
          {attentionNeeded}
        </div>
        <div className={`text-[11px] font-medium mt-2 ${attentionNeeded > 0 ? "text-red-600" : "text-slate-500"}`}>
          {attentionNeeded > 0 ? "Ratings of 1 or 2 stars" : "Zero negative ratings"}
        </div>
      </div>
    </div>
  );
}
