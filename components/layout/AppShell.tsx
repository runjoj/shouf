"use client";

import { useAppStore } from "@/lib/store";
import { LeftPanel } from "./LeftPanel";
import { CenterPanel } from "./CenterPanel";
import { RightPanel } from "./RightPanel";
import { MobileTabBar } from "./MobileTabBar";
import { IntroAnimation } from "./IntroAnimation";
import { AccentPicker } from "@/components/ui/AccentPicker";
import { AccordionNav } from "@/components/navigation/AccordionNav";
import { InspectPanel } from "@/components/inspect/InspectPanel";

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
              className="shrink-0 px-4 h-[42px] flex items-center"
              style={{ borderBottom: "1px solid var(--sh-border-sub)" }}
            >
              <span className="text-[12px] font-semibold" style={{ color: "var(--sh-text)" }}>
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
              className="shrink-0 px-4 h-[42px] flex items-center"
              style={{ borderBottom: "1px solid var(--sh-border-sub)" }}
            >
              <span className="text-[12px] font-semibold" style={{ color: "var(--sh-text)" }}>
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

function DesktopView() {
  const { launched } = useAppStore();

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
      <CenterPanel />

      {/* ── Right panel ──────────────────────────────────────────────────────── */}
      <RightPanel />

      {/* ── Intro animation overlay ───────────────────────────────────────────── */}
      {/* Covers everything during typing + border-draw phase, then fades out.    */}
      <IntroAnimation />

      {/* ── Accent color picker — bottom right, appears after intro ─────────── */}
      <div
        style={{
          position:      "absolute",
          bottom:        28,
          right:         16,
          zIndex:        10,
          display:       "flex",
          alignItems:    "center",
          gap:           "8px",
          opacity:       launched ? 1 : 0,
          transition:    "opacity 600ms ease",
          pointerEvents: launched ? "auto" : "none",
        }}
      >
        <span
          style={{
            fontSize:      "10px",
            fontFamily:    "ui-monospace, 'Cascadia Code', 'SF Mono', Menlo, Consolas, monospace",
            letterSpacing: "0.05em",
            color:         "var(--sh-text-faint)",
            userSelect:    "none",
          }}
        >
          --accent
        </span>
        <AccentPicker size="sm" />
      </div>
    </div>
  );
}

// ─── AppShell ─────────────────────────────────────────────────────────────────

export function AppShell() {
  return (
    <div className="h-screen overflow-hidden">
      <DesktopView />
      <MobileView />
    </div>
  );
}
