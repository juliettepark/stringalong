import React from "react";

/**
 * Play / Pause / Stop / Next controls for the Practice tab.
 */
export default function PlayPauseControls({
  scoreReady,
  isPlaying,
  onPlay,
  onPause,
  onStop,
  onNext,
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        disabled={!scoreReady || isPlaying}
        onClick={onPlay}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Play
      </button>
      <button
        type="button"
        disabled={!scoreReady || !isPlaying}
        onClick={onPause}
        className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-100 transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Pause
      </button>
      <button
        type="button"
        disabled={!scoreReady}
        onClick={onStop}
        className="rounded-lg bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-300 transition-colors hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Stop
      </button>
      <button
        type="button"
        disabled={!scoreReady}
        onClick={onNext}
        className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
