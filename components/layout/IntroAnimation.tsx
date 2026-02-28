"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useAppStore } from "@/lib/store";

// ─── Timing constants (ms from app load) ──────────────────────────────────────
// Typing is now handled by WelcomeCanvas itself (rendered above this overlay).
// IntroAnimation only manages the dark overlay, border draws, and launch signal.
//
// Typing:  12 words × 110ms = 1320ms
// Pause:   500ms cursor visible after last word
// Borders: left→right→toolbar, each 200ms apart, 450ms draw duration
// Launch:  overlay fades + panels reveal at 2870ms

const WORD_COUNT       = 12;   // words in the WelcomeCanvas headline
const T_WORD_INTERVAL  = 110;  // ms per word (must match WelcomeCanvas)
const T_TYPING_DONE    = WORD_COUNT * T_WORD_INTERVAL; // 1320 ms
const T_PAUSE          = 500;
const T_LEFT_BORDER    = T_TYPING_DONE + T_PAUSE;          // 1820 ms
const T_RIGHT_BORDER   = T_LEFT_BORDER  + 200;             // 2020 ms
const T_TOOLBAR_BORDER = T_RIGHT_BORDER + 200;             // 2220 ms
const T_BORDER_DUR     = 450;
const T_LAUNCH         = T_TOOLBAR_BORDER + T_BORDER_DUR + 200; // 2870 ms

const T_HINT_IN  = 400;
const T_HINT_OUT = 2600;

// Panel geometry — must match actual panel widths / toolbar height
const LEFT_W    = 260;
const RIGHT_W   = 280;
const TOOLBAR_H = 42;

const MONO = "ui-monospace, 'Cascadia Code', 'SF Mono', Menlo, Consolas, monospace";

// ─── IntroAnimation ──────────────────────────────────────────────────────────

export function IntroAnimation() {
  const { launched, launch } = useAppStore();

  const doneRef = useRef(false);
  const timers  = useRef<ReturnType<typeof setTimeout>[]>([]);

  const [leftBorder,     setLeftBorder]     = useState(false);
  const [rightBorder,    setRightBorder]    = useState(false);
  const [toolbarBorder,  setToolbarBorder]  = useState(false);
  const [hintVisible,    setHintVisible]    = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(true);

  // ── Skip-to-end ─────────────────────────────────────────────────────────────
  const skipAll = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setLeftBorder(true);
    setRightBorder(true);
    setToolbarBorder(true);
    setHintVisible(false);
    setOverlayVisible(false);
    launch();
  }, [launch]);

  // ── Schedule intro on mount ──────────────────────────────────────────────────
  useEffect(() => {
    if (launched) return;

    const add = (fn: () => void, ms: number) => {
      const id = setTimeout(fn, ms);
      timers.current.push(id);
    };

    // Skip hint
    add(() => setHintVisible(true),  T_HINT_IN);
    add(() => setHintVisible(false), T_HINT_OUT);

    // Border drawing sequence (after typing + pause)
    add(() => setLeftBorder(true),    T_LEFT_BORDER);
    add(() => setRightBorder(true),   T_RIGHT_BORDER);
    add(() => setToolbarBorder(true), T_TOOLBAR_BORDER);

    // Launch: fade overlay + reveal panels
    add(() => {
      doneRef.current = true;
      setOverlayVisible(false);
      launch();
    }, T_LAUNCH);

    return () => { timers.current.forEach(clearTimeout); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Key / click to skip ──────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = () => { if (!doneRef.current) skipAll(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [skipAll]);

  // If already launched (e.g., hot reload preserved state), nothing to render
  if (launched) return null;

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div
      onClick={() => { if (!doneRef.current) skipAll(); }}
      aria-hidden="true"
      style={{
        position:        "absolute",
        inset:           0,
        zIndex:          50,
        backgroundColor: "#111111",
        opacity:         overlayVisible ? 1 : 0,
        transition:      overlayVisible ? "none" : "opacity 700ms ease",
        pointerEvents:   overlayVisible ? "auto" : "none",
        cursor:          doneRef.current ? "default" : "pointer",
        overflow:        "hidden",
      }}
    >
      {/* ── Left panel right border ───────────────────────────────────────────── */}
      <div
        style={{
          position:        "absolute",
          left:            `${LEFT_W - 1}px`,
          top:             0,
          bottom:          0,
          width:           "1px",
          backgroundColor: "var(--sh-border-sub)",
          transformOrigin: "top center",
          transform:       leftBorder ? "scaleY(1)" : "scaleY(0)",
          transition:      leftBorder
            ? `transform ${T_BORDER_DUR}ms cubic-bezier(0.4, 0, 0.2, 1)`
            : "none",
        }}
      />

      {/* ── Right panel left border ───────────────────────────────────────────── */}
      <div
        style={{
          position:        "absolute",
          right:           `${RIGHT_W - 1}px`,
          top:             0,
          bottom:          0,
          width:           "1px",
          backgroundColor: "var(--sh-border-sub)",
          transformOrigin: "top center",
          transform:       rightBorder ? "scaleY(1)" : "scaleY(0)",
          transition:      rightBorder
            ? `transform ${T_BORDER_DUR}ms cubic-bezier(0.4, 0, 0.2, 1)`
            : "none",
        }}
      />

      {/* ── Toolbar bottom border — full width ────────────────────────────────── */}
      <div
        style={{
          position:        "absolute",
          left:            0,
          right:           0,
          top:             `${TOOLBAR_H - 1}px`,
          height:          "1px",
          backgroundColor: "var(--sh-border-sub)",
          transformOrigin: "left center",
          transform:       toolbarBorder ? "scaleX(1)" : "scaleX(0)",
          transition:      toolbarBorder
            ? `transform ${T_BORDER_DUR}ms cubic-bezier(0.4, 0, 0.2, 1)`
            : "none",
        }}
      />

      {/* ── Skip hint — bottom center ─────────────────────────────────────────── */}
      <div
        style={{
          position:      "absolute",
          bottom:        32,
          left:          "50%",
          transform:     "translateX(-50%)",
          opacity:       hintVisible ? 0.25 : 0,
          transition:    "opacity 500ms ease",
          whiteSpace:    "nowrap",
          fontSize:      "11px",
          fontFamily:    MONO,
          letterSpacing: "0.04em",
          color:         "#FFFFFF",
          pointerEvents: "none",
        }}
      >
        · press any key or click to skip
      </div>
    </div>
  );
}
