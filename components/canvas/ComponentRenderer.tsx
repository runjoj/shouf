"use client";

import { useState, useEffect, useRef } from "react";
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
import { RcGuideCanvas }       from "./RcGuideCanvas";
import { AboutCanvas }         from "./AboutCanvas";
import { EuEmbeddedCanvas }   from "./EuEmbeddedCanvas";
import { EuCaseStudyCanvas } from "./EuCaseStudyCanvas";
import { WorkIndexCanvas }   from "./WorkIndexCanvas";
import { RcCaseStudyCanvas } from "./RcCaseStudyCanvas";
import { EuOverviewCanvas } from "./EuOverviewCanvas";
import { PdsOverviewCanvas } from "./PdsOverviewCanvas";
import { EsCaseStudyCanvas } from "./EsCaseStudyCanvas";
import { QlCaseStudyCanvas } from "./QlCaseStudyCanvas";
import { QlUserProfilesCanvas } from "./QlUserProfilesCanvas";

// ─── WelcomeCanvas typing constants ───────────────────────────────────────────

const HEADLINE_STR =
  "I\u2019m Jo, a designer + engineer with a love of design systems.";

// Natural per-character delays — deterministic jitter so timing is consistent
// across renders but looks organic.
function charDelay(ch: string, i: number): number {
  const jitter = ((ch.charCodeAt(0) * 17 + i * 7) % 30) - 15;
  const bonus  = ch === "," ? 95 : 0;
  return Math.max(18, 42 + jitter + bonus);
}
const CHAR_DELAYS   = Array.from(HEADLINE_STR).map((ch, i) => charDelay(ch, i));
const TOTAL_CHAR_MS = CHAR_DELAYS.reduce((a, b) => a + b, 0);
// Hide cursor just before border-draw sequence starts
const CURSOR_HIDE_MS = TOTAL_CHAR_MS + 500 - 80;


// ─── Welcome canvas ───────────────────────────────────────────────────────────

// ─── Headline size map — must match WelcomeDefinition SIZE_TOKENS ─────────────
const WELCOME_FONT_SIZES: Record<string, string> = {
  sm: "clamp(1.4rem, 1.8vw, 1.8rem)",
  md: "clamp(1.8rem, 2.4vw, 2.4rem)",
  lg: "clamp(2.2rem, 3vw, 3rem)",
};

