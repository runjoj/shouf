"use client";

// ─── RolloutTimeline ─────────────────────────────────────────────────────────
// A simple phased timeline, drawn rather than screenshotted — the honest
// shape of a rollout constrained by a separate-repo API architecture.

import { ACCENT, INK, INK_FAINT, MONO } from "../tokens";
import { ImageSlot } from "../ImageSlot";

type Phase = { label: string; detail: string; status: "done" | "active" | "pending" };

const PHASES: Phase[] = [
  {
    label:  "Phase 1",
    detail: "Mobile-only: interim solution with separate routes for the side navigation layer",
    status: "done",
  },
  {
    label:  "Phase 2",
    detail: "Mobile-only: separate panels within the global navigation",
    status: "active",
  },
  {
    label:  "Phase 3",
    detail: "Nested navigation on both desktop and mobile",
    status: "pending",
  },
];

// `images` aligns to phases by index — phase 1 gets images[0], phase 2 gets
// images[1], and phase 3 has none. Each phase is a column so the images line
// up directly under their phase text; a fixed-height text header keeps the
// image tops aligned even when the detail copy wraps to different lengths.
export function RolloutTimeline({ images = [] }: { images?: Array<{ src: string; alt: string }> } = {}) {
  return (
    <div style={{ width: "100%", maxWidth: "1300px", margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 0.8fr", columnGap: "36px", alignItems: "start" }}>
        {PHASES.map((p, i) => (
          <div key={p.label} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <div style={{ minHeight: "104px" }}>
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
              <div style={{ fontFamily: MONO, fontSize: "14px", lineHeight: 1.55, color: INK, maxWidth: "300px" }}>
                {p.detail}
              </div>
            </div>
            {images[i] && (
              <ImageSlot src={images[i].src} alt={images[i].alt} maxHeight="clamp(340px, 50vh, 620px)" framed={false} reserveSpace />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
