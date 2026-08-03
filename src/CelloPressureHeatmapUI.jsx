import React, { useState, useEffect } from "react";
import FingerboardPanel, { HEATMAP_NOTE_TARGETS } from "./FingerboardPanel.jsx";
import PracticePage from "./practice/PracticePage.jsx";

// ── SVG Icon Components ──────────────────────────────────────────────────────

const IcoGrid = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
    <rect x="1" y="1" width="6" height="6" rx="1.5"/>
    <rect x="9" y="1" width="6" height="6" rx="1.5"/>
    <rect x="1" y="9" width="6" height="6" rx="1.5"/>
    <rect x="9" y="9" width="6" height="6" rx="1.5"/>
  </svg>
);
const IcoWave = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M1 8 Q3.5 4.5 6 8 Q8.5 11.5 11 8 Q13.5 4.5 15 6.5"/>
  </svg>
);
const IcoRect = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="5" y="1" width="6" height="14" rx="2"/>
    <line x1="7" y1="5" x2="9" y2="5" stroke="currentColor" strokeWidth="1"/>
    <line x1="7" y1="8" x2="9" y2="8" stroke="currentColor" strokeWidth="1"/>
    <line x1="7" y1="11" x2="9" y2="11" stroke="currentColor" strokeWidth="1"/>
  </svg>
);
const IcoTarget = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="8" cy="8" r="6"/>
    <circle cx="8" cy="8" r="3"/>
    <circle cx="8" cy="8" r="1" fill="currentColor" stroke="none"/>
  </svg>
);
const IcoClock = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="8" cy="8" r="6"/>
    <path d="M8 5v3l2 2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IcoSettings = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="8" cy="8" r="2.2"/>
    <path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M12.6 3.4l-1.4 1.4M4.8 11.2l-1.4 1.4" strokeLinecap="round"/>
  </svg>
);
const IcoBluetooth = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#6366f1" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 5l6 6-3 3V2l3 3-6 6"/>
  </svg>
);
// ── Sidebar ──────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "overview", label: "Overview", Icon: IcoGrid },
  { id: "practice", label: "Practice", Icon: IcoClock },
  { id: "heatmap", label: "Haptics", Icon: IcoTarget },
  { id: "settings", label: "Settings", Icon: IcoSettings },
];

const STRING_NAMES = ["C", "G", "D", "A"];

