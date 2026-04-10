"use client";

// ─── EuOverviewCanvas ───────────────────────────────────────────────────────
// Combined Eucalyptus DS overview page: tile grid view first, then case study
// content below a divider. Full-canvas, scrollable, no sidebar.

import { SectionGridCanvas } from "./SectionGridCanvas";

// ─── Shared typography ──────────────────────────────────────────────────────

const MONO = "var(--font-mono)";

import { SectionLabel as CaseStudySectionLabel } from "./CaseStudyShared";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <CaseStudySectionLabel>{children}</CaseStudySectionLabel>;
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontSize:      "26px",
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
        height:     "1px",
        margin:     "0 0 48px",
        background: "linear-gradient(to right, transparent, var(--shouf-border-sub) 20%, var(--shouf-border-sub) 80%, transparent)",
      }}
    />
  );
}

// ─── EuOverviewCanvas ───────────────────────────────────────────────────────

export function EuOverviewCanvas() {
  return (
    <div
      style={{
        flex:          1,
        overflowY:     "auto",
        display:       "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Tile grid view — full width ──────────────────────────────────── */}
      {/* Wrapper overrides SectionGridCanvas's height:100% so it sizes to content */}
      <div style={{ flex: "0 0 auto", overflow: "visible" }}>
        <SectionGridCanvas sectionId="eucalyptus" excludeIds={["eu-overview"]} noSelection />
      </div>

      {/* ── Divider between tiles and case study ─────────────────────────── */}
      <div style={{ padding: "0 192px" }}>
        <div
          style={{
            height:     "1px",
            marginBottom: "48px",
            background: "linear-gradient(to right, transparent, var(--shouf-border-sub) 20%, var(--shouf-border-sub) 80%, transparent)",
          }}
        />
      </div>

      {/* ── Case study content — matches case study padding ─────────────── */}
      <div
        style={{
          width:         "100%",
          padding:       "0 192px 80px",
          display:       "flex",
          flexDirection: "column",
        }}
      >
          {/* ── Overview ───────────────────────────────────────────────────── */}
          <section style={{ marginBottom: "72px" }}>
            <div style={{ marginBottom: "48px" }}>
              <div
                style={{
                  fontFamily:    MONO,
                  fontSize:      "14px",
                  fontWeight:    700,
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
                  fontSize:      "42px",
                  fontWeight:    600,
                  color:         "var(--shouf-text)",
                  margin:        "0 0 20px",
                  letterSpacing: "-0.03em",
                  lineHeight:    1.1,
                }}
              >
                The Eucalyptus Design Library was created for the Qualiti product and engineering team.
              </h1>
              <Body>
                Through the use of reusable components established in Eucalyptus, products and front-end code will follow a consistent design. It will also allow the team at Qualiti to deliver prototypes and products quickly.
              </Body>
            </div>

          </section>

          <Divider />

          {/* ── Problem ────────────────────────────────────────────────────── */}
          <section style={{ marginBottom: "72px" }}>
            <SectionLabel>Problem</SectionLabel>
            <SectionHeading>Qualiti did not have a standardized design system.</SectionHeading>
            <Body>
              The original Qualiti Portal was written by the first software engineer who was hired at Qualiti. The primary intention was to build it quickly so it could be shared internally with stakeholders. It was built using many prebuilt components and tables and was based heavily off of Material Design.
            </Body>
            <Body>
              This worked well initially, but to place the user first and create a stronger brand, the Portal went through a redesign.
            </Body>
          </section>

          <Divider />

          {/* ── Solution ───────────────────────────────────────────────────── */}
          <section style={{ marginBottom: "72px" }}>
            <SectionLabel>Solution</SectionLabel>
            <SectionHeading>The introduction of the Eucalyptus Design System.</SectionHeading>
            <Body>
              While going through the process of the redesign, it became clear that Qualiti would benefit from a design system. All updated branding was captured in a central location as well as any reusable components and styles. This provided direction, clarity, and efficiency across teams.
            </Body>
          </section>

          <Divider />

          {/* ── Research ───────────────────────────────────────────────────── */}
          <section style={{ marginBottom: "72px" }}>
            <SectionLabel>Research</SectionLabel>
            <SectionHeading>Competitive Analysis</SectionHeading>
            <Body>
              Due to this being the first Design System I created, I spent some time researching other Design Systems that are publicly published. I noted elements I appreciated about each, and what I could adapt for our own.
            </Body>
            <Body>
              Due to my background as a software engineer, I was especially interested in how different companies chose to organize their systems to make it as easy as possible for engineers to use.
            </Body>
          </section>

          <Divider />

          {/* ── Design ─────────────────────────────────────────────────────── */}
          <section style={{ marginBottom: "72px" }}>
            <SectionLabel>Design</SectionLabel>
            <SectionHeading>Building Components</SectionHeading>
            <Body>
              After starting with the foundational elements — branding, spacing, and colors — I then added components and elements to this library slowly over time while working on the Qualiti Portal redesign.
            </Body>
            <Body>
              I prioritized creating clean and clear reusable elements in the designs and made sure any changes were made on the master component that lives in the library.
            </Body>
          </section>

          <Divider />

          {/* ── Handoff ────────────────────────────────────────────────────── */}
          <section style={{ marginBottom: "72px" }}>
            <SectionLabel>Handoff</SectionLabel>
            <SectionHeading>Presenting to Developers</SectionHeading>
            <Body>
              I completed the Eucalyptus Design Library around the same time that I introduced bi-weekly Design Developer Review Meetings. During our first meeting, I presented Eucalyptus and walked through each page and how to use the library.
            </Body>
            <Body>
              I also took the opportunity to share where all of our design documentation and information architecture could be found.
            </Body>
          </section>

          <Divider />

          {/* ── Takeaways ──────────────────────────────────────────────────── */}
          <section style={{ marginBottom: "72px" }}>
            <SectionLabel>Takeaways</SectionLabel>
            <SectionHeading>Learnings</SectionHeading>
            <Body>
              One of my biggest takeaways from creating this library was organization of elements. After publishing the library and adding it to design files and seeing how the assets are laid out, I realized how important clear naming conventions of each component and variation is to be able to find and use them easily.
            </Body>
            <Body>
              I also quickly learned when I made an element that was not responsive. For example, some of my buttons were not automatically resizing with text changes unless they were detached. This helped me learn how to properly use auto layout and ensure that all elements were flexible and responsive.
            </Body>

          </section>

          <Divider />

          {/* ── Next Steps ─────────────────────────────────────────────────── */}
          <section style={{ marginBottom: "72px" }}>
            <SectionLabel>Next Steps</SectionLabel>
            <SectionHeading>The library continues to evolve alongside the product.</SectionHeading>
            <Body>
              The Eucalyptus Design Library remains a work in progress. It is constantly being updated and added to as designs progress and are refined. The Engineering and Product teams know that this is a resource that is the source of truth for design specifications and it is added as a library to each design file within the team space.
            </Body>
          </section>

        </div>
    </div>
  );
}
