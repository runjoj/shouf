"use client";

// ─── Presentation primitives ────────────────────────────────────────────────
// Shared typographic building blocks. No accent underlines, no color bars,
// no drop shadows — hierarchy comes from scale, weight, and space alone.

import { ACCENT, BODY_FONT, HAIRLINE, INK, INK_SOFT, PAPER_DIM, SANS, MONO } from "./tokens";

export function SlideLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily:    MONO,
        fontSize:      "16px",
        fontWeight:    600,
        letterSpacing: "0.14em",
        textTransform: "uppercase" as const,
        color:         ACCENT,
        marginBottom:  "28px",
      }}
    >
      {children}
    </div>
  );
}

export function SlideHeadline({
  children,
  size = "md",
}: {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const fs = { sm: "34px", md: "46px", lg: "60px", xl: "84px" }[size];
  // Generous measure so headlines that fit on one line aren't forced to wrap;
  // genuinely long ones still break and textWrap:balance keeps them even.
  const mw = { sm: "1120px", md: "1200px", lg: "1280px", xl: "1360px" }[size];
  return (
    <h2
      style={{
        fontFamily:    SANS,
        fontSize:      fs,
        fontWeight:    560,
        color:         INK,
        margin:        0,
        lineHeight:    1.12,
        letterSpacing: "-0.025em",
        marginBottom:  "28px",
        maxWidth:      mw,
        textWrap:      "balance" as const,
      }}
    >
      {children}
    </h2>
  );
}

export function SlideBody({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily:  BODY_FONT,
        fontSize:    "19px",
        lineHeight:  1.65,
        color:       INK_SOFT,
        margin:      0,
        marginBottom:"16px",
        maxWidth:    "660px",
        fontWeight:  400,
        textWrap:    "pretty" as const,
      }}
    >
      {children}
    </p>
  );
}

// A small "real code" panel — evidence that a decision is load-bearing in
// the actual codebase, not just described. Pinned roles (300/500) pick up
// the accent so the connection to the diagram above reads at a glance.
export function CodePanel({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div
      style={{
        background:   PAPER_DIM,
        border:       `1px solid ${HAIRLINE}`,
        borderRadius: "6px",
        padding:      "20px 24px",
        fontFamily:   MONO,
        fontSize:     "15px",
        lineHeight:   1.7,
        color:        INK_SOFT,
        maxWidth:     "360px",
      }}
    >
      <div style={{ color: INK, fontWeight: 600 }}>{title} {"{"}</div>
      {lines.map((line, i) => (
        <div key={i} style={{ paddingLeft: "20px", color: INK_SOFT, fontWeight: 400 }}>
          {line}
        </div>
      ))}
      <div style={{ color: INK, fontWeight: 600 }}>{"}"}</div>
    </div>
  );
}

// Consistent slide padding — generous margins are the whole point.
export function SlideFrame({
  children,
  align = "center",
}: {
  children: React.ReactNode;
  align?: "center" | "start";
}) {
  return (
    <div
      style={{
        display:        "flex",
        flexDirection:  "column",
        justifyContent: align === "center" ? "center" : "flex-start",
        height:         "100%",
        padding:        "88px 128px",
        boxSizing:      "border-box" as const,
      }}
    >
      <div style={{ width: "100%", maxWidth: "1320px", margin: "0 auto" }}>{children}</div>
    </div>
  );
}
