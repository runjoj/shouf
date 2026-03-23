"use client";

// ─── AboutCanvas ───────────────────────────────────────────────────────────────

import { useRef, useEffect, useState } from "react";
import React from "react";

const BIO_PARAGRAPHS = [
  "I started my career as an Army Captain, leading large teams through fast-moving missions with limited resources. It taught me how to make good decisions quickly and communicate effectively across different teams.",
  "After the Army, I transitioned into software engineering before eventually also moving into design. That path gave me a unique perspective and it allows me to understand what's actually feasible for a development team under a deadline, as well as how to bridge the gap between design and engineering.",
  "As a Design Engineer, I close the gap that usually exists between a design file and a shipped product. I catch technical constraints early, contribute to production code when the project calls for it, and build prototypes in real code. I think in systems, not screens, and I care most about creating work that developers can actually build and users actually understand.",
];

// ─── SVG animations ───────────────────────────────────────────────────────────

function HeartbeatSVG() {
  return (
    <svg width="82" height="32" viewBox="0 0 82 32" fill="none" aria-hidden>
      <path className="dp" d="M 0,16 L 20,16 L 25,6 L 30,26 L 34,10 L 38,16 L 82,16"
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SonarSVG() {
  return (
    <svg width="60" height="40" viewBox="0 0 60 40" fill="none" aria-hidden>
      <circle cx="6" cy="20" r="2" fill="currentColor" opacity="0.5" />
      <path className="dp"    d="M 13,12 A 10,10 0 0 1 13,28" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path className="dp d1" d="M 22,7  A 18,18 0 0 1 22,33" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path className="dp d2" d="M 33,2  A 26,26 0 0 1 33,38" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function RadioWaveSVG() {
  return (
    <svg width="60" height="40" viewBox="0 0 60 40" fill="none" aria-hidden>
      <circle cx="6" cy="20" r="2.5" fill="currentColor" />
      <path className="dp"    d="M 14,14 A 8,8   0 0 1 14,26" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path className="dp d1" d="M 23,9  A 14,14 0 0 1 23,31" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path className="dp d2" d="M 34,4  A 20,20 0 0 1 34,36" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function BackpackSVG() {
  return (
    <svg width="82" height="40" viewBox="0 0 82 40" fill="none" aria-hidden>
      <ellipse className="fi" cx="41" cy="20" rx="38" ry="17" stroke="currentColor" strokeWidth="1" />
      <line    className="fi" x1="3" y1="20" x2="79" y2="20" stroke="currentColor" strokeWidth="0.75" />
      <ellipse className="fi" cx="41" cy="20" rx="14" ry="17" stroke="currentColor" strokeWidth="0.75" />
      <path className="dp-dot" d="M 9,23 C 18,12 28,30 40,18 C 52,7 64,26 73,19"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="3 5" />
    </svg>
  );
}

function CodeSVG() {
  return (
    <svg width="72" height="36" viewBox="0 0 72 36" fill="none" aria-hidden>
      <path className="dp"    d="M 18,8  L 4,18  L 18,28" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path className="dp d1" d="M 30,8  L 44,18 L 30,28" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle className="dp-dot" cx="58" cy="18" r="2.5" fill="currentColor" />
      <path className="fi"    d="M 52,18 L 66,18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function RunnerSVG() {
  return (
    <svg width="82" height="44" viewBox="0 0 82 44" fill="none" aria-hidden>
      <circle className="dp-dot" cx="50" cy="6" r="2.5" fill="currentColor" />
      <path className="dp"    d="M 50,9 L 48,18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path className="dp d1" d="M 40,14 L 56,12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path className="dp d2" d="M 48,18 L 40,30 M 48,18 L 56,26 L 52,36" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path className="dp d3" d="M 4,38 L 16,34 L 28,38 L 42,32 L 60,36 L 78,32" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PagesSVG() {
  return (
    <svg width="54" height="40" viewBox="0 0 54 40" fill="none" aria-hidden>
      <path className="dp"    d="M 27,36 L 27,8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path className="dp d1" d="M 27,34 Q 10,28 8,10  L 27,14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path className="dp d2" d="M 27,34 Q 14,24 14,6  L 27,10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path className="dp d1" d="M 27,34 Q 44,28 46,10 L 27,14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path className="dp d2" d="M 27,34 Q 40,24 40,6  L 27,10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CedarSVG() {
  return (
    <svg width="48" height="50" viewBox="0 0 48 50" fill="none" aria-hidden>
      <path className="dp"    d="M 24,48 L 24,34"            stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path className="dp d1" d="M 6,38  L 24,28 L 42,38"   stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path className="dp d2" d="M 11,30 L 24,18 L 37,30"   stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path className="dp d3" d="M 16,22 L 24,10 L 32,22"   stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Milestone data ────────────────────────────────────────────────────────────

interface Milestone {
  year:  string | null;
  label: string;
  Anim:  () => React.ReactElement;
  // even-index nodes go in connector row 1 (close), odd in row 2 (further)
}

const MILESTONES: Milestone[] = [
  { year: null,      label: "Born — first gen Lebanese American",                   Anim: CedarSVG     },
  { year: "2014–18", label: "U.S. Army Captain — working in medical evacuations",   Anim: HeartbeatSVG },
  { year: "2017–19", label: "Crisis text line volunteer",                           Anim: RadioWaveSVG },
  { year: "2018–19", label: "Backpacked for 7 months",                              Anim: BackpackSVG  },
  { year: "2019",    label: "Transitioned to software engineering",                 Anim: CodeSVG      },
  { year: "2021–23", label: "Director of Outreach, Women of the Wasatch",           Anim: RunnerSVG    },
  { year: "2022–24", label: "Search and rescue volunteer",                          Anim: SonarSVG     },
  { year: "2023",    label: "Started working in design",                            Anim: PagesSVG     },
];

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  @media (max-width: 680px) {
    .ab-hero  { flex-direction: column !important; gap: 32px !important; align-items: center !important; }
    .ab-photo { width: 160px !important; min-width: unset !important; height: auto !important; align-self: center !important; }
    .ab-photo img { height: auto !important; object-fit: cover !important; }
  }

  /* ── Dot ── */
  .tl-dot {
    width: 10px; height: 10px; border-radius: 50%;
    background-color: var(--shouf-border);
    border: 1.5px solid var(--shouf-text-faint);
    margin: 0 auto;
    transition: transform 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
    cursor: default;
  }
  .tl-node:hover .tl-dot {
    transform: scale(1.7);
    background-color: var(--shouf-accent);
    border-color: var(--shouf-accent);
  }

  /* ── SVG animation area (above line, hover only) ── */
  .tl-anim {
    opacity: 0;
    transition: opacity 0.2s ease;
    color: var(--shouf-text-muted);
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }
  .tl-node:hover .tl-anim { opacity: 1; }

  /* ── SVG draw animations ── */
  .dp {
    stroke-dasharray: 600;
    stroke-dashoffset: 600;
    transition: stroke-dashoffset 0s;
  }
  .tl-node:hover .dp {
    stroke-dashoffset: 0;
    transition: stroke-dashoffset 1s cubic-bezier(0.37, 0, 0.63, 1);
  }
  .tl-node:hover .dp.d1 { transition-delay: 0.3s; }
  .tl-node:hover .dp.d2 { transition-delay: 0.6s; }
  .tl-node:hover .dp.d3 { transition-delay: 0.9s; }

  .fi { opacity: 0; }
  .tl-node:hover .fi { opacity: 0.22; transition: opacity 0.4s ease; }

  .dp-dot { opacity: 0; transition: opacity 0s; }
  .tl-node:hover .dp-dot { opacity: 1; transition: opacity 0.8s ease 0.15s; }

  /* ── Always-visible labels ── */
  .tl-label-year {
    font-size: 10px;
    font-family: var(--font-mono);
    color: var(--shouf-text-faint);
    letter-spacing: 0.05em;
    margin-bottom: 4px;
  }
  .tl-label-text {
    font-size: 12px;
    font-weight: 500;
    color: var(--shouf-text-muted);
    line-height: 1.45;
    transition: color 0.15s ease;
  }
  .tl-node:hover .tl-label-text { color: var(--shouf-text); }
`;

// ─── Timeline ─────────────────────────────────────────────────────────────────

function Timeline() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const n    = MILESTONES.length;
  const CONN = 28; // connector height in px — same for all nodes

  return (
    <div ref={wrapRef} style={{ marginTop: "64px", overflowX: "auto" }}>
      {/* min-width ensures same-row labels never collide; overflowX:auto on parent scrolls */}
      <div style={{ padding: "130px 56px 130px", position: "relative", minWidth: "620px" }}>
        {/* Track — nodes absolutely positioned inside */}
        <div style={{ position: "relative", height: "10px" }}>

          {/* ── Bleed line — gradient fades at each end beyond the nodes ── */}
          <div style={{
            position:   "absolute",
            top:        "50%",
            left:       "-56px",
            right:      "-56px",
            height:     "1px",
            background: "linear-gradient(to right, transparent 0px, var(--shouf-border) 40px, var(--shouf-border) calc(100% - 40px), transparent 100%)",
            transform:  "translateY(-50%)",
          }} />

          {/* ── Animated fill (draws left to right on scroll) ── */}
          <div style={{
            position:   "absolute",
            top:        "50%",
            left:       "-56px",
            height:     "1px",
            background: "linear-gradient(to right, transparent 0px, var(--shouf-border-sub) 40px)",
            transform:  "translateY(-50%)",
            width:      visible ? "calc(100% + 112px)" : "0px",
            transition: "width 1.4s cubic-bezier(0.4, 0, 0.2, 1)",
          }} />

          {/* ── Nodes ── */}
          {MILESTONES.map((m, i) => {
            const frac  = i / (n - 1);
            // Alternate: even nodes label below, odd nodes label above.
            // SVG animation is always on the opposite side from the label.
            const above = i % 2 !== 0;

            const labelX = i === 0 ? "translateX(-10%)" : i === n - 1 ? "translateX(-90%)" : "translateX(-50%)";
            const animX  = i === 0 ? "translateX(-10%)" : i === n - 1 ? "translateX(-90%)" : "translateX(-50%)";
            const align  = i === 0 ? "left" : i === n - 1 ? "right" : "center";

            return (
              <div
                key={i}
                className="tl-node"
                style={{
                  position:   "absolute",
                  top:        "50%",
                  left:       `${frac * 100}%`,
                  transform:  "translate(-50%, -50%)",
                  width:      "10px",
                  height:     "10px",
                  opacity:    visible ? 1 : 0,
                  transition: `opacity 0.4s ease ${0.3 + i * 0.08}s`,
                  zIndex:     1,
                }}
              >
                {/* Dot */}
                <div className="tl-dot" />

                {/* Connector — goes up for odd nodes, down for even */}
                <div style={{
                  position:        "absolute",
                  left:            "50%",
                  transform:       "translateX(-50%)",
                  width:           "1px",
                  height:          `${CONN}px`,
                  backgroundColor: "var(--shouf-border)",
                  ...(above ? { bottom: "100%" } : { top: "100%" }),
                }} />

                {/* Label — above line for odd, below for even */}
                <div style={{
                  position:  "absolute",
                  left:      "50%",
                  transform: labelX,
                  width:     "100px",
                  textAlign: align,
                  ...(above
                    ? { bottom: `calc(100% + ${CONN + 8}px)` }
                    : { top:    `calc(100% + ${CONN + 8}px)` }),
                }}>
                  {m.year && <div className="tl-label-year">{m.year}</div>}
                  <div className="tl-label-text">{m.label}</div>
                </div>

                {/* SVG animation — opposite side from label, hover only */}
                <div
                  className="tl-anim"
                  style={{
                    position:  "absolute",
                    left:      "50%",
                    transform: animX,
                    ...(above
                      ? { top:    "calc(100% + 20px)" }
                      : { bottom: "calc(100% + 20px)" }),
                  }}
                >
                  <m.Anim />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── AboutCanvas ──────────────────────────────────────────────────────────────

export function AboutCanvas() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div
        style={{
          width:           "100%",
          height:          "100%",
          overflowY:       "auto",
          backgroundColor: "var(--shouf-canvas)",
        }}
      >
        <main
          style={{
            maxWidth: "900px",
            margin:   "0 auto",
            padding:  "56px 60px 120px",
          }}
        >
          {/* ── Hero ─────────────────────────────────────────────────────── */}
          <section
            className="ab-hero"
            style={{ display: "flex", gap: "64px", alignItems: "flex-start" }}
          >
            <div
              className="ab-photo"
              style={{
                width:        "300px",
                minWidth:     "300px",
                alignSelf:    "stretch",
                borderRadius: "14px",
                flexShrink:   0,
                overflow:     "hidden",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/about_photo.JPG"
                alt="Jo Ann Saab"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }}
              />
            </div>

            <div style={{ flex: 1, paddingTop: "4px", maxWidth: "420px" }}>
              {BIO_PARAGRAPHS.map((para, i) => (
                <p
                  key={i}
                  style={{
                    fontSize:      "16px",
                    fontWeight:    400,
                    lineHeight:    1.75,
                    letterSpacing: "-0.01em",
                    color:         "var(--shouf-text)",
                    margin:        0,
                    marginBottom:  i < BIO_PARAGRAPHS.length - 1 ? "28px" : 0,
                  }}
                >
                  {para}
                </p>
              ))}
            </div>
          </section>

          {/* ── Timeline ─────────────────────────────────────────────────── */}
          <Timeline />
        </main>
      </div>
    </>
  );
}
