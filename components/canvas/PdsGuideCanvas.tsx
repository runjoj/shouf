"use client";

import { useRef, useEffect, useState } from "react";
import { MONO, Section, GuideSectionLabel as SectionLabel, GuideSectionHeading as SectionHeading, GuideBody as Body, GuideDivider as Divider, GuideCode as Code, GuideScrollReveal } from "./GuideShared";

// ─── Section map ──────────────────────────────────────────────────────────────

const SECTIONS = [
  { id: "overview",     label: "Overview"     },
  { id: "motivation",   label: "Motivation"   },
  { id: "architecture", label: "Architecture" },
  { id: "tokens",       label: "Tokens"       },
  { id: "components",   label: "Components"   },
  { id: "craft",        label: "Craft"        },
];

// ─── Token row ────────────────────────────────────────────────────────────────

function TokenRow({ prefix, description }: { prefix: string; description: string }) {
  return (
    <div
      style={{
        display:      "flex",
        alignItems:   "center",
        gap:          "16px",
        padding:      "12px 16px",
        borderBottom: "1px solid var(--shouf-border-sub)",
      }}
    >
      <Code>{prefix}</Code>
      <span style={{ fontSize: "13px", color: "var(--shouf-text-muted)", flex: 1 }}>
        {description}
      </span>
    </div>
  );
}

// ─── PdsGuideCanvas ───────────────────────────────────────────────────────────

