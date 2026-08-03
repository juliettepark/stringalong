import React, { useState, useEffect, useRef } from "react";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";
import { PRACTICE_PIECES } from "./practicePieces.js";
import PlayPauseControls from "./PlayPauseControls.jsx";
import ScoreDropdown from "./ScoreDropdown.jsx";

/**
 * First-position cello pitches (A4 = 440 Hz), including open strings.
 * Used to map OSMD frequencies → letter names like "F#3".
 */
const CELLO_FIRST_POSITION_NOTES = [
  { note: "C2", frequency: 65.406391 },
  { note: "D2", frequency: 73.416192 },
  { note: "Eb2", frequency: 77.781746 },
  { note: "E2", frequency: 82.406889 },
  { note: "F2", frequency: 87.307058 },
  { note: "G2", frequency: 97.998859 },
  { note: "A2", frequency: 110.0 },
  { note: "Bb2", frequency: 116.54094 },
  { note: "B2", frequency: 123.470825 },
  { note: "C3", frequency: 130.812783 },
  { note: "D3", frequency: 146.832384 },
  { note: "E3", frequency: 164.813778 },
  { note: "F3", frequency: 174.614116 },
  { note: "F#3", frequency: 184.997211 },
  { note: "G3", frequency: 195.997718 },
  { note: "A3", frequency: 220.0 },
  { note: "B3", frequency: 246.941651 },
  { note: "C4", frequency: 261.625565 },
  { note: "C#4", frequency: 277.182631 },
  { note: "D4", frequency: 293.664768 },
];

/** Match Hz to the nearest first-position note within ~50 cents; otherwise null. */
function frequencyToNote(frequency, maxCents = 50) {
  const hz = Number(frequency);
  if (!Number.isFinite(hz) || hz <= 0) return null;

  let best = null;
  let bestCents = Infinity;

  for (const entry of CELLO_FIRST_POSITION_NOTES) {
    const cents = Math.abs(1200 * Math.log2(hz / entry.frequency));
    if (cents < bestCents) {
      bestCents = cents;
      best = entry.note;
    }
  }

  return bestCents <= maxCents ? best : null;
}

/**
 * Practice tab
 */
