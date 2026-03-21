"use client";

import type { CSSProperties } from "react";
import { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { useTheme } from "@/lib/theme";
import { navSections } from "@/data/navigation";
import { ComponentRenderer } from "@/components/canvas/ComponentRenderer";
import { ControlsBar } from "@/components/canvas/ControlsBar";
import { PdsToggle } from "@/components/ui/PdsToggle";
import { AccentPicker } from "@/components/ui/AccentPicker";
import { ACCENT_PRESETS } from "@/lib/accent";

// ─── Zoom constants ────────────────────────────────────────────────────────────
const ZOOM_MIN  = 50;
const ZOOM_MAX  = 200;
const ZOOM_STEP = 10;

// ─── Toolbar element intro delays (ms after launch) ───────────────────────────
// Elements pop in left → right to reinforce the assembly narrative.
const D_ZOOM        = 100;
const D_BREADCRUMB  = 190;
const D_VIEWPORT    = 290;
const D_THEME       = 390;
const D_ACCENT_TOOL = 480;

function introStyle(delay: number, launched: boolean, skip = false): CSSProperties {
  if (skip) return {};
  return {
    animationName:           "intro-reveal",
    animationDuration:       "200ms",
    animationTimingFunction: "ease",
    animationFillMode:       "both",
    animationDelay:          `${delay}ms`,
    animationPlayState:      launched ? "running" : "paused",
  };
}

// ─── Mobile condensed theme + accent button ───────────────────────────────────

function MobileThemeButton() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme, accentId } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  const currentPreset = ACCENT_PRESETS.find((p) => p.id === accentId) ?? ACCENT_PRESETS[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={containerRef} style={{ position: "relative", flexShrink: 0 }}>
      {/* Accent circle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        title="Theme & accent"
        style={{
          width:           22,
          height:          22,
          borderRadius:    "50%",
          backgroundColor: currentPreset.hex,
          border:          "none",
          cursor:          "pointer",
          outline:         open ? `2px solid ${currentPreset.hex}` : "2px solid transparent",
          outlineOffset:   "2.5px",
          display:         "block",
          flexShrink:      0,
          transition:      "outline 120ms ease",
        }}
      />

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position:        "absolute",
            right:           0,
            top:             "calc(100% + 10px)",
            zIndex:          200,
            backgroundColor: "var(--shouf-panel)",
            border:          "1px solid var(--shouf-border)",
            borderRadius:    12,
            padding:         "12px",
            boxShadow:       "0 8px 32px rgba(0,0,0,0.18)",
            minWidth:        172,
          }}
        >
          {/* Theme toggle row */}
          <div
            style={{
              display:        "flex",
              alignItems:     "center",
              justifyContent: "space-between",
              gap:            12,
              marginBottom:   12,
            }}
          >
            <span
              style={{
                fontSize:      12,
                color:         "var(--shouf-text-muted)",
                fontFamily:    "var(--font-mono)",
                letterSpacing: "0.02em",
              }}
            >
              --mode: {theme}
            </span>
            <PdsToggle
              checked={theme === "dark"}
              onChange={() => toggleTheme()}
              size="sm"
              label="Toggle theme"
            />
          </div>
          {/* Accent swatches */}
          <AccentPicker size="sm" />
        </div>
      )}
    </div>
  );
}

// ─── Breadcrumb bar ──────────────────────────────────────────────────────────

