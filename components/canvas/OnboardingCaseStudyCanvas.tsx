"use client";

// ─── OnboardingCaseStudyCanvas ───────────────────────────────────────────────
// Case study: Onboarding Flow at Qualiti.
// Full-page, no left nav. Uses shared case study primitives.

import { useCallback } from "react";
import { useAppStore } from "@/lib/store";
import { MONO, SectionLabel, SectionHeading, Body, Divider, BackButton, ScrollReveal } from "./CaseStudyShared";

export function OnboardingCaseStudyCanvas() {
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
            Product Design · Qualiti
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
            Onboarding Flow
          </h1>
        </div>

        {/* Right column — overview */}
        <div>
          <Body>
            Every time a new customer signed up for Qualiti, they needed to get their project set
            up before they could see any value from the platform. The setup process involved
            multiple disconnected steps across different pages, and users were dropping off before
            ever running a test. The goal was to design a streamlined first-run experience that
            could get a user from sign-up to a successful test run in 15 minutes or less.
          </Body>
        </div>
      </section>

      <Divider />

      {/* ── Header image ──────────────────────────────────────────────────── */}
      <ScrollReveal>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/header_flow.png"
          alt="Onboarding flow overview"
          style={{
            display:      "block",
            width:        "100%",
            marginBottom: "56px",
            borderRadius: "10px",
            border:       "1px solid var(--shouf-border)",
          }}
        />
      </ScrollReveal>

      <Divider />

      {/* ── Problem & Context ─────────────────────────────────────────────── */}
      <ScrollReveal>
        <>
          <section style={{ marginBottom: "32px", maxWidth: "800px" }}>
            <SectionLabel>Problem &amp; Context</SectionLabel>
            <SectionHeading>
              Users were dropping off before they ever saw the product work.
            </SectionHeading>
            <Body>
              Even after simplifying the core product, there was a circular dependency. Users needed
              to set up profiles to run tests, but didn&apos;t understand why until they saw tests
              working. The setup process was overly complicated, and it wasn&apos;t clear what was
              required or where to begin.
            </Body>
            <Body>
              60% of users were abandoning during project setup, and another 25% were dropping off
              during profile creation.
            </Body>
          </section>
        </>
      </ScrollReveal>

      <Divider />

      {/* ── Solution ──────────────────────────────────────────────────────── */}
      <ScrollReveal>
        <section style={{ marginBottom: "56px", maxWidth: "800px" }}>
          <SectionLabel>Solution</SectionLabel>

          {/* Project Setup */}
          <SectionHeading>Project Setup</SectionHeading>
          <Body>
            The onboarding flow was designed as a 4-step process that prioritized momentum over
            technical perfection — value before complexity. The first step was setting up the
            project. This step was actually optional, but it made such an impact on the quality of
            tests the platform could provide that it felt important to include.
          </Body>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/solution_1_flow.png"
            alt="Solution step 1: project setup"
            style={{
              display:      "block",
              width:        "100%",
              marginBottom: "48px",
              borderRadius: "10px",
              border:       "1px solid var(--shouf-border)",
            }}
          />
        </>
      </ScrollReveal>

      <ScrollReveal>
        <section style={{ marginBottom: "32px", maxWidth: "800px" }}>
          {/* User Profile */}
          <SectionHeading>User Profile</SectionHeading>
          <Body>
            The user profile was stripped down to the bare essentials and included directly in the
            flow so everything was in one place. Users wanting advanced setup could access it from
            this screen. Validation was also available before continuing, allowing users to correct
            any errors right away that would prevent a successful test run.
          </Body>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/solution_2_flow.png"
            alt="Solution step 2: user profile"
            style={{
              display:      "block",
              width:        "100%",
              marginBottom: "48px",
              borderRadius: "10px",
              border:       "1px solid var(--shouf-border)",
            }}
          />
        </>
      </ScrollReveal>

      <ScrollReveal>
        <section style={{ marginBottom: "32px", maxWidth: "800px" }}>
          {/* Features & Tests */}
          <SectionHeading>Features &amp; Tests</SectionHeading>
          <Body>
            At Qualiti, the AI runs tests, but it also recommends tests and folders and can build
            out a full test suite. The flow walked users through this and encouraged them to get to
            that wow moment quickly by having them just choose one folder and one test for now.
          </Body>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/solution_3_flow.png"
            alt="Solution step 3: features and tests"
            style={{
              display:      "block",
              width:        "100%",
              marginBottom: "48px",
              borderRadius: "10px",
              border:       "1px solid var(--shouf-border)",
            }}
          />
        </>
      </ScrollReveal>

      <ScrollReveal>
        <section style={{ marginBottom: "32px", maxWidth: "800px" }}>
          {/* Guided Walkthrough */}
          <SectionHeading>Guided Walkthrough</SectionHeading>
          <Body>
            After completing the flow, users were taken to the test library where they could see
            the test and folder just created. A 3-step popout walkthrough showed how to return to
            key areas — where to create user profiles, where to add more folders and tests, and how
            to view the test just made.
          </Body>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/solution_4_flow.png"
            alt="Solution step 4: guided walkthrough"
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

      {/* ── Reflection ────────────────────────────────────────────────────── */}
      <ScrollReveal>
        <section style={{ marginBottom: "56px", maxWidth: "800px" }}>
          <SectionLabel>Reflection</SectionLabel>
          <SectionHeading>From 12% to 78% completion — and what still needs work</SectionHeading>
          <Body>
            Time to first successful test run went from 2+ hours down to 15 minutes. Onboarding
            completion rate went from 12% to 78%. The flow worked really well for the first user
            setting up a project — users were actually able to onboard themselves for the first time.
          </Body>
          <Body>
            However, the flow wasn&apos;t fully built to scale. The first person setting up the
            project gets the full experience, and the next person on the team just gets the popout
            bubbles. There wasn&apos;t an opportunity to test whether that was clear for follow-on
            team members, since there were limited customers at the time with only one person per
            company using the app.
          </Body>
          <Body>
            Even as simplified as the flow was, it still felt complex. Engineering confirmed this
            was the minimum information an automated AI system needed to build a functional test
            suite. Biggest takeaway: onboarding isn&apos;t about explaining the product — it&apos;s
            about proving the value proposition. Design for emotional momentum, not just functional
            completion.
          </Body>
        </section>
      </ScrollReveal>

    </div>
  );
}
