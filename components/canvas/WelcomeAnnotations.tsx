"use client";

import { useEffect, useState } from "react";

// ─── Layout constants — mirror AppShell / IntroAnimation panel widths ─────────
const LEFT_W = 260;

// ─── Animation timing (ms from launch) ───────────────────────────────────────
const BASE_DELAY  = 800;  // first annotation starts this long after launched=true
const STAGGER     = 300;  // additional ms between each annotation
const ARROW_DUR   = 400;  // ms for the arrow path stroke-dashoffset draw-on
const LABEL_AFTER = 200;  // label fades in this many ms after arrow draw starts

// ─── Annotation definitions ───────────────────────────────────────────────────
// Five sketch-style annotations pointing at each major shell region.
// Coordinates designed for ~1280px viewport; legible at any desktop width ≥1024.
// "svgFirst" = SVG arrow appears before the label text in DOM order.
// "direction" = flex-direction of the container.

type AnnotationDef = {
  id:           string;
  label:        string;
  svgFirst:     boolean;
  direction:    "row" | "column";
  alignItems:   "center" | "flex-start" | "flex-end";
  containerPos: React.CSSProperties; // position + left/right/top/bottom only
  svgW:         number;
  svgH:         number;
  arrowPath:    string;  // cubic-bezier from near-label end → target direction
  tipPoints:    string;  // polyline for open arrowhead at the target end
};

const ANNOTATIONS: AnnotationDef[] = [
  {
    // Arrow curves from inside canvas leftward into the nav accordion items
    id:           "nav",
    label:        "start exploring here",
    svgFirst:     true,
    direction:    "row",
    alignItems:   "center",
    containerPos: { position: "absolute", left: LEFT_W - 38, top: 118 },
    svgW: 96, svgH: 36,
    arrowPath:  "M 92 18 C 68 16 40 10 4 18",
    tipPoints:  "14,10 4,18 14,26",
  },
  {
    // Arrow rises nearly vertically from just below the toolbar up to the accent
    // color picker. svgFirst puts the SVG above the label; top:46 places the
    // whole unit just below the toolbar bottom edge so the tip doesn't overlap
    // the swatches — it points AT them from below.
    id:           "accent",
    label:        "make it yours",
    svgFirst:     true,
    direction:    "column",
    alignItems:   "flex-end",
    containerPos: { position: "absolute", right: 316, top: 46 },
    svgW: 24, svgH: 64,
    arrowPath:  "M 18 60 C 16 44 20 26 20 4",
    tipPoints:  "12,14 20,4 26,14",
  },
  {
    // Same pattern — nearly vertical arrow pointing up at the --mode toggle.
    // Positioned left of the accent annotation so it lands near the toggle.
    id:           "mode",
    label:        "try flipping this",
    svgFirst:     true,
    direction:    "column",
    alignItems:   "flex-end",
    containerPos: { position: "absolute", right: 520, top: 46 },
    svgW: 24, svgH: 64,
    arrowPath:  "M 18 60 C 20 44 16 26 18 4",
    tipPoints:  "10,14 18,4 24,14",
  },
  {
    // Arrow curves from inside canvas rightward into the right inspect panel
    id:           "inspect",
    label:        "tokens update\nlive here",
    svgFirst:     false,
    direction:    "row",
    alignItems:   "center",
    containerPos: { position: "absolute", right: 272, top: 250 },
    svgW: 56, svgH: 36,
    arrowPath:  "M 4 18 C 18 16 38 14 52 18",
    tipPoints:  "42,10 52,18 42,26",
  },
  {
    // Arrow points downward from canvas into the bottom controls bar
    id:           "controls",
    label:        "play with the controls",
    svgFirst:     false,
    direction:    "column",
    alignItems:   "flex-start",
    containerPos: { position: "absolute", bottom: 102, left: `calc(${LEFT_W}px + 4%)` },
    svgW: 38, svgH: 68,
    arrowPath:  "M 19 4 C 16 22 14 46 16 64",
    tipPoints:  "8,54 16,64 24,54",
  },
];

