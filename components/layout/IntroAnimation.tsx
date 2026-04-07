"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useAppStore } from "@/lib/store";
import { AccentPicker } from "@/components/ui/AccentPicker";
import { PdsButton } from "@/components/portfolio-design-system/PdsButton/PdsButton";

// ─── Timing constants (ms from app load) ──────────────────────────────────────
// Typing is handled by WelcomeCanvas (rendered above this overlay at z:55).
// IntroAnimation manages the dark overlay, border draws, and launch signal.

// ── Color picker moment after typing finishes ──────────────────────────────
// WelcomeCanvas types ~66 chars at ~42ms avg + 130ms comma pause ≈ 2866ms.
// Cursor hides at TOTAL_CHAR_MS + 420ms ≈ 3286ms. Picker panel appears just
// after that, with sequential 200ms fade-ins per element.
const T_BORDER_DUR   = 450;
const T_PICKER_START = 3400;  // one-liner fades in
const T_PICKER_IN    = T_PICKER_START + 200;
const T_ENTER_IN     = T_PICKER_START + 400;

// Panel geometry — must match actual panel widths / toolbar height
const LEFT_W     = 240;
const RIGHT_W    = 280;
const TOOLBAR_H  = 44;
// Must match WelcomeCanvas maxWidth so picker left edge = h2 left edge
const CONTENT_W  = 590;

// ─── IntroAnimation ──────────────────────────────────────────────────────────