function CanvasHeader({
  zoom,
  onZoomIn,
  onZoomOut,
  skipIntro = false,
}: {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  skipIntro?: boolean;
}) {
  const { selectedComponentId, selectedSectionId, launched, activeMobilePanel, setActiveMobilePanel } = useAppStore();
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

  // Show inspect button only when a component canvas is active
  const showInspect = !!selectedComponentId && !["welcome","about","pds-guide","rc-guide","eu-guide","eu-embedded","pds-color-tokens"].includes(selectedComponentId) && selectedSectionId === null;

  return (
    <div
      className="shrink-0 flex items-center gap-3 px-4 h-[44px]"
      style={{ borderBottom: "1px solid var(--shouf-border-sub)", backgroundColor: "var(--shouf-panel)" }}
    >
      {/* ── Mobile navigator button (hidden on desktop) ── */}
      <button
        className="flex lg:hidden items-center justify-center w-7 h-7 rounded shrink-0"
        onClick={() => setActiveMobilePanel("navigator")}
        title="Open navigator"
        style={{ color: activeMobilePanel === "navigator" ? "var(--shouf-accent)" : "var(--shouf-text-muted)" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--shouf-hover-str)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 4h12M2 8h12M2 12h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </button>

      {/* Zoom controls — hidden on mobile */}
      <div className="hidden sm:flex items-center gap-1" style={introStyle(D_ZOOM, launched, skipIntro)}>
        <button
          onClick={onZoomIn}
          disabled={zoom >= ZOOM_MAX}
          title="Zoom in"
          className="flex items-center justify-center w-6 h-6 rounded transition-colors"
          style={{ color: zoom >= ZOOM_MAX ? "var(--shouf-text-faint)" : "var(--shouf-text-muted)", cursor: zoom >= ZOOM_MAX ? "default" : "pointer" }}
          onMouseEnter={(e) => { if (zoom < ZOOM_MAX) (e.currentTarget as HTMLElement).style.backgroundColor = "var(--shouf-hover-str)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5h6M5 2v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <button
          onClick={onZoomOut}
          disabled={zoom <= ZOOM_MIN}
          title="Zoom out"
          className="flex items-center justify-center w-6 h-6 rounded transition-colors"
          style={{ color: zoom <= ZOOM_MIN ? "var(--shouf-text-faint)" : "var(--shouf-text-muted)", cursor: zoom <= ZOOM_MIN ? "default" : "pointer" }}
          onMouseEnter={(e) => { if (zoom > ZOOM_MIN) (e.currentTarget as HTMLElement).style.backgroundColor = "var(--shouf-hover-str)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <span className="text-[12px] px-1.5 min-w-[40px] text-center" style={{ color: "var(--shouf-text-muted)" }}>
          {zoom}%
        </span>
      </div>

      {/* Divider — hidden on mobile with zoom */}
      <div className="hidden sm:block w-px h-4" style={{ backgroundColor: "var(--shouf-border)", ...introStyle(D_ZOOM, launched, skipIntro) }} />

      {/* Breadcrumb */}
      <div
        className="flex items-center gap-1.5 text-[12px] flex-1 min-w-0"
        style={introStyle(D_BREADCRUMB, launched, skipIntro)}
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

      {/* Viewport controls — hidden on mobile */}
      <div className="hidden md:flex items-center gap-1" style={introStyle(D_VIEWPORT, launched, skipIntro)}>
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

      {/* Divider — hidden on mobile with viewport controls */}
      <div className="hidden md:block w-px h-4" style={{ backgroundColor: "var(--shouf-border)", ...introStyle(D_VIEWPORT, launched, skipIntro) }} />

      {/* Theme toggle — desktop only */}
      <div className="hidden lg:flex items-center gap-2" style={introStyle(D_THEME, launched, skipIntro)}>
        <span
          className="hidden md:inline font-mono select-none"
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

      {/* Divider — desktop only */}
      <div className="hidden lg:block w-px h-4" style={{ backgroundColor: "var(--shouf-border)", ...introStyle(D_THEME, launched, skipIntro) }} />

      {/* Accent color picker — desktop only */}
      <div className="hidden lg:block" style={introStyle(D_ACCENT_TOOL, launched, skipIntro)}>
        <AccentPicker size="sm" />
      </div>

      {/* ── Mobile right controls: inspect + condensed theme (hidden on desktop) ── */}
      <div className="flex lg:hidden items-center gap-2 shrink-0">
        {showInspect && (
          <button
            onClick={() => setActiveMobilePanel(activeMobilePanel === "inspect" ? "canvas" : "inspect")}
            className="flex items-center justify-center w-7 h-7 rounded"
            title="Open inspect"
            style={{ color: activeMobilePanel === "inspect" ? "var(--shouf-accent)" : "var(--shouf-text-muted)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--shouf-hover-str)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.3" />
              <path d="M2 6h12" stroke="currentColor" strokeWidth="1.3" />
              <path d="M7 6v8" stroke="currentColor" strokeWidth="1.3" />
              <path d="M4 9h1.5M4 12h1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              <path d="M9 9h3M9 12h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </button>
        )}
        <MobileThemeButton />
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

export function CenterPanel({ showControls = false, skipIntro = false }: { showControls?: boolean; skipIntro?: boolean }) {
  const [zoom, setZoom] = useState(100);

  const zoomIn  = () => setZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP));
  const zoomOut = () => setZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP));

  const scale = zoom / 100;

  return (
    <main
      className="flex flex-col flex-1 h-full overflow-hidden"
      style={{ backgroundColor: "var(--shouf-bg)", minWidth: 0 }}
    >
      <CanvasHeader zoom={zoom} onZoomIn={zoomIn} onZoomOut={zoomOut} skipIntro={skipIntro} />

      {/* Canvas area — two-layer approach:
          1. Outer: flex:1 block provides height; position:relative anchors inner.
          2. Inner: position:absolute inset:0 gives the scroll container an explicit
             pixel height so min-height:100% on the zoom wrapper always resolves.
          CSS zoom is layout-aware:
          - zoom > 1 → layout box grows beyond scroll viewport → scrolls ✓
          - zoom < 1 → layout box shrinks from top-left → no drift ✓
          flex column on zoom wrapper lets ComponentRenderer's flex:1 fill height,
          restoring vertical centering on Welcome and full-canvas stretch elsewhere. */}
      <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, overflow: "auto" }}>
          <div style={{ zoom: scale, width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
            <ComponentRenderer />
          </div>
        </div>
      </div>

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
