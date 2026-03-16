"use client";

import Link from "next/link";

// ─── Constants ────────────────────────────────────────────────────────────────

const BIO_PARAGRAPHS = [
  "I started as a software engineer and never fully left — I just added design. Seven years later I'm still most at home in the space between the two.",
  "I care about understanding the why before anything else — the user need, the technical context, the business goal. That curiosity shapes everything I make.",
  "My engineering background helps me work closely with developers, navigate technical constraints early, and contribute to the build when the project calls for it.",
  "I design experiences that feel like they belong — intuitive, embedded in the product, not bolted on. I work quickly, iterate often, and I'm comfortable with ambiguity.",
];

// ─── CSS ──────────────────────────────────────────────────────────────────────
// Injected as a style tag so we can use :hover without JS state.

const CSS = `
  .ab-back:hover { color: var(--sh-text) !important; }

  .ab-fact {
    display: flex;
    align-items: center;
    padding: 24px 0;
    border-bottom: 1px solid var(--sh-border);
    gap: 32px;
    cursor: default;
  }
  .ab-fact:first-child { border-top: 1px solid var(--sh-border); }
  .ab-fact-text {
    flex: 1;
    font-size: 17px;
    letter-spacing: -0.015em;
    line-height: 1.4;
    color: var(--sh-text);
    user-select: none;
  }
  .ab-anim {
    opacity: 0;
    transition: opacity 0.2s ease;
    flex-shrink: 0;
    color: var(--sh-text-muted);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 88px;
  }
  .ab-fact:hover .ab-anim { opacity: 1; }

  /* Draw-on base: large dasharray, full offset = invisible */
  .dp {
    stroke-dasharray: 600;
    stroke-dashoffset: 600;
    transition: stroke-dashoffset 0s;
  }
  /* On hover: draw each path on */
  .ab-fact:hover .dp {
    stroke-dashoffset: 0;
    transition: stroke-dashoffset 1s cubic-bezier(0.37, 0, 0.63, 1);
  }
  /* Staggered delays for multi-path SVGs */
  .ab-fact:hover .dp.d1 { transition-delay: 0.3s; }
  .ab-fact:hover .dp.d2 { transition-delay: 0.6s; }
  .ab-fact:hover .dp.d3 { transition-delay: 0.9s; }

  /* Fade-in for static decorative elements */
  .fi { opacity: 0; }
  .ab-fact:hover .fi {
    opacity: 0.22;
    transition: opacity 0.4s ease;
  }

  /* Dotted path: just fade in (dasharray pattern conflicts with dashoffset trick) */
  .dp-dot { opacity: 0; transition: opacity 0s; }
  .ab-fact:hover .dp-dot { opacity: 1; transition: opacity 0.8s ease 0.15s; }

  @media (max-width: 680px) {
    .ab-hero { flex-direction: column !important; gap: 40px !important; }
    .ab-photo { width: 100% !important; min-width: unset !important; height: 260px !important; }
    .ab-anim { display: none; }
  }
`;

// ─── SVG Animations ───────────────────────────────────────────────────────────
// Each is a small pen-sketch style SVG, ~80×40 (or taller for vertical shapes).
// .dp class = draw-on path, .d1/.d2/.d3 = staggered, .fi = fade-in static.