export function IntroAnimation() {
  const { launched, launch, skipIntroTyping } = useAppStore();

  const doneRef = useRef(false);
  const timers  = useRef<ReturnType<typeof setTimeout>[]>([]);

  const [leftBorder,     setLeftBorder]     = useState(false);
  const [rightBorder,    setRightBorder]    = useState(false);
  const [toolbarBorder,  setToolbarBorder]  = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(true);

  // Color picker moment — always shown on every load
  const [showOneLiner, setShowOneLiner] = useState(false);
  const [showPicker,   setShowPicker]   = useState(false);
  const [showEnterBtn, setShowEnterBtn] = useState(false);

  const pickerVisible = showOneLiner || showPicker || showEnterBtn;

  // ── Draw borders then fade overlay out ───────────────────────────────────────
  const runBordersAndLaunch = useCallback(() => {
    setLeftBorder(true);
    setTimeout(() => setRightBorder(true),                      200);
    setTimeout(() => setToolbarBorder(true),                    400);
    setTimeout(() => { setOverlayVisible(false); launch(); }, 400 + T_BORDER_DUR + 200);
  }, [launch]);

  // ── Enter button ─────────────────────────────────────────────────────────────
  const handleEnter = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    runBordersAndLaunch();
  }, [runBordersAndLaunch]);

  // ── Skip-to-end (keyboard Escape) ────────────────────────────────────────────
  const skipAll = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setLeftBorder(true);
    setRightBorder(true);
    setToolbarBorder(true);
    setOverlayVisible(false);
    launch();
  }, [launch]);

  // ── Fast-forward to picker (new visitor presses key during typing) ────────────
  const showPickerNow = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    skipIntroTyping();
    setShowOneLiner(true);
    setShowPicker(true);
    setShowEnterBtn(true);
  }, [skipIntroTyping]);

  // ── Schedule intro on mount (client-only via useEffect) ──────────────────────
  useEffect(() => {
    if (launched) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const add = (fn: () => void, ms: number) => {
      const id = setTimeout(fn, ms);
      timers.current.push(id);
    };

    // Always show color picker moment after typing finishes — every load
    if (reducedMotion) {
      // Respect prefers-reduced-motion — show all at once, no stagger
      add(() => {
        setShowOneLiner(true);
        setShowPicker(true);
        setShowEnterBtn(true);
      }, T_PICKER_START);
    } else {
      add(() => setShowOneLiner(true), T_PICKER_START);
      add(() => setShowPicker(true),   T_PICKER_IN);
      add(() => setShowEnterBtn(true), T_ENTER_IN);
    }

    return () => { timers.current.forEach(clearTimeout); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Keyboard + click handling ─────────────────────────────────────────────────
  // • Picker NOT yet showing: any key or click → skip straight to launched site
  // • Picker showing: Enter → confirm, Escape → skip, click on background → confirm
  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (doneRef.current) return;
    // Only fire on background clicks, not on picker elements (swatches, button)
    if (e.target !== e.currentTarget) return;
    if (pickerVisible) {
      handleEnter();
    } else {
      // Skip intro entirely — go straight to launched site
      skipIntroTyping();
      skipAll();
    }
  }, [pickerVisible, handleEnter, skipIntroTyping, skipAll]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (doneRef.current) return;

      if (pickerVisible) {
        if (e.key === "Enter")  { handleEnter(); return; }
        if (e.key === "Escape") { skipAll();     return; }
        return; // all other keys ignored while picker is open
      } else {
        // Skip intro entirely — go straight to launched site
        skipIntroTyping();
        skipAll();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [skipAll, handleEnter, skipIntroTyping, pickerVisible]);

  // If already launched (e.g., hot reload preserved state), nothing to render
  if (launched) return null;

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div
      aria-hidden="true"
      onClick={handleOverlayClick}
      style={{
        position:        "absolute",
        inset:           0,
        zIndex:          50,
        backgroundColor: "#111111",
        opacity:         overlayVisible ? 1 : 0,
        transition:      overlayVisible ? "none" : "opacity 700ms ease",
        pointerEvents:   overlayVisible ? "auto" : "none",
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
          backgroundColor: "var(--shouf-border-sub)",
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
          backgroundColor: "var(--shouf-border-sub)",
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
          backgroundColor: "var(--shouf-border-sub)",
          transformOrigin: "left center",
          transform:       toolbarBorder ? "scaleX(1)" : "scaleX(0)",
          transition:      toolbarBorder
            ? `transform ${T_BORDER_DUR}ms cubic-bezier(0.4, 0, 0.2, 1)`
            : "none",
        }}
      />

      {/* ── Color picker moment — shown on every load ────────────────────────── */}
      {/* Expressive craft moment: transforms the overlay into a personalization  */}
      {/* invitation — the first interaction is choosing your accent color.       */}
      {pickerVisible && (
        <div
          style={{
            position:       "absolute",
            // Position below the headline with generous gap.
            top:            "calc(50% + 36px)",
            // Offset by (LEFT_W − RIGHT_W)/2 = −10px so the picker aligns with
            // the headline, which is centered inside CenterPanel (not the viewport).
            left:           "calc(50% - 10px)",
            transform:      "translateX(-50%)",
            display:        "flex",
            flexDirection:  "column",
            alignItems:     "center",
            gap:            "36px",
            width:          `${CONTENT_W}px`,
            maxWidth:       "calc(100% - 96px)",
          }}
        >
          {/* One-liner */}
          <p
            style={{
              fontSize:   "15px",
              lineHeight: 1.65,
              color:      "rgba(255,255,255,0.72)",
              textAlign:  "center",
              margin:     0,
              opacity:    showOneLiner ? 1 : 0,
              transition: "opacity 500ms ease",
            }}
          >
            This portfolio is built on Shouf: a design system I designed and coded.
          </p>

          {/* Color picker + label */}
          <div
            style={{
              display:       "flex",
              flexDirection: "column",
              alignItems:    "center",
              gap:           "20px",
              opacity:       showPicker ? 1 : 0,
              transition:    "opacity 500ms ease",
            }}
          >
            <span
              style={{
                fontSize:      "12px",
                fontFamily:    "var(--font-mono)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color:         "rgba(255,255,255,1)",
              }}
            >
              Make it yours — pick an accent color
            </span>
            <AccentPicker size="lg" />
          </div>

          {/* Enter button — explicit primary CTA, styled with Shouf tokens */}
          <div
            style={{
              opacity:    showEnterBtn ? 1 : 0,
              transition: "opacity 400ms ease",
            }}
          >
            <PdsButton
              variant="primary"
              size="md"
              label="Enter"
              onClick={handleEnter}
            />
          </div>
        </div>
      )}
    </div>
  );
}
