import cMajorMusicXml from "../../music_data/CMajor.musicxml?raw";

/**
 * Catalog of practice scores available in the Practice tab.
 * Add new entries here as you drop more .musicxml files into music_data/.
 *
 * Each piece:
 * - id: stable key for selection/state
 * - title: label shown in the UI
 * - fileName: source filename (for display / debugging)
 * - musicXml: MusicXML string (Vite ?raw import)
 */
export const PRACTICE_PIECES = [
  {
    id: "c-major",
    title: "C Major Scale",
    fileName: "CMajor.musicxml",
    musicXml: cMajorMusicXml,
  },
];

export function getPracticePieceById(id) {
  return PRACTICE_PIECES.find((piece) => piece.id === id) ?? null;
}
