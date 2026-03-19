"use client";

import { useAppStore } from "@/lib/store";
import { SPACE_STEPS } from "@/components/portfolio-design-system/PdsSpacing/definition";

// ─── Stagger animation helper ─────────────────────────────────────────────────

function revealStyle(index: number) {
  return {
    animationName:           "intro-reveal",
    animationDuration:       "300ms",
    animationTimingFunction: "ease",
    animationFillMode:       "both",
    animationDelay:          `${index * 150}ms`,
  };
}

// ─── Scale row ────────────────────────────────────────────────────────────────

function ScaleRow({
  step,
  isActive,
  isSelected,
  index,
  onSelect,
}: {
  step:      typeof SPACE_STEPS[number];
  isActive:  boolean;
  isSelected: boolean;
  index:     number;
  onSelect:  () => void;
}) {
  return (
    <div
      onClick={onSelect}
      style={{
        ...revealStyle(index),
        display:       "flex",
        alignItems:    "center",
        gap:           "20px",
        padding:       "10px 0",
        borderBottom:  "1px solid var(--shouf-border-sub)",
        cursor:        "pointer",
        paddingLeft:   isSelected ? "12px" : "0",
        marginLeft:    isSelected ? "-12px" : "0",
        paddingRight:  isSelected ? "12px" : "0",
        marginRight:   isSelected ? "-12px" : "0",
        backgroundColor: isSelected ? "color-mix(in srgb, var(--shouf-accent) 6%, transparent)" : "transparent",
        transition:    "background-color 120ms ease, padding-left 120ms ease, margin-left 120ms ease",
      }}
    >
      {/* Token name */}
      <code
        style={{
          fontSize:   "12px",
          fontFamily: "var(--font-mono)",
          color:      "var(--shouf-text-faint)",
          minWidth:   "120px",
          flexShrink: 0,
          transition: "color 160ms ease",
        }}
      >
        {step.token}
      </code>

      {/* Visual block */}
      <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
        <div
          style={{
            width:           `${step.px}px`,
            height:          "20px",
            borderRadius:    "3px",
            backgroundColor: "var(--shouf-accent)",
            opacity:         isActive ? 0.7 : 0.25,
            border:          "1px solid var(--shouf-accent-ring)",
            transition:      "width 200ms ease, background-color 200ms ease, opacity 200ms ease",
            flexShrink:      0,
          }}
        />
      </div>

      {/* px value */}
      <code
        style={{
          fontSize:   "12px",
          fontFamily: "var(--font-mono)",
          color:      "var(--shouf-text-faint)",
          minWidth:   "32px",
          textAlign:  "right",
          flexShrink: 0,
          fontWeight: 400,
        }}
      >
        {step.px}px
      </code>
    </div>
  );
}

// ─── Demo card ────────────────────────────────────────────────────────────────

