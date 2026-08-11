// import cMajorMusicXml from "../../music_data/CMajor.musicxml?raw";
import cMajorScaleMusicXml from "../../music_data/C Major Scale.musicxml?raw";
import minuetAnnaMagdalenaMusicXml from "../../music_data/Minuet from Anna Magdalena Notebook.musicxml?raw";
import songOfTheWindMusicXml from "../../music_data/Song of the Wind.musicxml?raw";
import longLongAgoMusicXml from "../../music_data/Long, Long Ago.musicxml?raw";

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
  // {
  //   id: "c-major",
  //   title: "CMajor",
  //   fileName: "CMajor.musicxml",
  //   musicXml: cMajorMusicXml,
  // },
  {
    id: "c-major-scale",
    title: "C Major Scale",
    fileName: "C Major Scale.musicxml",
    musicXml: cMajorScaleMusicXml,
  },
  {
    id: "minuet-anna-magdalena",
    title: "Minuet from Anna Magdalena Notebook",
    fileName: "Minuet from Anna Magdalena Notebook.musicxml",
    musicXml: minuetAnnaMagdalenaMusicXml,
  },
  {
    id: "song-of-the-wind",
    title: "Song of the Wind",
    fileName: "Song of the Wind.musicxml",
    musicXml: songOfTheWindMusicXml,
  },
  {
    id: "long-long-ago",
    title: "Long, Long Ago",
    fileName: "Long, Long Ago.musicxml",
    musicXml: longLongAgoMusicXml,
  },
];

export function getPracticePieceById(id) {
  return PRACTICE_PIECES.find((piece) => piece.id === id) ?? null;
}
