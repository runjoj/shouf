"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { LeftPanel } from "./LeftPanel";
import { CenterPanel } from "./CenterPanel";
import { RightPanel } from "./RightPanel";
import { IntroAnimation } from "./IntroAnimation";
import { AccordionNav } from "@/components/navigation/AccordionNav";
import { InspectPanel } from "@/components/inspect/InspectPanel";
import { WaterRippleCanvas } from "@/components/ui/WaterRippleCanvas";
import { WelcomeAnnotations } from "@/components/canvas/WelcomeAnnotations";

// ─── Close icon ───────────────────────────────────────────────────────────────

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ─── Mobile view ──────────────────────────────────────────────────────────────
// Canvas is always the base. Navigator and Inspect slide in as overlay drawers.

function MobileView() {
  const {
    activeMobilePanel,
    setActiveMobilePanel,
    selectedComponentId,
    selectedSectionId,
  } = useAppStore();

  const showControls =
    !!selectedComponentId &&
    !NO_PANELS.has(selectedComponentId) &&
    selectedSectionId === null;

  const overlayOpen = activeMobilePanel !== "canvas";

  // Auto-close navigator when a component is selected
  const prevSelectedRef = useRef(selectedComponentId);
  useEffect(() => {
    if (
      selectedComponentId !== prevSelectedRef.current &&
      activeMobilePanel === "navigator"
    ) {
      setActiveMobilePanel("canvas");
    }
    prevSelectedRef.current = selectedComponentId;
  }, [selectedComponentId, activeMobilePanel, setActiveMobilePanel]);

  const closeOverlay = () => setActiveMobilePanel("canvas");

  return (
    <div
      className="flex flex-col h-full lg:hidden relative overflow-hidden"
      style={{ backgroundColor: "var(--shouf-bg)" }}
    >
      {/* Canvas is always the base layer */}
      <div className="flex-1 overflow-hidden">
        <CenterPanel showControls={showControls} skipIntro />
      </div>

      {/* Backdrop — dims canvas when an overlay is open */}
      <div
        onClick={closeOverlay}
        style={{
          position:         "absolute",
          inset:            0,
          zIndex:           40,
          backgroundColor:  "rgba(0,0,0,0.35)",
          opacity:          overlayOpen ? 1 : 0,
          pointerEvents:    overlayOpen ? "auto" : "none",
          transition:       "opacity 280ms cubic-bezier(0.25,0,0,1)",
        }}
      />

      {/* ── Navigator drawer — slides in from left ──────────────────────────── */}
      <div
        style={{
          position:        "absolute",
          top:             0,
          left:            0,
          bottom:          0,
          width:           "82%",
          maxWidth:        "320px",
          zIndex:          50,
          display:         "flex",
          flexDirection:   "column",
          overflow:        "hidden",
          backgroundColor: "var(--shouf-panel)",
          borderRight:     "1px solid var(--shouf-border-sub)",
          transform:       activeMobilePanel === "navigator" ? "translateX(0)" : "translateX(-100%)",
          transition:      "transform 280ms cubic-bezier(0.25,0,0,1)",
        }}
      >
        <div
          className="shrink-0 px-4 h-[44px] flex items-center justify-between"
          style={{ borderBottom: "1px solid var(--shouf-border-sub)" }}
        >
          <span className="text-[13px] font-semibold" style={{ color: "var(--shouf-text)" }}>
            Components
          </span>
          <button
            onClick={closeOverlay}
            className="flex items-center justify-center w-7 h-7 rounded"
            style={{ color: "var(--shouf-text-muted)" }}
          >
            <CloseIcon />
          </button>
        </div>
        <AccordionNav />
      </div>

      {/* ── Inspect drawer — slides in from right ───────────────────────────── */}
      <div
        style={{
          position:        "absolute",
          top:             0,
          right:           0,
          bottom:          0,
          width:           "82%",
          maxWidth:        "320px",
          zIndex:          50,
          display:         "flex",
          flexDirection:   "column",
          overflow:        "hidden",
          backgroundColor: "var(--shouf-panel)",
          borderLeft:      "1px solid var(--shouf-border-sub)",
          transform:       activeMobilePanel === "inspect" ? "translateX(0)" : "translateX(100%)",
          transition:      "transform 280ms cubic-bezier(0.25,0,0,1)",
        }}
      >
        <div
          className="shrink-0 px-4 h-[44px] flex items-center justify-between"
          style={{ borderBottom: "1px solid var(--shouf-border-sub)" }}
        >
          <button
            onClick={closeOverlay}
            className="flex items-center justify-center w-7 h-7 rounded"
            style={{ color: "var(--shouf-text-muted)" }}
          >
            <CloseIcon />
          </button>
          <span className="text-[13px] font-semibold" style={{ color: "var(--shouf-text)" }}>
            Inspect
          </span>
        </div>
        <InspectPanel />
      </div>
    </div>
  );
}

// Pages that should NOT show controls/inspect panels (guides, landing, about).
const NO_PANELS = new Set(["about", "pds-guide", "pds-overview", "rc-guide", "rc-case-study", "eu-guide", "eu-overview", "eu-embedded", "especialty", "ql-redesign", "ql-user-profiles", "onboarding-flow", "project-artemis", "product-sandbox"]);

// Pages that hide the left nav — case studies, about, and work index.
const NO_LEFT_PANEL = new Set(["rc-case-study", "eu-embedded", "especialty", "ql-redesign", "ql-user-profiles", "about", "onboarding-flow", "project-artemis", "product-sandbox"]);

// ─── Desktop three-panel view ─────────────────────────────────────────────────

