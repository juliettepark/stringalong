import React from "react";

/** Arc tuner needle for cents offset (−50 … +50). 
 * Refactored from CelloPressureHeatmapUI.jsx
*/
export default function TunerGauge({ cents = 0, hasData = true }) {
  const W = 360;
  const H = 180;
  const cx = 180;
  const cy = 150;
  const r = 118;
  const clamped = Math.max(-50, Math.min(50, cents));
  const needleAngle = -130 + ((clamped + 50) / 100) * 80;
  const toRad = (degrees) => (degrees * Math.PI) / 180;
  const point = (angle, radius) => ({
    x: cx + Math.cos(toRad(angle)) * radius,
    y: cy + Math.sin(toRad(angle)) * radius,
  });
  const needle = point(needleAngle, r - 8);
  const targetLeft = point(-94, r - 24);
  const targetRight = point(-86, r - 24);
  const targetTip = point(-90, 42);
  const tickValues = [-50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: "74px" }}>
      <defs>
        <linearGradient id="tunerNeedle" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>

      <path d={`M${point(-130, r).x},${point(-130, r).y} A${r},${r} 0 0 1 ${point(-50, r).x},${point(-50, r).y}`} fill="none" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
      <polygon
        points={`${targetLeft.x},${targetLeft.y} ${targetRight.x},${targetRight.y} ${targetTip.x},${targetTip.y}`}
        fill="#22c55e"
        opacity="0.15"
      />

      {tickValues.map((tick) => {
        const angle = -130 + ((tick + 50) / 100) * 80;
        const outer = point(angle, r);
        const inner = point(angle, tick === 0 || Math.abs(tick) === 10 ? r - 22 : r - 12);
        const label = point(angle, r + 18);
        const isCenterZone = Math.abs(tick) <= 10;
        return (
          <g key={tick}>
            <line
              x1={outer.x}
              y1={outer.y}
              x2={inner.x}
              y2={inner.y}
              stroke={isCenterZone ? "#a3e635" : "#3b82f6"}
              strokeWidth={tick === 0 ? 4 : Math.abs(tick) === 10 ? 3 : 1.8}
              strokeLinecap="round"
            />
            {tick % 10 === 0 && (
              <text
                x={label.x}
                y={label.y}
                fontSize="11"
                fill={isCenterZone ? "#a3e635" : "#3b82f6"}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {tick}
              </text>
            )}
          </g>
        );
      })}

      {hasData && (
        <line
          x1={cx}
          y1={cy}
          x2={needle.x}
          y2={needle.y}
          stroke={Math.abs(clamped) <= 5 ? "#22c55e" : "url(#tunerNeedle)"}
          strokeWidth="5"
          strokeLinecap="round"
        />
      )}
      <circle cx={cx} cy={cy} r="6" fill="#cbd5e1" />
    </svg>
  );
}
