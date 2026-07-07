"use client";

// ─── ThemeContrastDiagram ───────────────────────────────────────────────────
// The expressive moment for the MCP case study. Rather than a screenshot,
// this draws the actual mechanism: three illustrative customer themes, each
// with the same two scale steps pinned to the same two roles. The hue
// changes per customer; the mapping — and the contrast it guarantees —
// does not.

import { HAIRLINE, INK_FAINT, MONO } from "../tokens";

// Four shades per theme — matches the real ThemeShades scale (100/300/500/900).
const RAMPS: { name: string; steps: string[] }[] = [
  { name: "orange1", steps: ["#F3E9DE", "#D3AE83", "#8C6339", "#3B2A16"] },
  { name: "cyan1",   steps: ["#E7F1F2", "#A9CBCF", "#557E83", "#1E3235"] },
  { name: "purple1", steps: ["#EDE9F2", "#BBA9D1", "#705C8C", "#2C2438"] },
];

const STEP_LABELS = ["100", "300", "500", "900"];

function Ramp({ name, steps }: { name: string; steps: string[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div
        style={{
          fontFamily:    MONO,
          fontSize:      "13px",
          fontWeight:    600,
          letterSpacing: "0.08em",
          textTransform: "uppercase" as const,
          color:         INK_FAINT,
        }}
      >
        {name}
      </div>
      <div style={{ display: "flex", gap: "6px" }}>
        {steps.map((hex, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
            <div
              style={{
                width:        "50px",
                height:       "50px",
                background:   hex,
                borderRadius: "4px",
                border:       `1px solid ${HAIRLINE}`,
                boxSizing:    "border-box" as const,
              }}
            />
            <div style={{ fontFamily: MONO, fontSize: "11px", color: INK_FAINT, fontWeight: 400 }}>
              {STEP_LABELS[i]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ThemeContrastDiagram() {
  return (
    <div style={{ display: "flex", gap: "48px", flexWrap: "wrap" as const }}>
      {RAMPS.map((r) => (
        <Ramp key={r.name} {...r} />
      ))}
    </div>
  );
}
