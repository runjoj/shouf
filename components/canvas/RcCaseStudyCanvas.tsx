"use client";

// ─── RcCaseStudyCanvas ──────────────────────────────────────────────────────
// Combined case study page for Responsive Components.
// Full-canvas, scrollable, no sidebar. Breadcrumb → case study content →
// live interactive component → end navigation.

import { useCallback } from "react";
import { useAppStore } from "@/lib/store";
import { RcGlobalNavCanvas } from "./RcGlobalNavCanvas";

// ─── Shared typography ──────────────────────────────────────────────────────

const MONO = "var(--font-mono)";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily:    MONO,
        fontSize:      "12px",
        fontWeight:    800,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color:         "var(--shouf-text-faint)",
        marginBottom:  "10px",
      }}
    >
      {children}
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
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

function Body({ children }: { children: React.ReactNode }) {
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

function BulletList({ items }: { items: string[] }) {
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

function SubHeading({ children }: { children: React.ReactNode }) {
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

function Divider() {
  return (
    <div
      style={{
        height:          "1px",
        backgroundColor: "var(--shouf-border-sub)",
        margin:          "0 0 48px",
      }}
    />
  );
}

// ─── RcCaseStudyCanvas ──────────────────────────────────────────────────────

export function RcCaseStudyCanvas() {
  const { selectComponent, selectSection, setActiveMobilePanel } = useAppStore();

  const goToWork = useCallback(() => {
    selectComponent(null);
    selectSection("work");
    setActiveMobilePanel("canvas");
  }, [selectComponent, selectSection, setActiveMobilePanel]);

  const goToEmbedded = useCallback(() => {
    selectSection(null);
    selectComponent("eu-embedded");
    setActiveMobilePanel("canvas");
  }, [selectComponent, selectSection, setActiveMobilePanel]);

  return (
    <div
      style={{
        flex:         1,
        overflowY:    "auto",
        display:      "flex",
        flexDirection: "column",
        alignItems:   "center",
      }}
    >
      <div
        style={{
          width:        "100%",
          maxWidth:     "800px",
          padding:      "40px 48px 80px",
          display:      "flex",
          flexDirection: "column",
        }}
      >
        {/* ── Back button ──────────────────────────────────────────────── */}
        <div style={{ marginBottom: "40px" }}>
          <button
            onClick={goToWork}
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

        {/* ── Overview ───────────────────────────────────────────────────── */}
        <section style={{ marginBottom: "72px" }}>
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
        </section>

        <Divider />

        {/* ── Problem ────────────────────────────────────────────────────── */}
        <section style={{ marginBottom: "72px" }}>
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
        </section>

        <Divider />

        {/* ── Solution ───────────────────────────────────────────────────── */}
        <section style={{ marginBottom: "72px" }}>
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
        </section>

        <Divider />

        {/* ── Research ───────────────────────────────────────────────────── */}
        <section style={{ marginBottom: "72px" }}>
          <SectionLabel>Research</SectionLabel>
          <SectionHeading>User Interviews</SectionHeading>
          <Body>
            To inform the responsive approach, we conducted two rounds of user research. The first
            was 12 moderated interviews using wireframes, allowing us to gather early directional
            feedback on layout and structure. The second was 15 unmoderated interviews with a
            working prototype, focused specifically on navigational patterns and how users moved
            through the experience across screen sizes.
          </Body>
        </section>

        <Divider />

        {/* ── Design ─────────────────────────────────────────────────────── */}
        <section style={{ marginBottom: "72px" }}>
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
        </section>

        <Divider />

        {/* ── Next Steps ─────────────────────────────────────────────────── */}
        <section style={{ marginBottom: "72px" }}>
          <SectionLabel>Next Steps</SectionLabel>
          <SectionHeading>Pilot surface enablement</SectionHeading>
          <Body>
            Pilot surface enablement will convert a high-impact workflow to validate patterns.
            Responsive compliance becomes a default expectation for all new UI work, with VPAT
            alignment to follow.
          </Body>
        </section>

        <Divider />

        {/* ── Live Component ─────────────────────────────────────────────── */}
        <section style={{ marginBottom: "72px" }}>
          <div
            style={{
              fontFamily:    MONO,
              fontSize:      "11px",
              fontWeight:    600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color:         "var(--shouf-text-faint)",
              marginBottom:  "24px",
            }}
          >
            Live Component
          </div>
          <div
            style={{
              border:       "1px solid var(--shouf-border)",
              borderRadius: "12px",
              overflow:     "hidden",
              background:   "var(--shouf-panel)",
            }}
          >
            <RcGlobalNavCanvas />
          </div>
        </section>

        <Divider />

        {/* ── End navigation ─────────────────────────────────────────────── */}
        <div
          style={{
            display:        "flex",
            justifyContent: "space-between",
            alignItems:     "center",
            flexWrap:       "wrap",
            gap:            "16px",
          }}
        >
          <button
            onClick={goToWork}
            style={{
              all:           "unset",
              cursor:        "pointer",
              fontSize:      "14px",
              fontFamily:    MONO,
              color:         "var(--shouf-text-muted)",
              display:       "inline-flex",
              alignItems:    "center",
              gap:           "6px",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "var(--shouf-accent)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "var(--shouf-text-muted)";
            }}
          >
            <span>&larr;</span>
            <span>Back to Work</span>
          </button>

          <button
            onClick={goToEmbedded}
            style={{
              all:           "unset",
              cursor:        "pointer",
              fontSize:      "14px",
              fontFamily:    MONO,
              color:         "var(--shouf-text-muted)",
              display:       "inline-flex",
              alignItems:    "center",
              gap:           "6px",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "var(--shouf-accent)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "var(--shouf-text-muted)";
            }}
          >
            <span>Next: Embedded Experience</span>
            <span>&rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
}
