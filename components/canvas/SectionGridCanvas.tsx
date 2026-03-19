"use client";

// ─── SectionGridCanvas ───────────────────────────────────────────────────────
//
// Shows all components in a section as a live component showroom grid.
// Clicking a section header in the left nav navigates here instead of directly
// to an individual component canvas — the user browses first, then selects.
//
// Expressive moment: tiles cascade in with staggered reveals (index × 40ms),
// making the showroom feel like it's being uncovered one component at a time.
// The grid layout is CSS intrinsic (minmax 220px), so it responds to the
// available canvas width with no JS resize logic needed.

import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { navSections } from "@/data/navigation";
import { COMPONENT_RENDERERS, COMPONENT_REGISTRY } from "@/lib/registry";
import { ACCENT_PRESETS } from "@/lib/accent";
import type { ComponentEntry } from "@/lib/types";


// ─── Custom tile previews for full-canvas components ─────────────────────────
// Each is a self-contained mini snapshot that conveys what the full canvas does.

function ColorTokensPreview() {
  // Mirrors the three sections shown in ColorTokensCanvas:
  // Accent Presets → Background tokens → Text tokens
  const label = (text: string) => (
    <div style={{
      fontSize: "7px", fontFamily: "var(--font-mono)",
      color: "var(--shouf-text-faint)", letterSpacing: "0.12em",
      textTransform: "uppercase" as const, marginBottom: "5px",
      userSelect: "none" as const,
    }}>
      {text}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", maxWidth: "192px" }}>
      {/* Accent Presets — the actual 6 preset hex values, as circles */}
      <div>
        {label("Accent Presets")}
        <div style={{ display: "flex", gap: "5px" }}>
          {ACCENT_PRESETS.map((p) => (
            <div
              key={p.id}
              style={{
                width: "20px", height: "20px", borderRadius: "50%",
                backgroundColor: p.hex, flexShrink: 0,
                boxShadow: `0 2px 6px ${p.hex}55`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Section divider */}
      <div style={{ height: "1px", backgroundColor: "var(--shouf-border-sub)" }} />

      {/* Background surface tokens — bordered so near-white swatches register */}
      <div>
        {label("Background")}
        <div style={{ display: "flex", gap: "4px" }}>
          {["--shouf-bg", "--shouf-canvas", "--shouf-panel", "--shouf-panel-alt"].map((v) => (
            <div key={v} style={{ flex: 1, height: "20px", borderRadius: "4px", backgroundColor: `var(${v})`, border: "1px solid var(--shouf-border)" }} />
          ))}
        </div>
      </div>

      {/* Text tokens */}
      <div>
        {label("Text")}
        <div style={{ display: "flex", gap: "4px" }}>
          {["--shouf-text", "--shouf-text-muted", "--shouf-text-faint"].map((v) => (
            <div key={v} style={{ flex: 1, height: "20px", borderRadius: "4px", backgroundColor: `var(${v})` }} />
          ))}
          {/* Spacer to align with 4-col rows */}
          <div style={{ flex: 1 }} />
        </div>
      </div>
    </div>
  );
}

function TypographyPreview() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%", maxWidth: "180px", userSelect: "none" }}>
      <div style={{ fontSize: "22px", fontWeight: 600, lineHeight: 1.1, color: "var(--shouf-text)", letterSpacing: "-0.025em" }}>Display</div>
      <div style={{ fontSize: "15px", fontWeight: 500, lineHeight: 1.25, color: "var(--shouf-text)", letterSpacing: "-0.01em" }}>Heading</div>
      <div style={{ fontSize: "11px", fontWeight: 400, lineHeight: 1.55, color: "var(--shouf-text-muted)" }}>Body — regular weight</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--shouf-text-faint)", letterSpacing: "0.03em", marginTop: "1px" }}>
        --font-mono · 400
      </div>
    </div>
  );
}

function SpacingPreview() {
  const scale = [4, 8, 12, 16, 24, 32];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%", maxWidth: "180px" }}>
      {scale.map((px) => (
        <div key={px} style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <div style={{
            width: "18px", flexShrink: 0, textAlign: "right",
            fontFamily: "var(--font-mono)", fontSize: "8px",
            color: "var(--shouf-text-faint)", lineHeight: 1,
          }}>
            {px}
          </div>
          <div style={{
            height: "6px", borderRadius: "3px",
            backgroundColor: "var(--shouf-accent)",
            opacity: 0.55 + (px / 32) * 0.4,
            width: `${px * 2.8}px`,
          }} />
        </div>
      ))}
    </div>
  );
}

