"use client";

// ─── AiPatternsCaseStudyCanvas ───────────────────────────────────────────────
// Case study: AI Patterns. BambooHR's first formalized AI pattern library,
// built to standardize the AI experience across the product as it shifts to
// AI first.
//
// Expressive craft moment: the iframe reveal. A thin scan-line sweeps down
// the embedded site as it loads, dissolving into the live UI. Same treatment
// used in PsSandboxCaseStudyCanvas; it frames the embed as something coming
// to life rather than just dropping in.

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

const SANDBOX_URL = "https://ai-patterns.netlify.app/";

// ─── IframeEmbed ─────────────────────────────────────────────────────────────
// Wraps the iframe with a reveal animation: a gradient scan line descends
// while the page loads, then fades out once the iframe fires onLoad.

function IframeEmbed() {
  const [loaded, setLoaded] = useState(false);

  // On mobile, render the iframe at its natural container width (no 125% scale)
  // so the embedded site sees a phone-width viewport and renders its own mobile
  // layout instead of being visually squished.
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
      {/* Scan-line overlay. Descends while loading, fades out on load. */}
      <div
        aria-hidden
        style={{
          position:   "absolute",
          inset:      0,
          zIndex:     2,
          pointerEvents: "none",
          opacity:    loaded ? 0 : 1,
          transition: loaded ? "opacity 600ms ease 200ms" : "none",
          background: loaded
            ? "transparent"
            : "linear-gradient(to bottom, transparent 40%, var(--shouf-panel) 100%)",
        }}
      >
        {!loaded && (
          <div
            style={{
              position:        "absolute",
              left:            0,
              right:           0,
              height:          "2px",
              background:      "linear-gradient(to right, transparent, var(--shouf-accent) 30%, var(--shouf-accent) 70%, transparent)",
              opacity:         0.6,
              animation:       "ai-patterns-scan 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            }}
          />
        )}
      </div>

      {/* Loading label. Fades out with the overlay. */}
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
          Loading site&hellip;
        </span>
      </div>

      {/* Zoom wrapper: iframe is rendered at a larger logical size (1/SCALE)
          and then scaled down, so site chrome fits the frame without
          horizontal clipping or scrollbars. */}
      <iframe
        src={SANDBOX_URL}
        title="AI Patterns"
        style={{
          width:           isMobile ? "100%" : "125%",
          height:          isMobile ? "100%" : "125%",
          border:          "none",
          display:         "block",
          transform:       isMobile ? "none" : "scale(0.8)",
          transformOrigin: "top left",
          opacity:    loaded ? 1 : 0.15,
          transition: "opacity 800ms ease",
        }}
        onLoad={() => setLoaded(true)}
      />

      <style>{`
        @keyframes ai-patterns-scan {
          0%   { top: -2px; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
}

// ─── AiPatternsCaseStudyCanvas ────────────────────────────────────────────────

export function AiPatternsCaseStudyCanvas() {
  const { selectComponent, selectSection, setActiveMobilePanel } = useAppStore();

  // Hide the embedded iframe on mobile if it isn't meaningfully usable at phone size.
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
    selectComponent("product-sandbox");
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

      {/* ── Hero. Two-column overview (stacks on mobile) ────────────────── */}
      <section
        style={{
          marginBottom:        "48px",
          display:             "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(360px, 100%), 1fr))",
          gap:                 "32px",
          alignItems:          "start",
        }}
      >
        {/* Left: label + display headline */}
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
            AI Pattern Library
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
            AI Patterns
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

        {/* Right: overview body text */}
        <div>
          <Body>
            A reference site documenting the AI patterns used across
            BambooHR, built to standardize the AI experience as the
            product shifts toward AI first. The examples are interactive
            and render inside the actual Ask dialog as you scroll, so
            designers, PMs, and developers can see how each pattern will
            appear in the product.
          </Body>
        </div>
      </section>

      {/* ── Live Site. Hidden on mobile (iframe not usable at phone size). ── */}
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
                Live Site
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
            BambooHR wasn&apos;t built as an AI-first product, and the
            push to become one outpaced the patterns to support it.
          </SectionHeading>
          <Body>
            BambooHR was built well before the current wave of AI
            products, and the application wasn&apos;t designed with AI
            interactions in mind. As the company pushed to become AI
            first, teams started shipping AI features faster than we
            could establish how they should work. Every new AI experience
            was effectively vibe coded, with the door open for whoever
            was building it to decide what it should be. The result was
            an inconsistent AI experience across the product, and nothing
            concrete for teams to point to when they wanted to do it
            right.
          </Body>
          <Body>
            The deadline made it urgent. BambooHR is the presenting
            sponsor at SHRM on June 15th, and the new AI experience needs
            to be ready to show there. Multiple product teams need to
            ship coherent AI interactions before then, and they
            can&apos;t wait for the patterns to be defined after the
            fact.
          </Body>
        </section>
      </ScrollReveal>

      <Divider />

      {/* ── Approach ─────────────────────────────────────────────────── */}
      <ScrollReveal>
        <section style={{ marginBottom: "48px", maxWidth: "800px" }}>
          <SectionLabel>Process</SectionLabel>
          <SectionHeading>
            An AI pattern library formalized under deadline. The AI team
            designed the patterns, and the design system team brought
            them to life in code and documentation.
          </SectionHeading>
          <Body>
            The patterns were designed in Figma by a small team led by
            the AI team&apos;s design lead. As the designer on the Fabric
            design system team, I picked up the next stage, turning the
            Figma work into formalized, documented patterns that teams
            could actually use. That included building the reference
            site, writing the documentation, and shipping the patterns as
            an installable npm package.
          </Body>
          <Body>
            The pattern set was shaped by audits of how other AI products
            handle common interactions, references to shadcn&apos;s
            approach to components, and beta testing the early versions
            with real BambooHR customers. Every pattern in the library is
            one teams were already needing, not something added
            speculatively.
          </Body>
          <Body>
            The timeline was compressed. Engineering support wasn&apos;t
            available yet, and will come on as some of these patterns
            start landing in our Fabric component library, so for now the
            library is designer-built and designer-maintained. Rapid
            iteration kept the work moving and unblocked the product
            teams that needed to start using the patterns right away.
          </Body>
        </section>
      </ScrollReveal>

      <Divider />

      {/* ── What Made This Work ──────────────────────────────────────── */}
      <ScrollReveal>
        <section style={{ marginBottom: "48px", maxWidth: "800px" }}>
          <SectionLabel>Design</SectionLabel>
          <SectionHeading>What made this work.</SectionHeading>
          <Body>A few decisions that were key to landing this on time:</Body>

          {/* Decision list */}
          {[
            {
              label: "Interactive examples inside the real Ask dialog.",
              body:  "Each pattern renders inside the actual Ask UI as you scroll the site, so teams can see how it will appear in the product rather than guessing from a static document.",
            },
            {
              label: "Shipped as an installable npm package.",
              body:  "Teams pull the patterns into their work the same way they install any other Fabric component, so no one has to rebuild from documentation each time.",
            },
            {
              label: "A clear ownership split.",
              body:  "The AI team owns the design decisions and pattern definitions. The design system team owns the formalization, code, and ongoing maintenance. That keeps the patterns true to both the AI vision and the design system's standards.",
            },
            {
              label: "Audited and customer-tested, not invented.",
              body:  "Patterns came from real product needs, validated against how other AI products handle similar interactions, and beta tested with real customers before being added to the library.",
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
              label: "Established the first shared AI patterns at BambooHR.",
              body:  "Before this, every team was inventing its own AI experience. The library now provides a common starting point for the whole company.",
            },
            {
              label: "Unblocked product teams ahead of SHRM.",
              body:  "Multiple teams can ship coherent AI interactions in time for the June 15th conference because the patterns are ready when they need them.",
            },
            {
              label: "Standardized the AI experience for customers.",
              body:  "Users encounter the same interaction model wherever they engage with AI in the product, rather than a different invented pattern in each area.",
            },
            {
              label: "Adopted by 80+ across product and design.",
              body:  "Engineering will come on as the patterns start landing in Fabric, broadening the library into a shared reference across disciplines.",
            },
            {
              label: "Set up the path into Fabric.",
              body:  "The patterns are structured so they can move into our core component library once they're stable and engineering is brought on.",
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
            These are the first patterns BambooHR has ever established,
            and figuring out what counts as a pattern became its own
            design problem.
          </SectionHeading>
          <Body>
            Because we had no established patterns before this, much of
            the work involved figuring out what a pattern is in the first
            place. What counts as an atomic component versus an organism?
            Where should the patterns live: inside Storybook with our
            existing components, outside of Storybook as their own thing,
            or as a separate npm package that uses Fabric as building
            blocks? Each of those decisions shapes what the library can
            become.
          </Body>
          <Body>
            This first version is shipping under conference pressure,
            which forced quick answers to questions that probably deserve
            longer ones. The deeper architectural questions, like where
            these patterns really belong and how they should evolve over
            time, will get clearer as more patterns land and engineering
            joins the effort.
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
          <span>Next: Product Sandbox</span>
          <span>&rarr;</span>
        </button>
      </div>
    </div>
  );
}
