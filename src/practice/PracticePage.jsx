import React, { useState, useEffect, useRef } from "react";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";
import FingerboardPanel from "../FingerboardPanel.jsx";
import { PRACTICE_PIECES } from "./practicePieces.js";
import { lookupFingerboardTarget } from "./pitchToFingerboard.js";
import PlayPauseControls from "./PlayPauseControls.jsx";
import ScoreDropdown from "./ScoreDropdown.jsx";
import BpmSlider from "./BpmSlider.jsx";
import LoopControls from "./LoopControls.jsx";
import PressureThresholdIndicator from "./PressureThresholdIndicator.jsx";
import PracticeTuningIndicator from "./PracticeTuningIndicator.jsx";
import RecordToggle from "./RecordToggle.jsx";
import { buildRecordingRow, rowsToCsv, downloadCsv } from "./recordingCsv.js";

const LOOP_COUNTDOWN_SECONDS = 3;

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
  // F#2 is extended 4th finger on the thickest string
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

function getIterator(osmd) {
  return osmd?.cursor?.Iterator ?? osmd?.cursor?.iterator ?? null;
}

function getCursorMeasureNumber(osmd) {
  const iterator = getIterator(osmd);
  const measure = iterator?.CurrentMeasure ?? iterator?.currentMeasure;
  const value = Number(measure?.MeasureNumber ?? measure?.measureNumber);
  return Number.isFinite(value) ? value : null;
}

function isEndReached(osmd) {
  const iterator = getIterator(osmd);
  return Boolean(iterator?.EndReached ?? iterator?.endReached);
}

/**
 * Practice tab
 */
