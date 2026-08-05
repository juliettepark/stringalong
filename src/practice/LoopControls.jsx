import React, { useState, useEffect } from "react";

/**
 * Loop enable + start/end bar selectors for practice playback.
 * Bar values commit on blur or Enter, not on every keystroke.
 */
export default function LoopControls({
  enabled,
  startBar,
  endBar,
  measureCount = 1,
  countdownRemaining = 0,
  disabled = false,
  onEnabledChange,
  onStartBarChange,
  onEndBarChange,
}) {
  const maxBar = Math.max(1, measureCount);
  const [startInput, setStartInput] = useState(String(startBar));
  const [endInput, setEndInput] = useState(String(endBar));

  useEffect(() => {
    setStartInput(String(startBar));
  }, [startBar]);

  useEffect(() => {
    setEndInput(String(endBar));
  }, [endBar]);

  const commitStart = () => {
    const nextStart = Math.max(1, startInput);
    if (nextStart > maxBar || nextStart > endBar) {
      setStartInput(String(startBar));
      return;
    }
    onStartBarChange(nextStart);
    setStartInput(String(nextStart));
  };

  const commitEnd = () => {
    const nextEnd = Math.min(maxBar, endInput);
    if (nextEnd < startBar || nextEnd > maxBar) {
      setEndInput(String(endBar));
      return;
    }
    onEndBarChange(nextEnd);
    setEndInput(String(nextEnd));
  };

  const handleKeyDown = (event, commit) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commit();
      event.currentTarget.blur();
    }
  };

  return (
    <div className="flex flex-wrap items-end gap-3">
      <label className="flex cursor-pointer items-center gap-2 pb-1.5 text-sm text-slate-300">
        <input
          type="checkbox"
          checked={enabled}
          disabled={disabled}
          onChange={(event) => onEnabledChange(event.target.checked)}
          className="h-4 w-4 accent-emerald-500"
          aria-label="Enable bar loop"
        />
        <span className="text-[10px] font-bold tracking-widest text-slate-500">LOOP</span>
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-[10px] font-bold tracking-widest text-slate-500">START BAR</span>
        <input
          type="number"
          min={1}
          max={maxBar}
          value={startInput}
          disabled={disabled || !enabled}
          onChange={(event) => setStartInput(event.target.value)}
          onBlur={commitStart}
          onKeyDown={(event) => handleKeyDown(event, commitStart)}
          className="w-16 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-sm text-slate-100 disabled:opacity-40"
          aria-label="Loop start bar"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-[10px] font-bold tracking-widest text-slate-500">END BAR</span>
        <input
          type="number"
          min={1}
          max={maxBar}
          value={endInput}
          disabled={disabled || !enabled}
          onChange={(event) => setEndInput(event.target.value)}
          onBlur={commitEnd}
          onKeyDown={(event) => handleKeyDown(event, commitEnd)}
          className="w-16 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-sm text-slate-100 disabled:opacity-40"
          aria-label="Loop end bar"
        />
      </label>

      {countdownRemaining > 0 ? (
        <div className="pb-1.5 text-xs font-semibold text-amber-300">
          Next loop in {countdownRemaining}…
        </div>
      ) : null}
    </div>
  );
}
