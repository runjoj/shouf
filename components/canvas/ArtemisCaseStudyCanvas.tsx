"use client";

// ─── ArtemisCaseStudyCanvas ──────────────────────────────────────────────────
// Case study: Project Artemis.
// Full-page, no left nav. Uses shared case study primitives.
// Artifact prototype is embedded via iframe below the hero.
//
// To update the prototype URL: replace ARTIFACT_URL below.

import { useCallback } from "react";
import { useAppStore } from "@/lib/store";
import { MONO, SectionLabel, SectionHeading, Body, Divider, BackButton, ScrollReveal } from "./CaseStudyShared";

// ── Replace with the Artifact share URL when ready ───────────────────────────
const ARTIFACT_URL = "/artemis_artifact.html";

export function ArtemisCaseStudyCanvas() {
  const { selectComponent, selectSection, setActiveMobilePanel } = useAppStore();

  const goToWork = useCallback(() => {
    selectComponent(null);
    selectSection("work");
    setActiveMobilePanel("canvas");
  }, [selectComponent, selectSection, setActiveMobilePanel]);

  return (
    <div
      style={{
        flex:          1,
        overflowY:     "auto",
        display:       "flex",
        flexDirection: "column",
        padding:       "40px clamp(20px, 10vw, 192px) 80px",
        boxSizing:     "border-box",
      }}
    >
      {/* ── Back button ──────────────────────────────────────────────────── */}
      <BackButton onClick={goToWork} />

      {/* ── Hero — two-column overview (stacks on mobile) ─────────────────── */}
      <section
        style={{
          marginBottom:        "48px",
          display:             "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(360px, 100%), 1fr))",
          gap:                 "32px",
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
            Product Design · Design System
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
            Project Artemis
          </h1>
        </div>

        {/* Right column — overview */}
        <div>
          <Body>
            Lead Designer for Project Artemis, one of Bamboo&apos;s top company priorities with
            30-day C-suite check-ins. Artemis is a 90-day initiative to compress the SDLC from an
            average of 90 days down to 7 through AI-orchestrated workflows. Responsible for
            designing the Artemis UI and defining the experience for PMs and designers working
            within this new model.
          </Body>
        </div>
      </section>

      <Divider />

      {/* ── Prototype — full width Artifact embed ─────────────────────────── */}
      <ScrollReveal>
        <section style={{ marginBottom: "56px" }}>
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
            Prototype
          </div>
          <div
            style={{
              width:          "100%",
              height:         "820px",
              border:         "1px solid var(--shouf-border)",
              borderRadius:   "12px",
              overflow:       "hidden",
              background:     "var(--shouf-panel)",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
            }}
          >
            {ARTIFACT_URL ? (
              <iframe
                src={ARTIFACT_URL}
                style={{ width: "100%", height: "100%", border: "none" }}
                allow="fullscreen"
                title="Project Artemis prototype"
              />
            ) : (
              <span
                style={{
                  fontFamily:    MONO,
                  fontSize:      "13px",
                  color:         "var(--shouf-text-faint)",
                  letterSpacing: "0.04em",
                }}
              >
                Prototype coming soon
              </span>
            )}
          </div>
        </section>
      </ScrollReveal>

      <Divider />

      {/* ── Problem & Context ─────────────────────────────────────────────── */}
      <ScrollReveal>
        <section style={{ marginBottom: "56px", maxWidth: "800px" }}>
          <SectionLabel>Problem &amp; Context</SectionLabel>
          <SectionHeading>
            Compressing a 90-day SDLC down to 7 through AI orchestration.
          </SectionHeading>
          <Body>
            The average feature at Bamboo takes 90 days to go from hypothesis to production. The
            goal of Project Artemis is to radically shorten that loop by using AI to orchestrate
            the SDLC — not just individual tasks, but the full pipeline. The challenge from a design
            perspective is making this experience usable and trustworthy for PMs and designers who
            are now working alongside AI in a fundamentally different workflow.
          </Body>
        </section>
      </ScrollReveal>

      <Divider />

      {/* ── Process ───────────────────────────────────────────────────────── */}
      <ScrollReveal>
        <section style={{ marginBottom: "56px", maxWidth: "800px" }}>
          <SectionLabel>Process</SectionLabel>
          <SectionHeading>Phased rollout with tight feedback loops</SectionHeading>
          <Body>
            The team is taking a deliberate, phased approach to rollout. Artemis is being released
            to a few teams at a time, with multiple check-ins per week to collect feedback. A
            dedicated Slack channel keeps the feedback loop tight between sessions. For the bug
            automations feature specifically, the team is testing against a few teams&apos; JIRA
            bug boards to validate the workflow in real conditions.
          </Body>
        </section>
      </ScrollReveal>

      <Divider />

      {/* ── Solution ──────────────────────────────────────────────────────── */}
      <ScrollReveal>
        <section style={{ marginBottom: "56px", maxWidth: "800px" }}>
          <SectionLabel>Solution</SectionLabel>
          <SectionHeading>Bug Automations</SectionHeading>
          <Body>
            The first feature area in production is bug automations — a page where AI-orchestrated
            workflows handle bug triage and routing. One PR is currently in production. The UI is
            designed to give PMs and designers clarity into what the AI is doing and confidence in
            the output, without requiring them to manage the underlying complexity.
          </Body>
        </section>
      </ScrollReveal>

      <Divider />

      {/* ── What's Next ───────────────────────────────────────────────────── */}
      <ScrollReveal>
        <section style={{ marginBottom: "56px", maxWidth: "800px" }}>
          <SectionLabel>What&apos;s Next</SectionLabel>
          <SectionHeading>Still in its first 90 days</SectionHeading>
          <Body>
            Artemis is still in its first 90 days. As more features move through the pipeline and
            more teams are onboarded, the research and iteration cycle will continue to shape both
            the product and the process. Early results and learnings will be added here as the
            initiative progresses.
          </Body>
        </section>
      </ScrollReveal>

    </div>
  );
}
