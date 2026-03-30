"use client";

// ─── EuOverviewCanvas ───────────────────────────────────────────────────────
// Combined Eucalyptus DS overview page: tile grid view first, then case study
// content below a divider. Full-canvas, scrollable, no sidebar.

import { SectionGridCanvas } from "./SectionGridCanvas";

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
      <div
        style={{
          width:           "100%",
          display:         "flex",
          justifyContent:  "center",
        }}
      >
        <div
          style={{
            width:           "100%",
            maxWidth:        "800px",
            padding:         "0 48px",
          }}
        >
          <div
            style={{
              height:          "1px",
              backgroundColor: "var(--shouf-border-sub)",
              marginBottom:    "48px",
            }}
          />
        </div>
      </div>

      {/* ── Case study content — centered at 800px ───────────────────────── */}
      <div
        style={{
          width:         "100%",
          display:       "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width:         "100%",
            maxWidth:      "800px",
            padding:       "0 48px 80px",
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
                  fontSize:      "12px",
                  fontWeight:    800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color:         "var(--shouf-accent)",
                  marginBottom:  "14px",
                }}
              >
                Eucalyptus Design System
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
                The Eucalyptus Design Library was created for the Qualiti product and engineering team.
              </h1>
              <Body>
                Through the use of reusable components established in Eucalyptus, products and front-end code will follow a consistent design. It will also allow the team at Qualiti to deliver prototypes and products quickly.
              </Body>
            </div>

            {/* Role / Duration row */}
            <div
              style={{
                display:             "grid",
                gridTemplateColumns: "1fr 1fr",
                gap:                 "1px",
                backgroundColor:     "var(--shouf-border-sub)",
                border:              "1px solid var(--shouf-border-sub)",
                borderRadius:        "8px",
                overflow:            "hidden",
                marginBottom:        "0",
              }}
            >
              {[
                { label: "Role",     value: "Product Designer"                        },
                { label: "Duration", value: "6 weeks to establish, continuously updated" },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    backgroundColor: "var(--shouf-panel)",
                    padding:         "20px 24px",
                  }}
                >
                  <div
                    style={{
                      fontFamily:    MONO,
                      fontSize:      "10px",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color:         "var(--shouf-text-faint)",
                      marginBottom:  "8px",
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontSize:   "13px",
                      fontWeight: 500,
                      color:      "var(--shouf-text)",
                      lineHeight: 1.4,
                    }}
                  >
                    {item.value}
                  </div>
                </div>
              ))}
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

            <div
              style={{
                marginTop:       "40px",
                padding:         "24px",
                borderRadius:    "8px",
                backgroundColor: "var(--shouf-panel)",
                border:          "1px solid var(--shouf-border-sub)",
              }}
            >
              <div
                style={{
                  fontFamily:    MONO,
                  fontSize:      "10px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color:         "var(--shouf-text-faint)",
                  marginBottom:  "12px",
                }}
              >
                Next Steps
              </div>
              <p
                style={{
                  fontSize:   "14px",
                  color:      "var(--shouf-text-muted)",
                  lineHeight: 1.75,
                  margin:     0,
                }}
              >
                The Eucalyptus Design Library remains a work in progress. It is constantly being updated and added to as designs progress and are refined. The Engineering and Product teams know that this is a resource that is the source of truth for design specifications and it is added as a library to each design file within the team space.
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
