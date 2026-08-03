import React from "react";

/**
 * BPM range control for practice tempo (quarter-note beats per minute).
 */
export default function BpmSlider({ bpm, min = 40, max = 200, onChange }) {
  return (
    <label className="flex min-w-[10rem] flex-col gap-1 sm:max-w-xs">
      <span className="text-[10px] font-bold tracking-widest text-slate-500">
        BPM · {bpm}
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={5}
        value={bpm}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-emerald-500"
        aria-label="Practice tempo in BPM"
      />
    </label>
  );
}
