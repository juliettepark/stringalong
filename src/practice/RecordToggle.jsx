import React from "react";

/** Toggle for Play/Stop-linked session capture. */
export default function RecordToggle({
  enabled,
  disabled = false,
  onChange,
  label = "SAVE CSV",
  ariaLabel = "Save session CSV when playing",
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
      <input
        type="checkbox"
        checked={enabled}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-emerald-500"
        aria-label={ariaLabel}
      />
      <span className="text-[10px] font-bold tracking-widest text-slate-500">{label}</span>
    </label>
  );
}
