"use client";

interface TrendPoint {
  label: string;
  avg: number;
}

export function SatisfactionTrendChart({ points }: { points: TrendPoint[] }) {
  if (!points || points.length === 0) {
    return (
      <div className="p-5 rounded-lg border border-zinc-200/90 bg-white shadow-xs flex items-center justify-center h-56 text-xs text-zinc-400 font-mono">
        No satisfaction data recorded for this window
      </div>
    );
  }

  const validPoints = points.filter((p) => p.avg > 0);
  const lastAvg = validPoints.length > 0 ? validPoints[validPoints.length - 1].avg : 0;

  const width = 500;
  const height = 140;
  const padding = 20;

  const getY = (val: number) => {
    const min = 1.0;
    const max = 5.0;
    const clamped = Math.max(min, Math.min(max, val || 4.0));
    return height - padding - ((clamped - min) / (max - min)) * (height - 2 * padding);
  };

  const getX = (idx: number) => {
    if (points.length <= 1) return width / 2;
    return padding + (idx / (points.length - 1)) * (width - 2 * padding);
  };

  const pathD = points
    .map((pt, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(pt.avg)}`)
    .join(" ");

  const areaD = `${pathD} L ${getX(points.length - 1)} ${height} L ${getX(0)} ${height} Z`;

  return (
    <div className="p-5 rounded-lg border border-zinc-200/90 bg-white shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900">Satisfaction Trend</h3>
          <p className="text-xs text-zinc-500">Average customer rating dynamics</p>
        </div>
        {lastAvg > 0 ? (
          <div
            className={`text-xs font-semibold px-2 py-0.5 rounded font-mono ${
              lastAvg >= 4.5
                ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
                : lastAvg >= 3.5
                ? "text-blue-700 bg-blue-50 border border-blue-200"
                : "text-red-700 bg-red-50 border border-red-200"
            }`}
          >
            {lastAvg.toFixed(2)} / 5
          </div>
        ) : (
          <div className="text-xs text-zinc-400 font-mono">Awaiting ratings</div>
        )}
      </div>

      <div className="w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-36">
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Guidelines */}
          {[1, 2, 3, 4, 5].map((level) => (
            <line
              key={level}
              x1={padding}
              y1={getY(level)}
              x2={width - padding}
              y2={getY(level)}
              stroke="#f1f5f9"
              strokeDasharray="3 3"
            />
          ))}

          {/* Area fill */}
          <path d={areaD} fill="url(#trendGradient)" />

          {/* Stroke path */}
          <path
            d={pathD}
            fill="none"
            stroke="#2563eb"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data point dots */}
          {points.map((pt, i) => (
            <circle
              key={i}
              cx={getX(i)}
              cy={getY(pt.avg)}
              r="3.5"
              className="fill-white stroke-blue-600 stroke-2"
            />
          ))}
        </svg>

        {/* X-axis labels */}
        <div className="flex justify-between text-[10px] text-zinc-400 pt-1 font-mono">
          <span>{points[0]?.label || "Start"}</span>
          <span>{points[Math.floor(points.length / 2)]?.label}</span>
          <span>{points[points.length - 1]?.label || "Now"}</span>
        </div>
      </div>
    </div>
  );
}
