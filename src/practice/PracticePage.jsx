import React from "react";

/**
 * Practice tab shell
 */
export default function PracticePage() {
  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 lg:p-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
        <div className="text-[10px] font-bold tracking-widest text-slate-500">PRACTICE</div>
        <div className="mt-3 text-2xl font-semibold text-slate-100">Practice</div>
        <p className="mt-2 max-w-xl text-sm text-slate-400">
          Load a MusicXML score, set a tempo, and follow the cursor with fingerboard guidance.
        </p>
      </div>
    </div>
  );
}