// ─── Single annotation ────────────────────────────────────────────────────────

function Annot({
  def,
  index,
  reducedMotion,
}: {
  def:           AnnotationDef;
  index:         number;
  reducedMotion: boolean;
}) {
  const arrowDelay = BASE_DELAY + (reducedMotion ? 0 : index * STAGGER);
  const labelDelay = arrowDelay + (reducedMotion ? 0 : LABEL_AFTER);
  const tipDelay   = arrowDelay + (reducedMotion ? 0 : Math.round(ARROW_DUR * 0.75));

  // animation-fill-mode:"both" handles initial opacity:0 / dashoffset:1 via
  // the keyframe "from" state — do NOT set these inline (inline styles override
  // animation values in CSS specificity and would prevent them from animating).
  const arrowStyle: React.CSSProperties = reducedMotion
    ? { strokeDasharray: 1 }
    : {
        strokeDasharray:         1,
        animationName:           "annotation-arrow-draw",
        animationDuration:       `${ARROW_DUR}ms`,
        animationTimingFunction: "ease-out",
        animationFillMode:       "both",
        animationDelay:          `${arrowDelay}ms`,
      };

  const fadeStyle = (delay: number): React.CSSProperties =>
    reducedMotion
      ? {}
      : {
          animationName:           "annotation-label-fade",
          animationDuration:       "300ms",
          animationTimingFunction: "ease-out",
          animationFillMode:       "both",
          animationDelay:          `${delay}ms`,
        };

  const svgEl = (
    <svg
      width={def.svgW}
      height={def.svgH}
      viewBox={`0 0 ${def.svgW} ${def.svgH}`}
      fill="none"
      style={{ flexShrink: 0 }}
    >
      <path
        d={def.arrowPath}
        stroke="var(--shouf-accent)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.75"
        pathLength="1"
        style={arrowStyle}
      />
      <polyline
        points={def.tipPoints}
        stroke="var(--shouf-accent)"
        strokeWidth="2"
        strokeOpacity="0.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={fadeStyle(tipDelay)}
      />
    </svg>
  );

  const labelEl = (
    <span
      style={{
        fontFamily:    "var(--font-caveat), 'Patrick Hand', cursive",
        fontSize:      "22px",
        fontWeight:    "700",
        lineHeight:    1.3,
        color:         "var(--shouf-text-muted)",
        whiteSpace:    "pre-wrap",
        ...fadeStyle(labelDelay),
      }}
    >
      {def.label}
    </span>
  );

  return (
    <div
      style={{
        display:       "flex",
        flexDirection: def.direction,
        alignItems:    def.alignItems,
        gap:           def.direction === "row" ? 6 : 4,
        ...def.containerPos,
      }}
    >
      {def.svgFirst ? <>{svgEl}{labelEl}</> : <>{labelEl}{svgEl}</>}
    </div>
  );
}

// ─── WelcomeAnnotations ───────────────────────────────────────────────────────
// Expressive craft moment: five hand-drawn sketch annotations appear after
// launch, each pointing at a major shell region and explaining what it does.
// Caveat font gives them the warmth of a designer's sketchbook annotation.
// SVG bent arrows trace on with stroke-dashoffset draw-on animation — craft
// in the details. pointer-events:none so they never block interaction.

export function WelcomeAnnotations() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  return (
    <div
      className="hidden lg:block"
      aria-hidden="true"
      style={{
        position:      "absolute",
        inset:         0,
        pointerEvents: "none",
        userSelect:    "none",
        zIndex:        5,
      }}
    >
      {ANNOTATIONS.map((def, i) => (
        <Annot key={def.id} def={def} index={i} reducedMotion={reducedMotion} />
      ))}
    </div>
  );
}
