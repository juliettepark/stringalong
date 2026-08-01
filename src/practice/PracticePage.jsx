import React, { useState, useEffect, useRef } from "react";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";
import {
  getPracticePieceById,
  PRACTICE_PIECES,
} from "./practicePieces.js";

/**
 * Practice tab
 */
export default function PracticePage() {
  const osmdRef = useRef(null);
  const containerRef = useRef(null);
  const [status, setStatus] = useState("Loading score…");
  const [bpm, setBpm] = useState(80);
  const [selectedPiece, setSelectedPiece] = useState(PRACTICE_PIECES[0]);

  const fixOsmdCursorSize = (osmd) => {
    const el = osmd?.cursor?.cursorElement;
    if (!el) return;

    const width = Number(el.getAttribute("width") || el.width || 30);
    const height = Number(el.getAttribute("height") || el.height || 40);

    el.style.maxWidth = "none";
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;
    el.style.objectFit = "fill";
    el.style.zIndex = "10";
    el.style.display = "block";
  };


  useEffect( () => {

    // In case cleanup already ran, need to cancel late async work
    let cancelled = false;

    const osmd = new OpenSheetMusicDisplay(containerRef.current, {
      autoResize: false,
      backend: "svg",
      drawTitle: true,
      drawSubtitle: true,
      drawComposer: true,
      drawCredits: false,
      drawPartNames: true,
      disableCursor: false,
      cursorsOptions: [{ type: 0, color: "#33e02f", alpha: 0.5, follow: false }],
    })

    osmdRef.current = osmd;

    const loadScore = async() => {
      if (!osmd) {
        setStatus("OSMD not initialized");
        return;
      } else if (!selectedPiece) {
        setStatus("No score selected");
        return;
      }

      try {
        setStatus("Loading score…");
        await osmd.load(selectedPiece.musicXml);
        if (cancelled) return;
        osmd.render();
        osmd.cursor.reset();
        osmd.cursor.show();

        fixOsmdCursorSize(osmd);
        setStatus("Ready");
      } catch (error) {
        if (cancelled) return;
        console.error(error);
        setStatus("OSMD Load Failed");
      }
    }

    loadScore();

    // Return cleanup function to remove old OSMD instance on unmount
    return () => {
      cancelled = true;
      osmdRef.current = null;
      containerRef.current.innerHTML = "";
    }
  }, [selectedPiece] );

  const handleNext = () => {
    const osmd = osmdRef.current;
    if (!osmd?.cursor) return;
    osmd.cursor.next();
    fixOsmdCursorSize(osmd);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 lg:p-6">
      <div className="shrink-0 rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
        <div className="text-[10px] font-bold tracking-widest text-slate-500">PRACTICE</div>
        <div className="mt-2 text-2xl font-semibold text-slate-100">Practice</div>
        <p className="mt-2 max-w-xl text-sm text-slate-400">
          {selectedPiece
            ? `Playing ${selectedPiece.title} (${selectedPiece.fileName}).`
            : "Select a practice piece to begin."}
          {" "}
          {PRACTICE_PIECES.length} piece{PRACTICE_PIECES.length === 1 ? "" : "s"} available.
        </p>
      </div>

      <p className="text-sm text-slate-300">Status: {status}</p>
      <button className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white" onClick={handleNext}>Next</button>
      <div ref={containerRef} className="osmd-container w-full rounded-2xl bg-white p-3" />
    </div>
  );
}
