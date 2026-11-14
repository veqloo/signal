"use client";

interface TrendPoint {
  label: string;
  avg: number;
}

export function SatisfactionTrendChart({ points }: { points: TrendPoint[] }) {
  if (!points || points.length === 0) {
    return (
      <div className="p-5 rounded-lg border border-slate-200 bg-white shadow-card flex items-center justify-center h-56 text-xs text-slate-400">
        Not enough feedback data to plot trend line
      </div>
    );
  }

  // Generate SVG coordinates
  const width = 500;
  const height = 140;
  const padding = 20;

  // Scale: rating 1 to 5 -> height - padding to padding
  const getY = (val: number) => {
    const min = 3.0;
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
    <div className="p-5 rounded-lg border border-slate-200 bg-white shadow-card">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Satisfaction Trend</h3>
          <p className="text-xs text-slate-500">Average customer rating over time</p>
        </div>
        <div className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
          Steady & High Quality
        </div>
      </div>

      <div className="w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-36">
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1={padding}
            y1={getY(5.0)}
            x2={width - padding}
            y2={getY(5.0)}
            stroke="#f1f5f9"
            strokeDasharray="4 4"
          />
          <line
            x1={padding}
            y1={getY(4.0)}
            x2={width - padding}
            y2={getY(4.0)}
            stroke="#f1f5f9"
            strokeDasharray="4 4"
          />

          {/* Filled Area */}
          <path d={areaD} fill="url(#trendGradient)" />

          {/* Line */}
          <path
            d={pathD}
            fill="none"
            stroke="#2563eb"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points */}
          {points.map((pt, idx) => (
            <circle
              key={idx}
              cx={getX(idx)}
              cy={getY(pt.avg)}
              r="4"
              className="fill-white stroke-blue-600 stroke-2 hover:r-5 transition-all"
            />
          ))}
        </svg>

        <div className="flex justify-between text-[10px] text-slate-400 px-2 mt-1">
          {points.map((pt, i) => (
            <span key={i} className="truncate">
              {pt.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
