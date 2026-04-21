"use client";

// ─── RcCaseStudyCanvas ──────────────────────────────────────────────────────
// Combined case study page for Responsive Components.
// Full-page, no left nav, no max-width constraint. Content spans full width.
// Uses shared case study primitives for consistent storytelling.

import { useCallback } from "react";
import { useAppStore } from "@/lib/store";
import { RcGlobalNavCanvas } from "./RcGlobalNavCanvas";
import { MONO, SectionLabel, SectionHeading, Body, Divider, BackButton, ScrollReveal } from "./CaseStudyShared";

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
        flex:          1,
        overflowY:     "auto",
        display:       "flex",
        flexDirection: "column",
        padding:       "40px 192px 80px",
      }}
    >
      {/* ── Back button ──────────────────────────────────────────────── */}
      <BackButton onClick={goToWork} />

      {/* ── Hero — two-column overview ─────────────────────────────────── */}
      <section
        style={{
          marginBottom:        "48px",
          display:             "grid",
          gridTemplateColumns: "1fr 1fr",
          gap:                 "64px",
          alignItems:          "start",
        }}
      >
        {/* Left column — label + display headline */}
        <div>
          <div
            style={{
              fontFamily:    MONO,
              fontSize:      "12px",
              fontWeight:    800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color:         "var(--shouf-accent)",
              marginBottom:  "18px",
            }}
          >
            Responsive Components
          </div>
          <h1
            style={{
              fontSize:      "58px",
              fontWeight:    600,
              color:         "var(--shouf-text)",
              margin:        0,
              letterSpacing: "-0.03em",
              lineHeight:    1.1,
            }}
          >
            Responsive Navigation
          </h1>
        </div>

        {/* Right column — overview body text */}
        <div style={{ paddingTop: "36px" }}>
          <Body>
            BambooHR&apos;s in-platform experience was built desktop-first, with over 95% of the
            product lacking responsive behavior. This initiative proposes a strategic shift toward
            a responsive, mobile-aware platform as a foundational capability — improving
            accessibility, unblocking product innovation, and supporting a modern, hybrid
            workforce.
          </Body>
        </div>
      </section>

      {/* ── Live Component — full width, immersive ───────────────────────── */}
      <ScrollReveal>
      <section style={{ marginBottom: "48px" }}>
        <div
          style={{
            fontFamily:    MONO,
            fontSize:      "14px",
            fontWeight:    600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color:         "var(--shouf-text-faint)",
            marginBottom:  "16px",
          }}
        >
          Live Component
        </div>
        <div
          style={{
            width:        "100%",
            height:       "820px",
            border:       "1px solid var(--shouf-border)",
            borderRadius: "12px",
            overflow:     "hidden",
            background:   "var(--shouf-panel)",
          }}
        >
          <RcGlobalNavCanvas />
        </div>
      </section>
      </ScrollReveal>

      <Divider />

      {/* ── Problem ────────────────────────────────────────────────────── */}
      <ScrollReveal>
        <>
          <section style={{ marginBottom: "32px", maxWidth: "800px" }}>
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/problem_navigation.png"
            alt="Problem: navigation constraints"
            style={{
              display:      "block",
              width:        "100%",
              marginBottom: "56px",
              borderRadius: "10px",
              border:       "1px solid var(--shouf-border)",
            }}
          />
        </>
      </ScrollReveal>

      <Divider />

      {/* ── Solution ───────────────────────────────────────────────────── */}
      <ScrollReveal>
      <section style={{ marginBottom: "56px", maxWidth: "800px" }}>
        <SectionLabel>Solution</SectionLabel>
        <SectionHeading>
          Establish responsiveness as a built-in platform standard, not a one-off exception.
        </SectionHeading>
        <Body>
          Instead of a disruptive rewrite, we&apos;re embedding responsive foundations directly
          into the Fabric Design System so teams get responsiveness by default as part of their
          normal product work. This also opens the door to a hybrid mobile architecture where
          native app teams can embed responsive web features directly — helping close a 40:1
          web-to-mobile engineering gap.
        </Body>
        <Body>
          For navigation specifically, we&apos;re removing stacked navigation levels by nesting
          them within the left nav. This works better across the board — on mobile, on desktop
          when split panes are active, or when the Ask BambooHR AI panel is taking up screen real
          estate. When the left nav is collapsed, fly-out menus surface the sub-navigation. As an
          interim step, until we can rework the Settings side nav, mobile will show a dropdown at
          the top of the page while desktop keeps the side navigation.
        </Body>
      </section>
      </ScrollReveal>

      <Divider />

      {/* ── Research ───────────────────────────────────────────────────── */}
      <ScrollReveal>
        <>
          <section style={{ marginBottom: "32px", maxWidth: "800px" }}>
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/testing_navigation.png"
            alt="Research: navigation testing"
            style={{
              display:      "block",
              width:        "100%",
              marginBottom: "56px",
              borderRadius: "10px",
              border:       "1px solid var(--shouf-border)",
            }}
          />
        </>
      </ScrollReveal>

      <Divider />

      {/* ── Next Steps ─────────────────────────────────────────────────── */}
      <ScrollReveal>
        <>
          <section style={{ marginBottom: "32px", maxWidth: "800px" }}>
            <SectionLabel>Next Steps</SectionLabel>
            <SectionHeading>A phased rollout built around real constraints</SectionHeading>
            <Body>
              The prototype above shows the desired end state of the responsive navigation.
              However, due to architectural constraints, we will adopt this in a phased approach.
              Currently the navigation components are in a separate repo and each link uses an API
              call to connect it to another repo&apos;s pages. These API calls are slower than desired
              and would result in a poor user experience if we had to make API calls for each nested
              layer of the navigation component.
            </Body>
            <Body>
              For this first phase, the side navigation for each page will be shown as its own page
              on mobile. For example, for Files, instead of immediately landing on the All Files page
              or being able to choose which sub page you land on, it will take you to a /files page
              that shows only the sub navigation component.
            </Body>
            <Body>
              Once all critical foundational Fabric components are made responsive, these will all
              be released behind a feature flag. The page will render as is on mobile and will no
              longer be mocked to 900px. Feature teams will then have Q3 and Q4 to work on their
              product areas to complete additional work required to make these pages fully
              responsive. During this time, the rest of the Fabric components will be released and
              responsive compliance will become a default expectation for all teams.
            </Body>
          </section>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/current_navigation.png"
            alt="Next steps: current navigation"
            style={{
              display:      "block",
              width:        "100%",
              marginBottom: "56px",
              borderRadius: "10px",
              border:       "1px solid var(--shouf-border)",
            }}
          />
        </>
      </ScrollReveal>

      <Divider />

      {/* ── End navigation ─────────────────────────────────────────────── */}
      <div
        style={{
          display:        "flex",
          justifyContent: "space-between",
          alignItems:     "center",
          flexWrap:       "wrap",
          gap:            "16px",
          maxWidth:       "800px",
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
          <span>Next: Seamless Test Creation</span>
          <span>&rarr;</span>
        </button>
      </div>
    </div>
  );
}
