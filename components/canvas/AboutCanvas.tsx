"use client";

// ─── AboutCanvas ───────────────────────────────────────────────────────────────

import { useRef, useEffect, useState } from "react";

const BIO_PARAGRAPHS = [
  "I started my career as an Army Captain, leading large teams through fast-moving missions with limited resources. It taught me how to make good decisions quickly and communicate effectively across different teams.",
  "After the Army, I transitioned into software engineering before eventually also moving into design. That path gave me a unique perspective and it allows me to understand what's actually feasible for a development team under a deadline, as well as how to bridge the gap between design and engineering.",
  "As a Design Engineer, I close the gap that usually exists between a design file and a shipped product. I catch technical constraints early, contribute to production code when the project calls for it, and build prototypes in real code. I think in systems, not screens, and I care most about creating work that developers can actually build and users actually understand.",
];

// ─── Timeline ─────────────────────────────────────────────────────────────────

// Year range for proportional positioning.
// "Born" is placed at TL_START + 2 (no year shown).
const TL_START = 2008;
const TL_END   = 2026;

interface Milestone {
  year:    number | null; // null → "Born"
  yearEnd?: number;
  label:   string;
  sub:     string;
  above:   boolean;  // label above the line?
  connH:   number;   // connector line height (px) — higher = further from line
}

// Alternating above/below. connH is bumped for the two items that would
// otherwise land on the same vertical level as a same-side neighbour.
const MILESTONES: Milestone[] = [
  { year: null, label: "Born",                 sub: "First gen Lebanese American", above: true,  connH: 14 },
  { year: 2014, yearEnd: 2018, label: "Army Captain",         sub: "Medical evacuations",         above: false, connH: 14 },
  { year: 2017, yearEnd: 2019, label: "Crisis Text Line",     sub: "Volunteer",                   above: true,  connH: 14 },
  { year: 2018, yearEnd: 2019, label: "Backpacking",          sub: "Solo, 7 months",              above: false, connH: 14 },
  { year: 2019,                label: "Software engineer",    sub: "Career transition",            above: true,  connH: 44 },
  { year: 2021, yearEnd: 2023, label: "Women of the Wasatch", sub: "Director of Outreach",        above: false, connH: 14 },
  { year: 2022, yearEnd: 2024, label: "Search & rescue",      sub: "Volunteer",                   above: true,  connH: 14 },
  { year: 2023,                label: "Design",               sub: "Still going",                  above: false, connH: 44 },
];

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  @media (max-width: 680px) {
    .ab-hero  { flex-direction: column !important; gap: 32px !important; align-items: center !important; }
    .ab-photo { width: 160px !important; min-width: unset !important; height: auto !important; align-self: center !important; }
    .ab-photo img { height: auto !important; object-fit: cover !important; }
  }
  .tl-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background-color: var(--shouf-text-muted);
    margin: 0 auto;
    transition: transform 0.2s ease, background-color 0.2s ease;
  }
  .tl-node:hover .tl-dot {
    transform: scale(1.75);
    background-color: var(--shouf-accent);
  }
  .tl-title {
    font-size: 11px; font-weight: 600;
    color: var(--shouf-text-muted);
    line-height: 1.35;
    transition: color 0.15s ease;
  }
  .tl-node:hover .tl-title { color: var(--shouf-text); }
  .tl-year {
    font-size: 9px; font-family: var(--font-mono);
    color: var(--shouf-text-faint); letter-spacing: 0.06em;
    margin-bottom: 3px;
  }
  .tl-sub { font-size: 10px; color: var(--shouf-text-faint); margin-top: 2px; line-height: 1.3; }
`;

// ─── Timeline component ────────────────────────────────────────────────────────

function Timeline() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const PAD = 20; // px of horizontal padding inside the track container

  return (
    <div ref={wrapRef} style={{ marginTop: "72px" }}>
      <div style={{ overflowX: "auto", overflowY: "visible" }}>
        <div
          style={{
            position:  "relative",
            minWidth:  "900px",
            height:    "260px",
            padding:   `0 ${PAD}px`,
          }}
        >
          {/* ── Base line ─────────────────────────────────────────────────── */}
          <div style={{
            position:        "absolute",
            top:             "50%",
            left:            `${PAD}px`,
            right:           `${PAD}px`,
            height:          "1px",
            backgroundColor: "var(--shouf-border)",
            transform:       "translateY(-50%)",
          }} />

          {/* ── Animated fill ─────────────────────────────────────────────── */}
          <div style={{
            position:        "absolute",
            top:             "50%",
            left:            `${PAD}px`,
            height:          "1px",
            backgroundColor: "var(--shouf-border-sub)",
            transform:       "translateY(-50%)",
            width:           visible ? `calc(100% - ${PAD * 2}px)` : "0px",
            transition:      "width 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
          }} />

          {/* ── Range bands ───────────────────────────────────────────────── */}
          {MILESTONES.map((m, i) => {
            if (!m.yearEnd || m.year === null) return null;
            const l = (m.year    - TL_START) / (TL_END - TL_START);
            const w = (m.yearEnd - m.year)   / (TL_END - TL_START);
            return (
              <div
                key={`band${i}`}
                style={{
                  position:        "absolute",
                  top:             "50%",
                  left:            `calc(${PAD}px + ${l} * (100% - ${PAD * 2}px))`,
                  width:           `calc(${w} * (100% - ${PAD * 2}px))`,
                  height:          "3px",
                  borderRadius:    "2px",
                  backgroundColor: "var(--shouf-accent)",
                  transform:       "translateY(-50%)",
                  opacity:         visible ? 0.28 : 0,
                  transition:      `opacity 0.5s ease ${0.7 + i * 0.07}s`,
                  pointerEvents:   "none",
                }}
              />
            );
          })}

          {/* ── Nodes ─────────────────────────────────────────────────────── */}
          {MILESTONES.map((m, i) => {
            const posYear = m.year ?? (TL_START + 2);
            const frac    = (posYear - TL_START) / (TL_END - TL_START);

            return (
              <div
                key={i}
                className="tl-node"
                style={{
                  position:   "absolute",
                  top:        "50%",
                  left:       `calc(${PAD}px + ${frac} * (100% - ${PAD * 2}px))`,
                  transform:  "translate(-50%, -50%)",
                  opacity:    visible ? 1 : 0,
                  transition: `opacity 0.35s ease ${0.4 + i * 0.09}s`,
                  zIndex:     1,
                  cursor:     "default",
                }}
              >
                {/* Dot */}
                <div className="tl-dot" />

                {/* Connector line */}
                <div
                  style={{
                    position:        "absolute",
                    left:            "50%",
                    transform:       "translateX(-50%)",
                    ...(m.above ? { bottom: "8px" } : { top: "8px" }),
                    width:           "1px",
                    height:          `${m.connH}px`,
                    backgroundColor: "var(--shouf-border)",
                  }}
                />

                {/* Label */}
                <div
                  style={{
                    position:      "absolute",
                    left:          "50%",
                    transform:     "translateX(-50%)",
                    ...(m.above
                      ? { bottom: `${8 + m.connH + 6}px` }
                      : { top:    `${8 + m.connH + 6}px` }),
                    width:         "88px",
                    textAlign:     "center",
                    pointerEvents: "none",
                  }}
                >
                  {m.year !== null && (
                    <div className="tl-year">
                      {m.year}{m.yearEnd ? `\u2013${m.yearEnd}` : ""}
                    </div>
                  )}
                  <div className="tl-title">{m.label}</div>
                  <div className="tl-sub">{m.sub}</div>
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