function WelcomeCanvas() {
  const { launched, introSkipped, controlValues } = useAppStore();

  // Headline size driven by the controls bar "Headline" select.
  // Locked to "md" during typing so the animation frame is stable.
  const sizeKey  = launched ? ((controlValues["welcome"]?.size as string) ?? "lg") : "lg";
  const fontSize = WELCOME_FONT_SIZES[sizeKey] ?? WELCOME_FONT_SIZES.md;

  // Start already-complete if we're past the intro (skip or hot reload)
  const [typedCount, setTypedCount] = useState(launched ? HEADLINE_STR.length : 0);
  const [showCursor, setShowCursor] = useState(!launched);
  const typingTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // ── Typing sequence — runs once on mount if intro hasn't played yet ──────────
  useEffect(() => {
    if (launched) return;

    const add = (fn: () => void, ms: number) => {
      typingTimers.current.push(setTimeout(fn, ms));
    };

    // Reveal one character at a time with natural timing
    let t = 0;
    for (let i = 0; i < HEADLINE_STR.length; i++) {
      t += CHAR_DELAYS[i];
      const charIdx = i + 1;
      add(() => setTypedCount(charIdx), t);
    }

    // Hide cursor just before border-draw begins
    add(() => setShowCursor(false), CURSOR_HIDE_MS);

    return () => typingTimers.current.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Snap to full text when skipped or launched ──────────────────────────────
  useEffect(() => {
    if (launched || introSkipped) {
      // Cancel any pending typing timers
      typingTimers.current.forEach(clearTimeout);
      typingTimers.current = [];
      setTypedCount(HEADLINE_STR.length);
      setShowCursor(false);
    }
  }, [launched, introSkipped]);

  const displayText = HEADLINE_STR.slice(0, typedCount);

  // During the intro the overlay background is always #111111 (dark), so force
  // near-white text so it reads in light mode too.  Once launched the canvas
  // background fades in and we switch back to the theme token with a matching
  // transition so the colour change is invisible.
  const headlineColor      = launched ? "var(--shouf-text)" : "#F5F5F5";
  const headlineTransition = launched ? "color 700ms ease"  : "none";

  return (
    // Text column — centered in the canvas area.
    <div
      className="flex flex-col select-none"
      style={{ width: "min(590px, 100%)", gap: "2px", textAlign: "center" }}
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
            fontSize:   fontSize,
            fontWeight: 700,
            fontFamily: "var(--font-mono)",
            lineHeight: 1.2,
            color:      headlineColor,
            // Merge color transition with font-size transition after launch
            transition: launched
              ? "color 700ms ease, font-size 200ms ease"
              : "none",
            margin:     0,
            textWrap:   "balance",
          }}
          >
            {displayText}
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

          {/* Skip hint — visible only during typing, fades out */}
          <p
            style={{
              fontSize:      "12px",
              fontFamily:    "var(--font-mono)",
              letterSpacing: "0.04em",
              color:         "rgba(255,255,255,0.7)",
              margin:        0,
              opacity:       (!launched && !introSkipped && showCursor) ? 1 : 0,
              transition:    "opacity 400ms ease",
              pointerEvents: "none",
            }}
          >
            press any key to skip
          </p>

        </div>

      {/* Differentiator — elevated prominence */}
      <p
        style={{
          fontSize:      "13px",
          fontFamily:    "var(--font-mono)",
          fontWeight:    700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          lineHeight:    1.6,
          color:         "var(--shouf-accent)",
          margin:        0,
          opacity:       launched ? 1 : 0,
          transition:    launched ? "opacity 400ms ease 200ms" : "none",
        }}
      >
        You&apos;re inside a working design system — explore it live.
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

// ─── ComponentRenderer ───────────────────────────────────────────────────────

export function ComponentRenderer({ skipIntro = false }: { skipIntro?: boolean }) {
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
    selectedComponentId === "rc-guide"         ||
    selectedComponentId === "rc-case-study"   ||
    selectedComponentId === "rc-global-nav"    ||
    selectedComponentId === "eu-overview"     ||
    selectedComponentId === "pds-overview"    ||
    selectedComponentId === "especialty"      ||
    selectedComponentId === "ql-redesign"     ||
    selectedComponentId === "ql-user-profiles" ||
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
        // pointerEvents:none during intro so clicks pass through to the picker
        // panel inside IntroAnimation (z:50) without being intercepted here.
        zIndex:        launched ? undefined : 55,
        pointerEvents: launched ? undefined : "none",
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

      {/* Content layer */}
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
        {/* Welcome text — rendered in normal flex flow, centered by parent */}
        {showWelcome && <WelcomeCanvas />}

        {!showWelcome && !selectedComponentId && !selectedSectionId && <NoSelectionState />}

        {/* ── Section grid view ────────────────────────────────────────────── */}
        {/* Grid takes priority — individual component canvas is suppressed    */}
        {isGridCanvas && selectedSectionId === "work" && (
          <WorkIndexCanvas />
        )}
        {isGridCanvas && selectedSectionId !== "work" && (
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
        {!showWelcome && !isGridCanvas && selectedComponentId === "rc-guide" && (
          <RcGuideCanvas />
        )}
        {!showWelcome && !isGridCanvas && selectedComponentId === "rc-case-study" && (
          <RcCaseStudyCanvas />
        )}
        {!showWelcome && !isGridCanvas && selectedComponentId === "rc-global-nav" && (
          <RcGlobalNavCanvas />
        )}
        {!showWelcome && !isGridCanvas && selectedComponentId === "about" && (
          <AboutCanvas />
        )}
        {!showWelcome && !isGridCanvas && selectedComponentId === "eu-embedded" && (
          <EuCaseStudyCanvas />
        )}
        {!showWelcome && !isGridCanvas && selectedComponentId === "especialty" && (
          <EsCaseStudyCanvas />
        )}
        {!showWelcome && !isGridCanvas && selectedComponentId === "ql-redesign" && (
          <QlCaseStudyCanvas />
        )}
        {!showWelcome && !isGridCanvas && selectedComponentId === "ql-user-profiles" && (
          <QlUserProfilesCanvas />
        )}
        {!showWelcome && !isGridCanvas && selectedComponentId === "eu-overview" && (
          <EuOverviewCanvas />
        )}
        {!showWelcome && !isGridCanvas && selectedComponentId === "pds-overview" && (
          <PdsOverviewCanvas />
        )}

        {/* ── Registered components via LiveComponentCanvas ─────────────── */}
        {!showWelcome && !isGridCanvas && selectedComponentId &&
          selectedComponentId !== "pds-guide"        &&
          selectedComponentId !== "pds-color-tokens" &&
          selectedComponentId !== "pds-typography"   &&
          selectedComponentId !== "pds-spacing"      &&
          selectedComponentId !== "eu-guide"         &&
          selectedComponentId !== "eu-embedded"      &&
          selectedComponentId !== "rc-guide"         &&
          selectedComponentId !== "rc-case-study"   &&
          selectedComponentId !== "rc-global-nav"    &&
          selectedComponentId !== "eu-overview"     &&
          selectedComponentId !== "pds-overview"    &&
          selectedComponentId !== "especialty"      &&
          selectedComponentId !== "ql-redesign"     &&
          selectedComponentId !== "ql-user-profiles" &&
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
          selectedComponentId !== "rc-guide"         &&
          selectedComponentId !== "rc-case-study"   &&
          selectedComponentId !== "rc-global-nav"    &&
          selectedComponentId !== "eu-overview"     &&
          selectedComponentId !== "pds-overview"    &&
          selectedComponentId !== "especialty"      &&
          selectedComponentId !== "ql-redesign"     &&
          selectedComponentId !== "ql-user-profiles" &&
          selectedComponentId !== "about"            &&
          !isRegistered(selectedComponentId) && (
          <PlaceholderState componentId={selectedComponentId} />
        )}
      </div>
    </div>
  );
}