function Sidebar({ active, setActive, deviceStatus }) {
  const statusStyles = {
    connected: ["bg-green-500", "Device Connected"],
    calibrating: ["bg-amber-500", "Calibrating"],
    disconnected: ["bg-red-500", "Device Offline"],
    idle: ["bg-slate-500", "No Data"],
  };
  const [dotClass, label] = statusStyles[deviceStatus] || statusStyles.connected;

  return (
    <aside className="flex w-full shrink-0 flex-col border-r border-slate-800 bg-slate-950 lg:w-[196px]">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4 lg:pb-5 lg:pt-6">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500 shadow-md">
          <svg viewBox="0 0 22 32" width="14" height="21" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
            <path d="M11 2C7.5 4.5 5 9 5 14c0 5 2.5 8.5 6 10 3.5-1.5 6-5 6-10 0-5-2.5-9.5-6-12Z"/>
            <line x1="11" y1="24" x2="11" y2="30"/>
            <line x1="8.5" y1="27" x2="13.5" y2="27"/>
            <line x1="8" y1="14" x2="14" y2="14" strokeWidth="1"/>
          </svg>
        </div>
        <div className="leading-tight">
          <div className="text-[11px] font-bold tracking-widest text-slate-100">CELLO</div>
          <div className="text-[11px] font-bold tracking-widest text-slate-300">INTELLIGENCE</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:block lg:flex-1 lg:space-y-1.5 lg:overflow-visible lg:pb-0">
        {NAV_ITEMS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors lg:w-full ${
              active === id
                ? "bg-blue-500/15 text-blue-300"
                : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
            }`}
          >
            <span className={active === id ? "text-blue-300" : "text-slate-500"}>
              <Icon />
            </span>
            {label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="hidden space-y-3 px-3 pb-4 pt-4 lg:block">
        <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 px-2.5 py-2.5">
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`inline-block h-1.5 w-1.5 animate-pulse rounded-full ${dotClass}`}/>
              <span className="text-[10px] text-slate-400">{label}</span>
            </div>
            <div className="mt-0.5 text-xs font-semibold text-slate-200">ESP32-CELLO</div>
          </div>
          <IcoBluetooth />
        </div>
      </div>
    </aside>
  );
}

// ── Tuner Gauge ──────────────────────────────────────────────────────────────

function TunerGauge({ cents = 0, hasData = true }) {
  const W = 360;
  const H = 180;
  const cx = 180;
  const cy = 150;
  const r = 118;
  const clamped = Math.max(-50, Math.min(50, cents));
  const needleAngle = -130 + ((clamped + 50) / 100) * 80;
  const toRad = (degrees) => (degrees * Math.PI) / 180;
  const point = (angle, radius) => ({
    x: cx + Math.cos(toRad(angle)) * radius,
    y: cy + Math.sin(toRad(angle)) * radius,
  });
  const needle = point(needleAngle, r - 8);
  const targetLeft = point(-94, r - 24);
  const targetRight = point(-86, r - 24);
  const targetTip = point(-90, 42);
  const tickValues = [-50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: "74px" }}>
      <defs>
        <linearGradient id="tunerNeedle" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>

      <path d={`M${point(-130, r).x},${point(-130, r).y} A${r},${r} 0 0 1 ${point(-50, r).x},${point(-50, r).y}`} fill="none" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
      <polygon
        points={`${targetLeft.x},${targetLeft.y} ${targetRight.x},${targetRight.y} ${targetTip.x},${targetTip.y}`}
        fill="#22c55e"
        opacity="0.15"
      />

      {tickValues.map((tick) => {
        const angle = -130 + ((tick + 50) / 100) * 80;
        const outer = point(angle, r);
        const inner = point(angle, tick === 0 || Math.abs(tick) === 10 ? r - 22 : r - 12);
        const label = point(angle, r + 18);
        const isCenterZone = Math.abs(tick) <= 10;
        return (
          <g key={tick}>
            <line
              x1={outer.x}
              y1={outer.y}
              x2={inner.x}
              y2={inner.y}
              stroke={isCenterZone ? "#a3e635" : "#3b82f6"}
              strokeWidth={tick === 0 ? 4 : Math.abs(tick) === 10 ? 3 : 1.8}
              strokeLinecap="round"
            />
            {tick % 10 === 0 && (
              <text
                x={label.x}
                y={label.y}
                fontSize="11"
                fill={isCenterZone ? "#a3e635" : "#3b82f6"}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {tick}
              </text>
            )}
          </g>
        );
      })}

      {hasData && (
        <line
          x1={cx}
          y1={cy}
          x2={needle.x}
          y2={needle.y}
          stroke={Math.abs(clamped) <= 5 ? "#22c55e" : "url(#tunerNeedle)"}
          strokeWidth="5"
          strokeLinecap="round"
        />
      )}
      <circle cx={cx} cy={cy} r="6" fill="#cbd5e1" />
    </svg>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

function normalizeNoteTargets(targets = HEATMAP_NOTE_TARGETS) {
  return targets.map((target) => {
    const rowPos = Number(target.row_pos ?? target.rowPos ?? target.row ?? 0);
    return {
      ...target,
      row: Number.isFinite(Number(target.row)) ? Number(target.row) : Math.round(rowPos),
      rowPos,
      row_pos: rowPos,
      col: Number(target.col),
      string: target.string || STRING_NAMES[target.col] || "",
    };
  });
}

function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function peak(values) {
  return values.length ? Math.max(...values) : 0;
}

function flattenMatrix(matrix) {
  return matrix.flatMap((row) => row);
}

function buildDemoFrame(timeSeconds) {
  const rows = 24;
  const cols = 4;
  const noteTargets = normalizeNoteTargets(HEATMAP_NOTE_TARGETS);
  const contacts = [
    {
      col: 1,
      string: "G",
      row_pos: 7.1 + Math.sin(timeSeconds * 1.7) * 0.9,
      note: "Bb2",
      hz: 116.54094,
    },
    {
      col: 2,
      string: "D",
      row_pos: 11.8 + Math.sin(timeSeconds * 1.2 + 1.4) * 1.2,
      note: "F#3",
      hz: 184.997211,
    },
    {
      col: 3,
      string: "A",
      row_pos: 16.2 + Math.sin(timeSeconds * 1.5 + 2.2) * 0.8,
      note: "D4",
      hz: 293.664768,
    },
  ];

  const matrix = Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => {
      const base = 3 + Math.sin(timeSeconds * 2 + row * 0.35 + col) * 2;
      const contactValue = contacts.reduce((sum, contact) => {
        if (contact.col !== col) return sum;
        const distance = row - contact.row_pos;
        return sum + 88 * Math.exp(-(distance * distance) / 5.5);
      }, 0);
      return Math.max(0, Math.min(100, base + contactValue));
    }),
  );

  const displayContacts = contacts.map((contact) => {
    const peakRow = Math.max(0, Math.min(rows - 1, Math.round(contact.row_pos)));
    const clusterRows = [peakRow - 1, peakRow, peakRow + 1].filter((row) => row >= 0 && row < rows);
    return {
      string: contact.string,
      col: contact.col,
      row_pos: contact.row_pos,
      note: contact.note,
      hz: contact.hz,
      target_note: contact.note,
      target_matched: true,
      distance_mm: 60 + contact.row_pos * 6.9996,
      frequency: contact.hz,
      cluster_rows: clusterRows,
      peak_row: peakRow,
      peak_value: matrix[peakRow][contact.col],
      selected: contact.col === 2,
    };
  });

  const values = flattenMatrix(matrix);
  const activeContact = displayContacts.find((contact) => contact.selected) || displayContacts[0];

  return {
    source: "demo-simulation",
    frame: Math.round(timeSeconds * 30),
    pressure: 58 + Math.sin(timeSeconds * 2.2) * 8,
    cents_offset: Math.sin(timeSeconds * 2.4) * 7 + Math.sin(timeSeconds * 5.2) * 2,
    matrix,
    matrix_peak: peak(values),
    matrix_avg: average(values),
    active_cells: values.filter((value) => value >= 20).length,
    contacts: displayContacts,
    display_contacts: displayContacts,
    selected_contacts: [activeContact],
    note_targets: noteTargets,
    note: "F#3",
    hz: 184.997211,
    current_hz: 184.997211 + Math.sin(timeSeconds * 3.1) * 0.7,
  };
}

const SENSOR_BRIDGE_URL = "http://127.0.0.1:8765/events";
const SENSOR_KEYBOARD_URL = "http://127.0.0.1:8765/keyboard";
const OPEN_STRING_KEYS = new Set(["z", "x", "c", "v"]);
const OPEN_STRING_BY_KEY = {
  z: { key: "z", string: "C", note: "C2", col: 0, frequency: 65.406391 },
  x: { key: "x", string: "G", note: "G2", col: 1, frequency: 97.998859 },
  c: { key: "c", string: "D", note: "D3", col: 2, frequency: 146.832384 },
  v: { key: "v", string: "A", note: "A3", col: 3, frequency: 220.0 },
};
function normalizeSensorPressure(value) {
  return Math.max(0, Math.min(5, Number(value || 0) / 25));
}

function useSensorBridge(enabled) {
  const [frame, setFrame] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!enabled) {
      setStatus("idle");
      setError("");
      return undefined;
    }

    setStatus("connecting");
    setError("");

    const source = new EventSource(SENSOR_BRIDGE_URL);

    source.onopen = () => {
      setStatus("connected");
      setError("");
    };

    source.onmessage = (event) => {
      try {
        const nextFrame = JSON.parse(event.data);
        setFrame(nextFrame);
        setStatus("connected");
      } catch {
        setError("Invalid sensor bridge frame");
      }
    };

    source.onerror = () => {
      setStatus("error");
      setError("Sensor bridge is not reachable");
      source.close();
    };

    return () => source.close();
  }, [enabled]);

  return { frame, status, error };
}

function useOpenStringKeyboard(enabled) {
  const [activeOpenKey, setActiveOpenKey] = useState("");

  useEffect(() => {
    if (!enabled) {
      setActiveOpenKey("");
      return undefined;
    }

    const activeKeys = new Set();
    const sendActiveKeys = () => {
      fetch(SENSOR_KEYBOARD_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active_keys: [...activeKeys] }),
        keepalive: true,
      }).catch(() => {});
    };

    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();
      if (!OPEN_STRING_KEYS.has(key)) return;
      event.preventDefault();
      activeKeys.clear();
      activeKeys.add(key);
      setActiveOpenKey(key);
      sendActiveKeys();
    };

    const handleKeyUp = (event) => {
      const key = event.key.toLowerCase();
      if (!OPEN_STRING_KEYS.has(key)) return;
      event.preventDefault();
      activeKeys.delete(key);
      setActiveOpenKey("");
      sendActiveKeys();
    };

    const releaseAll = () => {
      activeKeys.clear();
      setActiveOpenKey("");
      sendActiveKeys();
    };
    const heartbeat = window.setInterval(sendActiveKeys, 250);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", releaseAll);

    return () => {
      releaseAll();
      window.clearInterval(heartbeat);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", releaseAll);
    };
  }, [enabled]);

  return activeOpenKey;
}

function buildLiveData({ pressure, history, deviceStatus, bridgeFrame, bridgeStatus, activeOpenKey }) {
  const hasBridgeFrame = Boolean(bridgeFrame?.matrix);
  const noteTargets = normalizeNoteTargets(bridgeFrame?.note_targets?.length ? bridgeFrame.note_targets : HEATMAP_NOTE_TARGETS);
  const effectivePressure = hasBridgeFrame ? normalizeSensorPressure(bridgeFrame.pressure) : 0;
  const effectiveHistory = hasBridgeFrame ? history : [];
  const matrix = hasBridgeFrame ? bridgeFrame.matrix : Array.from({ length: 24 }, () => Array(4).fill(0));
  const matrixValues = flattenMatrix(matrix);
  const matrixPeak = hasBridgeFrame ? bridgeFrame.matrix_peak : peak(matrixValues);
  const matrixAvg = hasBridgeFrame ? bridgeFrame.matrix_avg : average(matrixValues);
  const activeCells = hasBridgeFrame ? bridgeFrame.active_cells : matrixValues.filter((value) => value >= 20).length;
  const pressureHistory = effectiveHistory.map((value) => normalizeSensorPressure(value));
  const hasStoppedContact = Boolean(bridgeFrame?.selected_contacts?.length);
  const openString = bridgeFrame?.open_string || (!hasStoppedContact ? OPEN_STRING_BY_KEY[activeOpenKey] : null);
  const primaryContact = bridgeFrame?.selected_contacts?.[0] || bridgeFrame?.contacts?.[0] || null;
  const note = hasBridgeFrame
    ? {
        note: openString?.note || bridgeFrame.note || primaryContact?.note || primaryContact?.target_note || "--",
        hz: openString?.frequency || bridgeFrame.hz || primaryContact?.hz || primaryContact?.frequency || 0,
      }
    : { note: "--", hz: 0 };
  const centsOffset = hasBridgeFrame ? bridgeFrame.cents_offset || 0 : 0;
  const currentHz = hasBridgeFrame ? bridgeFrame.current_hz || note.hz || 0 : 0;
  const isOptimal = effectivePressure >= 1.8 && effectivePressure <= 2.8;
  const pressureStatus = !hasBridgeFrame
    ? "No Data"
    : effectivePressure < 1.8
      ? "Too Light"
      : effectivePressure > 2.8
        ? "Too Heavy"
        : "Optimal";
  const accuracy = hasBridgeFrame ? Math.round(74 + Math.min(effectivePressure, 3.1) * 7) : 0;
  const stability = hasBridgeFrame
    ? Math.round(70 + Math.max(0, 2.9 - Math.abs(effectivePressure - 2.3)) * 4)
    : 0;

  return {
    source: hasBridgeFrame ? bridgeFrame.source || "esp32-serial" : "none",
    frame: hasBridgeFrame ? bridgeFrame.frame || 0 : 0,
    bridgeStatus,
    deviceStatus: hasBridgeFrame
      ? "connected"
      : bridgeStatus === "connecting"
        ? "calibrating"
        : bridgeStatus === "error"
          ? "disconnected"
          : "idle",
    pressure: effectivePressure,
    history: effectiveHistory,
    pressureAvg: average(pressureHistory),
    pressurePeak: peak(pressureHistory),
    matrix,
    matrixPeak,
    matrixAvg,
    activeCells,
    pressureStatus,
    pressureColor: !hasBridgeFrame ? "text-slate-500" : isOptimal ? "text-emerald-300" : "text-orange-300",
    note: note.note,
    hz: note.hz,
    currentHz,
    centsOffset,
    accuracy,
    stability,
    leftHandPressure: hasBridgeFrame ? effectivePressure + 0.55 : 0,
    hasData: hasBridgeFrame || effectiveHistory.length > 0,
    contacts: bridgeFrame?.display_contacts?.length
      ? bridgeFrame.display_contacts
      : bridgeFrame?.contacts || [],
    selectedContacts: bridgeFrame?.selected_contacts || [],
    noteTargets,
    openString,
    maxRow: bridgeFrame?.max_row,
    maxCol: bridgeFrame?.max_col,
  };
}

function StatusBanner({ liveData, compact = false }) {
  const isMock = liveData.source === "demo-simulation";
  const copy = {
    connected: isMock
      ? [
          "Mock sensor stream active",
          "Frontend is displaying generated cello pressure, note, and tuning frames.",
          "bg-emerald-400/10 text-emerald-200 border-emerald-400/20",
        ]
      : [
          "ESP32 sensor stream active",
          "Frontend is receiving real matrix frames from the local Python bridge.",
          "bg-emerald-400/10 text-emerald-200 border-emerald-400/20",
        ],
    calibrating: ["Sensor calibration in progress", "Keep the fingerboard untouched until baseline values settle.", "bg-amber-400/10 text-amber-200 border-amber-400/20"],
    disconnected: ["Device disconnected", "Reconnect ESP32-CELLO and restart the local sensor bridge.", "bg-red-400/10 text-red-200 border-red-400/20"],
    idle: ["No pressure data", "Waiting for the next matrix frame.", "bg-slate-800 text-slate-300 border-slate-700"],
  };
  const [title, body, classes] = copy[liveData.deviceStatus] || copy.connected;

  return (
    <div className={`rounded-2xl border px-4 ${compact ? "py-2" : "py-3"} text-sm ${classes}`}>
      <div className="font-semibold">{title}</div>
      {!compact && <div className="mt-0.5 text-xs opacity-80">{body}</div>}
    </div>
  );
}

function StatCard({ label, value, detail, compact = false }) {
  return (
    <div className={`rounded-2xl border border-slate-800 bg-slate-900 ${compact ? "p-3" : "p-4"} shadow-[0_18px_50px_rgba(0,0,0,0.22)]`}>
      <div className="text-[10px] font-bold tracking-widest text-slate-500">{label}</div>
      <div className={`${compact ? "mt-1 text-2xl" : "mt-2 text-3xl"} font-light text-slate-100`}>{value}</div>
      <div className="mt-1 text-xs text-slate-500">{detail}</div>
    </div>
  );
}

function QuickStats({ liveData }) {
  const items = [
    {
      label: "Current Note",
      value: liveData.note,
      detail: liveData.hz > 0 ? `${liveData.hz.toFixed(1)} Hz` : "No contact",
    },
    {
      label: "Matrix Peak",
      value: `${liveData.matrixPeak.toFixed(0)}`,
      detail: `${liveData.activeCells} active cells`,
    },
    {
      label: "Avg Pressure",
      value: `${liveData.pressureAvg.toFixed(1)} N`,
      detail: "Last 22 samples",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
          <div className="truncate text-[10px] font-bold tracking-widest text-slate-500">{item.label}</div>
          <div className="mt-1 truncate text-2xl font-light leading-tight text-slate-100">{item.value}</div>
          <div className="mt-0.5 truncate text-[11px] text-slate-500">{item.detail}</div>
        </div>
      ))}
    </div>
  );
}

function DeviceSourceBar({
  liveData,
  deviceStatus,
  bridgeEnabled,
  setBridgeEnabled,
  bridgeStatus,
  bridgeError,
  mockMode = false,
}) {
  const dotClass = {
    connected: "bg-green-500",
    calibrating: "bg-amber-500",
    idle: "bg-slate-500",
    disconnected: "bg-red-500",
  };

  return (
    <div className="flex shrink-0 flex-col gap-3 border-b border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-400 xl:flex-row xl:items-center xl:justify-between lg:px-8">
      <div className="flex min-w-0 items-center gap-2">
        <span className={`h-2 w-2 shrink-0 rounded-full ${dotClass[deviceStatus] || dotClass.connected}`} />
        <span className="truncate font-semibold text-slate-200">ESP32-CELLO</span>
        <span className="shrink-0 text-slate-700">/</span>
        <span className="truncate">
          {mockMode ? "Mock data stream" : liveData.source === "none" ? "Session_2024-05-20" : `Source: ${liveData.source}`}
          {bridgeError ? ` (${bridgeError})` : bridgeEnabled ? ` (${bridgeStatus})` : ""}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          onClick={() => setBridgeEnabled((value) => !value)}
          disabled={mockMode}
          className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
            mockMode
              ? "cursor-default bg-emerald-500/15 text-emerald-300"
              : bridgeEnabled
              ? "bg-red-500/15 text-red-300 hover:bg-red-500/20"
              : "bg-blue-500 text-white shadow-sm hover:bg-blue-600"
          }`}
        >
          {mockMode ? "Mock Running" : bridgeEnabled ? "Stop Session" : "Start Session"}
        </button>
        <button className="shrink-0 font-medium text-slate-400 hover:text-slate-100">Calibration</button>
        <button className="shrink-0 font-medium text-slate-400 hover:text-slate-100">Gallery</button>
        <span className="shrink-0 rounded-lg bg-blue-500 px-2 py-1 text-xs font-bold text-white">83%</span>
        <span className="flex shrink-0 items-center gap-2 font-medium text-slate-400">
          <span className={`h-2 w-2 rounded-full ${deviceStatus === "connected" ? "bg-blue-500" : "bg-slate-400"}`} />
          {deviceStatus === "connected" ? "Online" : "Offline"}
        </span>
      </div>
    </div>
  );
}

