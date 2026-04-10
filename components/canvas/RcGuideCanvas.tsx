"use client";

import { useRef, useEffect, useState } from "react";
import {
  MONO,
  Section,
  GuideSectionLabel as SectionLabel,
  GuideSectionHeading as SectionHeading,
  GuideBody as Body,
  GuideDivider as Divider,
  GuideBulletList as BulletList,
  GuideSubHeading as SubHeading,
  GuideScrollReveal,
} from "./GuideShared";

// ─── Section map ──────────────────────────────────────────────────────────────

const SECTIONS = [
  { id: "overview",   label: "Overview"   },
  { id: "problem",    label: "Problem"    },
  { id: "solution",   label: "Solution"   },
  { id: "research",   label: "Research"   },
  { id: "design",     label: "Design"     },
  { id: "next-steps", label: "Next Steps" },
];

// ─── RcGuideCanvas ────────────────────────────────────────────────────────────

export function RcGuideCanvas() {
  const scrollRef  = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState("overview");

  // Track active section as user scrolls
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const ratios = new Map<string, number>();
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach(({ id }) => {
      const el = container.querySelector(`#guide-${id}`);
      if (!el) return;

      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => ratios.set(id, e.intersectionRatio));
          let bestId    = "overview";
          let bestRatio = -1;
          for (const [k, v] of ratios) {
            if (v > bestRatio) { bestRatio = v; bestId = k; }
          }
          setActiveId(bestId);
        },
        { root: container, threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
      );

      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  function jumpTo(id: string) {
    const container = scrollRef.current;
    const el = container?.querySelector(`#guide-${id}`) as HTMLElement | null;
    if (!el || !container) return;
    container.scrollTo({ top: el.offsetTop - 24, behavior: "smooth" });
  }

  return (
    <div
      ref={scrollRef}
      className="flex flex-col md:grid md:grid-cols-[200px_1fr]"
      style={{
        alignSelf:  "stretch",
        width:      "100%",
        maxWidth:   "880px",
        overflowY:  "auto",
        position:   "relative",
        alignItems: "start",
        margin:     "0 auto",
      }}
    >
      {/* ── Sticky section nav — first in DOM so it appears at top on mobile ── */}
      <nav
        className="md:sticky"
        style={{
          top:       "52px",
          alignSelf: "start",
          padding:   "24px 24px 0",
        }}
      >
        <div
          style={{
            fontFamily:    MONO,
            fontSize:      "11px",
            fontWeight:    500,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color:         "var(--shouf-text-faint)",
            marginBottom:  "14px",
          }}
        >
          On this page
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {SECTIONS.map(({ id, label }) => {
            const isActive = activeId === id;
            return (
              <button
                key={id}
                onClick={() => jumpTo(id)}
                style={{
                  all:             "unset",
                  display:         "block",
                  fontSize:        "14px",
                  fontWeight:      isActive ? 500 : 400,
                  color:           isActive ? "var(--shouf-text)" : "var(--shouf-text-faint)",
                  padding:         "8px 12px",
                  borderRadius:    "6px",
                  cursor:          "pointer",
                  backgroundColor: isActive ? "var(--shouf-hover)" : "transparent",
                  borderLeft:      isActive
                    ? "2px solid var(--shouf-accent)"
                    : "2px solid transparent",
                  transition:      "color 120ms ease, background-color 120ms ease, border-left-color 120ms ease",
                  whiteSpace:      "nowrap",
                  letterSpacing:   "-0.005em",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <div className="px-5 md:px-10 md:pl-12" style={{ paddingTop: "24px", paddingBottom: "120px", maxWidth: "680px" }}>

        {/* ── Overview ─────────────────────────────────────────────────────── */}
        <Section id="overview">
          <div style={{ marginBottom: "48px" }}>
            <div
              style={{
                fontFamily:    MONO,
                fontSize:      "12px",
                fontWeight:    800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color:         "var(--shouf-accent)",
                marginBottom:  "14px",
              }}
            >
              Responsive Components
            </div>
            <h1
              style={{
                fontSize:      "28px",
                fontWeight:    600,
                color:         "var(--shouf-text)",
                margin:        "0 0 20px",
                letterSpacing: "-0.025em",
                lineHeight:    1.15,
              }}
            >
              Responsive Site Development
            </h1>
            <Body>
              BambooHR&apos;s in-platform experience was built desktop-first, with over 95% of the
              product lacking responsive behavior. This initiative proposes a strategic shift toward
              a responsive, mobile-aware platform as a foundational capability — improving
              accessibility, unblocking product innovation, and supporting a modern, hybrid
              workforce.
            </Body>
          </div>

        </Section>

        <Divider />

        {/* ── Problem ──────────────────────────────────────────────────────── */}
        <GuideScrollReveal>
        <Section id="problem">
          <SectionLabel>Problem</SectionLabel>
          <SectionHeading>
            BambooHR&apos;s desktop-only approach introduced growing strategic and operational risk.
          </SectionHeading>
          <Body>
            Over 19% of unique users accessed the platform on mobile over a 90-day period, yet
            encountered experiences not designed for touch or small screens. At the same time,
            non-responsive layouts limited accessibility compliance efforts, blocked AI-assisted
            workflows, and created artificial constraints — such as dialog docking requiring
            ~2300px screen widths — that excluded the vast majority of users.
          </Body>
        </Section>
        </GuideScrollReveal>

        <Divider />

        {/* ── Solution ─────────────────────────────────────────────────────── */}
        <GuideScrollReveal>
        <Section id="solution">
          <SectionLabel>Solution</SectionLabel>
          <SectionHeading>
            Establish responsiveness as a built-in platform standard, not a one-off exception.
          </SectionHeading>
          <Body>
            Rather than a disruptive rewrite, the approach anchors responsive foundations in the
            design system (Fabricants), enabling teams to inherit responsiveness by default as part
            of normal product work. This also enables a &ldquo;Strategic Hybrid&rdquo; mobile
            architecture, allowing native app teams to embed responsive web features directly —
            addressing a 40:1 web-to-mobile engineering gap.
          </Body>
        </Section>
        </GuideScrollReveal>

        <Divider />

        {/* ── Research ─────────────────────────────────────────────────────── */}
        <GuideScrollReveal>
        <Section id="research">
          <SectionLabel>Research</SectionLabel>
          <SectionHeading>User Interviews</SectionHeading>
          <Body>
            To inform the responsive approach, we conducted two rounds of user research. The first
            was 12 moderated interviews using wireframes, allowing us to gather early directional
            feedback on layout and structure. The second was 15 unmoderated interviews with a
            working prototype, focused specifically on navigational patterns and how users moved
            through the experience across screen sizes.
          </Body>
        </Section>
        </GuideScrollReveal>

        <Divider />

        {/* ── Design ───────────────────────────────────────────────────────── */}
        <GuideScrollReveal>
        <Section id="design">
          <SectionLabel>Design</SectionLabel>
          <SectionHeading>Design System–Led Enablement</SectionHeading>
          <Body>
            The Fabricants team owns responsive primitives — breakpoints, layout grids, spacing
            tokens — so that responsiveness is inherited rather than re-solved at the feature
            level. Components are delivered incrementally across four categories:
          </Body>
          <BulletList
            items={[
              "Listener & Core Components",
              "Page Template & Structural Components",
              "Interactive & Form Components",
              "Data Display & Visualization Components",
            ]}
          />
          <SubHeading>Guiding Principles</SubHeading>
          <BulletList
            items={[
              "Responsive by default, not by exception",
              "Accessibility as a first-order constraint",
              "Build once, adapt everywhere",
              "Web and native are complementary, not competing",
            ]}
          />
        </Section>
        </GuideScrollReveal>

        <Divider />

        {/* ── Next Steps ───────────────────────────────────────────────────── */}
        <GuideScrollReveal>
        <Section id="next-steps">
          <SectionLabel>Next Steps</SectionLabel>
          <SectionHeading>Pilot surface enablement</SectionHeading>
          <Body>
            Pilot surface enablement will convert a high-impact workflow to validate patterns.
            Responsive compliance becomes a default expectation for all new UI work, with VPAT
            alignment to follow.
          </Body>
        </Section>
        </GuideScrollReveal>

      </div>
    </div>
  );
}