function HeartbeatSVG() {
  // EKG pulse line — flat, then sharp spike, flat again
  return (
    <svg width="82" height="32" viewBox="0 0 82 32" fill="none" aria-hidden>
      <path
        className="dp"
        d="M 0,16 L 20,16 L 25,6 L 30,26 L 34,10 L 38,16 L 82,16"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SonarSVG() {
  // Expanding arcs from a center point — like a sonar ping
  return (
    <svg width="60" height="40" viewBox="0 0 60 40" fill="none" aria-hidden>
      <circle cx="6" cy="20" r="2" fill="currentColor" opacity="0.5" />
      <path
        className="dp"
        d="M 13,12 A 10,10 0 0 1 13,28"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        className="dp d1"
        d="M 22,7 A 18,18 0 0 1 22,33"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        className="dp d2"
        d="M 33,2 A 26,26 0 0 1 33,38"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RadioWaveSVG() {
  // Concentric signal arcs — softer than sonar, more gentle
  return (
    <svg width="60" height="40" viewBox="0 0 60 40" fill="none" aria-hidden>
      <circle cx="6" cy="20" r="2.5" fill="currentColor" />
      <path
        className="dp"
        d="M 14,14 A 8,8 0 0 1 14,26"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        className="dp d1"
        d="M 23,9 A 14,14 0 0 1 23,31"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        className="dp d2"
        d="M 34,4 A 20,20 0 0 1 34,36"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BackpackSVG() {
  // Dotted path tracing across a minimal world outline
  return (
    <svg width="82" height="40" viewBox="0 0 82 40" fill="none" aria-hidden>
      {/* Faint world ellipse */}
      <ellipse className="fi" cx="41" cy="20" rx="38" ry="17" stroke="currentColor" strokeWidth="1" />
      <line className="fi" x1="3" y1="20" x2="79" y2="20" stroke="currentColor" strokeWidth="0.75" />
      <ellipse className="fi" cx="41" cy="20" rx="14" ry="17" stroke="currentColor" strokeWidth="0.75" />
      {/* Route dotted line */}
      <path
        className="dp-dot"
        d="M 9,23 C 18,12 28,30 40,18 C 52,7 64,26 73,19"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeDasharray="3 5"
      />
    </svg>
  );
}

function ElevationSVG() {
  // Elevation profile — climbs steadily with a steep push at the end
  return (
    <svg width="82" height="38" viewBox="0 0 82 38" fill="none" aria-hidden>
      {/* Baseline */}
      <line className="fi" x1="0" y1="35" x2="82" y2="35" stroke="currentColor" strokeWidth="0.75" />
      {/* Profile */}
      <path
        className="dp"
        d="M 2,33 L 10,30 L 18,31 L 26,24 L 34,20 L 40,22 L 50,12 L 60,5 L 68,9 L 76,7"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Summit dot */}
      <circle cx="60" cy="5" r="2" fill="currentColor" className="fi" style={{ opacity: 0 }} />
    </svg>
  );
}

function MountainSVG() {
  // Clean mountain silhouette + a descent line on the far side
  return (
    <svg width="82" height="44" viewBox="0 0 82 44" fill="none" aria-hidden>
      {/* Mountain ridge */}
      <path
        className="dp"
        d="M 4,40 L 20,16 L 28,24 L 40,6 L 58,40"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Ski descent — a sweeping dotted line down the right face */}
      <path
        className="dp-dot"
        d="M 40,6 C 46,16 48,24 54,30 C 58,34 62,36 68,40"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeDasharray="3 4"
      />
    </svg>
  );
}

function RowingSVG() {
  // Rhythmic water wave + paired oar strokes at each crest
  return (
    <svg width="82" height="36" viewBox="0 0 82 36" fill="none" aria-hidden>
      {/* Water */}
      <path
        className="dp"
        d="M 0,22 C 10,15 20,29 30,22 C 40,15 50,29 60,22 C 70,15 78,26 82,22"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {/* Left oar */}
      <path className="dp d1" d="M 20,12 L 20,22" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      {/* Right oar */}
      <path className="dp d2" d="M 60,12 L 60,22" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function CedarSVG() {
  // Layered cedar tree — three triangular tiers + trunk
  return (
    <svg width="48" height="50" viewBox="0 0 48 50" fill="none" aria-hidden>
      <path
        className="dp"
        d="M 24,48 L 24,34"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        className="dp d1"
        d="M 6,38 L 24,28 L 42,38"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className="dp d2"
        d="M 11,30 L 24,18 L 37,30"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className="dp d3"
        d="M 16,22 L 24,10 L 32,22"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PagesSVG() {
  // Book pages fanning open from a spine
  return (
    <svg width="54" height="40" viewBox="0 0 54 40" fill="none" aria-hidden>
      {/* Spine */}
      <path className="dp" d="M 27,36 L 27,8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Left pages */}
      <path className="dp d1" d="M 27,34 Q 10,28 8,10 L 27,14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path className="dp d2" d="M 27,34 Q 14,24 14,6 L 27,10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Right pages */}
      <path className="dp d1" d="M 27,34 Q 44,28 46,10 L 27,14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path className="dp d2" d="M 27,34 Q 40,24 40,6 L 27,10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LeavesSVG() {
  // Stem with three leaves unfurling
  return (
    <svg width="48" height="52" viewBox="0 0 48 52" fill="none" aria-hidden>
      {/* Stem */}
      <path
        className="dp"
        d="M 24,50 C 24,42 22,34 24,22 C 26,12 24,4 24,4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {/* Left leaf — low */}
      <path
        className="dp d1"
        d="M 22,34 C 12,30 6,20 12,13 C 15,18 19,28 22,34 Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right leaf — mid */}
      <path
        className="dp d2"
        d="M 26,24 C 36,20 42,11 36,4 C 33,9 29,18 26,24 Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Left leaf — high, small */}
      <path
        className="dp d3"
        d="M 22,16 C 15,14 10,8 14,4 C 16,7 20,12 22,16 Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const FACTS: { text: string; Anim: () => React.ReactElement }[] = [
  { text: "Military veteran — medical evacuations",           Anim: HeartbeatSVG },
  { text: "Search and rescue volunteer for 2 years",          Anim: SonarSVG     },
  { text: "Crisis text line volunteer for 2 years",           Anim: RadioWaveSVG },
  { text: "Backpacked solo for 7 months",                     Anim: BackpackSVG  },
  { text: "Ultra marathon runner",                            Anim: ElevationSVG },
  { text: "Backcountry skier",                                Anim: MountainSVG  },
  { text: "Nationally ranked competitive rower — team captain", Anim: RowingSVG  },
  { text: "First generation Lebanese American",               Anim: CedarSVG    },
  { text: "Avid reader",                                      Anim: PagesSVG    },
  { text: "Too many plants",                                  Anim: LeavesSVG   },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div
        style={{
          backgroundColor: "var(--sh-bg)",
          color:           "var(--sh-text)",
          height:          "100vh",
          overflowY:       "auto",
        }}
      >
        <main
          style={{
            maxWidth: "960px",
            margin:   "0 auto",
            padding:  "56px 60px 120px",
          }}
        >
          {/* ── Back nav ─────────────────────────────────────────────────── */}
          <nav style={{ marginBottom: "72px" }}>
            <Link
              href="/"
              className="ab-back"
              style={{
                display:        "inline-flex",
                alignItems:     "center",
                gap:            "7px",
                fontSize:       "12px",
                letterSpacing:  "0.06em",
                textTransform:  "uppercase",
                color:          "var(--sh-text-faint)",
                textDecoration: "none",
                transition:     "color 0.2s ease",
                fontFamily:     "ui-monospace, 'SF Mono', Menlo, monospace",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path d="M 8,2 L 3,6 L 8,10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to tool
            </Link>
          </nav>

          {/* ── Hero — photo + bio ───────────────────────────────────────── */}
          <section
            className="ab-hero"
            style={{
              display:    "flex",
              gap:        "72px",
              alignItems: "flex-start",
            }}
          >
            {/* Photo placeholder */}
            <div
              className="ab-photo"
              style={{
                width:           "280px",
                minWidth:        "280px",
                height:          "380px",
                borderRadius:    "14px",
                border:          "1px solid var(--sh-border)",
                backgroundColor: "var(--sh-panel)",
                display:         "flex",
                alignItems:      "center",
                justifyContent:  "center",
                flexShrink:      0,
                overflow:        "hidden",
              }}
            >
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.8"
                aria-hidden
                style={{ opacity: 0.18 }}
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M 4,20 C 4,16 7.6,13 12,13 S 20,16 20,20" />
              </svg>
            </div>

            {/* Bio */}
            <div style={{ flex: 1, paddingTop: "4px" }}>
              {BIO_PARAGRAPHS.map((para, i) => (
                <p
                  key={i}
                  style={{
                    fontSize:      "16px",
                    fontWeight:    400,
                    lineHeight:    1.75,
                    letterSpacing: "-0.01em",
                    color:         "var(--sh-text)",
                    margin:        0,
                    marginBottom:  i < BIO_PARAGRAPHS.length - 1 ? "28px" : 0,
                  }}
                >
                  {para}
                </p>
              ))}
            </div>
          </section>

          {/* ── Facts ───────────────────────────────────────────────────── */}
          <section style={{ marginTop: "96px" }}>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {FACTS.map(({ text, Anim }, i) => (
                <li key={i} className="ab-fact">
                  <span className="ab-fact-text">{text}</span>
                  <div className="ab-anim">
                    <Anim />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </main>
      </div>
    </>
  );
}
