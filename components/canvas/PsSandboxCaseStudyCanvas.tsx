"use client";

// ─── PsSandboxCaseStudyCanvas ────────────────────────────────────────────────
// Case study: Product Sandbox — a standalone BambooHR mirror built with the
// design system, disconnected from production code and real employee data.
//
// Expressive craft moment: the iframe reveal — a thin scan-line sweeps down
// the embedded product as it loads, dissolving into the live UI. This mirrors
// the "sandbox coming to life" narrative: a moment of materialisation before
// the prototype is ready to use.

import { useCallback, useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import {
  MONO,
  SectionLabel,
  SectionHeading,
  Body,
  Divider,
  BackButton,
  ScrollReveal,
} from "./CaseStudyShared";

const SANDBOX_URL = "https://69e799799e5d8a34e48e1b72--ps-dcefc1f4.netlify.app/people";

// ─── IframeEmbed ─────────────────────────────────────────────────────────────
// Wraps the iframe with a reveal animation: a gradient scan line descends
// while the page loads, then fades out once the iframe fires onLoad.

function IframeEmbed() {
  const [loaded, setLoaded] = useState(false);

  // On mobile, render the iframe at its natural container width (no 125% scale)
  // so the embedded BambooHR sandbox sees a phone-width viewport and renders its
  // own mobile layout instead of being visually squished.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 1023px)");
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return (
    <div
      style={{
        position:     "relative",
        width:        "100%",
        height:       isMobile ? "600px" : "750px",
        border:       "1px solid var(--shouf-border)",
        borderRadius: "12px",
        overflow:     "hidden",
        background:   "var(--shouf-panel)",
      }}
    >
      {/* Scan-line overlay — descends while loading, fades out on load */}
      <div
        aria-hidden
        style={{
          position:   "absolute",
          inset:      0,
          zIndex:     2,
          pointerEvents: "none",
          // Fade the whole overlay out once loaded
          opacity:    loaded ? 0 : 1,
          transition: loaded ? "opacity 600ms ease 200ms" : "none",
          // Gradient: transparent → accent → transparent, animated downward
          background: loaded
            ? "transparent"
            : "linear-gradient(to bottom, transparent 40%, var(--shouf-panel) 100%)",
        }}
      >
        {/* Moving scan line */}
        {!loaded && (
          <div
            style={{
              position:        "absolute",
              left:            0,
              right:           0,
              height:          "2px",
              background:      "linear-gradient(to right, transparent, var(--shouf-accent) 30%, var(--shouf-accent) 70%, transparent)",
              opacity:         0.6,
              animation:       "ps-scan 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            }}
          />
        )}
      </div>

      {/* Loading label — fades out with the overlay */}
      <div
        aria-hidden
        style={{
          position:       "absolute",
          bottom:         "24px",
          left:           0,
          right:          0,
          display:        "flex",
          justifyContent: "center",
          zIndex:         3,
          pointerEvents:  "none",
          opacity:        loaded ? 0 : 1,
          transition:     loaded ? "opacity 400ms ease" : "none",
        }}
      >
        <span
          style={{
            fontFamily:    MONO,
            fontSize:      "12px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color:         "var(--shouf-text-faint)",
          }}
        >
          Loading sandbox&hellip;
        </span>
      </div>

      {/* Zoom wrapper: iframe is rendered at a larger logical size
          (1/SCALE) and then scaled down, so product chrome fits the
          frame without horizontal clipping or scrollbars. */}
      <iframe
        src={SANDBOX_URL}
        title="Product Sandbox — BambooHR mirror"
        style={{
          // Desktop: render at 125% and scale down to 80% so full product chrome
          // fits without clipping. Mobile: render at natural size so the embedded
          // app sees a real phone-width viewport and renders its mobile layout.
          width:           isMobile ? "100%" : "125%",
          height:          isMobile ? "100%" : "125%",
          border:          "none",
          display:         "block",
          transform:       isMobile ? "none" : "scale(0.8)",
          transformOrigin: "top left",
          // Fade the iframe in once loaded so the scan line can finish
          opacity:    loaded ? 1 : 0.15,
          transition: "opacity 800ms ease",
        }}
        onLoad={() => setLoaded(true)}
      />

      {/* Keyframe injected inline — avoids touching globals.css for a one-off */}
      <style>{`
        @keyframes ps-scan {
          0%   { top: -2px; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
}

// ─── PsSandboxCaseStudyCanvas ─────────────────────────────────────────────────

export function PsSandboxCaseStudyCanvas() {
  const { selectComponent, selectSection, setActiveMobilePanel } = useAppStore();

  // Hide the embedded sandbox iframe on mobile — the BambooHR product inside
  // isn't meaningfully usable at phone size.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(max-width: 1023px)");
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  const goToWork = useCallback(() => {
    selectComponent(null);
    selectSection("work");
    setActiveMobilePanel("canvas");
  }, [selectComponent, selectSection, setActiveMobilePanel]);

  const goToNextProject = useCallback(() => {
    selectSection(null);
    selectComponent("rc-case-study");
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
      {/* ── Back button ───────────────────────────────────────────────── */}
      <BackButton onClick={goToWork} />

      {/* ── Hero — two-column overview (stacks on mobile) ─────────────── */}
      <section
        style={{
          marginBottom:        "48px",
          display:             "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(360px, 100%), 1fr))",
          gap:                 "32px",
          alignItems:          "start",
        }}
      >
        {/* Left — label + display headline */}
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
            Product Sandbox
          </h1>
          <div
            style={{
              marginTop:   "14px",
              fontFamily:  MONO,
              fontSize:    "13px",
              color:       "var(--shouf-text-faint)",
              letterSpacing: "0.02em",
            }}
          >
            BambooHR
          </div>
        </div>

        {/* Right — overview body text */}
        <div>
          <Body>
            A standalone mirror of BambooHR built with the design system but
            disconnected from production code and real employee data. Created
            to unblock designers and PMs from complex local setup, enabling
            high-fidelity prototyping and user testing without engineering
            support.
          </Body>
        </div>
      </section>

      {/* ── Live Sandbox — hidden on mobile (product iframe not usable at phone size) ── */}
      {!isMobile && (
        <>
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
                Live Sandbox
              </div>
              <IframeEmbed />
            </section>
          </ScrollReveal>

          <Divider />
        </>
      )}

      {/* ── Problem ──────────────────────────────────────────────────── */}
      <ScrollReveal>
        <section style={{ marginBottom: "48px", maxWidth: "800px" }}>
          <SectionLabel>Problem</SectionLabel>
          <SectionHeading>
            The people closest to customer problems had the least access to a
            realistic version of the product.
          </SectionHeading>
          <Body>
            BambooHR&apos;s product runs across many repositories, requires Docker,
            keys/tokens, and significant local configuration just to get running
            on a machine. For designers and PMs who needed a realistic
            environment to prototype or test ideas with users, this created a
            few painful realities.
          </Body>
          <Body>
            Standing up the product locally required engineering support and
            hours of setup. Most designers and PMs simply couldn&apos;t run the
            product themselves, which meant prototyping in the actual application
            was essentially off the table. Production code also couldn&apos;t be
            shared externally. The gap between what other prototyping tools could
            show and what the real HR platform felt like was large enough to
            undermine the quality of user testing.
          </Body>
        </section>
      </ScrollReveal>

      <Divider />

      {/* ── Approach ─────────────────────────────────────────────────── */}
      <ScrollReveal>
        <section style={{ marginBottom: "48px", maxWidth: "800px" }}>
          <SectionLabel>Process</SectionLabel>
          <SectionHeading>
            A design-system-built mirror — no production code, no backends, no
            real employee data.
          </SectionHeading>
          <Body>
            The team built a product sandbox: a standalone Next.js application
            that mirrors BambooHR using the Fabric Design System — the same
            components, tokens, and patterns used in production — but with no
            connection to production code, backends, or real employee data.
          </Body>
          <Body>
            Each screen was reconstructed from live product screenshots and
            design files, then implemented using Fabric components and tokens
            directly, so the sandbox visually matches production without sharing
            any production code or data pipelines. Synthetic data was carefully
            crafted to represent realistic diversity in employee names, roles,
            departments, and org structures, making the sandbox credible enough
            for user research without raising privacy concerns.
          </Body>
          <Body>
            Infrastructure and foundation: set up the repository, including
            documentation so teammates could onboard themselves and contribute
            to the sandbox. Built and documented the deploy pipeline via Netlify
            so any team member could ship updates without engineering support.
            Also built out several of the initial pages, establishing patterns
            that teammates could follow for additional page builds.
          </Body>
          <Body>
            Other designers on the team then built additional pages using the
            patterns and infrastructure already in place. Each page was rebuilt
            using vibe coding to move quickly while staying true to the design
            system.
          </Body>
        </section>
      </ScrollReveal>

      <Divider />

      {/* ── What Made This Work ──────────────────────────────────────── */}
      <ScrollReveal>
        <section style={{ marginBottom: "48px", maxWidth: "800px" }}>
          <SectionLabel>Design</SectionLabel>
          <SectionHeading>What made this work.</SectionHeading>
          <Body>A few decisions that were key to adoption:</Body>

          {/* Decision list */}
          {[
            {
              label: "Zero backend dependency.",
              body:  "No Docker, no tokens, no environment variables. Clone the repo and start running.",
            },
            {
              label: "Design system as the source of truth.",
              body:  "Because the sandbox used the real component library, the result looked and felt like the actual product, not a rough approximation.",
            },
            {
              label: "Self-serve by design.",
              body:  "The README, branching model, and deploy process were all built so that a designer or PM could contribute without filing a ticket or asking an engineer for help.",
            },
            {
              label: "Vibe coding as a workflow.",
              body:  "Using AI-assisted coding let designers who aren\u2019t primarily developers build realistic, interactive pages quickly. A deliberate choice to keep the project moving fast and keep ownership within the design team.",
            },
          ].map(({ label, body }) => (
            <div
              key={label}
              style={{
                display:      "flex",
                gap:          "16px",
                marginBottom: "20px",
                alignItems:   "start",
              }}
            >
              <div
                style={{
                  width:           "6px",
                  height:          "6px",
                  borderRadius:    "50%",
                  backgroundColor: "var(--shouf-accent)",
                  flexShrink:      0,
                  marginTop:       "11px",
                }}
              />
              <p style={{ fontSize: "16px", color: "var(--shouf-text-muted)", lineHeight: 1.75, margin: 0 }}>
                <strong style={{ color: "var(--shouf-text)", fontWeight: 500 }}>{label}</strong>{" "}
                {body}
              </p>
            </div>
          ))}
        </section>
      </ScrollReveal>

      <Divider />

      {/* ── Impact ───────────────────────────────────────────────────── */}
      <ScrollReveal>
        <section style={{ marginBottom: "48px", maxWidth: "800px" }}>
          <SectionLabel>Takeaways</SectionLabel>
          <SectionHeading>Impact.</SectionHeading>

          {[
            {
              label: "Unblocked prototyping from engineering dependencies.",
              body:  "Designers and PMs could build and iterate on realistic prototypes without waiting for eng support or navigating a complex local setup.",
            },
            {
              label: "Made user testing higher fidelity.",
              body:  "Testing sessions could use an interactive, visually accurate environment instead of static Figma mocks, closer to what users would actually experience.",
            },
            {
              label: "Enabled external sharing.",
              body:  "Because the sandbox contained no production code or real employee data, sharing with external participants, vendors, or stakeholders posed no security concerns.",
            },
            {
              label: "Created a repeatable, self-serve workflow.",
              body:  "The infrastructure and documentation meant the sandbox could grow organically. Any designer could add a new page without a bottleneck.",
            },
            {
              label: "Stress-tested the design system.",
              body:  "Building at product scale revealed gaps in the Fabric component library: edge cases in data display, missing empty-state patterns, and token inconsistencies that only surface when assembling full pages. Each gap became a filed issue in the design system backlog, turning the sandbox into a live audit of the system itself.",
            },
          ].map(({ label, body }) => (
            <div
              key={label}
              style={{
                display:      "flex",
                gap:          "16px",
                marginBottom: "20px",
                alignItems:   "start",
              }}
            >
              <div
                style={{
                  width:           "6px",
                  height:          "6px",
                  borderRadius:    "50%",
                  backgroundColor: "var(--shouf-accent)",
                  flexShrink:      0,
                  marginTop:       "11px",
                }}
              />
              <p style={{ fontSize: "16px", color: "var(--shouf-text-muted)", lineHeight: 1.75, margin: 0 }}>
                <strong style={{ color: "var(--shouf-text)", fontWeight: 500 }}>{label}</strong>{" "}
                {body}
              </p>
            </div>
          ))}
        </section>
      </ScrollReveal>

      <Divider />

      {/* ── Reflection ───────────────────────────────────────────────── */}
      <ScrollReveal>
        <section style={{ marginBottom: "48px", maxWidth: "800px" }}>
          <SectionLabel>Reflection</SectionLabel>
          <SectionHeading>
            The most rewarding part wasn&apos;t any single page.
          </SectionHeading>
          <Body>
            This project sat at the intersection of design systems, developer
            experience, and team enablement. The most rewarding part wasn&apos;t
            any single page, but seeing PMs and designers clone the repo and
            start contributing on their own.
          </Body>
          <Body>
            The sandbox is meant to be a temporary solution until a proper
            sandbox environment can be stood up from production code with a
            simpler setup process. The ideal version would also provide a path
            for getting new features built in prototypes into production code to
            A/B test with real customers.
          </Body>
        </section>
      </ScrollReveal>

      <Divider />

      {/* ── End navigation ───────────────────────────────────────────── */}
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
            all:        "unset",
            cursor:     "pointer",
            fontSize:   "14px",
            fontFamily: MONO,
            color:      "var(--shouf-text-muted)",
            display:    "inline-flex",
            alignItems: "center",
            gap:        "6px",
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
          onClick={goToNextProject}
          style={{
            all:        "unset",
            cursor:     "pointer",
            fontSize:   "14px",
            fontFamily: MONO,
            color:      "var(--shouf-text-muted)",
            display:    "inline-flex",
            alignItems: "center",
            gap:        "6px",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = "var(--shouf-accent)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = "var(--shouf-text-muted)";
          }}
        >
          <span>Next: Responsive Navigation</span>
          <span>&rarr;</span>
        </button>
      </div>
    </div>
  );
}
