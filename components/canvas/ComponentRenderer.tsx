"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { navSections } from "@/data/navigation";
import { isRegistered, COMPONENT_RENDERERS, COMPONENT_REGISTRY } from "@/lib/registry";
import { ColorTokensCanvas }   from "./ColorTokensCanvas";
import { SectionGridCanvas }   from "./SectionGridCanvas";
import { TypographyCanvas }    from "./TypographyCanvas";
import { SpacingCanvas }       from "./SpacingCanvas";
import { EuGuideCanvas }       from "./EuGuideCanvas";
import { PdsGuideCanvas }      from "./PdsGuideCanvas";
import { RcGlobalNavCanvas }   from "./RcGlobalNavCanvas";
import { AboutCanvas }         from "./AboutCanvas";
import { EuEmbeddedCanvas }   from "./EuEmbeddedCanvas";

// ─── WelcomeCanvas typing constants ───────────────────────────────────────────
// These timing values must stay in sync with IntroAnimation.tsx.

const HEADLINE_STR =
  "I\u2019m Jo, a designer and engineer who specializes in design systems";
const WORDS            = HEADLINE_STR.split(" "); // 12 words
const WORD_INTERVAL_MS = 110;                     // ms per word  (same as IntroAnimation)
// Hide cursor just before the border-draw sequence starts (matches T_LEFT_BORDER - 80ms)
const CURSOR_HIDE_MS   = WORDS.length * WORD_INTERVAL_MS + 500 - 80; // ~1740 ms

// ─── Welcome canvas ───────────────────────────────────────────────────────────

