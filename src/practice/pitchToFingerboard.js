/**
 * Map first-position cello pitch names → fingerboard targets.
 * Expects catalog spellings from CELLO_FIRST_POSITION_NOTES (e.g. "F#3", "Eb2").
 */

import { HEATMAP_NOTE_TARGETS } from "../FingerboardPanel.jsx";

const STRING_NAMES = ["C", "G", "D", "A"];

/** Open strings — finger 0, rowPos near the nut (above 1st finger). */
const OPEN_STRING_TARGETS = [
  { row: 0, rowPos: 0, col: 0, finger: 0, note: "C2" },
  { row: 0, rowPos: 0, col: 1, finger: 0, note: "G2" },
  { row: 0, rowPos: 0, col: 2, finger: 0, note: "D3" },
  { row: 0, rowPos: 0, col: 3, finger: 0, note: "A3" },
];

function withStringMeta(target) {
  return {
    ...target,
    row_pos: target.rowPos,
    string: target.string || STRING_NAMES[target.col] || "",
  };
}

function buildNameIndex(targets) {
  const map = new Map();
  for (const target of targets.map(withStringMeta)) {
    const list = map.get(target.note) || [];
    list.push(target);
    map.set(target.note, list);
  }
  return map;
}

/**
 * Build a map of note names to fingerboard targets.
 * 
 * Example: 
  * // open strings (from OPEN_STRING_TARGETS)
    "C2":  [{ note: "C2",  col: 0, row: 0,  rowPos: 0,     row_pos: 0,     finger: 0, string: "C" }],
    "G2":  [{ note: "G2",  col: 1, row: 0,  rowPos: 0,     row_pos: 0,     finger: 0, string: "G" }],
    "D3":  [{ note: "D3",  col: 2, row: 0,  rowPos: 0,     row_pos: 0,     finger: 0, string: "D" }],
    "A3":  [{ note: "A3",  col: 3, row: 0,  rowPos: 0,     row_pos: 0,     finger: 0, string: "A" }],
    // stopped (from HEATMAP_NOTE_TARGETS)
    "D2":  [{ note: "D2",  col: 0, row: 2,  rowPos: 2.18,  row_pos: 2.18,  finger: 1, string: "C" }],
    "Eb2": [{ note: "Eb2", col: 0, row: 7,  rowPos: 7.11,  row_pos: 7.11,  finger: 2, string: "C" }],
 */

const NOTE_NAME_TO_TARGETS = buildNameIndex([...OPEN_STRING_TARGETS, ...HEATMAP_NOTE_TARGETS]);

/**
 * Look up the fingerboard target for one pitch name.
 * unmapped: null when:
 * 1) pitch mapping found on the fingerboard
 * 2) Rest note (so no pitch)
 * 3) Empty note name
 * Unmapped is not null when:
 * 1) Pitch known but no fingerboard cell found
 * @param {string|null|undefined} pitchName e.g. "F#3"; null/empty → unmapped
 * @returns {{ target: object|null, unmapped: string|null }}
 */
export function lookupFingerboardTarget(pitchName) {
  if (!pitchName) {
    return { target: null, unmapped: null };
  }

  // If we cannot find a mapping position on the fingerboard, return null target but leave pitch.
  const matches = NOTE_NAME_TO_TARGETS.get(pitchName) || [];
  if (!matches.length) {
    return { target: null, unmapped: pitchName };
  }

  // Catalog has one preferred fingering per pitch name.
  return { target: matches[0], unmapped: null };
}

// export const FIRST_POSITION_TARGETS = [...OPEN_STRING_TARGETS, ...HEATMAP_NOTE_TARGETS].map(withStringMeta);
