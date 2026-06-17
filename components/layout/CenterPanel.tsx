"use client";

import type { CSSProperties } from "react";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAppStore } from "@/lib/store";
import { useTheme } from "@/lib/theme";
import { ComponentRenderer } from "@/components/canvas/ComponentRenderer";
import { ControlsBar } from "@/components/canvas/ControlsBar";
import { PdsToggle } from "@/components/ui/PdsToggle";
import { AccentPicker } from "@/components/ui/AccentPicker";
import { ACCENT_PRESETS } from "@/lib/accent";
import { isRegistered } from "@/lib/registry";

// ─── Zoom constants ────────────────────────────────────────────────────────────
const ZOOM_MIN  = 50;
const ZOOM_MAX  = 200;
const ZOOM_STEP = 10;

// ─── Toolbar element intro delays (ms after launch) ───────────────────────────
// Elements pop in left → right to reinforce the assembly narrative.
const D_NAV         = 100;
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
  const [mounted, setMounted] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const { theme, toggleTheme, accentId, setAccent } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef   = useRef<HTMLDivElement>(null);

  const currentPreset = ACCENT_PRESETS.find((p) => p.id === accentId) ?? ACCENT_PRESETS[0];

  // Portal needs to wait for client mount (createPortal into document.body)
  useEffect(() => { setMounted(true); }, []);

  // Measure the button on open so the portaled menu anchors under it
  useEffect(() => {
    if (!open) return;
    const update = () => {
      if (buttonRef.current) setAnchorRect(buttonRef.current.getBoundingClientRect());
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open]);

  // Close on outside click / escape
  useEffect(() => {
    if (!open) return;
    const handlePointer = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (buttonRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target))   return;
      setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("touchstart", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("touchstart", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  // Position the menu: right-aligned under the button, inset 8px from viewport edge.
  const MENU_W     = 240;
  const EDGE_INSET = 12;
  const menuTop  = anchorRect ? anchorRect.bottom + 10 : 0;
  const menuLeft = anchorRect
    ? Math.max(EDGE_INSET, Math.min(anchorRect.right - MENU_W, window.innerWidth - MENU_W - EDGE_INSET))
    : 0;

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setOpen((o) => !o)}
        title="Theme & accent"
        aria-haspopup="menu"
        aria-expanded={open}
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
          padding:         0,
        }}
      />

      {/* Dropdown portaled to body — escapes ancestor overflow:hidden clipping */}
      {mounted && open && anchorRect && createPortal(
        <div
          ref={menuRef}
          role="menu"
          style={{
            position:        "fixed",
            top:             menuTop,
            left:            menuLeft,
            width:           MENU_W,
            zIndex:          1000,
            backgroundColor: "var(--shouf-panel)",
            border:          "1px solid var(--shouf-border)",
            borderRadius:    12,
            padding:         "14px",
            boxShadow:       "0 12px 36px rgba(0,0,0,0.22)",
            animation:       "intro-reveal 160ms ease both",
          }}
        >
          {/* Theme toggle row */}
          <div
            style={{
              display:        "flex",
              alignItems:     "center",
              justifyContent: "space-between",
              gap:            12,
              marginBottom:   14,
              paddingBottom:  12,
              borderBottom:   "1px solid var(--shouf-border-sub)",
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

          {/* Accent label */}
          <div
            style={{
              fontSize:      11,
              color:         "var(--shouf-text-faint)",
              fontFamily:    "var(--font-mono)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom:  10,
            }}
          >
            --accent
          </div>

          {/* Accent list — labeled rows, easy to tap */}
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {ACCENT_PRESETS.map((preset) => {
              const selected = preset.id === accentId;
              return (
                <button
                  key={preset.id}
                  role="menuitemradio"
                  aria-checked={selected}
                  onClick={() => { setAccent(preset.id); setOpen(false); }}
                  style={{
                    display:        "flex",
                    alignItems:     "center",
                    gap:            12,
                    width:          "100%",
                    padding:        "8px 8px",
                    border:         "none",
                    background:     selected ? "var(--shouf-hover)" : "transparent",
                    borderRadius:   8,
                    cursor:         "pointer",
                    textAlign:      "left",
                    transition:     "background 120ms ease",
                  }}
                >
                  <span
                    style={{
                      width:           18,
                      height:          18,
                      borderRadius:    "50%",
                      backgroundColor: preset.hex,
                      flexShrink:      0,
                      outline:         selected ? `2px solid ${preset.hex}` : "2px solid transparent",
                      outlineOffset:   "2px",
                    }}
                  />
                  <span
                    style={{
                      fontSize:   13,
                      fontWeight: selected ? 600 : 500,
                      color:      selected ? "var(--shouf-text)" : "var(--shouf-text-muted)",
                      flex:       1,
                    }}
                  >
                    {preset.label}
                  </span>
                  {selected && (
                    <span
                      style={{
                        fontSize:   11,
                        color:      "var(--shouf-text-faint)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

// ─── Top-bar nav link ────────────────────────────────────────────────────────
// Horizontal nav links for Welcome / About / Work in the top bar.

function TopBarNavLink({
  label,
  isSelected,
  onClick,
}: {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="text-[14px] shrink-0 transition-colors"
      style={{
        background:    "none",
        border:        "none",
        padding:       "6px 12px",
        borderRadius:  "6px",
        cursor:        "pointer",
        fontWeight:    isSelected ? 600 : 500,
        color:         isSelected ? "var(--shouf-accent)" : "var(--shouf-text-muted)",
        backgroundColor: isSelected ? "var(--shouf-accent-sel)" : "transparent",
      }}
      onMouseEnter={(e) => {
        if (!isSelected)
          (e.currentTarget as HTMLElement).style.backgroundColor = "var(--shouf-hover)";
      }}
      onMouseLeave={(e) => {
        if (!isSelected)
          (e.currentTarget as HTMLElement).style.backgroundColor = isSelected ? "var(--shouf-accent-sel)" : "transparent";
      }}
    >
      {label}
    </button>
  );
}

// ─── Breadcrumb bar ──────────────────────────────────────────────────────────

function CanvasHeader({
  skipIntro = false,
}: {
  skipIntro?: boolean;
}) {
  const { selectedComponentId, selectedSectionId, launched, activeMobilePanel, setActiveMobilePanel, selectComponent, selectSection } = useAppStore();
  const { theme, toggleTheme } = useTheme();

  // Show inspect button only when the inspect panel has real content —
  // i.e. a registered component is selected (unregistered components show
  // a placeholder/skeleton, which isn't worth a dedicated mobile entry point).
  const showInspect =
    !!selectedComponentId &&
    selectedSectionId === null &&
    isRegistered(selectedComponentId);

  // Pages where left panel is hidden — show logo in top bar
  const NO_LEFT = ["rc-case-study", "eu-embedded", "especialty", "ql-redesign", "ql-user-profiles", "about", "work", "onboarding-flow", "project-artemis"];
  const isWorkSection = selectedSectionId === "work" && selectedComponentId === null;
  const showLogo = launched && (
    (!!selectedComponentId && NO_LEFT.includes(selectedComponentId)) || isWorkSection
  );

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

      {/* Logo — shown on far left when left panel is hidden (case studies, about, work) */}
      {showLogo && (
        <>
          <button
            onClick={() => { selectSection(null); selectComponent("welcome"); }}
            className="hidden lg:flex"
            style={{
              background:    "none",
              border:        "none",
              padding:       0,
              cursor:        "pointer",
              alignItems:    "center",
              flexShrink:    0,
            }}
            title="Back to Home"
          >
            <span className="text-[17px] font-bold" style={{ color: "var(--shouf-text)", fontFamily: "var(--font-manrope)", letterSpacing: "0.75px" }}>
              helloitsjo
            </span>
          </button>
          <div className="hidden lg:block w-px h-4" style={{ backgroundColor: "var(--shouf-border)" }} />
        </>
      )}

      {/* Navigation links — Welcome / About / Work */}
      <div className="flex items-center gap-1" style={introStyle(D_NAV, launched, skipIntro)}>
        <TopBarNavLink
          label="Home"
          isSelected={selectedComponentId === "welcome"}
          onClick={() => { selectSection(null); selectComponent("welcome"); }}
        />
        <TopBarNavLink
          label="About"
          isSelected={selectedComponentId === "about"}
          onClick={() => { selectSection(null); selectComponent("about"); }}
        />
        <TopBarNavLink
          label="Work"
          isSelected={isWorkSection}
          onClick={() => { selectComponent(null); selectSection("work"); }}
        />
      </div>

      {/* Spacer — pushes theme/accent controls to far right */}
      <div style={{ flex: 1 }} />

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

// Measured height of the controls bar (header ~32px + row ~54px + 1px border).
const CONTROLS_H = 100;

export function CenterPanel({ showControls = false, skipIntro = false }: { showControls?: boolean; skipIntro?: boolean }) {
  const [zoom, setZoom] = useState(100);
  const { launched } = useAppStore();

  const zoomIn  = () => setZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP));
  const zoomOut = () => setZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP));

  const scale = zoom / 100;

  // Toolbar and controls bar slide in on launch for the "system building itself" feel.
  // skipIntro (mobile) bypasses all intro animations.
  const toolbarIn  = launched || skipIntro;
  const controlsIn = launched || skipIntro;

  return (
    <main
      className="flex flex-col flex-1 h-full overflow-hidden"
      style={{ backgroundColor: "var(--shouf-bg)", minWidth: 0 }}
    >
      {/* Toolbar — slides down from above on launch.
          overflow:hidden is only needed during the slide-in animation (so the
          toolbar doesn't peek out above its slot). When skipIntro is true
          (mobile) the animation doesn't run, so we keep overflow visible —
          otherwise popovers like the mobile accent dropdown get clipped. */}
      <div style={{ flexShrink: 0, overflow: skipIntro ? "visible" : "hidden" }}>
        <div
          style={{
            transform:  toolbarIn ? "translateY(0)" : "translateY(-100%)",
            transition: skipIntro ? "none" : "transform 500ms cubic-bezier(0.25, 0, 0, 1) 150ms",
          }}
        >
          <CanvasHeader skipIntro={skipIntro} />
        </div>
      </div>

      {/* Canvas area */}
      <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, overflow: "auto" }}>
          <div style={{ zoom: scale, width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
            <ComponentRenderer skipIntro={skipIntro} />
          </div>
        </div>
      </div>

      {/* Controls bar — space reserved via maxHeight; content slides up on launch */}
      <div
        style={{
          maxHeight:  showControls ? CONTROLS_H : 0,
          overflow:   "hidden",
          flexShrink: 0,
          transition: "max-height 220ms cubic-bezier(0.25, 0, 0, 1)",
        }}
      >
        <div
          style={{
            transform:  controlsIn ? "translateY(0)" : "translateY(100%)",
            transition: skipIntro ? "none" : "transform 500ms cubic-bezier(0.25, 0, 0, 1) 300ms",
          }}
        >
          <ControlsBar zoom={zoom} onZoomIn={zoomIn} onZoomOut={zoomOut} />
        </div>
      </div>
    </main>
  );
}
