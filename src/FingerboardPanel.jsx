import React from "react";

/** First-position stopped-note catalog shared by Overview heatmap + practice mapper. */
export const HEATMAP_NOTE_TARGETS = [
  { row: 2, rowPos: 2.18, col: 0, finger: 1, note: "D2" },
  { row: 7, rowPos: 7.11, col: 0, finger: 2, note: "Eb2" },
  { row: 12, rowPos: 11.76, col: 0, finger: 3, note: "E2" },
  { row: 16, rowPos: 16.16, col: 0, finger: 4, note: "F2" },
  { row: 2, rowPos: 2.18, col: 1, finger: 1, note: "A2" },
  { row: 7, rowPos: 7.11, col: 1, finger: 2, note: "Bb2" },
  { row: 12, rowPos: 11.76, col: 1, finger: 3, note: "B2" },
  { row: 16, rowPos: 16.16, col: 1, finger: 4, note: "C3" },
  { row: 2, rowPos: 2.18, col: 2, finger: 1, note: "E3" },
  { row: 7, rowPos: 7.11, col: 2, finger: 2, note: "F3" },
  { row: 12, rowPos: 11.76, col: 2, finger: 3, note: "F#3" },
  { row: 16, rowPos: 16.16, col: 2, finger: 4, note: "G3" },
  { row: 2, rowPos: 2.18, col: 3, finger: 1, note: "B3" },
  { row: 7, rowPos: 7.11, col: 3, finger: 2, note: "C4" },
  { row: 12, rowPos: 11.76, col: 3, finger: 3, note: "C#4" },
  { row: 16, rowPos: 16.16, col: 3, finger: 4, note: "D4" },
];

const FINGERBOARD_IMAGE_WIDTH = 1570;
const FINGERBOARD_IMAGE_HEIGHT = 2777;
const FINGERBOARD_POSITION_ANCHORS = [
  { rowPos: 2.18, y: 32.95, x: [41.3, 46.2, 51.6, 56.6] },
  { rowPos: 7.11, y: 42.5, x: [40.8, 45.9, 51.7, 57.0] },
  { rowPos: 11.76, y: 52.45, x: [39.9, 46.0, 51.7, 57.2] },
  { rowPos: 16.16, y: 61.35, x: [39.4, 45.9, 51.7, 57.6] },
];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function fingerboardPoint(col, rowPos) {
  const safeCol = clamp(Number(col) || 0, 0, 3);
  const position = Number(rowPos) || 0;
  const anchors = FINGERBOARD_POSITION_ANCHORS;
  let lower = anchors[0];
  let upper = anchors[1];

  if (position >= anchors[anchors.length - 1].rowPos) {
    lower = anchors[anchors.length - 2];
    upper = anchors[anchors.length - 1];
  } else {
    for (let index = 0; index < anchors.length - 1; index += 1) {
      if (position <= anchors[index + 1].rowPos) {
        lower = anchors[index];
        upper = anchors[index + 1];
        break;
      }
    }
  }

  const span = upper.rowPos - lower.rowPos || 1;
  const t = (position - lower.rowPos) / span;
  const x = lower.x[safeCol] + (upper.x[safeCol] - lower.x[safeCol]) * t;
  const y = lower.y + (upper.y - lower.y) * t;

  return {
    x: clamp(x, 36, 62),
    y: clamp(y, 24, 72),
  };
}

export default function FingerboardPanel({
  pressure,
  contacts = [],
  noteTargets = [],
  practiceTargets = [],
}) {
  const displayContacts = contacts.length ? contacts : [];

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-slate-800 px-5 py-3">
        <span className="text-[10px] font-bold tracking-widest text-slate-500">FINGERBOARD</span>
      </div>

      {/* Photo + heatmap overlay */}
      <div className="relative min-h-0 flex-1 overflow-hidden bg-slate-950">
        <div
          className="absolute left-1/2 top-0 w-full"
          style={{
            aspectRatio: `${FINGERBOARD_IMAGE_WIDTH} / ${FINGERBOARD_IMAGE_HEIGHT}`,
            transform: "translateX(-50%) scale(1.08)",
            transformOrigin: "center top",
          }}
        >
          <img
            src="/cello-fingerboard-note-guide.png"
            alt="Cello Fingerboard"
            className="absolute inset-0 h-full w-full"
          />

          {/* Heatmap SVG overlay in the same coordinate space as the photo */}
          <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${FINGERBOARD_IMAGE_WIDTH} ${FINGERBOARD_IMAGE_HEIGHT}`}>
            
            {/* Practice score targets (where user should be pressing) */}
            {practiceTargets.map((target, index) => {
              const rowPos = target.row_pos ?? target.rowPos ?? target.row ?? 0;
              const point = fingerboardPoint(target.col, rowPos);
              const x = (point.x / 100) * FINGERBOARD_IMAGE_WIDTH;
              const y = (point.y / 100) * FINGERBOARD_IMAGE_HEIGHT;
              const label = target.note || "target";
              const labelWidth = Math.max(92, label.length * 27 + 24);
              return (
                <g key={`practice-${target.col}-${rowPos}-${index}`}>
                  <circle
                    cx={x}
                    cy={y}
                    r="28"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="5"
                    strokeDasharray="14 10"
                    opacity="0.95"
                  />
                  <circle cx={x} cy={y} r="12" fill="none" stroke="#fbbf24" strokeWidth="4" />
                  <rect x={x + 26} y={y - 56} width={labelWidth} height="42" rx="12" fill="#78350f" opacity="0.9" />
                  <text x={x + 38} y={y - 25} fontSize="25" fill="#fef3c7" fontWeight="800">
                    {label}
                  </text>
                </g>
              );
            })}

            {/* Active sensor contacts */}
            {displayContacts.map((contact, index) => {
              const point = fingerboardPoint(contact.col, contact.row_pos);
              const x = (point.x / 100) * FINGERBOARD_IMAGE_WIDTH;
              const y = (point.y / 100) * FINGERBOARD_IMAGE_HEIGHT;
              const label = contact.note || contact.target_note || contact.string;
              const labelWidth = Math.max(92, label.length * 27 + 24);
              return (
                <g key={`${contact.col}-${contact.peak_row}-${index}`}>
                  <circle cx={x} cy={y} r="16" fill="none" stroke="white" strokeWidth="6"/>
                  <circle cx={x} cy={y} r="7.5" fill={contact.selected ? "#3b82f6" : "#22c55e"}/>
                  <rect x={x + 26} y={y - 56} width={labelWidth} height="42" rx="12" fill="#0f172a" opacity="0.86" />
                  <text x={x + 38} y={y - 25} fontSize="25" fill="white" fontWeight="800">
                    {label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

      </div>

      {/* Pressure legend */}
      <div className="flex shrink-0 items-center gap-2 border-t border-slate-800 bg-slate-950 px-5 py-2.5 text-[10px] text-slate-400">
        <span className="font-medium text-slate-500">Pressure</span>
        <span className="ml-1">Low</span>
        <div
          className="h-2 flex-1 rounded-full"
          style={{ background: "linear-gradient(to right,#3b82f6,#06b6d4,#22c55e,#facc15,#f97316,#ef4444)" }}
        />
        <span>High</span>
      </div>
    </div>
  );
}