function OverviewStatusStrip({ liveData }) {
  const hasData = liveData.hasData;
  return (
    <div className={`flex items-center gap-3 rounded-2xl border px-4 py-2 shadow-[0_14px_36px_rgba(15,23,42,0.08)] ${
      hasData
        ? "border-blue-400/30 bg-blue-500/15"
        : "border-slate-800 bg-slate-900"
    }`}>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-blue-300">
        <IcoWave />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-slate-100">
          {hasData ? "Live sensor data" : "No pressure data"}
        </div>
        <div className="truncate text-xs text-slate-400">
          {hasData ? "Simulated matrix frames are driving the overview layout." : "Waiting for the next sensor frame..."}
        </div>
      </div>
    </div>
  );
}

function OverviewMetricCards({ liveData }) {
  const vibratoIndex = liveData.hasData ? Math.round(liveData.stability) : 0;
  const items = [
    {
      label: "Current Note",
      value: liveData.hasData ? liveData.note : "--",
      detail: liveData.hasData && liveData.hz > 0 ? `${liveData.hz.toFixed(1)} Hz` : "Not detected",
    },
    {
      label: "Vibrato Index",
      value: `${vibratoIndex}`,
      detail: liveData.hasData ? "Excellent stability" : "Excellent stability",
    },
    {
      label: "Avg Pressure",
      value: `${liveData.pressureAvg.toFixed(1)} N`,
      detail: "Last 10 samples",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2.5 shadow-[0_14px_36px_rgba(15,23,42,0.08)]">
          <div className="text-xs font-medium text-slate-500">{item.label}</div>
          <div className="mt-1.5 text-2xl font-light leading-none text-slate-100">{item.value}</div>
          <div className="mt-1.5 text-xs text-slate-500">{item.detail}</div>
        </div>
      ))}
    </div>
  );
}

