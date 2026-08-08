import React from "react";

/** Toggle: when on, Play starts a CSV session and Stop downloads it. */
export default function RecordToggle({ enabled, disabled = false, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
      <input
        type="checkbox"
        checked={enabled}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-emerald-500"
        aria-label="Save session CSV when playing"
      />
      <span className="text-[10px] font-bold tracking-widest text-slate-500">SAVE CSV</span>
    </label>
  );
}