export function PdsGuideCanvas() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState("overview");

  // Track active section via IntersectionObserver
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

      {/* ── Main content — second in DOM, order-1 puts it first on desktop ── */}
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
              Shouf Design System
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
              Shouf is the design system that powers this portfolio — built entirely from scratch.
            </h1>
            <Body>
              Every surface you&apos;re looking at — the shell, the tokens, the components, the
              animations — was designed and engineered as a cohesive system. Shouf is both the
              subject of the portfolio and the medium it&apos;s delivered in.
            </Body>
          </div>

          {/* Meta grid */}
          <div
            style={{
              display:             "grid",
              gridTemplateColumns: "1fr 1fr",
              gap:                 "1px",
              backgroundColor:     "var(--shouf-border-sub)",
              border:              "1px solid var(--shouf-border-sub)",
              borderRadius:        "8px",
              overflow:            "hidden",
            }}
          >
            {[
              { label: "Role",    value: "Design Engineer"              },
              { label: "Stack",   value: "Next.js 16 · React 19 · TS"  },
            ].map((item) => (
              <div
                key={item.label}
                style={{ backgroundColor: "var(--shouf-panel)", padding: "20px 24px" }}
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

        {/* ── Motivation ────────────────────────────────────────────────── */}
        <GuideScrollReveal>
        <Section id="motivation">
          <SectionLabel>Motivation</SectionLabel>
          <SectionHeading>A portfolio that demonstrates the work, not just describes it.</SectionHeading>
          <Body>
            Most portfolios are static pages with screenshots. A design engineer&apos;s work lives at
            the intersection of design decisions and production code — a format that can&apos;t be
            communicated through images alone.
          </Body>
          <Body>
            Building the portfolio as a design system meant the medium itself becomes the
            argument. The token system, component interactivity, theming, and animation craft are
            all legible to anyone who uses it — no case study required.
          </Body>
        </Section>
        </GuideScrollReveal>

        <Divider />

        {/* ── Architecture ──────────────────────────────────────────────── */}
        <GuideScrollReveal>
        <Section id="architecture">
          <SectionLabel>Architecture</SectionLabel>
          <SectionHeading>Zero UI dependencies. Every pixel is intentional.</SectionHeading>
          <Body>
            Shouf is built on Next.js 16 with React 19, TypeScript throughout, and Tailwind v4
            for utility scaffolding. There are no third-party UI libraries — no Radix, no
            Shadcn, no component kits. Every element was designed and implemented from scratch.
          </Body>
          <Body>
            The shell is a fixed-layout application frame with a left navigator, scrollable
            center canvas, and right inspect panel. Panel visibility, theming, and navigation
            state are managed in a lightweight Zustand store. Components render into the canvas
            with live controls wired through the store.
          </Body>
          <Body>
            All theming is driven by CSS custom properties on <Code>:root</Code>. There are no
            JavaScript-in-CSS approaches — theme and accent changes are a single{" "}
            <Code>setProperty</Code> call that propagates instantly across the entire UI.
          </Body>
        </Section>
        </GuideScrollReveal>

        <Divider />

        {/* ── Tokens ────────────────────────────────────────────────────── */}
        <GuideScrollReveal>
        <Section id="tokens">
          <SectionLabel>Tokens</SectionLabel>
          <SectionHeading>A structured token layer with semantic prefixes.</SectionHeading>
          <Body>
            Design tokens are organized by prefix so every variable&apos;s scope is obvious at a
            glance. Shell tokens cover surfaces, text, borders, and interactive states. Component
            namespaces keep design decisions local to the component that owns them.
          </Body>

          <div
            style={{
              border:       "1px solid var(--shouf-border-sub)",
              borderRadius: "8px",
              overflow:     "hidden",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                backgroundColor: "var(--shouf-panel)",
                padding:         "12px 16px",
                borderBottom:    "1px solid var(--shouf-border-sub)",
                fontFamily:      MONO,
                fontSize:        "10px",
                letterSpacing:   "0.12em",
                textTransform:   "uppercase",
                color:           "var(--shouf-text-faint)",
              }}
            >
              Token Prefixes
            </div>
            <TokenRow prefix="--shouf-*"  description="Shouf — surfaces, text, borders, accent, interactive states, and component tokens" />
            <TokenRow prefix="--bhr-*"    description="BambooHR — brand palette, surfaces, and interactive states for the Global Navigation component" />
            <TokenRow prefix="--eu-*"     description="Eucalyptus — component tokens scoped to the Eucalyptus design system" />
          </div>

          <Body>
            The accent system supports six presets — Chartreuse, Electric Mint, Bright Coral,
            Vivid Cyan, Lavender, and Hot Pink. Each carries separate dark-mode (vibrant) and
            light-mode (WCAG AA ≥ 4.5:1) values so contrast is maintained regardless of theme.
            Switching accent updates every token in under a millisecond.
          </Body>
        </Section>
        </GuideScrollReveal>

        <Divider />

        {/* ── Components ────────────────────────────────────────────────── */}
        <GuideScrollReveal>
        <Section id="components">
          <SectionLabel>Components</SectionLabel>
          <SectionHeading>Interactive component canvases with live controls.</SectionHeading>
          <Body>
            Each component in the navigator opens a dedicated canvas with a live preview,
            an inspect panel documenting props and token usage, and a controls bar for
            toggling variants, sizes, and states in real time — mirroring the experience of
            a Storybook without the framework dependency.
          </Body>
          <Body>
            Section overview grids show every component as a miniature tile — not a generic
            placeholder, but a faithful scaled-down representation of the actual component.
            Each tile preview is hand-crafted to mirror the real design at thumbnail scale.
          </Body>
          <Body>
            Components outside the Shouf system — Global Navigation from BambooHR, and the
            Eucalyptus system from Qualiti — are included to demonstrate cross-system
            design engineering and component documentation at scale.
          </Body>
        </Section>
        </GuideScrollReveal>

        <Divider />

        {/* ── Craft ─────────────────────────────────────────────────────── */}
        <GuideScrollReveal>
        <Section id="craft">
          <SectionLabel>Craft</SectionLabel>
          <SectionHeading>Every page has at least one expressive moment.</SectionHeading>
          <Body>
            A guiding principle throughout Shouf: expressive moments must enhance understanding,
            never distract from it. Each animation or micro-interaction communicates something
            about the system — it is considered and purposeful, never gratuitous.
          </Body>
          <Body>
            The intro sequence types the headline word-by-word before drawing the panel borders
            into place — revealing the shell structure as a deliberate act rather than a static
            load. The accordion nav staggers on first appearance but snaps instantly on reopen,
            so the animation teaches the layout once and then gets out of the way.
          </Body>
          <Body>
            On the About page, hovering each personal fact reveals a bespoke SVG illustration
            that animates into the frame — a heartbeat monitor for military service, sonar arcs
            for search and rescue, a cedar tree for Lebanese heritage. The illustrations are not
            decoration; they are a second layer of meaning.
          </Body>

        </Section>
        </GuideScrollReveal>

      </div>

    </div>
  );
}