function OverviewTuningPanel({ liveData }) {
  const cents = liveData.centsOffset || 0;
  const absCents = Math.abs(cents);
  const tuneStatus = !liveData.hasData
    ? "Waiting"
    : absCents <= 5
      ? "In Tune"
      : cents > 0
        ? "Too High"
        : "Too Low";
  const statusColor = !liveData.hasData
    ? "text-slate-500"
    : absCents <= 5
      ? "text-emerald-300"
      : "text-orange-300";
  const note = liveData.hasData ? liveData.note : "--";
  const target = note.replace(/\d/g, "") || "--";

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900 p-3 shadow-[0_14px_36px_rgba(15,23,42,0.08)]">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Current Tuning</div>
          <div className="mt-1 text-sm text-slate-500">A4 = 440Hz</div>
        </div>
        <div className={`flex items-center gap-2 text-sm font-semibold ${statusColor}`}>
          <span className={`h-2 w-2 rounded-full ${liveData.hasData ? "bg-emerald-400" : "bg-slate-400"}`} />
          {tuneStatus}
        </div>
      </div>

      <div className="grid flex-1 items-center gap-3 lg:grid-cols-[150px_minmax(190px,1fr)_150px]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-3xl font-light leading-none text-slate-100">{note}</span>
            <span className="text-base font-light text-blue-300">{liveData.currentHz.toFixed(1)}Hz</span>
          </div>
          <div className="mt-2 inline-flex rounded-lg border border-blue-400/40 bg-blue-400/10 px-3 py-1 text-sm font-semibold text-blue-300">
            {tuneStatus}
          </div>
        </div>

        <div className="min-w-0">
          <TunerGauge cents={cents} hasData={liveData.hasData} />
          <div className="-mt-4 text-center">
            <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Target</div>
            <div className="mt-1 text-base font-semibold text-slate-100">{liveData.hasData ? `${liveData.hz.toFixed(1)}Hz` : "0.0Hz"}</div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-right">
          <div className="text-[10px] font-medium uppercase tracking-wide text-slate-500">Cents</div>
          <div className="mt-2 text-3xl font-light leading-none text-blue-300">
            {cents > 0 ? "+" : ""}
            {Math.round(cents)}¢
          </div>
          <div className="mt-2 truncate rounded-lg border border-blue-400/40 bg-blue-400/10 px-2 py-1.5 text-[9px] font-bold uppercase tracking-wide text-slate-500">
            {liveData.hasData ? `Target ${target}` : "Waiting for sensor data"}
          </div>
        </div>
      </div>
    </div>
  );
}

