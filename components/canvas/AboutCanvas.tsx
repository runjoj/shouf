"use client";

// ─── AboutCanvas ───────────────────────────────────────────────────────────────

import { useRef, useEffect, useState } from "react";

const BIO_PARAGRAPHS = [
  "I started my career as an Army Captain, leading large teams through fast-moving missions with limited resources. It taught me how to make good decisions quickly and communicate effectively across different teams.",
  "After the Army, I transitioned into software engineering before eventually also moving into design. That path gave me a unique perspective and it allows me to understand what's actually feasible for a development team under a deadline, as well as how to bridge the gap between design and engineering.",
  "As a Design Engineer, I close the gap that usually exists between a design file and a shipped product. I catch technical constraints early, contribute to production code when the project calls for it, and build prototypes in real code. I think in systems, not screens, and I care most about creating work that developers can actually build and users actually understand.",
];

// ─── Timeline ─────────────────────────────────────────────────────────────────

interface Milestone {
  label:    string;
  sub:      string;
  year:     string | null; // display string, e.g. "2014–18", null for Born
  above:    boolean;       // tooltip above or below line
}

const MILESTONES: Milestone[] = [
  { label: "Born",                 sub: "First gen Lebanese American", year: null,      above: true  },
  { label: "Army Captain",         sub: "Medical evacuations",         year: "2014–18", above: false },
  { label: "Crisis Text Line",     sub: "Volunteer",                   year: "2017–19", above: true  },
  { label: "Backpacking",          sub: "Solo, 7 months",              year: "2018–19", above: false },
  { label: "Software engineer",    sub: "Career transition",           year: "2019",    above: true  },
  { label: "Women of the Wasatch", sub: "Director of Outreach",        year: "2021–23", above: false },
  { label: "Search & rescue",      sub: "Volunteer",                   year: "2022–24", above: true  },
  { label: "Design",               sub: "Still going",                 year: "2023",    above: false },
];

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  @media (max-width: 680px) {
    .ab-hero  { flex-direction: column !important; gap: 32px !important; align-items: center !important; }
    .ab-photo { width: 160px !important; min-width: unset !important; height: auto !important; align-self: center !important; }
    .ab-photo img { height: auto !important; object-fit: cover !important; }
  }

  /* ── Timeline node dot ── */
  .tl-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: var(--shouf-border);
    border: 1.5px solid var(--shouf-text-faint);
    margin: 0 auto;
    transition: transform 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
    cursor: pointer;
  }
  .tl-node:hover .tl-dot {
    transform: scale(1.8);
    background-color: var(--shouf-accent);
    border-color: var(--shouf-accent);
  }

  /* ── Tooltip ── */
  .tl-tip {
    opacity: 0;
    transform: translateY(4px);
    transition: opacity 0.18s ease, transform 0.18s ease;
    pointer-events: none;
  }
  .tl-tip-above {
    transform: translateY(-4px);
  }
  .tl-node:hover .tl-tip {
    opacity: 1;
    transform: translateY(0);
  }
  .tl-tip-label {
    font-size: 20px;
    font-weight: 700;
    color: var(--shouf-text);
    line-height: 1.2;
    margin-bottom: 4px;
  }
  .tl-tip-sub {
    font-size: 14px;
    color: var(--shouf-text-muted);
    line-height: 1.4;
  }
  .tl-tip-year {
    font-size: 11px;
    font-family: var(--font-mono);
    color: var(--shouf-text-faint);
    letter-spacing: 0.06em;
    margin-bottom: 8px;
  }
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
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const n   = MILESTONES.length;
  const PAD = 32; // px horizontal padding inside the track

  return (
    <div ref={wrapRef} style={{ marginTop: "80px" }}>
      {/* Outer wrapper: padding makes room for tooltips without needing overflow:visible on a scroll container */}
      <div style={{ padding: "120px 0 120px", position: "relative" }}>
        {/* Track */}
        <div style={{ position: "relative", height: "24px", padding: `0 ${PAD}px` }}>

          {/* Base line */}
          <div style={{
            position:        "absolute",
            top:             "50%",
            left:            `${PAD}px`,
            right:           `${PAD}px`,
            height:          "1px",
            backgroundColor: "var(--shouf-border)",
            transform:       "translateY(-50%)",
          }} />

          {/* Animated fill */}
          <div style={{
            position:        "absolute",
            top:             "50%",
            left:            `${PAD}px`,
            height:          "1px",
            backgroundColor: "var(--shouf-text-faint)",
            transform:       "translateY(-50%)",
            width:           visible ? `calc(100% - ${PAD * 2}px)` : "0px",
            transition:      "width 1.4s cubic-bezier(0.4, 0, 0.2, 1)",
          }} />

          {/* Nodes — evenly spaced */}
          {MILESTONES.map((m, i) => {
            const frac = i / (n - 1);
            // Nudge tooltip alignment at edges to keep it in-bounds
            let tipAlign = "translateX(-50%)";
            if (i === 0)     tipAlign = "translateX(-16%)";
            if (i === n - 1) tipAlign = "translateX(-84%)";

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
                  transition: `opacity 0.4s ease ${0.3 + i * 0.1}s`,
                  zIndex:     1,
                }}
              >
                {/* Dot */}
                <div className="tl-dot" />

                {/* Tooltip */}
                <div
                  className={`tl-tip ${m.above ? "tl-tip-above" : ""}`}
                  style={{
                    position:  "absolute",
                    left:      "50%",
                    transform: tipAlign,
                    ...(m.above
                      ? { bottom: "calc(100% + 24px)" }
                      : { top:    "calc(100% + 24px)" }),
                    width:     "180px",
                    textAlign: i === 0 ? "left" : i === n - 1 ? "right" : "center",
                  }}
                >
                  {m.year && <div className="tl-tip-year">{m.year}</div>}
                  <div className="tl-tip-label">{m.label}</div>
                  <div className="tl-tip-sub">{m.sub}</div>
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
