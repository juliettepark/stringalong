import React from "react";

/** Circle that grows from the center with pressure; turns green at threshold. */
export default function PressureThresholdIndicator({ pressure = 0, threshold = 2.1 }) {
  const reached = pressure >= threshold;
  // What percentage of the threshold is the pressure? (max 100%)
  const t = Math.min(1, Math.max(0, pressure / threshold));
  // Calculate radius of circle based on percentage of threshold
  // This is how far color "spreads out" from center
  const r = 4 + (t * 36);

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] font-bold tracking-widest text-slate-500">PRESSURE</span>
      <svg width="80" height="80" viewBox="0 0 80 80" aria-label={reached ? "Pressure reached" : "Pressure too light"}>
        <circle cx="40" cy="40" r="39" fill="none" />
        <circle cx="40" cy="40" r={r} fill={reached ? "#22c55e" : "#f59e0b"} />
        <text x="40" y="40" textAnchor="middle" dominantBaseline="central" fill="white" fontSize="14" fontWeight="700">
          {Number(pressure).toFixed(1)}
        </text>
      </svg>
    </div>
  );
}
