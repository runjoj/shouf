"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { HeroCanvas } from "@/components/canvas/HeroCanvas";
import { PdsButton } from "@/components/portfolio-design-system/PdsButton/PdsButton";
import { AccentPicker } from "@/components/ui/AccentPicker";
import { useAppStore } from "@/lib/store";

// ─── Typography constants ─────────────────────────────────────────────────────

const SERIF = "var(--font-playfair), Georgia, 'Times New Roman', serif";
const FS    = "clamp(2.4rem, 3.6vw, 4.2rem)";
const LH    = 1.1;

// ─── Headline words ───────────────────────────────────────────────────────────
// Split so each word snaps in independently during the typing phase.

const HEADLINE_SERIF = (
  <>
    I&rsquo;m Jo, a designer + engineer with a love of
    design systems.
  </>
);

const HEADLINE_STR =
  "I'm Jo, a designer + engineer with a love of design systems.";


// ─── Animation timing (ms) ────────────────────────────────────────────────────

const T_BG_START    = 0;
const T_BLOBS_START = 400;
const T_CURSOR_ON   = 800;
const T_HINT_IN     = 300;
const T_HINT_OUT    = 2000;

// Natural per-character delays — deterministic jitter keyed on char + position
function lsCharDelay(ch: string, i: number): number {
  const jitter = ((ch.charCodeAt(0) * 17 + i * 7) % 30) - 15;
  const bonus  = ch === "," ? 130 : 0;
  return Math.max(20, 40 + jitter + bonus);
}
const LS_CHAR_DELAYS   = Array.from(HEADLINE_STR).map((ch, i) => lsCharDelay(ch, i));
const LS_TOTAL_CHAR_MS = LS_CHAR_DELAYS.reduce((a, b) => a + b, 0);

// Derived timings — flow from typing duration
const T_SERIF_START = T_CURSOR_ON + LS_TOTAL_CHAR_MS + 280;
const T_SUBHEAD     = T_SERIF_START + 400;
const T_BUTTON      = T_SERIF_START + 800;
const T_DONE        = T_SERIF_START + 1100;

// ─── Logo mark ────────────────────────────────────────────────────────────────

function LogoMark() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <div
        style={{
          width:           "26px",
          height:          "26px",
          borderRadius:    "6px",
          display:         "flex",
          alignItems:      "center",
          justifyContent:  "center",
          backgroundColor: "var(--shouf-accent)",
          flexShrink:      0,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
          <rect x="2"   y="2"   width="3.5" height="3.5" rx="0.75" fill="#111111" />
          <rect x="6.5" y="2"   width="3.5" height="3.5" rx="0.75" fill="#111111" fillOpacity="0.5" />
          <rect x="2"   y="6.5" width="3.5" height="3.5" rx="0.75" fill="#111111" fillOpacity="0.5" />
          <rect x="6.5" y="6.5" width="3.5" height="3.5" rx="0.75" fill="#111111" fillOpacity="0.75" />
        </svg>
      </div>
      <span
        style={{
          fontSize:      "14px",
          fontWeight:    600,
          letterSpacing: "-0.02em",
          color:         "#F5F5F5",
        }}
      >
        helloitsjo
      </span>
    </div>
  );
}

// ─── LandingScreen ────────────────────────────────────────────────────────────

