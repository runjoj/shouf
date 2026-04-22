"use client";

// ─── QlCaseStudyCanvas ──────────────────────────────────────────────────────
// Case study page for Qualiti Portal Redesign.
// Full-canvas, scrollable, no sidebar. Uses shared case study primitives.

import { useCallback } from "react";
import { useAppStore } from "@/lib/store";
import { CaseStudyImage } from "./CaseStudyImage";
import {
  MONO,
  SectionLabel,
  SectionHeading,
  Body,
  Divider,
  BackButton,
  ScrollReveal,
} from "./CaseStudyShared";

// ─── QlCaseStudyCanvas ──────────────────────────────────────────────────────

export function QlCaseStudyCanvas() {
  const { selectComponent, selectSection, setActiveMobilePanel } = useAppStore();

  const goToWork = useCallback(() => {
    selectComponent(null);
    selectSection("work");
    setActiveMobilePanel("canvas");
  }, [selectComponent, selectSection, setActiveMobilePanel]);

  const goToEucalyptus = useCallback(() => {
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
        padding:       "40px clamp(20px, 10vw, 192px) 80px",
        boxSizing:     "border-box",
      }}
    >
        <BackButton onClick={goToWork} />

        {/* ── Hero — two-column overview (stacks on mobile) ──────────────── */}
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
              Qualiti
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
              Qualiti Portal Redesign
            </h1>
          </div>

          {/* Right column — overview paragraph */}
          <div>
            <Body>
              The Qualiti Portal is an application that uses AI to create tests for engineers.
              It was originally built as a working prototype by a software engineer. It was not
              meant for customer use and was primarily used for research. After gaining traction
              and customer interest, it went through a full redesign.
            </Body>
          </div>
        </section>

        <Divider />

        {/* ── Problem ────────────────────────────────────────────────────── */}
        <ScrollReveal>
          <section style={{ marginBottom: "32px", maxWidth: "800px" }}>
            <SectionLabel>Problem</SectionLabel>
            <SectionHeading>The Qualiti Portal was not created for users — it was created for internal use.</SectionHeading>
            <Body>
              The original Qualiti Portal was written by the first software engineer who was hired at
              Qualiti. The primary intention was to build it quickly so it could be shared internally
              with stakeholders. It was built using many prebuilt components and tables and did not
              factor in a user&apos;s perspective and needs.
            </Body>
            <Body>
              The Portal was created with two views. There was the Client View, which is what future
              users would see, and there was the Super View, which is what internal users would see.
              The Super View was thought of as the &ldquo;main view&rdquo; and all new features were
              added there and then later adapted for the Client View if needed, which often meant that
              the user was thought of last, if at all. When it came time to sell to customers, they
              were not able to understand how to use the Portal and had to have a lot of assistance
              from Qualiti.
            </Body>
          </section>
        </ScrollReveal>

        {/* ── Before ──────────────────────────────────────────────────────── */}
        <ScrollReveal>
          <section style={{ marginBottom: "56px" }}>
            <div
              style={{
                fontFamily:    MONO,
                fontSize:      "16px",
                fontWeight:    700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color:         "var(--shouf-text-faint)",
                marginBottom:  "16px",
              }}
            >
              Before
            </div>
            <CaseStudyImage
              src="/before.jpg"
              alt="Original Qualiti Portal before redesign"
              style={{ borderRadius: "8px", border: "1px solid var(--shouf-border-sub)" }}
            />
          </section>
        </ScrollReveal>

        <Divider />

        {/* ── Solution ───────────────────────────────────────────────────── */}
        <ScrollReveal>
          <section style={{ marginBottom: "32px", maxWidth: "800px" }}>
            <SectionLabel>Solution</SectionLabel>
            <SectionHeading>Recreate the user experience by prioritizing their needs and perspectives.</SectionHeading>
            <Body>
              The Client View went through a full redesign that now prioritizes the user experience.
              It has a clear end user and has a simplified user journey resulting in users being able
              to use the product on their own.
            </Body>
          </section>
        </ScrollReveal>

        {/* ── After ───────────────────────────────────────────────────────── */}
        <ScrollReveal>
          <section style={{ marginBottom: "56px" }}>
            <div
              style={{
                fontFamily:    MONO,
                fontSize:      "16px",
                fontWeight:    700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color:         "var(--shouf-text-faint)",
                marginBottom:  "16px",
              }}
            >
              After
            </div>
            <CaseStudyImage
              src="/final2.jpg"
              alt="Redesigned Qualiti Portal"
              style={{ borderRadius: "8px", border: "1px solid var(--shouf-border-sub)" }}
            />
          </section>
        </ScrollReveal>

        <Divider />

        {/* ── Research: Competitive Analysis ──────────────────────────────── */}
        <ScrollReveal>
          <section style={{ marginBottom: "56px", maxWidth: "800px" }}>
            <SectionLabel>Research</SectionLabel>
            <SectionHeading>Competitive Analysis</SectionHeading>
            <Body>
              Due to not being able to conduct primary research on real customers, I focused heavily
              on secondary research by doing a deep competitive analysis. The Product Team had just
              finalized our primary persona when I joined the team — a Quality Assurance Engineer.
              Therefore, I prioritized my efforts both on companies that use AI, but also on companies
              that offer test management software that is popular with engineers already.
            </Body>
            <Body>
              Our team also has two of our own QA Engineers, so I was able to ask them detailed
              questions about what they liked and disliked about our product, as well as other products
              and why. In an attempt to get more feedback, I conducted a few usability interviews and
              sent out surveys to my network.
            </Body>
          </section>
        </ScrollReveal>

        <Divider />

        {/* ── Research: Information Architecture ──────────────────────────── */}
        <ScrollReveal>
          <section style={{ marginBottom: "56px", maxWidth: "800px" }}>
            <SectionLabel>Research</SectionLabel>
            <SectionHeading>Information Architecture</SectionHeading>
            <Body>
              Throughout the process of understanding our application and creating detailed Information
              Architecture, I learned that we are including a lot of features and pages that don&apos;t
              make sense for a user or are not working as intended. These diagrams and files are linked
              publicly in my Design space in our Company&apos;s Notion and are kept up to date at all
              times as the application matures.
            </Body>
          </section>
        </ScrollReveal>

        {/* Research + Architecture images — full width, stacked */}
        <ScrollReveal>
          <div style={{ display: "flex", flexDirection: "column", gap: "40px", marginBottom: "56px" }}>
            <CaseStudyImage src="/research.jpg" alt="Competitive analysis research" />
            <CaseStudyImage src="/architecture.jpg" alt="Information architecture diagram" />
          </div>
        </ScrollReveal>

        <Divider />

        {/* ── Design: Wireframing ─────────────────────────────────────────── */}
        <ScrollReveal>
          <section style={{ marginBottom: "56px", maxWidth: "800px" }}>
            <SectionLabel>Design</SectionLabel>
            <SectionHeading>Wireframing</SectionHeading>
            <Body>
              After laying out our new Information Architecture as well as improved user flows, I set
              to work creating wireframes. I had a lot of questions and notes on how our application
              works, and took these to the leadership in engineering to better understand our product
              and our long term goals. I shared my wireframes with different members of the team going
              through many iterations to get to a version that seemed ready to be refined.
            </Body>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <CaseStudyImage src="/wireframes.jpg" alt="Wireframes" style={{ marginBottom: "56px" }} />
        </ScrollReveal>

        <Divider />

        {/* ── Design: Accessibility ───────────────────────────────────────── */}
        <ScrollReveal>
          <section style={{ marginBottom: "56px", maxWidth: "800px" }}>
            <SectionLabel>Design</SectionLabel>
            <SectionHeading>Accessibility</SectionHeading>
            <Body>
              After testing our left navigation and current branding guidelines, I realized that we
              are failing accessibility standards set by the WCAG. I tested several updated variations
              of our branding and created a presentation for the CEO showcasing my recommendations.
              With all of our stakeholders approval, we moved forward with our updated branding as
              displayed in the new designs.
            </Body>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <CaseStudyImage src="/accessibility.jpg" alt="Accessibility audit and branding updates" style={{ marginBottom: "56px" }} />
        </ScrollReveal>

        <Divider />

        {/* ── Design: Design System ───────────────────────────────────────── */}
        <ScrollReveal>
          <section style={{ marginBottom: "56px", maxWidth: "800px" }}>
            <SectionLabel>Design</SectionLabel>
            <SectionHeading>Design System</SectionHeading>
            <Body>
              Due to being the first designer hired at the company, there were no design guidelines,
              processes, or systems in place. While creating my prototype screens, I decided to create
              a Design System. My goal was to establish standards and consistency for our design
              elements as well as to create reusable components that the engineering team could create
              and reuse, increasing our efficiency as a company.{" "}
              <button
                onClick={goToEucalyptus}
                style={{
                  all:        "unset",
                  cursor:     "pointer",
                  color:      "var(--shouf-accent)",
                  fontWeight: 500,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.textDecoration = "underline";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.textDecoration = "none";
                }}
              >
                Learn more about the Eucalyptus Design System here.
              </button>
            </Body>
          </section>
        </ScrollReveal>

        <Divider />

        {/* ── Feedback: Prototype Refinement ──────────────────────────────── */}
        <ScrollReveal>
          <section style={{ marginBottom: "32px", maxWidth: "800px" }}>
            <SectionLabel>Feedback</SectionLabel>
            <SectionHeading>Prototype Refinement</SectionHeading>
            <Body>
              I received feedback that we do not want to include element ID&apos;s anywhere in our
              application except for in individual tests. The ID&apos;s were originally meant for
              internal use only and have no relevance to the user. In improved versions, I removed all
              IDs and also many table headers that no longer felt useful or relevant. I also learned
              from our QA team that the test descriptions in the library felt overwhelming. We decided
              to create titles for tests, and show those in the table instead. Lastly, I was told that
              some pages felt cluttered, so I decided on using a tab view for most pages so that pages
              felt more contained, organized, and consistent across the application.
            </Body>
          </section>
        </ScrollReveal>

        <Divider />

        {/* ── Handoff ─────────────────────────────────────────────────────── */}
        <ScrollReveal>
          <section style={{ marginBottom: "56px", maxWidth: "800px" }}>
            <SectionLabel>Handoff</SectionLabel>
            <SectionHeading>Presenting to Developers</SectionHeading>
            <Body>
              Due to my past experience working as a Front End Developer with an early interest in
              the design process, I always appreciated working with designers who gave me a chance to
              see upcoming designs and give feedback from a technical perspective ahead of time. At
              Qualiti, I established biweekly Design/Dev meetings where the focus is on the engineers.
              I present upcoming designs a few sprints ahead of time, and walk through the prototypes
              while answering questions. I found that this creates a lot of trust and open communication
              between teams and increases buy-in for UI changes.
            </Body>
          </section>
        </ScrollReveal>

        <Divider />

        {/* ── Takeaways: Learnings ────────────────────────────────────────── */}
        <ScrollReveal>
          <section style={{ marginBottom: "56px", maxWidth: "800px" }}>
            <SectionLabel>Takeaways</SectionLabel>
            <SectionHeading>Learnings</SectionHeading>
            <Body>
              I learned a lot throughout this process and it was really rewarding to see it through
              to now being a functional product with the new designs. This was the first big project
              I worked on at Qualiti and since there was not a design process in place, I had to learn
              a lot with creating and documenting my Design Process, and how to integrate within the
              team. I added in the Design/Dev meetings a little bit too late in the process, but once
              they began I noticed huge improvements with communication and addressing design issues
              well ahead of time.
            </Body>
            <Body>
              Also, from talking to the engineers and being really involved in the sprint process, I
              learned that sometimes key architectural changes and decisions were missed which then led
              to work taking longer than expected or needing to rewrite code. I learned to include a
              section of Technical Change Highlights in my Design/Dev meetings of architectural changes
              that I know of to ensure they are addressed in Technical Design meetings.
            </Body>
            <Body>
              Lastly, I initially started the process with individual files for different designs
              grouped by sprints. This started to get confusing because work would bleed into later
              timeframes and it was hard to keep track of what designs were where. Once I started to
              organize them by the overarching concept (i.e. Test Library), with sub pages relating to
              different aspects of those designs, it became a lot easier for everyone, myself included.
            </Body>
          </section>
        </ScrollReveal>

        <Divider />

        {/* ── Next Steps ──────────────────────────────────────────────────── */}
        <ScrollReveal>
          <section style={{ marginBottom: "56px", maxWidth: "800px" }}>
            <SectionLabel>Looking Ahead</SectionLabel>
            <SectionHeading>Next Steps</SectionHeading>
            <Body>
              While we are getting a lot closer to a version of the product that we believe customers
              will love, we still won&apos;t know for sure until we can do usability tests. The goal
              is to be very hands on with our initial customers who are signing on in the next few
              months and ask them about their experience and document their feedback as much as
              possible. We will then analyze the data with affinity maps, prioritize their feedback,
              and determine next steps based on what the user needs.
            </Body>
          </section>
        </ScrollReveal>

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
