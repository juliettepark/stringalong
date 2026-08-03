import cMajorMusicXml from "../../music_data/CMajor.musicxml?raw";
import minuetAnnaMagdalenaMusicXml from "../../music_data/Minuet from Anna Magdalena Notebook.musicxml?raw";

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
  {
    id: "minuet-anna-magdalena",
    title: "Minuet from Anna Magdalena Notebook",
    fileName: "Minuet from Anna Magdalena Notebook.musicxml",
    musicXml: minuetAnnaMagdalenaMusicXml,
  },
];

export function getPracticePieceById(id) {
  return PRACTICE_PIECES.find((piece) => piece.id === id) ?? null;
}