function WelcomeCanvas() {
  const { launched } = useAppStore();

  // Start already-complete if we're past the intro (skip or hot reload)
  const [typedCount, setTypedCount] = useState(launched ? WORDS.length : 0);
  const [showCursor, setShowCursor] = useState(!launched);

  // ── Typing sequence — runs once on mount if intro hasn't played yet ──────────
  useEffect(() => {
    if (launched) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    const add = (fn: () => void, ms: number) => { timers.push(setTimeout(fn, ms)); };

    // Reveal one word at a time
    for (let i = 0; i < WORDS.length; i++) {
      add(() => setTypedCount(i + 1), i * WORD_INTERVAL_MS);
    }

    // Hide cursor just before border-draw begins
    add(() => setShowCursor(false), CURSOR_HIDE_MS);

    return () => timers.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Snap to full text when skipped ──────────────────────────────────────────
  useEffect(() => {
    if (launched) {
      setTypedCount(WORDS.length);
      setShowCursor(false);
    }
  }, [launched]);

  const displayWords = WORDS.slice(0, typedCount);

  // During the intro the overlay background is always #111111 (dark), so force
  // near-white text so it reads in light mode too.  Once launched the canvas
  // background fades in and we switch back to the theme token with a matching
  // transition so the colour change is invisible.
  const headlineColor      = launched ? "var(--shouf-text)" : "#F5F5F5";
  const headlineTransition = launched ? "color 700ms ease"  : "none";

  return (
    // Text column only — centered at true viewport centre via paddingRight offset.
    // The preview card is rendered as an absolute sibling in ComponentRenderer.
    <div
      className="flex flex-col gap-8 select-none"
      style={{ maxWidth: "520px", padding: "0 40px" }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/*
          This h2 is the SOURCE OF TRUTH for the typing animation.
          It renders at its final font-size, line-height, and position from the
          very first frame — words simply appear one-by-one in place.
          Nothing moves or resizes when typing completes.
        */}
        <h2
          style={{
            fontSize:   "clamp(1.8rem, 2.4vw, 2.4rem)",
              fontWeight: 700,
              fontFamily: "var(--font-mono)",
              lineHeight: 1.35,
              color:      headlineColor,
              transition: headlineTransition,
              margin:     0,
            }}
          >
            {displayWords.map((word, i) => (
                <span key={i} style={{ animation: "ls-word-in 150ms ease both" }}>
                  {i > 0 ? " " : ""}{word}
                </span>
              ))}
            {showCursor && (
              <span
                style={{
                  display:    "inline-block",
                  marginLeft: "2px",
                  color:      "var(--shouf-accent)",
                  animation:  "ls-cursor-blink 0.7s step-end infinite",
                  fontWeight: 300,
                }}
              >
                |
              </span>
            )}
          </h2>

          {/* Subhead */}
          <p
            style={{
              fontSize:   "16px",
              lineHeight: 1.75,
              color:      "var(--shouf-text-muted)",
              margin:     0,
              opacity:    launched ? 1 : 0,
              transition: launched ? "opacity 400ms ease 100ms" : "none",
            }}
          >
            Experienced in building components in Storybook, defining design tokens, and
            turning design decisions into production-ready code.
          </p>
          {/* Shouf label */}
          <p
            style={{
              fontSize:      "12px",
              fontFamily:    "var(--font-mono)",
              letterSpacing: "0.05em",
              color:         "var(--shouf-text-faint)",
              margin:        0,
              opacity:       launched ? 1 : 0,
              transition:    launched ? "opacity 400ms ease 150ms" : "none",
            }}
          >
            Shouf Design System
          </p>
        </div>

      {/* Nav hint */}
      <p
        style={{
          fontSize:      "12px",
          fontFamily:    "var(--font-mono)",
          letterSpacing: "0.02em",
          color:         "var(--shouf-text-faint)",
          margin:        0,
          opacity:       launched ? 1 : 0,
          transition:    launched ? "opacity 400ms ease 200ms" : "none",
        }}
      >
        ← select a section from the navigator to explore components
      </p>
    </div>
  );
}

// ─── No component selected ───────────────────────────────────────────────────

function NoSelectionState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 select-none">
      <div
        className="flex items-center justify-center w-14 h-14 rounded-xl"
        style={{ backgroundColor: "var(--shouf-hover)", border: "1px solid var(--shouf-border)" }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="3" stroke="var(--shouf-text-faint)" strokeWidth="1.5" />
          <path d="M3 9h18M9 3v18" stroke="var(--shouf-text-faint)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <div className="flex flex-col items-center gap-1.5 text-center">
        <p className="text-sm font-medium" style={{ color: "var(--shouf-text-muted)" }}>
          No component selected
        </p>
        <p className="text-xs" style={{ color: "var(--shouf-text-faint)" }}>
          Choose a component from the navigator to preview it here
        </p>
      </div>
    </div>
  );
}

// ─── Placeholder (component not yet built) ───────────────────────────────────

function PlaceholderState({ componentId }: { componentId: string }) {
  const entry   = navSections.flatMap((s) => s.entries).find((e) => e.id === componentId);
  const section = navSections.find((s) => s.id === entry?.sectionId);

  return (
    <div className="flex flex-col items-center justify-center gap-5 select-none">
      {entry && section && (
        <div className="flex items-center gap-1.5 text-[12px]" style={{ color: "var(--shouf-text-faint)" }}>
          <span>{section.title}</span>
          <span>/</span>
          <span style={{ color: "var(--shouf-text-muted)" }}>{entry.name}</span>
        </div>
      )}
      <div
        className="flex flex-col items-center justify-center gap-3 w-64 h-36 rounded-xl"
        style={{ backgroundColor: "var(--shouf-panel)", border: "1px solid var(--shouf-border)" }}
      >
        <div className="flex flex-col gap-2 w-40">
          <div className="h-2.5 rounded-full" style={{ backgroundColor: "var(--shouf-skeleton)", width: "75%" }} />
          <div className="h-2 rounded-full"   style={{ backgroundColor: "var(--shouf-skeleton-alt)", width: "55%" }} />
          <div className="h-2 rounded-full"   style={{ backgroundColor: "var(--shouf-skeleton-alt)", width: "65%" }} />
        </div>
        <div className="h-7 rounded-md" style={{ backgroundColor: "var(--shouf-skeleton)", width: "88px" }} />
      </div>
      {entry && (
        <p className="text-[12px]" style={{ color: "var(--shouf-text-faint)" }}>
          <span style={{ color: "var(--shouf-accent)" }}>{entry.name}</span>
          {" "}— coming soon
        </p>
      )}
    </div>
  );
}

// ─── Real component canvas ───────────────────────────────────────────────────

function LiveComponentCanvas({ componentId }: { componentId: string }) {
  const { controlValues } = useAppStore();
  const values    = controlValues[componentId] ?? {};
  const renderer  = COMPONENT_RENDERERS[componentId];
  const fullWidth = values.fullWidth === true;

  const entry   = navSections.flatMap((s) => s.entries).find((e) => e.id === componentId);
  const section = navSections.find((s) => s.id === entry?.sectionId);
  const variant = (values.variant as string) || "";
  const size    = (values.size    as string) || "";

  return (
    <div className={`flex flex-col items-center gap-8${fullWidth ? " w-full" : ""}`}>
      {/* The actual component */}
      <div
        className="flex items-center justify-center"
        style={{ minHeight: "80px", width: fullWidth ? "100%" : undefined, padding: fullWidth ? "0 32px" : undefined }}
      >
        {renderer?.(values)}
      </div>

      {/* Meta label */}
      <div className="flex items-center gap-2 select-none">
        {entry && section && (
          <>
            <span className="text-[12px]" style={{ color: "var(--shouf-text-faint)" }}>
              {section.title}
            </span>
            <span style={{ color: "var(--shouf-border)", fontSize: "12px" }}>/</span>
            <span className="text-[12px] font-medium" style={{ color: "var(--shouf-text-muted)" }}>
              {entry.name}
            </span>
          </>
        )}
        {variant && (
          <>
            <span
              className="text-[12px] px-1.5 py-px rounded"
              style={{ backgroundColor: "var(--shouf-accent-sel)", color: "var(--shouf-accent)" }}
            >
              {variant}
            </span>
            {size && (
              <span
                className="text-[12px] px-1.5 py-px rounded"
                style={{ backgroundColor: "var(--shouf-hover)", color: "var(--shouf-text-faint)" }}
              >
                {size}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── FloatingWelcomePreview ───────────────────────────────────────────────────
// Cycles through live component previews — rendered inline in WelcomeCanvas's
// flex row so it aligns naturally with the text column.

const PREVIEW_CYCLE = [
  { label: "Button",   id: "pds-button"   },
  { label: "Input",    id: "pds-input"    },
  { label: "Statuses", id: "eu-statuses"  },
];

const MONO = "var(--font-mono)";

function FloatingWelcomePreview({ launched }: { launched: boolean }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [visible,   setVisible]   = useState(true);

  useEffect(() => {
    if (!launched) return;
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setActiveIdx((i) => (i + 1) % PREVIEW_CYCLE.length);
        setVisible(true);
      }, 350);
    }, 5000);
    return () => clearInterval(interval);
  }, [launched]);

  const item     = PREVIEW_CYCLE[activeIdx];
  const renderer = COMPONENT_RENDERERS[item.id];
  const values   = COMPONENT_REGISTRY[item.id]?.defaultValues ?? {};

  return (
    <div
      style={{
        position:        "absolute",
        right:           "200px",
        top:             "50%",
        transform:       "translateY(-50%)",
        width:           "256px",
        borderRadius:    "16px",
        backgroundColor: "var(--shouf-panel)",
        border:          "1px solid var(--shouf-border-sub)",
        overflow:        "hidden",
        boxShadow:       "0 4px 24px rgba(0,0,0,0.12)",
        // Expressive moment: card fades in after launch with a slight delay
        opacity:         launched ? 1 : 0,
        transition:      launched ? "opacity 400ms ease 500ms" : "none",
      }}
    >
      {/* Label + dot indicators */}
      <div
        style={{
          padding:      "12px 16px 10px",
          borderBottom: "1px solid var(--shouf-border-sub)",
          display:      "flex",
          alignItems:   "center",
        }}
      >
        <span style={{
          fontFamily:    MONO,
          fontSize:      "10px",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color:         "var(--shouf-text-faint)",
        }}>
          {item.label}
        </span>
        <div style={{ marginLeft: "auto", display: "flex", gap: "5px" }}>
          {PREVIEW_CYCLE.map((_, i) => (
            <div key={i} style={{
              width:           "5px",
              height:          "5px",
              borderRadius:    "50%",
              backgroundColor: i === activeIdx ? "var(--shouf-accent)" : "var(--shouf-border)",
              transition:      "background-color 200ms ease",
            }} />
          ))}
        </div>
      </div>

      {/* Live component preview */}
      <div
        style={{
          minHeight:      "160px",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          padding:        "28px 24px",
          pointerEvents:  "none",
          userSelect:     "none",
          opacity:        visible ? 1 : 0,
          transition:     "opacity 300ms ease",
        }}
      >
        {renderer?.(values)}
      </div>
    </div>
  );
}

// ─── ComponentRenderer ───────────────────────────────────────────────────────

export function ComponentRenderer() {
  const { selectedComponentId, selectedSectionId, launched } = useAppStore();

  // During intro, WelcomeCanvas renders above the dark overlay (z-index 50)
  // by elevating this wrapper to z-index 55.  After launch the stacking order
  // returns to normal (z-index: auto = no isolated stacking context).
  //
  // The dot-grid background is a separate absolute child so it can fade in
  // independently without hiding the canvas content during the intro.
  const showWelcome = !launched || selectedComponentId === "welcome";

  // Section grid view takes over the entire canvas — needs the same stretch
  // layout as ColorTokensCanvas so it can own its own scrolling.
  const isGridCanvas  = !showWelcome && selectedSectionId !== null;
  const isFullCanvas  = !showWelcome && (
    selectedComponentId === "pds-guide"        ||
    selectedComponentId === "pds-color-tokens" ||
    selectedComponentId === "pds-typography"   ||
    selectedComponentId === "pds-spacing"      ||
    selectedComponentId === "eu-guide"         ||
    selectedComponentId === "eu-embedded"      ||
    selectedComponentId === "rc-global-nav"    ||
    selectedComponentId === "about"            ||
    isGridCanvas
  );

  return (
    <div
      style={{
        flex:      1,
        minHeight: 0,
        display:   "flex",
        position:  "relative",
        // Rise above the overlay (z:50) during intro so WelcomeCanvas types
        // at its real DOM position — no size or position change on launch.
        zIndex:    launched ? undefined : 55,
      }}
    >
      {/* Dot-grid canvas background — fades in 1300 ms after launch */}
      <div
        className="canvas-grid"
        style={{
          position:                "absolute",
          inset:                   0,
          animationName:           "intro-canvas-fade",
          animationDuration:       "800ms",
          animationTimingFunction: "ease",
          animationFillMode:       "both",
          animationDelay:          "1300ms",
          animationPlayState:      launched ? "running" : "paused",
        }}
      />

      {/* Content layer — always on top of the background */}
      <div
        style={{
          position:       "relative",
          zIndex:         1,
          flex:           1,
          minHeight:      0,
          display:        "flex",
          alignItems:     isFullCanvas ? "stretch"    : "center",
          justifyContent: isFullCanvas ? "flex-start" : "center",
          // Shift the flex centre-point leftward by half the left-panel width
          // so WelcomeCanvas lands at the true viewport centre, not the
          // centre of the narrower content area.  Only active during welcome.
          paddingRight:   showWelcome ? "260px" : 0,
        }}
      >
        {showWelcome && <WelcomeCanvas />}
        {showWelcome && launched && <FloatingWelcomePreview launched={launched} />}

        {!showWelcome && !selectedComponentId && !selectedSectionId && <NoSelectionState />}

        {/* ── Section grid view ────────────────────────────────────────────── */}
        {/* Grid takes priority — individual component canvas is suppressed    */}
        {isGridCanvas && (
          <SectionGridCanvas sectionId={selectedSectionId!} />
        )}

        {/* ── Individual component canvases — only when NOT in grid mode ───── */}
        {!showWelcome && !isGridCanvas && selectedComponentId === "pds-guide" && (
          <PdsGuideCanvas />
        )}
        {!showWelcome && !isGridCanvas && selectedComponentId === "pds-color-tokens" && (
          <ColorTokensCanvas />
        )}
        {!showWelcome && !isGridCanvas && selectedComponentId === "pds-typography" && (
          <TypographyCanvas />
        )}
        {!showWelcome && !isGridCanvas && selectedComponentId === "pds-spacing" && (
          <SpacingCanvas />
        )}
        {!showWelcome && !isGridCanvas && selectedComponentId === "eu-guide" && (
          <EuGuideCanvas />
        )}
        {!showWelcome && !isGridCanvas && selectedComponentId === "rc-global-nav" && (
          <RcGlobalNavCanvas />
        )}
        {!showWelcome && !isGridCanvas && selectedComponentId === "about" && (
          <AboutCanvas />
        )}
        {!showWelcome && !isGridCanvas && selectedComponentId === "eu-embedded" && (
          <EuEmbeddedCanvas />
        )}

        {/* ── Registered components via LiveComponentCanvas ─────────────── */}
        {!showWelcome && !isGridCanvas && selectedComponentId &&
          selectedComponentId !== "pds-guide"        &&
          selectedComponentId !== "pds-color-tokens" &&
          selectedComponentId !== "pds-typography"   &&
          selectedComponentId !== "pds-spacing"      &&
          selectedComponentId !== "eu-guide"         &&
          selectedComponentId !== "eu-embedded"      &&
          selectedComponentId !== "rc-global-nav"    &&
          isRegistered(selectedComponentId) && (
          <LiveComponentCanvas componentId={selectedComponentId} />
        )}

        {/* ── Placeholder for unbuilt components ────────────────────────── */}
        {!showWelcome && !isGridCanvas && selectedComponentId &&
          selectedComponentId !== "pds-guide"        &&
          selectedComponentId !== "pds-color-tokens" &&
          selectedComponentId !== "pds-typography"   &&
          selectedComponentId !== "pds-spacing"      &&
          selectedComponentId !== "eu-guide"         &&
          selectedComponentId !== "eu-embedded"      &&
          selectedComponentId !== "rc-global-nav"    &&
          selectedComponentId !== "about"            &&
          !isRegistered(selectedComponentId) && (
          <PlaceholderState componentId={selectedComponentId} />
        )}
      </div>
    </div>
  );
}
