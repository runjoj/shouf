"use client";

// ─── RolloutTimeline ─────────────────────────────────────────────────────────
// A simple phased timeline, drawn rather than screenshotted — the honest
// shape of a rollout constrained by a separate-repo API architecture.

import { ACCENT, HAIRLINE, INK, INK_FAINT, MONO } from "../tokens";

type Phase = { label: string; detail: string; status: "done" | "active" | "pending" };

const PHASES: Phase[] = [
  {
    label:  "Phase 1",
    detail: "Each page's side nav ships as its own page on mobile",
    status: "done",
  },
  {
    label:  "Phase 2",
    detail: "Foundational Fabric components ship behind a feature flag",
    status: "active",
  },
  {
    label:  "Phase 3",
    detail: "Responsive compliance becomes default · teams finish in Q3–Q4",
    status: "pending",
  },
];

function Node({ status }: { status: Phase["status"] }) {
  if (status === "done") {
    return <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: ACCENT }} />;
  }
  if (status === "active") {
    return (
      <div
        style={{
          width: "14px", height: "14px", borderRadius: "50%",
          border: `2px solid ${ACCENT}`, boxSizing: "border-box" as const,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: ACCENT }} />
      </div>
    );
  }
  return (
    <div style={{ width: "14px", height: "14px", borderRadius: "50%", border: `2px solid ${HAIRLINE}`, boxSizing: "border-box" as const }} />
  );
}

export function RolloutTimeline() {
  return (
    <div style={{ width: "100%", maxWidth: "1040px" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {PHASES.map((p, i) => (
          <div key={p.label} style={{ display: "flex", alignItems: "center", flex: i < PHASES.length - 1 ? 1 : "0 0 auto" }}>
            <Node status={p.status} />
            {i < PHASES.length - 1 && (
              <div style={{ flex: 1, height: "1.5px", background: HAIRLINE, marginLeft: "6px" }} />
            )}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", marginTop: "18px" }}>
        {PHASES.map((p, i) => (
          <div
            key={p.label}
            style={{
              flex:      i < PHASES.length - 1 ? 1 : "0 0 auto",
              maxWidth:  i < PHASES.length - 1 ? undefined : "280px",
              paddingRight: "24px",
              boxSizing: "border-box" as const,
            }}
          >
            <div
              style={{
                fontFamily:    MONO,
                fontSize:      "13px",
                fontWeight:    700,
                letterSpacing: "0.08em",
                textTransform: "uppercase" as const,
                color:         p.status === "pending" ? INK_FAINT : ACCENT,
                marginBottom:  "8px",
              }}
            >
              {p.label}
            </div>
            <div style={{ fontFamily: MONO, fontSize: "14px", lineHeight: 1.55, color: INK, maxWidth: "260px" }}>
              {p.detail}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