function DemoCard({
  padding,
  gap,
  borderRadius,
}: {
  padding:      number;
  gap:          number;
  borderRadius: number;
}) {
  return (
    <div
      style={{
        display:         "inline-flex",
        flexDirection:   "column",
        gap:             `${gap}px`,
        padding:         `${padding}px`,
        borderRadius:    `${borderRadius}px`,
        backgroundColor: "var(--shouf-panel)",
        border:          "1px solid var(--shouf-border)",
        boxShadow:       "0 2px 12px rgba(0,0,0,0.08)",
        maxWidth:        "280px",
        transition:      "gap 200ms ease, padding 200ms ease, border-radius 200ms ease",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width:           "32px",
          height:          "32px",
          borderRadius:    `${Math.max(4, borderRadius - 4)}px`,
          backgroundColor: "var(--shouf-accent-sel)",
          border:          "1px solid var(--shouf-accent-ring)",
          display:         "flex",
          alignItems:      "center",
          justifyContent:  "center",
          flexShrink:      0,
          transition:      "border-radius 200ms ease",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="1"   y="1"   width="5" height="5" rx="1" fill="var(--shouf-accent)" fillOpacity="0.9" />
          <rect x="8"   y="1"   width="5" height="5" rx="1" fill="var(--shouf-accent)" fillOpacity="0.5" />
          <rect x="1"   y="8"   width="5" height="5" rx="1" fill="var(--shouf-accent)" fillOpacity="0.5" />
          <rect x="8"   y="8"   width="5" height="5" rx="1" fill="var(--shouf-accent)" fillOpacity="0.75" />
        </svg>
      </div>

      {/* Text content */}
      <div style={{ display: "flex", flexDirection: "column", gap: `${Math.round(gap * 0.4)}px` }}>
        <div
          style={{
            fontSize:      "14px",
            fontWeight:    600,
            color:         "var(--shouf-text)",
            lineHeight:    1.2,
            letterSpacing: "-0.01em",
          }}
        >
          Design Token
        </div>
        <div
          style={{
            fontSize:   "12px",
            color:      "var(--shouf-text-muted)",
            lineHeight: 1.55,
          }}
        >
          Semantic values that bridge design decisions and production code.
        </div>
      </div>

      {/* Footer row */}
      <div
        style={{
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          paddingTop:     `${Math.round(gap * 0.6)}px`,
          borderTop:      "1px solid var(--shouf-border-sub)",
        }}
      >
        <code
          style={{
            fontSize:   "10px",
            fontFamily: "var(--font-mono)",
            color:      "var(--shouf-accent)",
            letterSpacing: "0.04em",
          }}
        >
          --shouf-space-{padding}
        </code>
        <div style={{ display: "flex", gap: "4px" }}>
          {[0.4, 0.65, 1].map((op, i) => (
            <div
              key={i}
              style={{
                width:           "6px",
                height:          "6px",
                borderRadius:    "50%",
                backgroundColor: "var(--shouf-accent)",
                opacity:         op,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SpacingCanvas ────────────────────────────────────────────────────────────

export function SpacingCanvas() {
  const { controlValues, setControlValue } = useAppStore();
  const values = controlValues["pds-spacing"] ?? {};

  const padding      = Number(values.padding      ?? 16);
  const gap          = Number(values.gap          ?? 12);
  const borderRadius = Number(values.borderRadius ?? 12);
  const selectedToken = (values.selectedToken as string) ?? "";

  // Rows that are actively used in the demo card
  const activeIds = new Set([String(padding), String(gap), String(borderRadius)]);

  function handleRowClick(id: string) {
    const next = selectedToken === id ? "" : id;
    setControlValue("pds-spacing", "selectedToken", next);
  }

  return (
    <div
      style={{
        alignSelf: "stretch",
        width:     "100%",
        overflowY: "auto",
        padding:   "52px 48px 80px",
      }}
    >
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>

        {/* ── Page header ─────────────────────────────────────────────────── */}
        <div style={{ marginBottom: "56px", ...revealStyle(0) }}>
          <h1
            style={{
              fontSize:      "22px",
              fontWeight:    600,
              color:         "var(--shouf-text)",
              margin:        "0 0 6px",
              letterSpacing: "-0.02em",
            }}
          >
            Spacing System
          </h1>
          <p
            style={{
              fontSize:   "14px",
              fontFamily: "var(--font-mono)",
              color:      "var(--shouf-text-faint)",
              margin:     0,
            }}
          >
            Shouf Design System — 4px base unit, nine steps
          </p>
        </div>

        {/* ── Scale ───────────────────────────────────────────────────────── */}
        <div style={{ marginBottom: "72px" }}>
          {SPACE_STEPS.map((step, index) => (
            <ScaleRow
              key={step.id}
              step={step}
              isActive={activeIds.has(step.id)}
              isSelected={selectedToken === step.id}
              index={index + 1}
              onSelect={() => handleRowClick(step.id)}
            />
          ))}
        </div>

        {/* ── Demo card ───────────────────────────────────────────────────── */}
        <div style={{ ...revealStyle(SPACE_STEPS.length + 2) }}>
          <div
            style={{
              fontSize:      "10px",
              fontFamily:    "var(--font-mono)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color:         "var(--shouf-text-faint)",
              marginBottom:  "24px",
              userSelect:    "none",
            }}
          >
            Live Demo — adjust via controls below
          </div>
          <DemoCard
            padding={padding}
            gap={gap}
            borderRadius={borderRadius}
          />
          <div
            style={{
              marginTop:  "20px",
              display:    "flex",
              gap:        "20px",
              flexWrap:   "wrap",
            }}
          >
            {[
              { label: "padding",  value: `${padding}px`,      token: `--shouf-space-${padding}`      },
              { label: "gap",      value: `${gap}px`,          token: `--shouf-space-${gap}`          },
              { label: "radius",   value: `${borderRadius}px`, token: `--shouf-space-${borderRadius}` },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                <code
                  style={{
                    fontSize:   "10px",
                    fontFamily: "var(--font-mono)",
                    color:      "var(--shouf-text-faint)",
                    letterSpacing: "0.04em",
                  }}
                >
                  {item.label}
                </code>
                <code
                  style={{
                    fontSize:   "12px",
                    fontFamily: "var(--font-mono)",
                    color:      "var(--shouf-accent)",
                  }}
                >
                  {item.value}
                </code>
                <code
                  style={{
                    fontSize:   "10px",
                    fontFamily: "var(--font-mono)",
                    color:      "var(--shouf-text-faint)",
                  }}
                >
                  {item.token}
                </code>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