function GuidePreview() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%", maxWidth: "160px" }}>
      {/* Title line */}
      <div style={{ height: "9px", borderRadius: "3px", backgroundColor: "var(--shouf-skeleton)", width: "60%" }} />
      {/* Body paragraph */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {[95, 88, 78, 90, 60].map((w, i) => (
          <div key={i} style={{ height: "4px", borderRadius: "2px", backgroundColor: "var(--shouf-skeleton-alt)", width: `${w}%` }} />
        ))}
      </div>
      {/* Sub-heading */}
      <div style={{ height: "7px", borderRadius: "3px", backgroundColor: "var(--shouf-skeleton)", width: "45%", marginTop: "2px" }} />
      {/* Second paragraph */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {[82, 95, 70].map((w, i) => (
          <div key={i} style={{ height: "4px", borderRadius: "2px", backgroundColor: "var(--shouf-skeleton-alt)", width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}

function GlobalNavPreview() {
  // Uses the actual BambooHR palette from RcGlobalNavCanvas (C object)
  const NAV_BG      = "#FFFFFF";
  const BORDER      = "#E5E7EB";
  const ACTIVE_BG   = "#F5F4F1";
  const ACTIVE_GRN  = "#3D7A30";  // BambooHR green
  const NAV_ICON    = "#9CA3AF";
  const CONTENT_BG  = "#F0EFEB";
  const ASK_BG      = "#3D7A30";

  // 7 nav items — index 1 is active (Reports), matching the canvas default
  const items = [0, 1, 2, 3, 4, 5, 6];

  return (
    <div style={{ width: "100%", maxWidth: "200px", userSelect: "none" }}>
      {/* Browser frame */}
      <div style={{
        borderRadius: "8px",
        border: "1px solid var(--shouf-border)",
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
      }}>
        {/* Browser chrome */}
        <div style={{
          height: "15px", backgroundColor: "#F3F4F6",
          borderBottom: `1px solid ${BORDER}`,
          display: "flex", alignItems: "center", padding: "0 7px", gap: "3px",
        }}>
          {["#FF5F57", "#FFBD2E", "#28CA42"].map((c, i) => (
            <div key={i} style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: c }} />
          ))}
        </div>

        {/* App shell */}
        <div style={{ display: "flex", height: "94px" }}>

          {/* Sidebar — white, 36px wide, matching the collapsed desktop sidebar */}
          <div style={{
            width: "36px", flexShrink: 0,
            backgroundColor: NAV_BG,
            borderRight: `1px solid ${BORDER}`,
            display: "flex", flexDirection: "column",
            alignItems: "center",
            padding: "5px 0",
          }}>
            {/* Logo — bamboo leaf shape approximated */}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginBottom: "5px" }}>
              <path d="M7 13C7 9 3 7 3 4.5C3 2.8 4.8 2 7 2C9.2 2 11 2.8 11 4.5C11 7 7 9 7 13Z" fill={ACTIVE_GRN} />
            </svg>

            {/* Nav icon buttons — each is a small rounded rect icon placeholder */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1, width: "100%", alignItems: "center" }}>
              {items.map((_, i) => {
                const isActive = i === 1;
                return (
                  <div key={i} style={{
                    width: "28px", height: "16px", borderRadius: "3px",
                    backgroundColor: isActive ? ACTIVE_BG : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <div style={{
                      width: "10px", height: "7px", borderRadius: "1.5px",
                      backgroundColor: isActive ? ACTIVE_GRN : NAV_ICON,
                      opacity: isActive ? 1 : 0.55,
                    }} />
                  </div>
                );
              })}
            </div>

            {/* "Ask" button at bottom */}
            <div style={{
              width: "28px", height: "14px", borderRadius: "3px",
              backgroundColor: ASK_BG,
              display: "flex", alignItems: "center", justifyContent: "center",
              marginTop: "3px",
            }}>
              <div style={{ width: "8px", height: "5px", borderRadius: "1px", backgroundColor: "rgba(255,255,255,0.9)" }} />
            </div>
          </div>

          {/* Right: header + content */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: NAV_BG }}>
            {/* Header */}
            <div style={{
              height: "24px", flexShrink: 0,
              borderBottom: `1px solid ${BORDER}`,
              display: "flex", alignItems: "center",
              padding: "0 7px", gap: "5px",
            }}>
              <div style={{
                flex: 1, height: "12px", borderRadius: "3px",
                backgroundColor: "#F9FAFB", border: `1px solid ${BORDER}`,
              }} />
              <div style={{ width: "14px", height: "14px", borderRadius: "50%", backgroundColor: "#D1D5DB", flexShrink: 0 }} />
            </div>

            {/* Content area */}
            <div style={{ flex: 1, backgroundColor: CONTENT_BG, padding: "6px 8px", display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ height: "5px", borderRadius: "2px", backgroundColor: "rgba(0,0,0,0.14)", width: "58%" }} />
              <div style={{ height: "4px", borderRadius: "2px", backgroundColor: "rgba(0,0,0,0.08)", width: "42%" }} />
              <div style={{ height: "4px", borderRadius: "2px", backgroundColor: "rgba(0,0,0,0.08)", width: "52%" }} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── Custom preview lookup ────────────────────────────────────────────────────

const CUSTOM_TILE_PREVIEWS: Record<string, () => React.ReactElement> = {
  "pds-guide":        GuidePreview,
  "pds-color-tokens": ColorTokensPreview,
  "pds-typography":   TypographyPreview,
  "pds-spacing":      SpacingPreview,
  "rc-guide":         GuidePreview,
  "rc-global-nav":    GlobalNavPreview,
  "eu-guide":         GuidePreview,
};

// ─── Placeholder preview (unregistered components without a custom preview) ───

function PlaceholderPreview() {
  return (
    <div
      style={{
        display:       "flex",
        flexDirection: "column",
        alignItems:    "flex-start",
        gap:           "6px",
        width:         "100%",
        maxWidth:      "160px",
        opacity:       0.35,
      }}
    >
      <div style={{ height: "8px",  width: "75%", borderRadius: "3px", backgroundColor: "var(--shouf-skeleton)" }} />
      <div style={{ height: "6px",  width: "55%", borderRadius: "3px", backgroundColor: "var(--shouf-skeleton-alt)" }} />
      <div style={{ height: "6px",  width: "65%", borderRadius: "3px", backgroundColor: "var(--shouf-skeleton-alt)" }} />
      <div style={{ marginTop: "6px", height: "26px", width: "80px", borderRadius: "5px", backgroundColor: "var(--shouf-skeleton)" }} />
    </div>
  );
}

// ─── Component tile ───────────────────────────────────────────────────────────

type TileProps = {
  entry:      ComponentEntry;
  isSelected: boolean;
  tileIndex:  number;
  onClick:    () => void;
};

function ComponentTile({ entry, isSelected, tileIndex, onClick }: TileProps) {
  const { controlValues } = useAppStore();
  const [isHovered, setIsHovered] = useState(false);

  const renderer      = COMPONENT_RENDERERS[entry.id];
  const CustomPreview = CUSTOM_TILE_PREVIEWS[entry.id];
  // Use current control values when available, fall back to registry defaults.
  const values        = controlValues[entry.id] ?? COMPONENT_REGISTRY[entry.id]?.defaultValues ?? {};

  const borderColor = isSelected
    ? "var(--shouf-accent)"
    : isHovered
      ? "var(--shouf-border)"
      : "var(--shouf-border-sub)";

  const bgColor = isSelected
    ? "var(--shouf-accent-sel)"
    : isHovered
      ? "var(--shouf-hover)"
      : "transparent";

  const labelColor = isSelected ? "var(--shouf-accent)" : "var(--shouf-text-faint)";

  const nameSeparatorColor = isSelected
    ? "var(--shouf-accent-ring)"
    : "var(--shouf-border-sub)";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick(); }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        border:        `1px solid ${borderColor}`,
        borderRadius:  "10px",
        backgroundColor: bgColor,
        cursor:        "pointer",
        display:       "flex",
        flexDirection: "column",
        overflow:      "hidden",
        transition:    "background-color 150ms ease, border-color 150ms ease",
        // Expressive craft: staggered cascade reveal as tiles enter the showroom
        animationName:           "intro-reveal",
        animationDuration:       "280ms",
        animationTimingFunction: "ease",
        animationFillMode:       "both",
        animationDelay:          `${tileIndex * 45}ms`,
      }}
    >
      {/* Live component preview — pointer-events:none so tile owns the click */}
      <div
        style={{
          flex:            1,
          minHeight:       "120px",
          display:         "flex",
          alignItems:      "center",
          justifyContent:  "center",
          padding:         "28px 24px 20px",
          pointerEvents:   "none",
          userSelect:      "none",
        }}
      >
        {renderer
          ? renderer(values)
          : CustomPreview
            ? <CustomPreview />
            : <PlaceholderPreview />}
      </div>

      {/* Component name label */}
      <div
        style={{
          padding:      "9px 14px 11px",
          borderTop:    `1px solid ${nameSeparatorColor}`,
          display:      "flex",
          alignItems:   "center",
          gap:          "6px",
          transition:   "border-color 150ms ease",
        }}
      >
        <span
          style={{
            fontFamily:    "var(--font-mono)",
            fontSize:      "12px",
            color:         labelColor,
            transition:    "color 150ms ease",
            whiteSpace:    "nowrap",
            overflow:      "hidden",
            textOverflow:  "ellipsis",
          }}
        >
          {entry.name}
        </span>

        {/* "placeholder" badge for unregistered components */}
        {!renderer && (
          <span
            style={{
              marginLeft:    "auto",
              fontFamily:    "var(--font-mono)",
              fontSize:      "10px",
              color:         "var(--shouf-text-faint)",
              opacity:       0.5,
              flexShrink:    0,
            }}
          >
            soon
          </span>
        )}
      </div>
    </div>
  );
}

