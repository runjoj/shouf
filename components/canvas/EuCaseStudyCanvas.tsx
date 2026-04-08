"use client";

// ─── EuCaseStudyCanvas ──────────────────────────────────────────────────────
// Combined case study page for Seamless Test Creation.
// Full-canvas, scrollable, no sidebar. Breadcrumb → case study content →
// end navigation. Same template as RcCaseStudyCanvas.

import { useCallback } from "react";
import { useAppStore } from "@/lib/store";
import { CaseStudyImage } from "./CaseStudyImage";

// ─── Shared typography ──────────────────────────────────────────────────────

const MONO = "var(--font-mono)";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily:    MONO,
        fontSize:      "22px",
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
        fontSize:      "28px",
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
        fontSize:   "16px",
        color:      "var(--shouf-text-muted)",
        lineHeight: 1.75,
        margin:     "0 0 16px",
      }}
    >
      {children}
    </p>
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

// ─── EuCaseStudyCanvas ──────────────────────────────────────────────────────

export function EuCaseStudyCanvas() {
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
        padding:       "40px 192px 80px",
      }}
    >
        {/* ── Back button ──────────────────────────────────────────────── */}
        <div style={{ marginBottom: "40px", maxWidth: "800px" }}>
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
              Eucalyptus Design System
            </div>
            <h1
              style={{
                fontSize:      "58px",
                fontWeight:    600,
                color:         "var(--shouf-text)",
                margin:        "0 0 12px",
                letterSpacing: "-0.03em",
                lineHeight:    1.1,
              }}
            >
              Seamless Test Creation
            </h1>
          </div>

          {/* Right column — overview body text */}
          <div style={{ paddingTop: "36px" }}>
            <Body>
              Adding tests to the test library was not an ideal experience due to its heavy use of
              modals. This was originally chosen due to legacy code, but when the time became
              available to rewrite the old code — an embedded experience became possible.
            </Body>
          </div>
        </section>

        {/* ── Gif ────────────────────────────────────────────────────────── */}
        <section style={{ marginBottom: "72px" }}>
          <div
            style={{
              overflow:     "hidden",
              borderRadius: "8px",
              border:       "1px solid var(--shouf-border-sub)",
            }}
          >
            <video
              src="/seamlesss_test_experience.mov"
              autoPlay
              loop
              muted
              playsInline
              style={{
                width:     "100%",
                display:   "block",
                marginTop: "-1px",
              }}
            />
          </div>
        </section>

        <Divider />

        {/* ── Problem ────────────────────────────────────────────────────── */}
        <section style={{ marginBottom: "32px", maxWidth: "800px" }}>
          <SectionLabel>Problem</SectionLabel>
          <SectionHeading>Qualiti used a lot of old, legacy code.</SectionHeading>
          <Body>
            The company originally started with just a few people, and one main developer. In order
            to quickly build a product to show to investors, a great deal of the application was
            built with uncustomizable tables. This resulted in the need for a lot of modals. Any time
            the user wanted to add or edit something, instead of being able to act directly on the
            page, a modal would pop up and the user would have to interact with the modal instead.
          </Body>
          <Body>
            Modals get the job done, but should really only be used for alerts or specific messaging
            with limited inputs. Creating a seamless experience in the application is less jarring
            for the user and helps them keep context.
          </Body>
        </section>

        {/* ── Problem images ─────────────────────────────────────────────── */}
        <section style={{ marginBottom: "56px", display: "flex", flexDirection: "column", gap: "40px" }}>
          <CaseStudyImage src="/add_test_1.png" alt="Legacy add test flow — step 1" style={{ borderRadius: "8px", border: "1px solid var(--shouf-border-sub)" }} />
          <CaseStudyImage src="/add_test_2.png" alt="Legacy add test flow — step 2" style={{ borderRadius: "8px", border: "1px solid var(--shouf-border-sub)" }} />
        </section>

        <Divider />

        {/* ── Solution ───────────────────────────────────────────────────── */}
        <section style={{ marginBottom: "56px", maxWidth: "800px" }}>
          <SectionLabel>Solution</SectionLabel>
          <SectionHeading>The introduction of embedding manual and suggested test creation.</SectionHeading>
          <Body>
            When new feature work slowed down, and resources were dedicated to updating old code,
            the opportunity arose to remove the old structured tables and use custom components. I
            created designs that allow for both of the flows users can take to add tests — suggested
            and manual.
          </Body>
          <Body>
            If a user selects suggested tests, the Qualiti Intelligence AI will prepare 3 tests for
            the user, who then has the ability to add or remove them. They are also able to generate
            similar tests to a suggested test, or they can manually edit that test instead. If a
            user just wants to add their own manual test, they have that option as well.
          </Body>
        </section>

        <Divider />

        {/* ── Research ───────────────────────────────────────────────────── */}
        <section style={{ marginBottom: "56px", maxWidth: "800px" }}>
          <SectionLabel>Research</SectionLabel>
          <SectionHeading>Competitive Analysis</SectionHeading>
          <Body>
            Embedding our test additions into the library was inspired while conducting competitive
            research for other companies. The product team discovered a competitor that had an
            impressive experience for adding test steps within the test view itself.
          </Body>
          <Body>
            After creating an updated experience for our users to add test steps, I realized that
            our users could benefit from a similar experience within the test library. At this stage,
            I would normally perform more thorough user research with actual users, however, this
            was not prioritized within the team and our restricted resources did not allow for it.
          </Body>
        </section>

        <Divider />

        {/* ── Takeaways ──────────────────────────────────────────────────── */}
        <section style={{ marginBottom: "56px", maxWidth: "800px" }}>
          <SectionLabel>Takeaways</SectionLabel>
          <SectionHeading>Learnings</SectionHeading>
          <Body>
            When we used the old code table for the test library, we had checkboxes on each row for
            a user to be able to select and act on multiple tests, and they also had the ability to
            select the entire row to go to that test&apos;s detailed view. Checkboxes are a very
            small element to interact with and can take up a lot of valuable space on a table, so I
            wanted to find a way to move away from these while I had the opportunity.
          </Body>
          <Body>
            I struggled for a bit with how to allow users to still select multiple rows to take
            actions on them, but also still be able to click to easily go to a test&apos;s detailed
            view. I eventually came up with: selecting a row highlights that row and its actions,
            and the ability to do this with multiple rows. When you have a row selected or hover on
            a row, you then can see the action buttons that will appear for that row, including go
            to the detail view.
          </Body>

        </section>

        <CaseStudyImage src="/1. Library.png" alt="Test library design" style={{ borderRadius: "8px", border: "1px solid var(--shouf-border-sub)", marginBottom: "56px" }} />

        <Divider />

        {/* ── Next Steps ────────────────────────────────────────────────── */}
        <section style={{ marginBottom: "56px", maxWidth: "800px" }}>
          <SectionLabel>Looking Ahead</SectionLabel>
          <SectionHeading>Next Steps</SectionHeading>
          <Body>
            Some use cases were not addressed in this design — is a user able to add multiple
            manual tests at once? Is there a way for them to add more than three suggested tests
            at once? If they edit a suggested test, does the AI learn from that and is it still
            able to generate steps? To further refine this design, I would address these scenarios
            along with a few others not listed here. I would also add specific tags to tests that
            are generated by the AI versus ones that are made manually. Ideally I would do user
            research and see if there is a need to distinguish the two before proceeding.
          </Body>
        </section>

        <Divider />

        {/* ── End navigation ─────────────────────────────────────────────── */}
        <div
          style={{
            display:        "flex",
            justifyContent: "flex-start",
            alignItems:     "center",
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
        </div>
    </div>
  );
}
