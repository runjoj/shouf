"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "@/lib/store";
import { LeftPanel } from "./LeftPanel";
import { CenterPanel } from "./CenterPanel";
import { RightPanel } from "./RightPanel";
import { IntroAnimation } from "./IntroAnimation";
import { AccordionNav } from "@/components/navigation/AccordionNav";
import { InspectPanel } from "@/components/inspect/InspectPanel";
import { WaterRippleCanvas } from "@/components/ui/WaterRippleCanvas";

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
const NO_PANELS = new Set(["welcome", "about", "pds-guide", "rc-guide", "eu-guide", "eu-embedded", "pds-color-tokens"]);

// ─── Desktop three-panel view ─────────────────────────────────────────────────

// Width of the right panel in px — must match RightPanel's own width style.
const RIGHT_PANEL_W = 280;

function DesktopView() {
  const { selectedComponentId, selectedSectionId } = useAppStore();

  // Hide panels on landing/about/guide pages and section overview grids.
  const showPanels = !!selectedComponentId && !NO_PANELS.has(selectedComponentId) && selectedSectionId === null;

  return (
    <div
      className="hidden lg:flex h-full"
      style={{
        position:        "relative",
        overflow:        "hidden",
        backgroundColor: "var(--shouf-bg)",
      }}
    >
      {/* ── Left panel ───────────────────────────────────────────────────────── */}
      <LeftPanel />

      {/* ── Center panel ─────────────────────────────────────────────────────── */}
      <CenterPanel showControls={showPanels} />

      {/* ── Right panel — slides in from right when a controllable component
           is selected, slides back out when returning to a guide/welcome page. */}
      <div
        style={{
          width:      showPanels ? RIGHT_PANEL_W : 0,
          flexShrink: 0,
          overflow:   "hidden",
          transition: "width 300ms cubic-bezier(0.25, 0, 0, 1)",
        }}
      >
        <RightPanel />
      </div>

      {/* ── Intro animation overlay ───────────────────────────────────────────── */}
      {/* Covers everything during typing + border-draw phase, then fades out.    */}
      <IntroAnimation />
    </div>
  );
}

// ─── AppShell ─────────────────────────────────────────────────────────────────

export function AppShell() {
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