// ─── SectionGridCanvas ────────────────────────────────────────────────────────

export function SectionGridCanvas({ sectionId }: { sectionId: string }) {
  const { selectedComponentId, selectComponent } = useAppStore();
  const section = navSections.find((s) => s.id === sectionId);

  if (!section) return null;

  const registeredCount   = section.entries.filter((e) => e.id in COMPONENT_REGISTRY).length;
  const placeholderCount  = section.entries.length - registeredCount;

  return (
    <div
      style={{
        width:     "100%",
        height:    "100%",
        overflowY: "auto",
        padding:   "32px 32px 48px",
      }}
    >
      {/* Section header */}
      <div style={{ marginBottom: "28px" }}>
        <h2
          style={{
            fontSize:      "12px",
            fontFamily:    "var(--font-mono)",
            fontWeight:    600,
            color:         "var(--shouf-text-muted)",
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            margin:        0,
          }}
        >
          {section.title}
        </h2>
        <p
          style={{
            fontSize:  "12px",
            color:     "var(--shouf-text-faint)",
            margin:    "6px 0 0",
            fontFamily: "var(--font-mono)",
          }}
        >
          {registeredCount} live
          {placeholderCount > 0 && ` · ${placeholderCount} coming soon`}
          {" — click any tile to inspect"}
        </p>
      </div>

      {/* Responsive component grid — CSS intrinsic sizing, no JS breakpoints */}
      <div
        style={{
          display:               "grid",
          gridTemplateColumns:   "repeat(auto-fill, minmax(220px, 1fr))",
          gap:                   "14px",
        }}
      >
        {section.entries.map((entry, i) => (
          <ComponentTile
            key={entry.id}
            entry={entry}
            isSelected={selectedComponentId === entry.id}
            tileIndex={i}
            onClick={() => selectComponent(entry.id)}
          />
        ))}
      </div>
    </div>
  );
}