// Width of the right panel in px — must match RightPanel's own width style.
const RIGHT_PANEL_W = 250;

function DesktopView() {
  const { selectedComponentId, selectedSectionId, launched } = useAppStore();

  // Hide panels on landing/about/guide pages and section overview grids.
  const showPanels = !!selectedComponentId && !NO_PANELS.has(selectedComponentId) && selectedSectionId === null;

  // Hide left nav on case studies, about, and work pages.
  const hideLeftPanel =
    (!!selectedComponentId && NO_LEFT_PANEL.has(selectedComponentId)) ||
    (selectedSectionId === "work" && selectedComponentId === null);

  // Reserve right panel width before launch (prevents headline shift) and
  // whenever panels are active. Collapses smoothly on NO_PANELS pages.
  const rightPanelReserved = !launched || showPanels;

  return (
    <div
      className="hidden lg:flex h-full"
      style={{
        position:        "relative",
        overflow:        "hidden",
        backgroundColor: "var(--shouf-bg)",
      }}
    >
      {/* ── Left panel — space always in layout; content slides in on launch ─── */}
      <div
        style={{
          flexShrink: 0,
          overflow:   "hidden",
          width:      (launched && hideLeftPanel) ? 0 : 240,
          transition: "width 400ms cubic-bezier(0.25, 0, 0, 1)",
        }}
      >
        <div
          style={{
            height:     "100%",
            width:      240,
            transform:  (launched && !hideLeftPanel) ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 500ms cubic-bezier(0.25, 0, 0, 1) 50ms",
          }}
        >
          <LeftPanel />
        </div>
      </div>

      {/* ── Center panel ─────────────────────────────────────────────────────── */}
      {/* Reserve controls bar height even before launch to prevent vertical shift */}
      <CenterPanel showControls={showPanels || !launched} />

      {/* ── Right panel — reserves RIGHT_PANEL_W once launched so CenterPanel
           stays stable; content slides in/out with transform only. */}
      <div
        style={{
          width:      rightPanelReserved ? RIGHT_PANEL_W : 0,
          flexShrink: 0,
          overflow:   "hidden",
          transition: "width 500ms cubic-bezier(0.25, 0, 0, 1)",
        }}
      >
        <div
          style={{
            width:      RIGHT_PANEL_W,
            height:     "100%",
            transform:  showPanels ? "translateX(0)" : "translateX(100%)",
            transition: "transform 500ms cubic-bezier(0.25, 0, 0, 1) 250ms",
          }}
        >
          <RightPanel />
        </div>
      </div>

      {/* ── Welcome annotations — sketch arrows pointing at each shell region ──── */}
      {/* Appear 800ms after launch, staggered 300ms apart. pointer-events:none. */}
      {launched && selectedComponentId === "welcome" && <WelcomeAnnotations />}

      {/* ── Intro animation overlay ───────────────────────────────────────────── */}
      {/* Covers everything during typing + border-draw phase, then fades out.    */}
      <IntroAnimation />
    </div>
  );
}

// ─── AppShell ─────────────────────────────────────────────────────────────────

export function AppShell() {
  const router = useRouter();
  const { launch, launched } = useAppStore();

  // Skip the intro/typing screen entirely on mobile viewports (< lg breakpoint).
  // IntroAnimation's border-draw positions are hardcoded to desktop panel widths
  // and the typing animation inside WelcomeCanvas runs whenever !launched.
  // Calling launch() before paint on mobile jumps straight to the final state.
  useEffect(() => {
    if (launched) return;
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(max-width: 1023px)");
    if (mql.matches) launch();
  }, [launched, launch]);

  // Hidden entry into presentation mode: type the sequence "jojo" anywhere on
  // the portfolio. Chosen deliberately over a single chord (e.g. Cmd+/) because
  // recruiters were accidentally triggering the old shortcut and getting stuck
  // in fullscreen with no visible exit. A typed sequence is essentially
  // impossible to hit by accident — the buffer resets after 1.5s of idle and
  // is ignored when modifier keys are held or focus is in an editable element.
  useEffect(() => {
    const SEQ = "jojo";
    let buffer = "";
    let timer: ReturnType<typeof setTimeout> | null = null;

    function reset() {
      buffer = "";
      if (timer) { clearTimeout(timer); timer = null; }
    }

    function onKey(e: KeyboardEvent) {
      if (e.repeat) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      // Don't capture keys when the user is typing in an input field.
      const t = e.target as HTMLElement | null;
      const tag = t?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || t?.isContentEditable) return;

      // Single printable characters only — ignore Tab, Shift, arrows, etc.
      if (e.key.length !== 1) return;

      buffer = (buffer + e.key.toLowerCase()).slice(-SEQ.length);

      if (timer) clearTimeout(timer);
      timer = setTimeout(reset, 1500);

      if (buffer === SEQ) {
        e.preventDefault();
        reset();
        const el = document.documentElement;
        if (!document.fullscreenElement && el.requestFullscreen) {
          el.requestFullscreen().catch(() => { /* ignore — some browsers block */ });
        }
        // Mark the app as launched so the intro/typing screen is skipped
        // if the user later exits the presentation back to the portfolio.
        launch();
        router.push("/present");
      }
    }

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (timer) clearTimeout(timer);
    };
  }, [router, launch]);

  return (
    <div className="h-screen overflow-hidden">
      {/* Canvas ripple layer — fixed, full-screen, pointer-events: none.
          rAF loop draws an expanding elliptical radial gradient from the
          exact toolbar swatch position whenever an accent color is clicked. */}
      <WaterRippleCanvas />
      <DesktopView />
      <MobileView />
    </div>
  );
}