export default function PracticePage() {
  const osmdRef = useRef(null);
  const containerRef = useRef(null);
  const timerRef = useRef(null);
  // make a ref to ensure value is never stale for timer logic
  const isPlayingRef = useRef(false);
  const [status, setStatus] = useState("Loading score…");
  const [bpm, setBpm] = useState(80);
  const [selectedPiece, setSelectedPiece] = useState(PRACTICE_PIECES[1]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);

  const scoreReady = status === "Ready";

  // Keep a ref in sync so timeouts don't see a stale isPlaying from an old render.
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const clearTimer = () => {
    if (timerRef.current != null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

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

  const dwellMsForNote = (note) => {
    if (!note?.Length) return (60 / bpm) * 1000;
    // Length is a whole-note Fraction; * 4 → quarter-note beats.
    const beats = note.Length.RealValue * 4;
    return Math.max(1, beats * (60 / bpm) * 1000); // never schedule 0 length
  };

  const setTimerForCurrentNote = (note = currentNote) => {
    clearTimer();
    if (!note) {
      console.error("No current note");
      return;
    }

    const frequency = note.pitch?.frequency;
    const letter = frequency != null ? frequencyToNote(frequency) : null;
    const dwellMs = dwellMsForNote(note);
    console.log("Current note:", letter, "dwellMs:", dwellMs);

    timerRef.current = setTimeout(() => {
      handleNext();
    }, dwellMs);
  };

  useEffect(() => {
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
    });

    osmd.EngravingRules.RenderXMeasuresPerLineAkaSystem = 4; // e.g. 4 bars per line

    osmdRef.current = osmd;

    const loadScore = async () => {
      if (!osmd) {
        setStatus("OSMD not initialized");
        return;
      }
      if (!selectedPiece) {
        setStatus("No score selected");
        return;
      }

      try {
        isPlayingRef.current = false;
        setIsPlaying(false);
        clearTimer();
        setStatus("Loading score…");
        await osmd.load(selectedPiece.musicXml);
        if (cancelled) return;
        osmd.render();
        osmd.cursor.reset();
        osmd.cursor.show();

        fixOsmdCursorSize(osmd);
        const notes = osmd.cursor.NotesUnderCursor();
        printNotes(notes);
        setCurrentNote(notes[0] ?? null);
        setStatus("Ready");
      } catch (error) {
        if (cancelled) return;
        console.error(error);
        isPlayingRef.current = false;
        setIsPlaying(false);
        setStatus("OSMD Load Failed");
      }
    };

    loadScore();

    // Return cleanup function to remove old OSMD instance on unmount
    return () => {
      cancelled = true;
      clearTimer();
      isPlayingRef.current = false;
      setIsPlaying(false);
      osmdRef.current = null;
      containerRef.current.innerHTML = "";
    };
  }, [selectedPiece]);

  const printNotes = (notes) => {
    console.log("Notes under cursor:", notes);
    console.log("Count:", notes.length);
    if (notes[0]) {
      console.log("Pitch Frequency (Hz):", notes[0].pitch?.frequency);
      console.log("Mapped note:", frequencyToNote(notes[0].pitch?.frequency));
      console.log("Length:", notes[0].Length);
      console.log("IsRest:", notes[0].isRest());
    }
  };

  const handleNext = () => {
    const osmd = osmdRef.current;
    if (!osmd?.cursor) return;

    osmd.cursor.next();
    fixOsmdCursorSize(osmd);

    // Use ref — timeout callbacks close over a stale isPlaying state value.
    if (!isPlayingRef.current) return;

    if (osmd.cursor.Iterator.EndReached) {
      console.log("End of piece reached");
      handleStop();
      return;
    }

    const nextNote = osmd.cursor.NotesUnderCursor()[0] ?? null;
    setCurrentNote(nextNote);
    // Pass the note in — setState is async, so currentNote is still the old one here.
    setTimerForCurrentNote(nextNote);
  };

  const handlePlay = () => {
    if (!scoreReady) return;
    isPlayingRef.current = true;
    setIsPlaying(true);
    setTimerForCurrentNote(currentNote);
  };

  const handlePause = () => {
    clearTimer();
    isPlayingRef.current = false;
    setIsPlaying(false);
  };

  const handleStop = () => {
    clearTimer();
    isPlayingRef.current = false;
    setIsPlaying(false);
    const osmd = osmdRef.current;
    if (!osmd?.cursor) return;
    osmd.cursor.reset();
    osmd.cursor.show();
    fixOsmdCursorSize(osmd);
    setCurrentNote(osmd.cursor.NotesUnderCursor()[0] ?? null);
  };

  const handlePieceChange = (event) => {
    const piece = PRACTICE_PIECES.find((p) => p.id === event.target.value);
    if (!piece || piece.id === selectedPiece?.id) {
      console.log("Unable to find piece corresponding to id:", event.target.value);
      return;
    }

    clearTimer();
    isPlayingRef.current = false;
    setIsPlaying(false);
    setSelectedPiece(piece);
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

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 shadow-[0_18px_50px_rgba(0,0,0,0.22)] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex min-w-0 items-center gap-3">
            <span
              className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                isPlaying ? "bg-emerald-400" : scoreReady ? "bg-slate-500" : "bg-amber-400"
              }`}
            />
            <div className="min-w-0">
              <div className="text-sm font-semibold text-slate-100">
                {isPlaying ? "Playing" : scoreReady ? "Stopped" : status}
              </div>
              <div className="truncate text-xs text-slate-400">
                {selectedPiece?.title ?? "No piece"} · {bpm} BPM · {status}
              </div>
            </div>
          </div>

          <ScoreDropdown
            pieces={PRACTICE_PIECES}
            selectedPieceId={selectedPiece?.id}
            onChange={handlePieceChange}
          />
        </div>

        <PlayPauseControls
          scoreReady={scoreReady}
          isPlaying={isPlaying}
          onPlay={handlePlay}
          onPause={handlePause}
          onStop={handleStop}
          onNext={handleNext}
        />
      </div>

      <div ref={containerRef} className="osmd-container w-full rounded-2xl bg-white p-3" />
    </div>
  );
}
