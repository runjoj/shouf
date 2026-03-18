"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { navSections } from "@/data/navigation";
import { isRegistered, COMPONENT_RENDERERS } from "@/lib/registry";
import { ColorTokensCanvas }   from "./ColorTokensCanvas";
import { SectionGridCanvas }   from "./SectionGridCanvas";
import { TypographyCanvas }    from "./TypographyCanvas";
import { SpacingCanvas }       from "./SpacingCanvas";
import { EuGuideCanvas }       from "./EuGuideCanvas";
import { RcGlobalNavCanvas }   from "./RcGlobalNavCanvas";

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

  const displayText = WORDS.slice(0, typedCount).join(" ");

  // During the intro the overlay background is always #111111 (dark), so force
  // near-white text so it reads in light mode too.  Once launched the canvas
  // background fades in and we switch back to the theme token with a matching
  // transition so the colour change is invisible.
  const headlineColor      = launched ? "var(--sh-text)" : "#F5F5F5";
  const headlineTransition = launched ? "color 700ms ease"  : "none";

  return (
    <div
      className="flex flex-col items-center justify-center gap-8 select-none text-center"
      style={{ maxWidth: "480px", padding: "0 32px" }}
    >
      {/* Logo mark — invisible during intro, fades in after launch */}
      <div
        style={{
          width:           "44px",
          height:          "44px",
          borderRadius:    "12px",
          backgroundColor: "var(--sh-accent)",
          display:         "flex",
          alignItems:      "center",
          justifyContent:  "center",
          flexShrink:      0,
          opacity:         launched ? 1 : 0,
          transition:      launched ? "opacity 300ms ease" : "none",
        }}
      >
        <svg width="24" height="24" viewBox="0 0 12 12" fill="none">
          <rect x="2"   y="2"   width="3.5" height="3.5" rx="0.75" fill="#111111" />
          <rect x="6.5" y="2"   width="3.5" height="3.5" rx="0.75" fill="#111111" fillOpacity="0.5" />
          <rect x="2"   y="6.5" width="3.5" height="3.5" rx="0.75" fill="#111111" fillOpacity="0.5" />
          <rect x="6.5" y="6.5" width="3.5" height="3.5" rx="0.75" fill="#111111" fillOpacity="0.75" />
        </svg>
      </div>

      {/* Headline + subhead */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {/*
          This h2 is the SOURCE OF TRUTH for the typing animation.
          It renders at its final font-size, line-height, and position from the
          very first frame — words simply appear one-by-one in place.
          Nothing moves or resizes when typing completes.
        */}
        <h2
          style={{
            fontSize:   "20px",
            fontWeight: 400,
            fontFamily: "var(--font-mono)",
            lineHeight: 1.35,
            color:      headlineColor,
            transition: headlineTransition,
            margin:     0,
          }}
        >
          {displayText}
          {showCursor && (
            <span
              style={{
                display:    "inline-block",
                marginLeft: "2px",
                color:      "var(--sh-accent)",
                animation:  "ls-cursor-blink 0.7s step-end infinite",
                fontWeight: 300,
              }}
            >
              |
            </span>
          )}
        </h2>

        {/* Subhead — hidden during intro, fades in after launch */}
        <p
          style={{
            fontSize:   "14px",
            lineHeight: 1.7,
            color:      "var(--sh-text-muted)",
            margin:     0,
            opacity:    launched ? 1 : 0,
            transition: launched ? "opacity 400ms ease 100ms" : "none",
          }}
        >
          Experienced in building components in Storybook, defining design tokens, and
          turning design decisions into production-ready code.
        </p>
        {/* Shouf label — subtle, below subhead */}
        <p
          style={{
            fontSize:      "12px",
            fontFamily:    "var(--font-mono)",
            letterSpacing: "0.05em",
            color:         "var(--sh-text-faint)",
            margin:        "4px 0 0",
            opacity:       launched ? 1 : 0,
            transition:    launched ? "opacity 400ms ease 150ms" : "none",
          }}
        >
          Shouf Design System
        </p>
      </div>

      {/* Nav hint — hidden during intro, fades in after launch */}
      <p
        style={{
          fontSize:      "12px",
          fontFamily:    "var(--font-mono)",
          letterSpacing: "0.02em",
          color:         "var(--sh-text-faint)",
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
        style={{ backgroundColor: "var(--sh-hover)", border: "1px solid var(--sh-border)" }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="3" stroke="var(--sh-text-faint)" strokeWidth="1.5" />
          <path d="M3 9h18M9 3v18" stroke="var(--sh-text-faint)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <div className="flex flex-col items-center gap-1.5 text-center">
        <p className="text-sm font-medium" style={{ color: "var(--sh-text-muted)" }}>
          No component selected
        </p>
        <p className="text-xs" style={{ color: "var(--sh-text-faint)" }}>
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
        <div className="flex items-center gap-1.5 text-[12px]" style={{ color: "var(--sh-text-faint)" }}>
          <span>{section.title}</span>
          <span>/</span>
          <span style={{ color: "var(--sh-text-muted)" }}>{entry.name}</span>
        </div>
      )}
      <div
        className="flex flex-col items-center justify-center gap-3 w-64 h-36 rounded-xl"
        style={{ backgroundColor: "var(--sh-panel)", border: "1px solid var(--sh-border)" }}
      >
        <div className="flex flex-col gap-2 w-40">
          <div className="h-2.5 rounded-full" style={{ backgroundColor: "var(--sh-skeleton)", width: "75%" }} />
          <div className="h-2 rounded-full"   style={{ backgroundColor: "var(--sh-skeleton-alt)", width: "55%" }} />
          <div className="h-2 rounded-full"   style={{ backgroundColor: "var(--sh-skeleton-alt)", width: "65%" }} />
        </div>
        <div className="h-7 rounded-md" style={{ backgroundColor: "var(--sh-skeleton)", width: "88px" }} />
      </div>
      {entry && (
        <p className="text-[12px]" style={{ color: "var(--sh-text-faint)" }}>
          <span style={{ color: "var(--sh-accent)" }}>{entry.name}</span>
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
            <span className="text-[12px]" style={{ color: "var(--sh-text-faint)" }}>
              {section.title}
            </span>
            <span style={{ color: "var(--sh-border)", fontSize: "12px" }}>/</span>
            <span className="text-[12px] font-medium" style={{ color: "var(--sh-text-muted)" }}>
              {entry.name}
            </span>
          </>
        )}
        {variant && (
          <>
            <span
              className="text-[12px] px-1.5 py-px rounded"
              style={{ backgroundColor: "var(--sh-accent-sel)", color: "var(--sh-accent)" }}
            >
              {variant}
            </span>
            {size && (
              <span
                className="text-[12px] px-1.5 py-px rounded"
                style={{ backgroundColor: "var(--sh-hover)", color: "var(--sh-text-faint)" }}
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
    selectedComponentId === "pds-color-tokens" ||
    selectedComponentId === "pds-typography"   ||
    selectedComponentId === "pds-spacing"      ||
    selectedComponentId === "eu-guide"         ||
    selectedComponentId === "rc-global-nav"    ||
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
        }}
      >
        {showWelcome && <WelcomeCanvas />}

        {!showWelcome && !selectedComponentId && !selectedSectionId && <NoSelectionState />}

        {/* ── Section grid view ────────────────────────────────────────────── */}
        {/* Grid takes priority — individual component canvas is suppressed    */}
        {isGridCanvas && (
          <SectionGridCanvas sectionId={selectedSectionId!} />
        )}

        {/* ── Individual component canvases — only when NOT in grid mode ───── */}
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

        {/* ── Registered components via LiveComponentCanvas ─────────────── */}
        {!showWelcome && !isGridCanvas && selectedComponentId &&
          selectedComponentId !== "pds-color-tokens" &&
          selectedComponentId !== "pds-typography"   &&
          selectedComponentId !== "pds-spacing"      &&
          selectedComponentId !== "eu-guide"         &&
          selectedComponentId !== "rc-global-nav"    &&
          isRegistered(selectedComponentId) && (
          <LiveComponentCanvas componentId={selectedComponentId} />
        )}

        {/* ── Placeholder for unbuilt components ────────────────────────── */}
        {!showWelcome && !isGridCanvas && selectedComponentId &&
          selectedComponentId !== "pds-color-tokens" &&
          selectedComponentId !== "pds-typography"   &&
          selectedComponentId !== "pds-spacing"      &&
          selectedComponentId !== "eu-guide"         &&
          selectedComponentId !== "rc-global-nav"    &&
          !isRegistered(selectedComponentId) && (
          <PlaceholderState componentId={selectedComponentId} />
        )}
      </div>
    </div>
  );
}
