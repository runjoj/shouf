"use client";

// ─── CaseStudyShared ────────────────────────────────────────────────────────
// Shared typography and layout primitives for all case study pages.
// Consolidates section labels, headings, body text, dividers, and
// scroll-triggered entrance animations into one module.
//
// Expressive craft moment: section labels carry a color accent that maps
// to the section's narrative role (problem = warm, solution = accent,
// research = cool, design = primary, takeaways = muted). This subtle
// color language helps the reader sense where they are in the story.

import { useRef, useEffect, useState, type ReactNode, type CSSProperties } from "react";

// ─── Constants ──────────────────────────────────────────────────────────────

export const MONO = "var(--font-mono)";

// ─── Section color map ──────────────────────────────────────────────────────
// Maps section label text to a subtle accent that signals narrative role.

const SECTION_COLORS: Record<string, string> = {
  problem:     "var(--shouf-accent-rose)",
  problems:    "var(--shouf-accent-rose)",
  solution:    "var(--shouf-accent)",
  research:    "var(--shouf-accent-blue)",
  ideation:    "var(--shouf-accent-blue)",
  design:      "var(--shouf-accent)",
  refinement:  "var(--shouf-accent-sage)",
  feedback:    "var(--shouf-accent-sage)",
  handoff:     "var(--shouf-text-muted)",
  takeaways:   "var(--shouf-text-muted)",
  "next steps":      "var(--shouf-accent-sage)",
  "looking ahead":   "var(--shouf-accent-sage)",
  // Overview page sections
  motivation:    "var(--shouf-accent-blue)",
  architecture:  "var(--shouf-accent)",
  tokens:        "var(--shouf-accent-sage)",
  components:    "var(--shouf-accent)",
  craft:         "var(--shouf-accent-rose)",
  overview:      "var(--shouf-accent-blue)",
  learnings:     "var(--shouf-text-muted)",
};

function getSectionColor(label: string): string {
  return SECTION_COLORS[label.toLowerCase()] ?? "var(--shouf-text-faint)";
}

// ─── ScrollReveal ───────────────────────────────────────────────────────────
// Wraps children in a container that fades + lifts into view when it enters
// the viewport. Uses IntersectionObserver — no runtime deps.

export function ScrollReveal({
  children,
  delay = 0,
  style,
}: {
  children: ReactNode;
  delay?: number;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Check if prefers-reduced-motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 500ms ease ${delay}ms, transform 500ms ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── SectionLabel ───────────────────────────────────────────────────────────
// Color-coded uppercase label that signals the section's narrative role.

export function SectionLabel({ children }: { children: ReactNode }) {
  const label = typeof children === "string" ? children : "";
  const color = getSectionColor(label);

  return (
    <div
      style={{
        fontFamily:    MONO,
        fontSize:      "13px",
        fontWeight:    700,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color,
        marginBottom:  "10px",
        display:       "flex",
        alignItems:    "center",
        gap:           "10px",
      }}
    >
      {/* Accent bar — 2px wide, matches section color */}
      <span
        style={{
          width:           "20px",
          height:          "2px",
          backgroundColor: color,
          borderRadius:    "1px",
          flexShrink:      0,
          opacity:         0.7,
        }}
      />
      {children}
    </div>
  );
}

// ─── SectionHeading ─────────────────────────────────────────────────────────

export function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2
      style={{
        fontSize:      "28px",
        fontWeight:    600,
        color:         "var(--shouf-text)",
        margin:        "0 0 20px",
        letterSpacing: "-0.02em",
        lineHeight:    1.2,
      }}
    >
      {children}
    </h2>
  );
}

// ─── Body ───────────────────────────────────────────────────────────────────

export function Body({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        fontSize:   "16px",
        color:      "var(--shouf-text-muted)",
        lineHeight: 1.75,
        margin:     "0 0 16px",
      }}
    >
      {children}
    </p>
  );
}

// ─── Divider ────────────────────────────────────────────────────────────────
// Gradient fade divider — fades from transparent → border color → transparent.
// More atmospheric than a flat line; suggests continuation.

export function Divider() {
  return (
    <div
      style={{
        height:     "1px",
        margin:     "0 0 48px",
        background: "linear-gradient(to right, transparent, var(--shouf-border-sub) 20%, var(--shouf-border-sub) 80%, transparent)",
      }}
    />
  );
}

// ─── BackButton ─────────────────────────────────────────────────────────────
// Consistent back-to-work navigation across all case studies.

export function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <div style={{ marginBottom: "40px", maxWidth: "800px" }}>
      <button
        onClick={onClick}
        style={{
          all:           "unset",
          cursor:        "pointer",
          fontSize:      "15px",
          fontFamily:    MONO,
          color:         "var(--shouf-text-faint)",
          letterSpacing: "0.02em",
          display:       "inline-flex",
          alignItems:    "center",
          gap:           "8px",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.color = "var(--shouf-accent)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.color = "var(--shouf-text-faint)";
        }}
      >
        <span style={{ fontSize: "17px" }}>&larr;</span>
        <span>Back</span>
      </button>
    </div>
  );
}
