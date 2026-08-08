/**
 * CSV helpers for practice session recording.
 */

import Papa from "papaparse";

export const CSV_HEADERS = [
  "timestamp_ms",
  "elapsed_ms",
  "piece_id",
  "bpm",
  "loop_enabled",
  "loop_start",
  "loop_end",
  "score_is_rest",
  "score_hz",
  "score_pitch",
  "score_duration_beats",
  "score_measure",
  "has_data",
  "frame",
  "source",
  "pressure",
  "pressure_status",
  "detected_note",
  "detected_target_hz",
  "measured_hz",
  "cents_offset",
  "contact_count",
  "primary_contact_col",
  "primary_contact_row_pos",
  "primary_contact_note",
];

/**
 * Builds one row to capture the current state of the sensor and note information at that instant
 * @param {object|null} note - OSMD note under cursor
 * @param {object} liveData - current frame of live data from sensor
 * @param {object} meta - metadata about piece like song name, loop controls, etc.
 * @param {(hz: number) => string|null} frequencyToNote - function to convert hz to frequency
 */
export function buildRecordingRow(note, liveData, meta, frequencyToNote) {
  if (!note) return; // don't build row if there is no row available
  const timestampMs = Date.now();
  const isRest = Boolean(note && note.isRest());
  const scoreHz = !isRest && note.pitch?.frequency != null ? Number(note.pitch.frequency) : "";
  const scorePitch =
    scoreHz !== "" && typeof frequencyToNote === "function" ? frequencyToNote(scoreHz) ?? "" : "";
  const durationBeats =
    note.Length?.RealValue != null ? Number(note.Length.RealValue) * 4 : "";

  const contacts = liveData.contacts ?? [];
  const primary = contacts[0] ?? null;

  return {
    timestamp_ms: timestampMs,
    elapsed_ms: meta.startedAtMs != null ? timestampMs - meta.startedAtMs : 0,
    piece_id: meta.pieceId ?? "",
    bpm: meta.bpm ?? "",
    loop_enabled: Boolean(meta.loopEnabled),
    loop_start: meta.loopStart ?? "",
    loop_end: meta.loopEnd ?? "",
    score_is_rest: isRest,
    score_hz: scoreHz,
    score_pitch: scorePitch,
    score_duration_beats: durationBeats,
    score_measure: meta.measureNumber ?? "",
    has_data: Boolean(liveData?.hasData),
    frame: liveData?.frame ?? "",
    source: liveData?.source ?? "",
    pressure: liveData?.pressure ?? "",
    pressure_status: liveData?.pressureStatus ?? "",
    detected_note: liveData?.note ?? "",
    detected_target_hz: liveData?.hz ?? "",
    measured_hz: liveData?.currentHz ?? "",
    cents_offset: liveData?.centsOffset ?? "",
    contact_count: contacts.length,
    primary_contact_col: primary?.col ?? "",
    primary_contact_row_pos: primary?.row_pos ?? primary?.rowPos ?? "",
    primary_contact_note: primary?.note ?? primary?.target_note ?? "",
  };
}

export function rowsToCsv(rows) {
  return Papa.unparse(rows, { columns: CSV_HEADERS });
}

export function downloadCsv(filename, csvText) {
  const blob = new Blob([csvText], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
