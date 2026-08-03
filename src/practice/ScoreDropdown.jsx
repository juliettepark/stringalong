import React from "react";

/**
 * Dropdown to choose a practice score from the catalog.
 */
export default function ScoreDropdown({ pieces, selectedPieceId, onChange }) {
  return (
    <label className="flex min-w-0 flex-col gap-1 sm:max-w-xs">
      <span className="text-[10px] font-bold tracking-widest text-slate-500">PIECE</span>
      <select
        value={selectedPieceId ?? ""}
        onChange={onChange}
        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-100 outline-none transition-colors hover:border-slate-600 focus:border-blue-500"
      >
        {pieces.map((piece) => (
          <option key={piece.id} value={piece.id}>
            {piece.title}
          </option>
        ))}
      </select>
    </label>
  );
}
