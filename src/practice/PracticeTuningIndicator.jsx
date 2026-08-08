import React from "react";
import TunerGauge from "../TunerGauge.jsx";

/**
 * Component to show detected note, score note, and tuning gauge for current pitch matching
 */
export default function PracticeTuningIndicator({ liveData, scorePitchName = null }) {
  const hasData = Boolean(liveData?.hasData);
  const cents = liveData?.centsOffset || 0;
  const note = hasData ? liveData.note : "--";
  const currentHz = hasData ? liveData.currentHz : 0;
  const targetHz = hasData ? liveData.hz : 0;

  return (
    <>
      <div className="flex flex-col items-center text-center">
        <div className="text-[10px] font-bold tracking-widest text-slate-500">DETECTED</div>
        <div className="mt-1 text-2xl font-light leading-none tabular-nums text-slate-100">{note}</div>
        <div className="mt-1 text-sm font-light tabular-nums text-blue-300">{currentHz.toFixed(1)}Hz</div>
      </div>

      <div className="flex flex-col items-center">
        <TunerGauge cents={cents} hasData={hasData} />
        <div className="-mt-3 text-center">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Target</div>
          <div className="text-sm font-semibold tabular-nums text-slate-100">
            {hasData ? `${targetHz.toFixed(1)}Hz` : "0.0Hz"}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center text-center">
        <div className="text-[10px] font-bold tracking-widest text-slate-500">SCORE NOTE</div>
        <div className="mt-1 text-2xl font-light leading-none tabular-nums text-slate-100">
          {scorePitchName ?? "—"}
        </div>
      </div>
    </>
  );
}
