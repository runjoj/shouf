"use client";

import { useRef, useEffect, useState } from "react";

// ─── Section map ──────────────────────────────────────────────────────────────

const SECTIONS = [
  { id: "overview",  label: "Overview"  },
  { id: "problem",   label: "Problem"   },
  { id: "solution",  label: "Solution"  },
  { id: "research",  label: "Research"  },
  { id: "design",    label: "Design"    },
  { id: "feedback",  label: "Feedback"  },
  { id: "handoff",   label: "Handoff"   },
  { id: "takeaways", label: "Takeaways" },
];

// ─── Shared typography ────────────────────────────────────────────────────────

const MONO = "var(--font-mono)";

// ─── Section anchor wrapper ───────────────────────────────────────────────────

function Section({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section
      id={`guide-${id}`}
      style={{ scrollMarginTop: "24px", marginBottom: "72px" }}
    >
      {children}
    </section>
  );
}

// ─── Section label (small-caps monospace above headings) ──────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily:    MONO,
        fontSize:      "10px",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color:         "var(--shouf-text-faint)",
        marginBottom:  "10px",
      }}
    >
      {children}
    </div>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────

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

// ─── Body copy ────────────────────────────────────────────────────────────────

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

// ─── Divider ──────────────────────────────────────────────────────────────────

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

// ─── EuGuideCanvas ────────────────────────────────────────────────────────────

export function EuGuideCanvas() {
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
          // Active = section with the highest visible fraction
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
      style={{
        alignSelf: "stretch",
        width:     "100%",
        overflowY: "auto",
        display:   "grid",
        gridTemplateColumns: "1fr 168px",
        position:  "relative",
        alignItems: "start",
      }}
    >
      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div style={{ padding: "52px 40px 120px 48px", maxWidth: "680px" }}>

        {/* ── Overview ──────────────────────────────────────────────────── */}
        <Section id="overview">
          <div style={{ marginBottom: "48px" }}>
            <div
              style={{
                fontFamily:    MONO,
                fontSize:      "10px",
                letterSpacing: "0.14em",
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
              display:         "grid",
              gridTemplateColumns: "1fr 1fr",
              gap:             "1px",
              backgroundColor: "var(--shouf-border-sub)",
              border:          "1px solid var(--shouf-border-sub)",
              borderRadius:    "8px",
              overflow:        "hidden",
              marginBottom:    "0",
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
        </Section>

        <Divider />

        {/* ── Problem ───────────────────────────────────────────────────── */}
        <Section id="problem">
          <SectionLabel>Problem</SectionLabel>
          <SectionHeading>Qualiti did not have a standardized design system.</SectionHeading>
          <Body>
            The original Qualiti Portal was written by the first software engineer who was hired at Qualiti. The primary intention was to build it quickly so it could be shared internally with stakeholders. It was built using many prebuilt components and tables and was based heavily off of Material Design.
          </Body>
          <Body>
            This worked well initially, but to place the user first and create a stronger brand, the Portal went through a redesign.
          </Body>
        </Section>

        <Divider />

        {/* ── Solution ──────────────────────────────────────────────────── */}
        <Section id="solution">
          <SectionLabel>Solution</SectionLabel>
          <SectionHeading>The introduction of the Eucalyptus Design System.</SectionHeading>
          <Body>
            While going through the process of the redesign, it became clear that Qualiti would benefit from a design system. All updated branding was captured in a central location as well as any reusable components and styles. This provided direction, clarity, and efficiency across teams.
          </Body>
        </Section>

        <Divider />

        {/* ── Research ──────────────────────────────────────────────────── */}
        <Section id="research">
          <SectionLabel>Research</SectionLabel>
          <SectionHeading>Competitive Analysis</SectionHeading>
          <Body>
            Due to this being the first Design System I created, I spent some time researching other Design Systems that are publicly published. I noted elements I appreciated about each, and what I could adapt for our own.
          </Body>
          <Body>
            Due to my background as a software engineer, I was especially interested in how different companies chose to organize their systems to make it as easy as possible for engineers to use.
          </Body>
        </Section>

        <Divider />

        {/* ── Design ────────────────────────────────────────────────────── */}
        <Section id="design">
          <SectionLabel>Design</SectionLabel>
          <SectionHeading>Building Components</SectionHeading>
          <Body>
            After starting with the foundational elements — branding, spacing, and colors — I then added components and elements to this library slowly over time while working on the Qualiti Portal redesign.
          </Body>
          <Body>
            I prioritized creating clean and clear reusable elements in the designs and made sure any changes were made on the master component that lives in the library.
          </Body>
        </Section>

        <Divider />

        {/* ── Feedback ──────────────────────────────────────────────────── */}
        <Section id="feedback">
          <SectionLabel>Feedback</SectionLabel>
          <SectionHeading>Library Refinement</SectionHeading>
          <Body>
            I received feedback that some element variants were missing and could be helpful to include, such as disabled button states and radio buttons. I added those in and established the design standard that disabled buttons would be set to 38% opacity for all text, icons, and backgrounds.
          </Body>
        </Section>

        <Divider />

        {/* ── Handoff ───────────────────────────────────────────────────── */}
        <Section id="handoff">
          <SectionLabel>Handoff</SectionLabel>
          <SectionHeading>Presenting to Developers</SectionHeading>
          <Body>
            I completed the Eucalyptus Design Library around the same time that I introduced bi-weekly Design Developer Review Meetings. During our first meeting, I presented Eucalyptus and walked through each page and how to use the library.
          </Body>
          <Body>
            I also took the opportunity to share where all of our design documentation and information architecture could be found.
          </Body>
        </Section>

        <Divider />

        {/* ── Takeaways ─────────────────────────────────────────────────── */}
        <Section id="takeaways">
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
        </Section>

      </div>

      {/* ── Sticky section nav ───────────────────────────────────────────── */}
      <nav
        style={{
          position:   "sticky",
          top:        "52px",
          alignSelf:  "start",
          padding:    "52px 24px 0 0",
        }}
      >
        <div
          style={{
            fontFamily:    MONO,
            fontSize:      "9px",
            letterSpacing: "0.14em",
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
                  all:           "unset",
                  display:       "block",
                  fontSize:      "12px",
                  fontWeight:    isActive ? 500 : 400,
                  color:         isActive ? "var(--shouf-text)" : "var(--shouf-text-faint)",
                  padding:       "5px 10px",
                  borderRadius:  "5px",
                  cursor:        "pointer",
                  backgroundColor: isActive ? "var(--shouf-hover)" : "transparent",
                  borderLeft:    isActive
                    ? "2px solid var(--shouf-accent)"
                    : "2px solid transparent",
                  transition:    "color 120ms ease, background-color 120ms ease, border-left-color 120ms ease",
                  whiteSpace:    "nowrap",
                  letterSpacing: "-0.005em",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </nav>

    </div>
  );
}