export default function PracticePage({ liveData }) {
  const osmdRef = useRef(null);
  const containerRef = useRef(null);
  const timerRef = useRef(null);
  const countdownTimerRef = useRef(null);
  // Refs so timeouts don't see stale values from an old render.
  const isPlayingRef = useRef(false);
  const bpmRef = useRef(80);
  const loopEnabledRef = useRef(false);
  const loopStartRef = useRef(1);
  const loopEndRef = useRef(1);
  const measureCountRef = useRef(1);

  // RECORDING FIELDS
  const liveDataRef = useRef(liveData);
  const isRecordingRef = useRef(false);
  const recordEnabledRef = useRef(false);
  const rowsRef = useRef([]);
  const recordingStartedAtRef = useRef(null);
  const selectedPieceRef = useRef(null);

  const [status, setStatus] = useState("Loading score…");
  const [bpm, setBpm] = useState(80);
  const [selectedPiece, setSelectedPiece] = useState(PRACTICE_PIECES[1]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [loopEnabled, setLoopEnabled] = useState(false);
  const [loopStartBar, setLoopStartBar] = useState(1);
  const [loopEndBar, setLoopEndBar] = useState(1);
  const [measureCount, setMeasureCount] = useState(1);
  const [countdownRemaining, setCountdownRemaining] = useState(0);
  const [recordEnabled, setRecordEnabled] = useState(false);

  selectedPieceRef.current = selectedPiece;

  const scoreReady = status === "Ready";

  const pitchName =
    currentNote && typeof currentNote.isRest === "function" && !currentNote.isRest()
      ? frequencyToNote(currentNote.pitch?.frequency)
      : null;
  const { target: practiceTarget, unmapped: unmappedPitch } = lookupFingerboardTarget(pitchName);
  const practiceTargets = practiceTarget ? [practiceTarget] : [];

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);

  useEffect(() => {
    loopEnabledRef.current = loopEnabled;
  }, [loopEnabled]);

  useEffect(() => {
    loopStartRef.current = loopStartBar;
  }, [loopStartBar]);

  useEffect(() => {
    loopEndRef.current = loopEndBar;
  }, [loopEndBar]);

  useEffect(() => {
    measureCountRef.current = measureCount;
  }, [measureCount]);

  useEffect(() => {
    liveDataRef.current = liveData;
  }, [liveData]);

  useEffect(() => {
    recordEnabledRef.current = recordEnabled;
  }, [recordEnabled]);

  const clearNoteTimer = () => {
    if (timerRef.current != null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const clearCountdown = () => {
    if (countdownTimerRef.current != null) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
  };

  const clearAllPlaybackTimers = () => {
    clearNoteTimer();
    clearCountdown();
    setCountdownRemaining(0);
  };

  const captureFrame = (note) => {
    if (!isRecordingRef.current) return;

    const row = buildRecordingRow(
      note,
      liveDataRef.current,
      {
        startedAtMs: recordingStartedAtRef.current,
        pieceId: selectedPieceRef.current?.id ?? "",
        bpm: bpmRef.current,
        loopEnabled: loopEnabledRef.current,
        loopStart: loopStartRef.current,
        loopEnd: loopEndRef.current,
        measureNumber: getCursorMeasureNumber(osmdRef.current),
      },
      frequencyToNote,
    );
    rowsRef.current.push(row);
  };

  const startRecordingSession = (note) => {
    rowsRef.current = [];
    recordingStartedAtRef.current = Date.now();
    isRecordingRef.current = true;
    captureFrame(note);
  };

  const finishRecordingSession = () => {
    if (!isRecordingRef.current) return;

    const rows = rowsRef.current;
    isRecordingRef.current = false;
    recordingStartedAtRef.current = null;
    rowsRef.current = [];

    if (!rows.length) return;

    const pieceId = selectedPieceRef.current?.id || "practice";
    const filename = `practice-${pieceId}-${Date.now()}.csv`;
    downloadCsv(filename, rowsToCsv(rows));
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
    const currentBpm = bpmRef.current || 80;
    if (!note?.Length) return (60 / currentBpm) * 1000;
    // Length is a whole-note Fraction; * 4 → quarter-note beats.
    const beats = note.Length.RealValue * 4;
    return Math.max(1, beats * (60 / currentBpm) * 1000); // never schedule 0 length
  };

  const seekToMeasure = (measureNumber) => {
    const osmd = osmdRef.current;
    if (!osmd?.cursor) return null;

    const maxMeasure = measureCountRef.current || 1;
    const target = Math.min(maxMeasure, Math.max(1, Number(measureNumber) || 1));

    osmd.cursor.reset();
    osmd.cursor.show();

    let guard = 0;
    while (!isEndReached(osmd) && (getCursorMeasureNumber(osmd) ?? 1) < target) {
      osmd.cursor.next();
      guard += 1;
    }

    fixOsmdCursorSize(osmd);
    const note = osmd.cursor.NotesUnderCursor()[0] ?? null;
    setCurrentNote(note);
    return note;
  };

  const setTimerForCurrentNote = (note = currentNote) => {
    clearNoteTimer();
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

  const startLoopCountdown = () => {
    clearNoteTimer();
    clearCountdown();

    // Return cursor to loop start before the pause, not after.
    const loopNote = seekToMeasure(loopStartRef.current);

    setCountdownRemaining(LOOP_COUNTDOWN_SECONDS);

    let remaining = LOOP_COUNTDOWN_SECONDS;
    countdownTimerRef.current = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        clearCountdown();
        setCountdownRemaining(0);
        if (!isPlayingRef.current || !loopEnabledRef.current) return;

        const note = osmdRef.current?.cursor?.NotesUnderCursor()[0] ?? null;
        if (note) {
          setTimerForCurrentNote(note);
          // Mirror handleNext to capture frame after note begins
          captureFrame(loopNote);
        } else {
          handleStop();
        }
        return;
      }
      setCountdownRemaining(remaining);
    }, 1000);
  };

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;
    if (!container) return undefined;

    const osmd = new OpenSheetMusicDisplay(container, {
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
        clearAllPlaybackTimers();
        setStatus("Loading score…");
        await osmd.load(selectedPiece.musicXml);
        if (cancelled) return;
        osmd.render();
        osmd.cursor.reset();
        osmd.cursor.show();

        const count = Math.max(1, osmd.Sheet?.SourceMeasures?.length || 1);
        setMeasureCount(count);
        setLoopStartBar(1);
        setLoopEndBar(count);
        loopStartRef.current = 1;
        loopEndRef.current = count;
        measureCountRef.current = count;

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

    return () => {
      cancelled = true;
      clearAllPlaybackTimers();
      isPlayingRef.current = false;
      setIsPlaying(false);
      finishRecordingSession();
      osmdRef.current = null;
      container.innerHTML = "";
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

    const measureNumber = getCursorMeasureNumber(osmd);
    const pastLoopEnd =
      loopEnabledRef.current &&
      (isEndReached(osmd) || (measureNumber != null && measureNumber > loopEndRef.current));

    if (pastLoopEnd) {
      console.log("Loop range finished — starting countdown");
      startLoopCountdown();
      return;
    }

    if (isEndReached(osmd)) {
      console.log("End of piece reached");
      handleStop();
      return;
    }

    const nextNote = osmd.cursor.NotesUnderCursor()[0] ?? null;
    setCurrentNote(nextNote);
    // Pass the note in — setState is async, so currentNote is still the old one here.
    setTimerForCurrentNote(nextNote);
    // Capture frame last
    captureFrame(nextNote);
  };

  const handlePlay = () => {
    if (!scoreReady) return;
    clearCountdown();
    setCountdownRemaining(0);

    // Set to first note if we are in a loop
    let note = currentNote;
    if (loopEnabledRef.current) {
      note = seekToMeasure(loopStartRef.current);
    }

    // Start recording new only if loop has begun and rows are empty (brand new play)
    // Otherwise, we continue the existing session
    if (recordEnabledRef.current && rowsRef.current.length === 0) {
      startRecordingSession(note);
    }

    isPlayingRef.current = true;
    setIsPlaying(true);
    if (note) setTimerForCurrentNote(note);
  };

  const handlePause = () => {
    clearAllPlaybackTimers();
    isPlayingRef.current = false;
    setIsPlaying(false);
  };

  const handleStop = () => {
    clearAllPlaybackTimers();
    isPlayingRef.current = false;
    setIsPlaying(false);
    finishRecordingSession();

    if (loopEnabledRef.current) {
      seekToMeasure(loopStartRef.current);
      return;
    }

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

    clearAllPlaybackTimers();
    isPlayingRef.current = false;
    setIsPlaying(false);
    finishRecordingSession();
    setSelectedPiece(piece);
  };

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-y-auto p-4 lg:p-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,35%)]">
      {/* Left column: controls → transport → score */}
      <div className="flex min-h-0 min-w-0 flex-col gap-3">
        <div className="flex shrink-0 flex-wrap items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
          <ScoreDropdown
            pieces={PRACTICE_PIECES}
            selectedPieceId={selectedPiece?.id}
            onChange={handlePieceChange}
          />

          <BpmSlider bpm={bpm} onChange={setBpm} />

          <LoopControls
            enabled={loopEnabled}
            startBar={loopStartBar}
            endBar={loopEndBar}
            measureCount={measureCount}
            countdownRemaining={countdownRemaining}
            disabled={!scoreReady}
            onEnabledChange={setLoopEnabled}
            onStartBarChange={setLoopStartBar}
            onEndBarChange={setLoopEndBar}
          />
        </div>

        <div className="flex shrink-0 items-center justify-center gap-4">
          <RecordToggle
            enabled={recordEnabled}
            disabled={!scoreReady}
            onChange={setRecordEnabled}
          />
          <PlayPauseControls
            scoreReady={scoreReady}
            isPlaying={isPlaying}
            onPlay={handlePlay}
            onPause={handlePause}
            onStop={handleStop}
            onNext={handleNext}
          />
        </div>

        <div
          ref={containerRef}
          className="osmd-container min-h-[320px] w-full flex-1 overflow-auto rounded-2xl bg-white p-3"
        />
      </div>

      {/* Right column: pressure cue → fingerboard */}
      <div className="flex min-h-0 min-w-0 flex-col gap-3">
        <div className="grid w-full shrink-0 grid-cols-4 items-center rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3">
          <PracticeTuningIndicator liveData={liveData} scorePitchName={pitchName} />
          <div className="flex justify-center">
            <PressureThresholdIndicator pressure={liveData?.pressure ?? 0} />
          </div>
        </div>
        {unmappedPitch ? (
          <div className="text-xs text-amber-300">
            No first-position mapping for {unmappedPitch}
          </div>
        ) : null}

        <div className="flex min-h-[520px] flex-1 flex-col xl:min-h-[620px]">
          <FingerboardPanel
            pressure={liveData?.pressure ?? 0}
            contacts={liveData?.contacts ?? []}
            practiceTargets={practiceTargets}
          />
        </div>
      </div>
    </div>
  );
}
