"use client";

import { useAppStore } from "@/lib/store";
import { hasRenderer } from "@/lib/registry";
import { LeftPanel } from "./LeftPanel";
import { CenterPanel } from "./CenterPanel";
import { RightPanel } from "./RightPanel";
import { MobileTabBar } from "./MobileTabBar";
import { IntroAnimation } from "./IntroAnimation";
import { AccordionNav } from "@/components/navigation/AccordionNav";
import { InspectPanel } from "@/components/inspect/InspectPanel";
import { WaterRippleCanvas } from "@/components/ui/WaterRippleCanvas";

// ─── Mobile single-panel view ─────────────────────────────────────────────────

function MobileView() {
  const { activeMobilePanel } = useAppStore();

  return (
    <div className="flex flex-col h-full lg:hidden" style={{ backgroundColor: "var(--sh-bg)" }}>
      <MobileTabBar />

      <div className="flex-1 overflow-hidden">
        {activeMobilePanel === "navigator" && (
          <div
            className="flex flex-col h-full overflow-hidden"
            style={{ backgroundColor: "var(--sh-panel)" }}
          >
            <div
              className="shrink-0 px-4 h-[44px] flex items-center"
              style={{ borderBottom: "1px solid var(--sh-border-sub)" }}
            >
              <span className="text-[14px] font-semibold" style={{ color: "var(--sh-text)" }}>
                Components
              </span>
            </div>
            <AccordionNav />
          </div>
        )}

        {activeMobilePanel === "canvas" && <CenterPanel />}

        {activeMobilePanel === "inspect" && (
          <div
            className="flex flex-col h-full overflow-hidden"
            style={{ backgroundColor: "var(--sh-panel)" }}
          >
            <div
              className="shrink-0 px-4 h-[44px] flex items-center"
              style={{ borderBottom: "1px solid var(--sh-border-sub)" }}
            >
              <span className="text-[14px] font-semibold" style={{ color: "var(--sh-text)" }}>
                Inspect
              </span>
            </div>
            <InspectPanel />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Desktop three-panel view ─────────────────────────────────────────────────

// Width of the right panel in px — must match RightPanel's own width style.
const RIGHT_PANEL_W = 280;

function DesktopView() {
  const { selectedComponentId } = useAppStore();

  // Show the right panel and controls bar only for components that have an
  // interactive renderer. Welcome, About, and all guide pages are excluded.
  const showPanels = !!selectedComponentId && hasRenderer(selectedComponentId);

  return (
    <div
      className="hidden lg:flex h-full"
      style={{
        position:        "relative",
        overflow:        "hidden",
        backgroundColor: "var(--sh-bg)",
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