function LiveVibrationCurve({ liveData }) {
  const W = 420;
  const H = 132;
  const left = 26;
  const right = 3;
  const top = 2;
  const bottom = 4;
  const plotW = W - left - right;
  const plotH = H - top - bottom;
  const historyAvg = liveData.history.length ? average(liveData.history) : 0;
  const maxDeviation = liveData.history.length
    ? Math.max(...liveData.history.map((value) => Math.abs(value - historyAvg)), 0.08)
    : 1;
  const phase = (liveData.frame || 0) * 0.18;
  const samples = liveData.history.length
    ? liveData.history.map((value, index) => {
        const normalized = (value - historyAvg) / maxDeviation;
        return Math.max(-0.95, Math.min(0.95, normalized * 0.76 + Math.sin(index * 0.48 + value * 0.08 + phase) * 0.14));
      })
    : Array.from({ length: 28 }, () => 0);
  const points = samples
    .map((value, index) => {
      const x = left + (index / Math.max(samples.length - 1, 1)) * plotW;
      const y = top + (1 - (value + 1) / 2) * plotH;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="flex h-full min-h-0 flex-col rounded-2xl border border-slate-800 bg-slate-900 p-2 shadow-[0_14px_36px_rgba(15,23,42,0.08)]">
      <div className="mb-1 flex items-center justify-between px-1">
        <div className="text-[11px] font-medium text-slate-500">Live Vibration Curve</div>
        <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-300">
          <span className="h-1 w-1 rounded-full bg-emerald-400" />
          Live
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="min-h-0 flex-1 w-full">
        {[-1, -0.5, 0, 0.5, 1].map((tick) => {
          const y = top + (1 - (tick + 1) / 2) * plotH;
          return (
            <g key={tick}>
              <line x1={left} y1={y} x2={W - right} y2={y} stroke={tick === 0 ? "#94a3b8" : "#e2e8f0"} strokeWidth={tick === 0 ? 1.3 : 0.75} />
              <text x={left - 7} y={y + 2.5} fontSize="8" fill="#64748b" textAnchor="end">{tick.toFixed(1)}</text>
            </g>
          );
        })}
        {Array.from({ length: 13 }, (_, index) => {
          const x = left + (index / 12) * plotW;
          return <line key={index} x1={x} y1={top} x2={x} y2={top + plotH} stroke="#e2e8f0" strokeWidth="0.55" opacity="0.55" />;
        })}
        <polyline points={points} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function pressureColor(value) {
  const clamped = Math.max(0, Math.min(100, value));
  const stops = [
    { at: 0, color: [31, 119, 180] },
    { at: 50, color: [247, 209, 84] },
    { at: 100, color: [214, 39, 40] },
  ];
  const start = clamped <= 50 ? stops[0] : stops[1];
  const end = clamped <= 50 ? stops[1] : stops[2];
  const t = (clamped - start.at) / (end.at - start.at);
  const [r, g, b] = start.color.map((channel, index) =>
    Math.round(channel + (end.color[index] - channel) * t),
  );
  return `rgb(${r}, ${g}, ${b})`;
}

function pressureTextColor(value) {
  return value > 35 && value < 78 ? "text-slate-950" : "text-white";
}

function MatrixHeatmapView({ liveData }) {
  const maxValue = liveData.matrixPeak;
  const noteTargets = liveData.noteTargets?.length ? liveData.noteTargets : normalizeNoteTargets(HEATMAP_NOTE_TARGETS);
  let maxRow = 0;
  let maxCol = 0;

  liveData.matrix.forEach((rowValues, row) => {
    rowValues.forEach((value, col) => {
      if (value === maxValue) {
        maxRow = row;
        maxCol = col;
      }
    });
  });

  const noteTargetByCell = new Map(
    noteTargets.map((target) => [`${target.row}-${target.col}`, target]),
  );
  const contactCellByKey = new Map();
  liveData.contacts.forEach((contact) => {
    contact.cluster_rows.forEach((row) => {
      contactCellByKey.set(`${row}-${contact.col}`, contact);
    });
  });
  const columnAverages = [0, 1, 2, 3].map((col) =>
    average(liveData.matrix.map((rowValues) => rowValues[col] || 0)),
  );
  const activeTargets = noteTargets.filter(
    (target) => liveData.matrix[target.row]?.[target.col] >= 20,
  );

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-hidden p-3 lg:grid-cols-[300px_1fr]">
      <div className="flex min-h-0 flex-col gap-3 overflow-y-auto">
        <StatusBanner liveData={liveData} compact />

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
          <div className="text-[10px] font-bold tracking-widest text-slate-500">ACTIVE CONTACT</div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
              <div className="text-[10px] text-slate-500">Peak Cell</div>
              <div className="mt-1 text-2xl font-light text-slate-100">R{maxRow + 1}</div>
              <div className="text-xs font-semibold text-blue-300">{STRING_NAMES[maxCol]} string</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
              <div className="text-[10px] text-slate-500">Peak Value</div>
              <div className="mt-1 text-2xl font-light text-slate-100">{maxValue.toFixed(0)}</div>
              <div className="text-xs text-slate-500">0-100 scale</div>
            </div>
          </div>
          <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950 p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Active Cells</span>
              <span className="font-semibold text-slate-100">{liveData.activeCells} / 96</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-blue-500"
                style={{ width: `${Math.min(100, (liveData.activeCells / 96) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
          <div className="mb-3 text-[10px] font-bold tracking-widest text-slate-500">STRING PRESSURE</div>
          <div className="space-y-2.5">
            {columnAverages.map((value, index) => (
              <div key={index}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-300">{STRING_NAMES[index]} string</span>
                  <span className="text-slate-500">{value.toFixed(0)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(100, value)}%`,
                      backgroundColor: pressureColor(value),
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
          <div className="mb-3 text-[10px] font-bold tracking-widest text-slate-500">NOTE TARGETS</div>
          <div className="grid grid-cols-2 gap-2">
            {noteTargets.map((target) => {
              const isActive = activeTargets.some((item) => item === target);
              return (
                <div
                  key={`${target.row}-${target.col}`}
                  className={`rounded-xl border px-2.5 py-2 ${
                    isActive
                      ? "border-blue-400/40 bg-blue-500/15 text-blue-200"
                      : "border-slate-800 bg-slate-950 text-slate-400"
                  }`}
                >
                  <div className="text-xs font-semibold">{target.finger}: {target.note}</div>
                  <div className="mt-0.5 text-[10px] opacity-75">
                    R{(target.rowPos + 1).toFixed(2)} {STRING_NAMES[target.col]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
        <div className="mb-3 flex shrink-0 items-center justify-between">
          <div>
            <div className="text-[10px] font-bold tracking-widest text-slate-500">24 x 4 SENSOR MATRIX</div>
            <div className="mt-1 text-sm text-slate-400">Same layout and color scale as the local Python heatmap: rows R1-R24, strings C-G-D-A, range 0-100.</div>
          </div>
          <div className="hidden items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 lg:flex">
            <div className="text-right">
              <div className="text-[10px] font-semibold text-slate-500">Scale</div>
              <div className="text-[10px] text-slate-400">0 - 100</div>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <span>Low</span>
              <div
                className="h-2 w-36 rounded-full border border-slate-700"
                style={{ background: "linear-gradient(to right,#1f77b4,#f7d154,#d62728)" }}
              />
              <span>High</span>
            </div>
          </div>
        </div>

        <div className="mb-2 flex shrink-0 flex-wrap items-center gap-2 text-[10px] text-slate-400">
          <span className="font-semibold text-slate-500">Marked cello targets:</span>
          {noteTargets.slice(0, 4).map((target) => (
            <span key={`${target.row}-${target.col}`} className="rounded-full border border-blue-400/30 bg-blue-500/15 px-2 py-0.5 font-semibold text-blue-200">
              {target.finger}: {target.note}=R{(target.rowPos + 1).toFixed(2)} {STRING_NAMES[target.col]}
            </span>
          ))}
          <span className="text-slate-500">Additional practice notes are labeled inside the grid.</span>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 p-2">
          <div className="mx-auto grid h-full max-h-full w-max grid-cols-[28px_repeat(4,22px)] grid-rows-[22px_repeat(24,minmax(0,1fr))] gap-[3px] sm:grid-cols-[30px_repeat(4,24px)] sm:grid-rows-[24px_repeat(24,minmax(0,1fr))] lg:grid-cols-[34px_repeat(4,28px)] lg:grid-rows-[28px_repeat(24,minmax(0,1fr))]">
            <div />
            {STRING_NAMES.map((stringName) => (
              <div key={stringName} className="flex items-center justify-center rounded-md border border-slate-800 bg-slate-900 text-[9px] font-semibold text-slate-300">
                {stringName}
              </div>
            ))}

            {liveData.matrix.map((rowValues, row) => (
              <React.Fragment key={row}>
                <div className="flex items-center justify-center rounded-md border border-slate-800 bg-slate-900 text-[8px] font-semibold text-slate-400">
                  R{row + 1}
                </div>
                {rowValues.map((value, col) => {
                  const isPeak = row === maxRow && col === maxCol && maxValue > 0;
                  const target = noteTargetByCell.get(`${row}-${col}`);
                  const contact = contactCellByKey.get(`${row}-${col}`);
                  return (
                    <div
                      key={`${row}-${col}`}
                      className={`relative flex min-h-0 flex-col items-center justify-center rounded-[5px] border text-[8px] font-semibold leading-none shadow-[inset_0_0_0_1px_rgba(15,23,42,0.04)] transition-colors ${pressureTextColor(value)} ${
                        contact
                          ? "border-emerald-300 ring-2 ring-emerald-300 ring-offset-1 ring-offset-slate-950"
                          : isPeak
                            ? "ring-2 ring-blue-400 ring-offset-1 ring-offset-slate-950"
                            : target
                              ? "border-blue-400"
                              : "border-slate-800"
                      }`}
                      style={{ backgroundColor: pressureColor(value) }}
                      title={`R${row + 1} C${col + 1}: ${value.toFixed(1)}`}
                    >
                      <span>{value.toFixed(0)}</span>
                      {target && (
                        <span className="mt-0.5 rounded-sm bg-slate-950/85 px-0.5 text-[7px] font-bold text-blue-200">
                          {target.finger}:{target.note}
                        </span>
                      )}
                      {isPeak && (
                        <span className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-blue-300 shadow-sm" />
                      )}
                      {contact && row === contact.peak_row && (
                        <span className="absolute left-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-sm" />
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewPage({ liveData }) {
  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-y-auto p-3 lg:p-4 xl:grid-cols-[minmax(320px,38%)_minmax(0,1fr)]">
      <div className="flex min-h-[520px] flex-col xl:min-h-[620px]">
        <FingerboardPanel
          pressure={liveData.pressure}
          contacts={liveData.contacts}
          noteTargets={liveData.noteTargets}
        />
      </div>

      <div className="flex min-h-0 min-w-0 flex-col gap-3">
        <OverviewStatusStrip liveData={liveData} />
        <OverviewMetricCards liveData={liveData} />
        <OverviewTuningPanel liveData={liveData} />
        <LiveVibrationCurve liveData={liveData} />
      </div>
    </div>
  );
}

function DetailPage({ activeNav, liveData }) {
  const title = NAV_ITEMS.find((item) => item.id === activeNav)?.label || "Overview";

  if (activeNav === "heatmap") {
    return <MatrixHeatmapView liveData={liveData} />;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
      <StatusBanner liveData={liveData} />
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
        <div className="text-[10px] font-bold tracking-widest text-slate-500">{title.toUpperCase()}</div>
        <div className="mt-3 text-2xl font-semibold text-slate-100">{title}</div>
        <p className="mt-2 max-w-xl text-sm text-slate-400">
          This page reads only from the live sensor bridge. If no matrix frame is available, no fallback data is shown.
        </p>
      </div>
    </div>
  );
}

export default function CelloPressureHeatmapUI() {
  const searchParams = new URLSearchParams(window.location.search);
  const liveMode = searchParams.get("live") === "1";
  const demoMode = !liveMode;
  const [activeNav, setActiveNav] = useState("overview");
  const [pressure, setPressure] = useState(0);
  const [history, setHistory] = useState([]);
  const [deviceStatus, setDeviceStatus] = useState("connected");
  const [bridgeEnabled, setBridgeEnabled] = useState(false);
  const [demoTime, setDemoTime] = useState(0);
  const bridge = useSensorBridge(!demoMode && bridgeEnabled);
  const activeOpenKey = useOpenStringKeyboard(!demoMode && bridgeEnabled);
  const demoFrame = demoMode ? buildDemoFrame(demoTime) : null;

  useEffect(() => {
    if (!demoMode) return undefined;

    const startedAt = performance.now();
    const interval = window.setInterval(() => {
      setDemoTime((performance.now() - startedAt) / 1000);
    }, 100);

    return () => window.clearInterval(interval);
  }, [demoMode]);

  useEffect(() => {
    if (demoMode) {
      const nextPressure = normalizeSensorPressure(demoFrame.pressure);
      setPressure(nextPressure);
      setHistory((prev) => [...prev.slice(-21), Number(demoFrame.pressure || 0)]);
      return;
    }

    if (!bridge.frame) {
      setPressure(0);
      setHistory([]);
      return;
    }

    const nextPressure = normalizeSensorPressure(bridge.frame.pressure);
    setPressure(nextPressure);
    setHistory((prev) => [...prev.slice(-21), Number(bridge.frame.pressure || 0)]);
  }, [bridge.frame?.frame, demoFrame?.frame, demoMode]);

  const liveData = buildLiveData({
    pressure,
    history,
    deviceStatus,
    bridgeFrame: demoFrame || bridge.frame,
    bridgeStatus: demoMode ? "connected" : bridge.status,
    activeOpenKey,
  });

  const handleNavChange = (nav) => {
    setActiveNav(nav);
  };

  return (
    <div className="theme-light flex h-screen flex-col overflow-hidden bg-[#070b14] font-sans text-slate-100">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
        <Sidebar
          active={activeNav}
          setActive={handleNavChange}
          deviceStatus={liveData.deviceStatus}
        />

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <DeviceSourceBar
            liveData={liveData}
            deviceStatus={liveData.deviceStatus}
            setDeviceStatus={setDeviceStatus}
            bridgeEnabled={demoMode || bridgeEnabled}
            setBridgeEnabled={demoMode ? () => {} : setBridgeEnabled}
            bridgeStatus={demoMode ? "connected" : bridge.status}
            bridgeError={demoMode ? "" : bridge.error}
            mockMode={demoMode}
          />

          {activeNav === "overview" ? (
            <OverviewPage liveData={liveData} />
          ) : activeNav === "practice" ? (
            <PracticePage />
          ) : (
            <DetailPage activeNav={activeNav} liveData={liveData} />
          )}
        </div>
      </div>
    </div>
  );
}
