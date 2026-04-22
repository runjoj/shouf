"use client";

// ─── PdsOverviewCanvas ──────────────────────────────────────────────────────
// Combined Shouf DS overview page: tile grid view first, then case study
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

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code
      style={{
        fontFamily:      MONO,
        fontSize:        "13px",
        backgroundColor: "var(--shouf-hover)",
        border:          "1px solid var(--shouf-border-sub)",
        borderRadius:    "4px",
        padding:         "1px 6px",
        color:           "var(--shouf-accent)",
      }}
    >
      {children}
    </code>
  );
}

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
      <span style={{ fontSize: "14px", color: "var(--shouf-text-muted)", flex: 1 }}>
        {description}
      </span>
    </div>
  );
}

// ─── PdsOverviewCanvas ──────────────────────────────────────────────────────

export function PdsOverviewCanvas() {
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
        <SectionGridCanvas sectionId="portfolio-design-system" excludeIds={["pds-overview"]} noSelection />
      </div>

      {/* ── Divider between tiles and case study ─────────────────────────── */}
      <div style={{ padding: "0 clamp(20px, 10vw, 192px)" }}>
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
          padding:       "0 clamp(20px, 10vw, 192px) 80px",
          boxSizing:     "border-box",
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
                Shouf Design System
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
                Shouf is the design system that powers this portfolio — built entirely from scratch.
              </h1>
              <Body>
                Every surface you&apos;re looking at — the shell, the tokens, the components, the
                animations — was designed and engineered as a cohesive system. Shouf is both the
                subject of the portfolio and the medium it&apos;s delivered in.
              </Body>
            </div>

          </section>

          <Divider />

          {/* ── Motivation ─────────────────────────────────────────────────── */}
          <section style={{ marginBottom: "72px" }}>
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
          </section>

          <Divider />

          {/* ── Architecture ───────────────────────────────────────────────── */}
          <section style={{ marginBottom: "72px" }}>
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
          </section>

          <Divider />

          {/* ── Tokens ─────────────────────────────────────────────────────── */}
          <section style={{ marginBottom: "72px" }}>
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
          </section>

          <Divider />

          {/* ── Components ─────────────────────────────────────────────────── */}
          <section style={{ marginBottom: "72px" }}>
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
          </section>

          <Divider />

          {/* ── Craft ──────────────────────────────────────────────────────── */}
          <section style={{ marginBottom: "72px" }}>
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
          </section>

        </div>
    </div>
  );
}
