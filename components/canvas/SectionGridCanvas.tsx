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

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { navSections } from "@/data/navigation";
import { COMPONENT_RENDERERS, COMPONENT_REGISTRY } from "@/lib/registry";
import type { ComponentEntry } from "@/lib/types";

const MONO = "ui-monospace, 'Cascadia Code', 'SF Mono', Menlo, Consolas, monospace";

// ─── Placeholder preview (unregistered components) ───────────────────────────
// Renders a skeleton mock so every tile has visual presence even for placeholders.

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
      <div style={{ height: "8px",  width: "75%", borderRadius: "3px", backgroundColor: "var(--sh-skeleton)" }} />
      <div style={{ height: "6px",  width: "55%", borderRadius: "3px", backgroundColor: "var(--sh-skeleton-alt)" }} />
      <div style={{ height: "6px",  width: "65%", borderRadius: "3px", backgroundColor: "var(--sh-skeleton-alt)" }} />
      <div style={{ marginTop: "6px", height: "26px", width: "80px", borderRadius: "5px", backgroundColor: "var(--sh-skeleton)" }} />
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

  const renderer = COMPONENT_RENDERERS[entry.id];
  // Use current control values when available, fall back to registry defaults.
  const values   = controlValues[entry.id] ?? COMPONENT_REGISTRY[entry.id]?.defaultValues ?? {};

  const borderColor = isSelected
    ? "var(--sh-accent)"
    : isHovered
      ? "var(--sh-border)"
      : "var(--sh-border-sub)";

  const bgColor = isSelected
    ? "var(--sh-accent-sel)"
    : isHovered
      ? "var(--sh-hover)"
      : "transparent";

  const labelColor = isSelected ? "var(--sh-accent)" : "var(--sh-text-faint)";

  const nameSeparatorColor = isSelected
    ? "var(--sh-accent-ring)"
    : "var(--sh-border-sub)";

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
        {renderer ? renderer(values) : <PlaceholderPreview />}
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
            fontFamily:    MONO,
            fontSize:      "11px",
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
              fontFamily:    MONO,
              fontSize:      "9px",
              color:         "var(--sh-text-faint)",
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
            fontSize:      "11px",
            fontFamily:    MONO,
            fontWeight:    600,
            color:         "var(--sh-text-muted)",
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            margin:        0,
          }}
        >
          {section.title}
        </h2>
        <p
          style={{
            fontSize:  "11px",
            color:     "var(--sh-text-faint)",
            margin:    "6px 0 0",
            fontFamily: MONO,
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
