"use client";

import type { CSSProperties } from "react";
import { useAppStore } from "@/lib/store";
import { useTheme } from "@/lib/theme";
import { navSections } from "@/data/navigation";
import { ComponentRenderer } from "@/components/canvas/ComponentRenderer";
import { ControlsBar } from "@/components/canvas/ControlsBar";
import { PdsToggle } from "@/components/ui/PdsToggle";
import { AccentPicker } from "@/components/ui/AccentPicker";

// ─── Toolbar element intro delays (ms after launch) ───────────────────────────
// Elements pop in left → right to reinforce the assembly narrative.
const D_ZOOM        = 100;
const D_BREADCRUMB  = 190;
const D_VIEWPORT    = 290;
const D_THEME       = 390;
const D_ACCENT_TOOL = 480;

function introStyle(delay: number, launched: boolean): CSSProperties {
  return {
    animationName:           "intro-reveal",
    animationDuration:       "200ms",
    animationTimingFunction: "ease",
    animationFillMode:       "both",
    animationDelay:          `${delay}ms`,
    animationPlayState:      launched ? "running" : "paused",
  };
}

// ─── Breadcrumb bar ──────────────────────────────────────────────────────────

function CanvasHeader() {
  const { selectedComponentId, selectedSectionId, launched } = useAppStore();
  const { theme, toggleTheme } = useTheme();

  // Resolve component entry + its owning section (relevant in both grid and solo views)
  const entry = selectedComponentId && selectedComponentId !== "welcome"
    ? navSections.flatMap((s) => s.entries).find((e) => e.id === selectedComponentId)
    : null;
  const entrySection = entry ? navSections.find((s) => s.id === entry.sectionId) : null;

  // Active grid section (may be set even when no component is selected)
  const gridSection = selectedSectionId
    ? navSections.find((s) => s.id === selectedSectionId)
    : null;

  // Breadcrumb resolution:
  //   grid + component selected  → "Section Title / Component Name"
  //   grid + nothing selected    → "Section Title"
  //   solo canvas with entry     → "Section Title / Component Name"
  //   welcome                    → "Welcome"
  //   fallback                   → "Canvas"
  const activeSection = gridSection ?? entrySection;

  return (
    <div
      className="shrink-0 flex items-center gap-3 px-4 h-[44px]"
      style={{ borderBottom: "1px solid var(--shouf-border-sub)", backgroundColor: "var(--shouf-panel)" }}
    >
      {/* Zoom controls */}
      <div className="flex items-center gap-1" style={introStyle(D_ZOOM, launched)}>
        <button
          className="flex items-center justify-center w-6 h-6 rounded transition-colors"
          style={{ color: "var(--shouf-text-muted)" }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--shouf-hover-str)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")
          }
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5h6M5 2v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <button
          className="flex items-center justify-center w-6 h-6 rounded transition-colors"
          style={{ color: "var(--shouf-text-muted)" }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--shouf-hover-str)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")
          }
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <span className="text-[12px] px-1.5 min-w-[40px] text-center" style={{ color: "var(--shouf-text-muted)" }}>
          100%
        </span>
      </div>

      {/* Divider */}
      <div className="w-px h-4" style={{ backgroundColor: "var(--shouf-border)", ...introStyle(D_ZOOM, launched) }} />

      {/* Breadcrumb */}
      <div
        className="flex items-center gap-1.5 text-[12px] flex-1 min-w-0"
        style={introStyle(D_BREADCRUMB, launched)}
      >
        {activeSection && entry ? (
          /* Section Name / Component Name */
          <>
            <span style={{ color: "var(--shouf-text-faint)" }}>{activeSection.title}</span>
            <span style={{ color: "var(--shouf-border)", fontSize: "12px" }}>/</span>
            <span className="font-medium truncate" style={{ color: "var(--shouf-text)" }}>
              {entry.name}
            </span>
          </>
        ) : activeSection ? (
          /* Grid view — section selected but no component yet */
          <span style={{ color: "var(--shouf-text-faint)" }}>{activeSection.title}</span>
        ) : selectedComponentId === "welcome" ? (
          <span style={{ color: "var(--shouf-text-faint)" }}>Welcome</span>
        ) : (
          <span style={{ color: "var(--shouf-text-faint)" }}>Canvas</span>
        )}
      </div>

      {/* Viewport controls */}
      <div className="flex items-center gap-1" style={introStyle(D_VIEWPORT, launched)}>
        {["Desktop", "Tablet", "Mobile"].map((label, i) => {
          const icons = [
            <path key="d" d="M2 3h12v8H2zM5 11v2M3 11h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />,
            <path key="t" d="M3 2h10v12H3zM3 9h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />,
            <rect key="m" x="4" y="1" width="8" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.2" />,
          ];
          return (
            <button
              key={label}
              title={label}
              className="flex items-center justify-center w-6 h-6 rounded transition-colors"
              style={{ color: i === 0 ? "var(--shouf-text-muted)" : "var(--shouf-text-faint)" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--shouf-hover-str)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")
              }
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                {icons[i]}
              </svg>
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div className="w-px h-4" style={{ backgroundColor: "var(--shouf-border)", ...introStyle(D_VIEWPORT, launched) }} />

      {/* Theme toggle */}
      <div className="flex items-center gap-2" style={introStyle(D_THEME, launched)}>
        <span
          className="font-mono select-none"
          style={{ fontSize: "12px", color: "var(--shouf-text-faint)", letterSpacing: "0.02em" }}
        >
          --mode:&nbsp;{theme}
        </span>
        <PdsToggle
          checked={theme === "dark"}
          onChange={() => toggleTheme()}
          size="sm"
          label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        />
      </div>

      {/* Divider */}
      <div className="w-px h-4" style={{ backgroundColor: "var(--shouf-border)", ...introStyle(D_THEME, launched) }} />

      {/* Accent color picker */}
      <div style={introStyle(D_ACCENT_TOOL, launched)}>
        <AccentPicker size="sm" />
      </div>
    </div>
  );
}

// ─── CenterPanel ─────────────────────────────────────────────────────────────
// showControls — true only when an interactive component (with a renderer) is
// selected. Controls bar slides up into view; slides back down for guide/welcome
// pages so the canvas can use the full height.

// Measured height of the controls bar (header ~32px + row ~50px + 1px border).
const CONTROLS_H = 88;

export function CenterPanel({ showControls = false }: { showControls?: boolean }) {
  return (
    <main
      className="flex flex-col flex-1 h-full overflow-hidden"
      style={{ backgroundColor: "var(--shouf-bg)", minWidth: 0 }}
    >
      <CanvasHeader />
      <ComponentRenderer />

      {/* Controls bar — slides up from the bottom when showControls becomes true */}
      <div
        style={{
          maxHeight:  showControls ? CONTROLS_H : 0,
          overflow:   "hidden",
          flexShrink: 0,
          transition: "max-height 300ms cubic-bezier(0.25, 0, 0, 1)",
        }}
      >
        <ControlsBar />
      </div>
    </main>
  );
}
