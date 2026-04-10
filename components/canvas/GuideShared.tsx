"use client";

// ─── GuideShared ───────────────────────────────────────────────────────────
// Shared typography and layout primitives for all guide pages (PDS, RC, EU).
// Parallels CaseStudyShared but uses smaller typography appropriate for
// documentation context. Includes color-coded section labels and gradient
// dividers matching the expressive craft principles.

import { useRef, useEffect, useState, type ReactNode, type CSSProperties } from "react";

// ─── Constants ──────────────────────────────────────────────────────────────

export const MONO = "var(--font-mono)";

// ─── Section color map ──────────────────────────────────────────────────────
// Maps section label text to a subtle accent that signals narrative role.
// Same vocabulary as CaseStudyShared to maintain consistent color language.

const SECTION_COLORS: Record<string, string> = {
  overview:      "var(--shouf-accent)",
  motivation:    "var(--shouf-accent)",
  architecture:  "var(--shouf-accent-blue)",
  tokens:        "var(--shouf-accent-sage)",
  components:    "var(--shouf-accent)",
  craft:         "var(--shouf-accent-rose)",
  problem:       "var(--shouf-accent-rose)",
  solution:      "var(--shouf-accent)",
  research:      "var(--shouf-accent-blue)",
  design:        "var(--shouf-accent)",
  handoff:       "var(--shouf-text-muted)",
  takeaways:     "var(--shouf-text-muted)",
  "next steps":  "var(--shouf-accent-sage)",
  "next-steps":  "var(--shouf-accent-sage)",
};

function getSectionColor(label: string): string {
  return SECTION_COLORS[label.toLowerCase()] ?? "var(--shouf-text-faint)";
}

// ─── GuideScrollReveal ──────────────────────────────────────────────────────
// Scroll-triggered entrance animation for guide page sections.
// Each section fades in and lifts 14px as it enters the viewport.

export function GuideScrollReveal({
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
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? "translateY(0)" : "translateY(14px)",
        transition: `opacity 450ms ease ${delay}ms, transform 450ms ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Section (anchor wrapper) ───────────────────────────────────────────────

export function Section({ id, children }: { id: string; children: ReactNode }) {
  return (
    <section
      id={`guide-${id}`}
      style={{ scrollMarginTop: "24px", marginBottom: "72px" }}
    >
      {children}
    </section>
  );
}

// ─── SectionLabel ───────────────────────────────────────────────────────────
// Color-coded uppercase label with accent bar — mirrors CaseStudyShared
// at guide-appropriate scale.

export function GuideSectionLabel({ children }: { children: ReactNode }) {
  const label = typeof children === "string" ? children : "";
  const color = getSectionColor(label);

  return (
    <div
      style={{
        fontFamily:    MONO,
        fontSize:      "12px",
        fontWeight:    800,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color,
        marginBottom:  "10px",
        display:       "flex",
        alignItems:    "center",
        gap:           "8px",
      }}
    >
      {/* Accent bar — matches section color */}
      <span
        style={{
          width:           "16px",
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

export function GuideSectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2
      style={{
        fontSize:      "20px",
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

export function GuideBody({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        fontSize:   "14px",
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
// Gradient fade divider — matches CaseStudyShared atmospheric style.

export function GuideDivider() {
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

// ─── BulletList ─────────────────────────────────────────────────────────────

export function GuideBulletList({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: "0 0 16px", paddingLeft: "20px" }}>
      {items.map((item, i) => (
        <li
          key={i}
          style={{
            fontSize:     "14px",
            color:        "var(--shouf-text-muted)",
            lineHeight:   1.75,
            marginBottom: "6px",
          }}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

// ─── SubHeading ─────────────────────────────────────────────────────────────

export function GuideSubHeading({ children }: { children: ReactNode }) {
  return (
    <h3
      style={{
        fontSize:      "14px",
        fontWeight:    600,
        color:         "var(--shouf-text)",
        margin:        "0 0 10px",
        letterSpacing: "-0.01em",
      }}
    >
      {children}
    </h3>
  );
}

// ─── Inline code chip ───────────────────────────────────────────────────────

export function GuideCode({ children }: { children: ReactNode }) {
  return (
    <code
      style={{
        fontFamily:      MONO,
        fontSize:        "12px",
        backgroundColor: "var(--shouf-hover)",
        border:          "1px solid var(--shouf-border-sub)",
        borderRadius:    "4px",
        padding:         "1px 6px",
        color:           "var(--shouf-accent)",
      }}
    >
      {children}
    </code>
  );
}
