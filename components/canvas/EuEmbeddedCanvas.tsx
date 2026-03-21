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
  { id: "takeaways", label: "Takeaways" },
];

const MONO = "var(--font-mono)";

// ─── Shared primitives ────────────────────────────────────────────────────────

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

// ─── EuEmbeddedCanvas ─────────────────────────────────────────────────────────

export function EuEmbeddedCanvas() {
  const scrollRef  = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState("overview");

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
          let bestId = "overview", bestRatio = -1;
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

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="px-5 md:px-10 md:pl-12" style={{ paddingTop: "24px", paddingBottom: "120px", maxWidth: "680px" }}>

        {/* ── Overview ──────────────────────────────────────────────────── */}
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
              Embedded Experience
            </h1>
            <Body>
              Adding tests to the test library was not an ideal experience due to its heavy use of
              modals. This was originally chosen due to legacy code, but when the time became
              available to rewrite the old code — an embedded experience became possible.
            </Body>
          </div>

          {/* Gif */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/embedded.gif"
            alt="Embedded Experience interaction recording"
            style={{
              width:        "100%",
              display:      "block",
              borderRadius: "8px",
              border:       "1px solid var(--shouf-border-sub)",
              marginBottom: "0",
            }}
          />
        </Section>

        <Divider />

        {/* ── Problem ───────────────────────────────────────────────────── */}
        <Section id="problem">
          <SectionLabel>Problem</SectionLabel>
          <SectionHeading>Qualiti used a lot of old, legacy code.</SectionHeading>
          <Body>
            The company originally started with just a few people, and one main developer. In order
            to move quickly and generate a product that could win funding, a great deal of the
            application was built with standardized but difficult to customize components such as
            incredibly inflexible tables. This resulted in the need for a lot of modals. Any time
            the user wanted to add or edit something, instead of being able to act directly on the
            page, a modal would pop up and the user would have to interact with the modal instead.
          </Body>
          <Body>
            Modals get the job done, but should really only be used for alerts or specific messaging
            with limited inputs. Creating a seamless experience in the application is less jarring
            for the user and helps them keep context.
          </Body>
        </Section>

        <Divider />

        {/* ── Solution ──────────────────────────────────────────────────── */}
        <Section id="solution">
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
        </Section>

        <Divider />

        {/* ── Research ──────────────────────────────────────────────────── */}
        <Section id="research">
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
        </Section>

        <Divider />

        {/* ── Design ────────────────────────────────────────────────────── */}
        <Section id="design">
          <SectionLabel>Design</SectionLabel>
          <SectionHeading>Building Components</SectionHeading>
          <Body>
            After starting with the foundational elements, such as branding, spacing, and colors, I
            then added components and elements to this library slowly over time while working on the
            Qualiti Portal redesign. I prioritized creating clean and clear reusable elements in the
            designs and made sure any changes were made on the master component that lives in the
            library.
          </Body>
          <Body>
            I wanted to create an experience that felt both within the user&apos;s workflow and was
            efficient and as clear as possible. It was important to me to ensure the user both could
            work quickly and could understand what they were adding, and could easily distinguish it
            from what was already there.
          </Body>
        </Section>

        <Divider />

        {/* ── Feedback ──────────────────────────────────────────────────── */}
        <Section id="feedback">
          <SectionLabel>Feedback</SectionLabel>
          <SectionHeading>Missing credentials</SectionHeading>
          <Body>
            After presenting this to the team, I received feedback that the option for users to
            select a credential was missing. This is required for our Qualiti Intelligence to know
            how to login to the user&apos;s application and have the ability to generate steps. I
            resolved this by adding it in for both suggested and manual tests.
          </Body>
        </Section>

        <Divider />

        {/* ── Takeaways ─────────────────────────────────────────────────── */}
        <Section id="takeaways">
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
              Some use cases were not addressed in this design — is a user able to add multiple
              manual tests at once? Is there a way for them to add more than three suggested tests
              at once? If they edit a suggested test, does the AI learn from that and is it still
              able to generate steps? To further refine this design, I would address these scenarios
              along with a few others not listed here. I would also add specific tags to tests that
              are generated by the AI versus ones that are made manually. Ideally I would do user
              research and see if there is a need to distinguish the two before proceeding.
            </p>
          </div>
        </Section>

      </div>

    </div>
  );
}