export function LandingScreen() {
  const { launch } = useAppStore();

  // ── Animation state ─────────────────────────────────────────────────────────
  const doneRef   = useRef(false);
  const timers    = useRef<ReturnType<typeof setTimeout>[]>([]);

  const [bgVisible,      setBgVisible]      = useState(false);
  const [blobsVisible,   setBlobsVisible]   = useState(false);
  const [typedCount,     setTypedCount]     = useState(0); // char count
  const [showCursor,     setShowCursor]     = useState(false);
  const [serif,          setSerif]          = useState(false);
  const [subheadVisible, setSubheadVisible] = useState(false);
  const [buttonVisible,  setButtonVisible]  = useState(false);
  const [hintVisible,    setHintVisible]    = useState(false);

  // ── Skip to final state instantly ───────────────────────────────────────────
  const skipAll = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setBgVisible(true);
    setBlobsVisible(true);
    setTypedCount(HEADLINE_STR.length);
    setShowCursor(false);
    setSerif(true);
    setSubheadVisible(true);
    setButtonVisible(true);
    setHintVisible(false);
  }, []);

  // ── Schedule animation on mount ─────────────────────────────────────────────
  useEffect(() => {
    const add = (fn: () => void, ms: number) => {
      const id = setTimeout(fn, ms);
      timers.current.push(id);
    };

    // Dot grid fades in
    add(() => setBgVisible(true), T_BG_START);

    // Blobs fade in
    add(() => setBlobsVisible(true), T_BLOBS_START);

    // Skip hint fades in then out
    add(() => setHintVisible(true),  T_HINT_IN);
    add(() => setHintVisible(false), T_HINT_OUT);

    // Typing sequence — character by character with natural timing
    add(() => setShowCursor(true), T_CURSOR_ON);
    let t = T_CURSOR_ON;
    for (let i = 0; i < HEADLINE_STR.length; i++) {
      t += LS_CHAR_DELAYS[i];
      const charIdx = i + 1;
      add(() => setTypedCount(charIdx), t);
    }

    // Mono → serif crossfade (the magic moment)
    add(() => {
      setShowCursor(false);
      setSerif(true);
    }, T_SERIF_START);

    // Subhead slides in
    add(() => setSubheadVisible(true), T_SUBHEAD);

    // Button pops in
    add(() => setButtonVisible(true), T_BUTTON);

    // Mark as done — clicks on backdrop no longer skip
    add(() => { doneRef.current = true; }, T_DONE);

    return () => { timers.current.forEach(clearTimeout); };
  }, []); // runs once on mount

  // ── Keydown + click-anywhere to skip ────────────────────────────────────────
  useEffect(() => {
    const onKey = () => { if (!doneRef.current) skipAll(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [skipAll]);

  const handleClick = () => {
    if (!doneRef.current) skipAll();
  };

  // ── Mono h1 text ─────────────────────────────────────────────────────────────
  const typedText = HEADLINE_STR.slice(0, typedCount);

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div
      onClick={handleClick}
      style={{
        position:        "relative",
        width:           "100%",
        height:          "100%",
        backgroundColor: "#111111",
        overflow:        "hidden",
        cursor:          doneRef.current ? "default" : "pointer",
      }}
    >
      {/* ── Dot-grid background — fades in at 0ms ──────────────────────────── */}
      <div
        aria-hidden
        style={{
          position:       "absolute",
          inset:          0,
          zIndex:         0,
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.55) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          opacity:        bgVisible ? 0.07 : 0,
          transition:     "opacity 600ms ease",
          pointerEvents:  "none",
        }}
      />

      {/* ── Animated blob canvas — right 65% of screen ─────────────────────── */}
      <div
        style={{
          position:      "absolute",
          top:           0,
          right:         0,
          bottom:        0,
          left:          "35%",
          zIndex:        1,
          pointerEvents: "none",
          opacity:       blobsVisible ? 1 : 0,
          transition:    "opacity 800ms ease",
        }}
      >
        <HeroCanvas />
      </div>

      {/* ── Grain texture — subtle noise for depth ─────────────────────────── */}
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position:      "absolute",
          inset:         0,
          width:         "100%",
          height:        "100%",
          pointerEvents: "none",
          zIndex:        10,
        }}
      >
        <filter id="ls-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#ls-grain)" opacity="0.045" />
      </svg>

      {/* ── Main content ───────────────────────────────────────────────────── */}
      <div
        style={{
          position:      "relative",
          zIndex:        5,
          height:        "100%",
          display:       "flex",
          flexDirection: "column",
          padding:       "40px 72px",
        }}
      >
        {/* Logo */}
        <div style={{ flexShrink: 0 }}>
          <LogoMark />
        </div>

        {/* ── Vertically centred hero block ──────────────────────────────── */}
        <div
          style={{
            flex:           "1",
            display:        "flex",
            flexDirection:  "column",
            justifyContent: "center",
            alignSelf:      "center",
            maxWidth:       "560px",
            width:          "100%",
          }}
        >
          {/* ── Headline crossfade container ──────────────────────────────── */}
          {/* Serif h1 stays in normal flow → defines height throughout.      */}
          {/* Mono h1 is absolute overlay → types itself, then crossfades out.*/}
          <div style={{ position: "relative" }}>

            {/* Serif layer — in flow, always defines layout height */}
            <h1
              aria-live="polite"
              style={{
                fontSize:      FS,
                fontWeight:    400,
                fontFamily:    SERIF,
                lineHeight:    LH,
                letterSpacing: "-0.01em",
                color:         "#F5F5F5",
                margin:        0,
                opacity:       serif ? 1 : 0,
                transition:    "opacity 400ms ease",
                userSelect:    "none",
              }}
            >
              {HEADLINE_SERIF}
            </h1>

            {/* Monospace layer — absolute overlay, types word-by-word */}
            <h1
              aria-hidden="true"
              style={{
                position:      "absolute",
                top:           0,
                left:          0,
                right:         0,
                fontSize:      FS,
                fontWeight:    400,
                fontFamily:    "var(--font-mono)",
                lineHeight:    LH,
                color:         "#F5F5F5",
                margin:        0,
                // Instant on during typing; smooth fade out on serif transition
                opacity:       serif ? 0 : (typedCount > 0 ? 1 : 0),
                transition:    serif ? "opacity 400ms ease" : "none",
                whiteSpace:    "pre-wrap",
                wordBreak:     "break-word",
              }}
            >
              {typedText}
              {showCursor && (
                <span
                  style={{
                    display:         "inline-block",
                    marginLeft:      "2px",
                    color:           "var(--shouf-accent)",
                    animation:       "ls-cursor-blink 0.7s step-end infinite",
                    fontWeight:      300,
                  }}
                >
                  |
                </span>
              )}
            </h1>
          </div>

          {/* ── Subhead — fades + slides up ──────────────────────────────── */}
          <p
            style={{
              marginTop:  "24px",
              fontSize:   "16px",
              lineHeight: 1.65,
              color:      "#888888",
              maxWidth:   "460px",
              margin:     "24px 0 0",
              opacity:    subheadVisible ? 1 : 0,
              transform:  subheadVisible ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 500ms ease, transform 500ms ease",
            }}
          >
            Experienced in building components in Storybook, defining design tokens, and
            turning design decisions into production-ready code.
          </p>

          {/* ── Shouf label ──────────────────────────────────────────────── */}

          {/* ── CTA — pops in below the subhead ─────────────────────────── */}
          <div
            style={{
              marginTop:  "48px",
              opacity:    buttonVisible ? 1 : 0,
              transform:  buttonVisible ? "scale(1)" : "scale(0.95)",
              transition: "opacity 300ms ease, transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            <PdsButton
              variant="primary"
              size="lg"
              label="Explore the system"
              onClick={launch}
            />
          </div>
        </div>
      </div>

      {/* ── Skip hint — bottom center ────────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position:      "absolute",
          bottom:        96,
          left:          "50%",
          transform:     "translateX(-50%)",
          zIndex:        5,
          pointerEvents: "none",
          opacity:       hintVisible ? 0.7 : 0,
          transition:    "opacity 500ms ease",
          whiteSpace:    "nowrap",
          fontSize:      "12px",
          fontFamily:    "var(--font-mono)",
          letterSpacing: "0.04em",
          color:         "#FFFFFF",
        }}
      >
        · press any key to skip
      </div>

      {/* ── Accent picker — bottom right ─────────────────────────────────── */}
      <div
        style={{
          position:      "absolute",
          bottom:        34,
          right:         72,
          zIndex:        5,
          display:       "flex",
          alignItems:    "center",
          gap:           "10px",
        }}
      >
        <span
          style={{
            fontSize:      "12px",
            fontFamily:    "var(--font-mono)",
            letterSpacing: "0.06em",
            color:         "rgba(255,255,255,0.22)",
            userSelect:    "none",
          }}
        >
          --accent
        </span>
        <AccentPicker size="md" />
      </div>
    </div>
  );
}
