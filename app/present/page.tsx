"use client";

// ─── Interview Presentation ──────────────────────────────────────────────────
// Standalone slide deck for a 60-minute design interview.
// Two case studies: Responsive Navigation (BambooHR) + Onboarding Flow (Qualiti).
// Keyboard nav: ← → arrows, spacebar. Click zones on left/right 15% of screen.
// All content and images sourced from the portfolio repo's public/ folder.

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { RcGlobalNavCanvas } from "@/components/canvas/RcGlobalNavCanvas";
import { useAppStore } from "@/lib/store";

// ── Design tokens ─────────────────────────────────────────────────────────────
// Contrast is tuned for screenshare / projector. Body text sits at ~#c0 so it
// stays readable on Zoom compression; captions are a touch dimmer but still legible.
const BG     = "#090909";
const TEXT   = "#f5f5f5";
const ACCENT = "#C8E000";
const BODY   = "#e2e2e2";   // primary body copy — readable on projector/Zoom compression
const SUB    = "#cccccc";   // captions, secondary labels — not "secondary" by contrast, only by size
const DIM    = "#7a7a7a";   // tertiary chrome (slide counter) — still legible, just quieter
const BORDER = "#262626";
const SANS   = "var(--font-instrument-sans), var(--font-manrope), system-ui, sans-serif";
const MONO   = "ui-monospace, 'SF Mono', Menlo, monospace";

// ── Slide type definitions ────────────────────────────────────────────────────
type Slide =
  | { type: "cover";         label: string; title: string; sub: string }
  | { type: "section-break"; num: string;   title: string; company: string; role: string }
  | { type: "statement";     label: string; headline: string; body?: string; body2?: string }
  | { type: "image";         src: string;   alt: string;   caption?: string }
  | { type: "live-nav";      label: string; caption?: string }
  | { type: "two-image";     label: string; images: Array<{ src: string; alt: string; caption: string }> }
  | { type: "stats";         label: string; stats: Array<{ value: string; label: string }>; note?: string }
  | { type: "quote";         quote: string }
  | { type: "qa";            title: string }
  | { type: "close" };

// ── Slide content ─────────────────────────────────────────────────────────────
const SLIDES: Slide[] = [

  // ─── Cover ──────────────────────────────────────────────────────────────────
  {
    type:  "cover",
    label: "",
    title: "Jo Ann Saab",
    sub:   "Case Study Presentation",
  },

  // ─── Case Study 01: Responsive Navigation ───────────────────────────────────
  {
    type:    "section-break",
    num:     "01",
    title:   "Responsive Navigation",
    company: "BambooHR",
    role:    "Design Systems · Fabric DS",
  },
  {
    type:     "statement",
    label:    "Context",
    headline: "BambooHR's platform was built for a world that no longer exists.",
    body:     "The product was built without responsive behavior. 19% of users are on mobile, but the product was mocked to render a 900px screen. There was a 40:1 web to mobile engineering gap.",
  },
  {
    type:    "image",
    src:     "/presentation_nav1.png",
    alt:     "Too many nav layers and unclear hierarchy",
    caption: "Three nav layers compete for horizontal space. Users lose track of where they are.",
  },
  {
    type:    "image",
    src:     "/presentation_nav2.png",
    alt:     "Header stacks and broken mobile navigation",
    caption: "Repeated headers pack context into tighter frames. Mobile breaks entirely.",
  },
  {
    type:     "statement",
    label:    "Research",
    headline: "Two rounds of customer interviews.",
    body:     "12 moderated sessions for directional signal, then 15 unmoderated sessions with a working prototype — focused on how users moved between breakpoints.",
  },
  {
    type:    "image",
    src:     "/testing_navigation.png",
    alt:     "Usability testing sessions for responsive navigation",
    caption: "Unmoderated prototype testing — observing navigation patterns across screen sizes",
  },
  {
    type:     "statement",
    label:    "Key Decision",
    headline: "Don't fix the nav. Fix the system the nav lives in.",
    body:     "Responsive foundations went directly into Fabric — so every team gets responsiveness by default, not as a special project. The same move opens a path to close a 40:1 web-to-mobile engineering gap without a parallel native build.",
  },
  {
    type:     "statement",
    label:    "Navigation Solution",
    headline: "Remove stacked nav levels. Nest them in the left nav.",
    body:     "Works at every breakpoint: collapsed desktop, AI panel open, split-pane, mobile. Sub-nav surfaces as flyouts when collapsed, or a full-width drawer on mobile.",
  },
  {
    type:    "live-nav",
    label:   "Live Prototype",
    caption: "Drag the right edge to resize. The nav restructures itself at the tablet and mobile breakpoints.",
  },
  {
    type:     "statement",
    label:    "Reflection",
    headline: "Phased approach to new patterns.",
    body:     "Nav components lived in a separate repo, connected via API calls. Nesting them would mean an API call per level — worse performance at exactly the wrong moment. Phase 1 shipped what the architecture could support today.",
  },
  {
    type:    "image",
    src:     "/current_navigation.png",
    alt:     "Phased navigation rollout plan",
    caption: "Phased rollout — mapping current state to end state, with constraints named",
  },
  {
    type:  "stats",
    label: "Outcome",
    stats: [
      { value: "19%",     label: "of users on mobile — now reached by a responsive experience" },
      { value: "40:1",    label: "web-to-mobile engineering gap — a path to close it" },
      { value: "VPAT",    label: "raise accessibility standards, meet compliance, and unlock customers" },
    ],
    note: "Phase 1-3 shipped behind a feature flag. Teams had runway to complete their areas before compliance became a default expectation.",
  },
  {
    type:  "qa",
    title: "Responsive Navigation",
  },

  // ─── Case Study 02: Onboarding Flow ─────────────────────────────────────────
  {
    type:    "section-break",
    num:     "02",
    title:   "Onboarding Flow",
    company: "Qualiti",
    role:    "Product Design",
  },
  {
    type:     "statement",
    label:    "Context",
    headline: "Users dropped off before they ever saw the product work.",
    body:     "Qualiti is an AI-powered testing platform. Setup was fragmented across pages with no clear sequence — and the AI couldn't prove its value until every step was complete. Most users quit before getting there.",
  },
  {
    type:  "stats",
    label: "The Problem, in Numbers",
    stats: [
      { value: "60%",    label: "abandonment during project setup" },
      { value: "25%",    label: "dropped off during profile creation" },
      { value: "2+ hrs", label: "average time to first successful test run" },
    ],
    note: "These weren't retention problems. They were first-impression problems.",
  },
  {
    type:  "quote",
    quote: "Onboarding isn't about explaining the product. It's about proving the value proposition.",
  },
  {
    type:     "statement",
    label:    "Solution",
    headline: "Four steps. Designed for emotional momentum, not technical completeness.",
    body:     "Engineering confirmed every step was required. The design question wasn't \u201Ccan we cut steps?\u201D — it was \u201Ccan we make each step feel like forward progress?\u201D",
  },
  {
    type:    "image",
    src:     "/solution_1_flow.png",
    alt:     "Step 1: Project Setup",
    caption: "Step 1 — Project Setup: optional but critical for test quality. Users who skipped got lower-fidelity AI results.",
  },
  {
    type:    "image",
    src:     "/solution_2_flow.png",
    alt:     "Step 2: User Profile",
    caption: "Step 2 — User Profile: stripped to bare essentials. Inline validation so errors surface before they block progress.",
  },
  {
    type:    "image",
    src:     "/solution_3_flow.png",
    alt:     "Step 3: Features & Tests",
    caption: "Step 3 — Features & Tests: one folder, one test. The AI recommends — users just confirm. First wow moment.",
  },
  {
    type:    "image",
    src:     "/solution_4_flow.png",
    alt:     "Step 4: Guided Walkthrough",
    caption: "Step 4 — Guided Walkthrough: three-step popout showing exactly where key things live after setup completes.",
  },
  {
    type:  "stats",
    label: "Outcome",
    stats: [
      { value: "78%",   label: "onboarding completion rate, up from 12%" },
      { value: "15 min", label: "median time to first test run, down from 2+ hours" },
    ],
    note: "Users onboarded themselves for the first time — without support intervention.",
  },
  {
    type:     "statement",
    label:    "Reflection",
    headline: "It still felt complex. That was the minimum.",
    body:     "The flow worked for the first user on an account — but didn't account for teammates who joined later. They got the popout bubbles without the setup context.",
    body2:    "Next iteration: design for the second and third user from day one. Onboarding isn't a one-time event.",
  },
  {
    type:  "qa",
    title: "Onboarding Flow",
  },

  // ─── Close ──────────────────────────────────────────────────────────────────
  {
    type: "close",
  },
];

// ── Primitive components ───────────────────────────────────────────────────────

function SlideLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily:    MONO,
      fontSize:      "20px",
      fontWeight:    600,
      letterSpacing: "0.1em",
      textTransform: "uppercase" as const,
      color:         ACCENT,
      marginBottom:  "30px",
    }}>
      {children}
    </div>
  );
}

function SlideHeadline({ children, size = "md" }: { children: React.ReactNode; size?: "sm" | "md" | "lg" | "xl" }) {
  const fs = { sm: "40px", md: "56px", lg: "72px", xl: "96px" }[size];
  // Cap width so long headlines wrap to ~2 lines and share a column with the body
  // beneath them. Wider at lg/xl sizes since those slides carry fewer words.
  const mw = { sm: "860px", md: "900px", lg: "1180px", xl: "1400px" }[size];
  return (
    <h2 style={{
      fontFamily:    SANS,
      fontSize:      fs,
      fontWeight:    600,
      color:         TEXT,
      margin:        0,
      lineHeight:    1.08,
      letterSpacing: "-0.03em",
      marginBottom:  "32px",
      maxWidth:      mw,
      // balance: distribute characters evenly across lines — no widow word on its own line
      textWrap:      "balance",
    }}>
      {children}
    </h2>
  );
}

function SlideBody({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily:  SANS,
      fontSize:    "21px",
      lineHeight:  1.65,
      color:       BODY,
      margin:      0,
      marginBottom:"18px",
      maxWidth:    "820px",
      fontWeight:  400,
      // pretty: prevents an orphan word from landing alone on the last line
      textWrap:    "pretty",
    }}>
      {children}
    </p>
  );
}

// ── Slide renderers ────────────────────────────────────────────────────────────

function CoverSlide({ slide }: { slide: Extract<Slide, { type: "cover" }> }) {
  return (
    <div style={{
      display:        "flex",
      flexDirection:  "column",
      alignItems:     "center",
      justifyContent: "center",
      height:         "100%",
      textAlign:      "center",
      padding:        "80px",
      gap:            "0",
    }}>
      <h1 style={{
        fontFamily:    SANS,
        fontSize:      "clamp(72px, 10vw, 120px)",
        fontWeight:    600,
        color:         TEXT,
        letterSpacing: "-0.04em",
        lineHeight:    1,
        margin:        0,
        marginBottom:  "36px",
      }}>
        {slide.title}
      </h1>
      <div style={{
        fontFamily:    MONO,
        fontSize:      "21px",
        fontWeight:    600,
        color:         ACCENT,
        letterSpacing: "0.04em",
      }}>
        {slide.sub}
      </div>
    </div>
  );
}

function SectionBreakSlide({ slide }: { slide: Extract<Slide, { type: "section-break" }> }) {
  return (
    <div style={{
      display:       "flex",
      flexDirection: "column",
      justifyContent:"center",
      height:        "100%",
      padding:       "80px 120px",
      position:      "relative",
    }}>
      {/* Large number — textural background element */}
      <div style={{
        position:      "absolute",
        top:           "50%",
        right:         "100px",
        transform:     "translateY(-50%)",
        fontFamily:    MONO,
        fontSize:      "clamp(160px, 22vw, 280px)",
        fontWeight:    700,
        color:         "#131313",
        lineHeight:    1,
        letterSpacing: "-0.05em",
        userSelect:    "none",
        pointerEvents: "none",
      }}>
        {slide.num}
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{
          fontFamily:    MONO,
          fontSize:      "21px",
          fontWeight:    600,
          letterSpacing: "0.1em",
          textTransform: "uppercase" as const,
          color:         ACCENT,
          marginBottom:  "32px",
        }}>
          {slide.company} · {slide.role}
        </div>
        <h1 style={{
          fontFamily:    SANS,
          fontSize:      "clamp(52px, 7vw, 80px)",
          fontWeight:    600,
          color:         TEXT,
          margin:        0,
          lineHeight:    1.05,
          letterSpacing: "-0.035em",
        }}>
          {slide.title}
        </h1>
      </div>
    </div>
  );
}

function StatementSlide({ slide }: { slide: Extract<Slide, { type: "statement" }> }) {
  return (
    <div style={{
      display:       "flex",
      flexDirection: "column",
      justifyContent:"center",
      alignItems:    "center",
      height:        "100%",
      padding:       "80px 120px",
    }}>
      {/* Centered column: content stays left-aligned inside, but the whole
          block sits centered in the slide — symmetric breathing room on both sides */}
      <div style={{ width: "100%", maxWidth: "1400px" }}>
        <SlideLabel>{slide.label}</SlideLabel>
        <SlideHeadline size={slide.body ? "md" : "lg"}>{slide.headline}</SlideHeadline>
        {slide.body  && <SlideBody>{slide.body}</SlideBody>}
        {slide.body2 && <SlideBody>{slide.body2}</SlideBody>}
      </div>
    </div>
  );
}

function ImageSlide({ slide }: { slide: Extract<Slide, { type: "image" }> }) {
  return (
    <div style={{
      display:        "flex",
      flexDirection:  "column",
      justifyContent: "center",
      alignItems:     "center",
      height:         "100%",
      padding:        "40px 64px 56px",
      gap:            "20px",
    }}>
      <img
        src={slide.src}
        alt={slide.alt}
        style={{
          maxWidth:   "100%",
          maxHeight:  "calc(100vh - 180px)",
          objectFit:  "contain",
          borderRadius:"10px",
          border:     `1px solid ${BORDER}`,
          display:    "block",
        }}
      />
      {slide.caption && (
        <div style={{
          fontFamily:    MONO,
          fontSize:      "16px",
          color:         SUB,
          letterSpacing: "0.03em",
          textAlign:     "center",
          maxWidth:      "900px",
          lineHeight:    1.55,
          textWrap:      "balance",
        }}>
          {slide.caption}
        </div>
      )}
    </div>
  );
}

function LiveNavSlide({ slide }: { slide: Extract<Slide, { type: "live-nav" }> }) {
  return (
    <div style={{
      display:        "flex",
      flexDirection:  "column",
      alignItems:     "center",
      justifyContent: "center",
      height:         "100%",
      padding:        "28px 48px 40px",
      gap:            "16px",
    }}>
      <div style={{
        fontFamily:    MONO,
        fontSize:      "20px",
        fontWeight:    600,
        letterSpacing: "0.1em",
        textTransform: "uppercase" as const,
        color:         ACCENT,
        flexShrink:    0,
      }}>
        {slide.label}
      </div>
      {/*
        Live, interactive prototype. Same component used on the portfolio
        case study — resizable frame, responsive breakpoints, portal-based
        dropdowns, accordion sub-nav. Authentic light palette is intentional:
        the component simulates a third-party product and shouldn't inherit
        the deck's theme.
      */}
      <div style={{
        width:        "100%",
        flex:         1,
        minHeight:    0,
        borderRadius: "10px",
        border:       `1px solid ${BORDER}`,
        overflow:     "hidden",
        background:   "#fff",
      }}>
        <RcGlobalNavCanvas />
      </div>
      {slide.caption && (
        <div style={{
          fontFamily:    MONO,
          fontSize:      "16px",
          color:         SUB,
          letterSpacing: "0.03em",
          textAlign:     "center",
          maxWidth:      "820px",
          lineHeight:    1.55,
          flexShrink:    0,
        }}>
          {slide.caption}
        </div>
      )}
    </div>
  );
}

function TwoImageSlide({ slide }: { slide: Extract<Slide, { type: "two-image" }> }) {
  return (
    <div style={{
      display:       "flex",
      flexDirection: "column",
      justifyContent:"center",
      height:        "100%",
      padding:       "48px 80px",
      gap:           "24px",
    }}>
      <SlideLabel>{slide.label}</SlideLabel>
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "24px",
        flex: 1,
        minHeight: 0,
      }}>
        {slide.images.map((img, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: "12px", minHeight: 0 }}>
            <img
              src={img.src}
              alt={img.alt}
              style={{
                width:        "100%",
                flex:         1,
                minHeight:    0,
                objectFit:    "contain",
                borderRadius: "8px",
                border:       `1px solid ${BORDER}`,
                display:      "block",
              }}
            />
            <div style={{
              fontFamily:    MONO,
              fontSize:      "15px",
              color:         SUB,
              letterSpacing: "0.03em",
              lineHeight:    1.5,
            }}>
              {img.caption}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatsSlide({ slide }: { slide: Extract<Slide, { type: "stats" }> }) {
  return (
    <div style={{
      display:       "flex",
      flexDirection: "column",
      justifyContent:"center",
      height:        "100%",
      padding:       "80px 120px",
    }}>
      <SlideLabel>{slide.label}</SlideLabel>
      <div style={{
        display:  "flex",
        gap:      "72px",
        flexWrap: "wrap" as const,
        marginBottom: slide.note ? "48px" : "0",
      }}>
        {slide.stats.map((stat, i) => (
          <div key={i}>
            <div style={{
              fontFamily:    SANS,
              fontSize:      "clamp(48px, 6vw, 72px)",
              fontWeight:    600,
              color:         ACCENT,
              lineHeight:    1,
              letterSpacing: "-0.03em",
              marginBottom:  "14px",
            }}>
              {stat.value}
            </div>
            <div style={{
              fontFamily: SANS,
              fontSize:   "17px",
              color:      BODY,
              lineHeight: 1.5,
              maxWidth:   "220px",
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
      {slide.note && (
        <div style={{
          fontFamily:    MONO,
          fontSize:      "17px",
          color:         SUB,
          letterSpacing: "0.01em",
          borderLeft:    `2px solid ${ACCENT}`,
          paddingLeft:   "22px",
          lineHeight:    1.55,
          maxWidth:      "720px",
        }}>
          {slide.note}
        </div>
      )}
    </div>
  );
}

function QuoteSlide({ slide }: { slide: Extract<Slide, { type: "quote" }> }) {
  return (
    <div style={{
      display:        "flex",
      flexDirection:  "column",
      alignItems:     "center",
      justifyContent: "center",
      height:         "100%",
      padding:        "80px 160px",
      textAlign:      "center",
    }}>
      {/* Opening mark */}
      <div style={{
        fontFamily:    SANS,
        fontSize:      "120px",
        color:         "#1a1a1a",
        lineHeight:    0.6,
        marginBottom:  "32px",
        fontWeight:    700,
        userSelect:    "none",
      }}>
        "
      </div>
      <p style={{
        fontFamily:    SANS,
        fontSize:      "clamp(28px, 3.5vw, 44px)",
        fontWeight:    500,
        color:         TEXT,
        lineHeight:    1.35,
        letterSpacing: "-0.02em",
        maxWidth:      "820px",
        margin:        0,
      }}>
        {slide.quote}
      </p>
    </div>
  );
}

function QASlide({ slide }: { slide: Extract<Slide, { type: "qa" }> }) {
  return (
    <div style={{
      display:        "flex",
      flexDirection:  "column",
      alignItems:     "center",
      justifyContent: "center",
      height:         "100%",
      textAlign:      "center",
    }}>
      <div style={{
        fontFamily:    MONO,
        fontSize:      "21px",
        fontWeight:    600,
        letterSpacing: "0.1em",
        textTransform: "uppercase" as const,
        color:         ACCENT,
        marginBottom:  "36px",
      }}>
        {slide.title}
      </div>
      <h2 style={{
        fontFamily:    SANS,
        fontSize:      "clamp(52px, 8vw, 88px)",
        fontWeight:    600,
        color:         TEXT,
        margin:        0,
        letterSpacing: "-0.035em",
        lineHeight:    1,
      }}>
        Questions?
      </h2>
    </div>
  );
}

function CloseSlide() {
  return (
    <div style={{
      display:        "flex",
      flexDirection:  "column",
      alignItems:     "center",
      justifyContent: "center",
      height:         "100%",
      textAlign:      "center",
    }}>
      <div style={{
        fontFamily:    MONO,
        fontSize:      "21px",
        fontWeight:    600,
        letterSpacing: "0.1em",
        textTransform: "uppercase" as const,
        color:         ACCENT,
        marginBottom:  "36px",
      }}>
        Jo Ann Saab
      </div>
      <h2 style={{
        fontFamily:    SANS,
        fontSize:      "clamp(52px, 8vw, 88px)",
        fontWeight:    600,
        color:         TEXT,
        margin:        0,
        letterSpacing: "-0.035em",
        lineHeight:    1,
      }}>
        Thank you.
      </h2>
    </div>
  );
}

// ── Keyboard hint (shown briefly on first load) ───────────────────────────────

function KeyHint({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position:   "fixed",
            bottom:     "72px",
            left:       "50%",
            transform:  "translateX(-50%)",
            fontFamily: MONO,
            fontSize:   "15px",
            color:      SUB,
            letterSpacing: "0.04em",
            pointerEvents: "none",
            zIndex:     20,
            whiteSpace: "nowrap",
          }}
        >
          ← → arrow keys to navigate
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function PresentPage() {
  const router = useRouter();
  const { launch } = useAppStore();
  const [idx,       setIdx]       = useState(0);
  const [direction, setDirection] = useState(1);
  const [showHint,  setShowHint]  = useState(true);
  const hasNavigated = useRef(false);

  const total    = SLIDES.length;
  const progress = (idx / (total - 1)) * 100;

  const go = useCallback((next: number) => {
    if (next < 0 || next >= total) return;
    setDirection(next > idx ? 1 : -1);
    setIdx(next);
    if (!hasNavigated.current) {
      hasNavigated.current = true;
      setShowHint(false);
    }
  }, [idx, total]);

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // Cmd/Ctrl + \  →  exit presentation, return to portfolio home
      if ((e.metaKey || e.ctrlKey) && e.key === "\\") {
        e.preventDefault();
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => { /* ignore */ });
        }
        // Skip the intro/typing landing when returning to the portfolio.
        launch();
        router.push("/");
        return;
      }
      if (["ArrowRight", "ArrowDown", " "].includes(e.key)) {
        e.preventDefault();
        go(idx + 1);
      } else if (["ArrowLeft", "ArrowUp"].includes(e.key)) {
        e.preventDefault();
        go(idx - 1);
      } else if (e.key === "Home") {
        go(0);
      } else if (e.key === "End") {
        go(total - 1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, idx, total, router]);

  // Hide hint after 5s regardless
  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 5000);
    return () => clearTimeout(t);
  }, []);

  // Auto-fullscreen: if not already fullscreen (e.g. page opened directly),
  // request it on the first user interaction — browsers require a gesture.
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.fullscreenElement) return;
    function enter() {
      const el = document.documentElement;
      if (!document.fullscreenElement && el.requestFullscreen) {
        el.requestFullscreen().catch(() => { /* ignore */ });
      }
      window.removeEventListener("keydown",   enter);
      window.removeEventListener("pointerdown", enter);
    }
    window.addEventListener("keydown",   enter, { once: true });
    window.addEventListener("pointerdown", enter, { once: true });
    return () => {
      window.removeEventListener("keydown",   enter);
      window.removeEventListener("pointerdown", enter);
    };
  }, []);

  // Slide transition variants — gentle upward drift with crossfade
  const variants = {
    enter:  (dir: number) => ({ opacity: 0, y: dir > 0 ? 16 : -16 }),
    center: { opacity: 1, y: 0 },
    exit:   (dir: number) => ({ opacity: 0, y: dir > 0 ? -16 : 16 }),
  };

  function renderSlide(s: Slide) {
    switch (s.type) {
      case "cover":         return <CoverSlide         slide={s} />;
      case "section-break": return <SectionBreakSlide  slide={s} />;
      case "statement":     return <StatementSlide     slide={s} />;
      case "image":         return <ImageSlide         slide={s} />;
      case "live-nav":      return <LiveNavSlide       slide={s} />;
      case "two-image":     return <TwoImageSlide      slide={s} />;
      case "stats":         return <StatsSlide         slide={s} />;
      case "quote":         return <QuoteSlide         slide={s} />;
      case "qa":            return <QASlide            slide={s} />;
      case "close":         return <CloseSlide />;
    }
  }

  return (
    <div style={{
      position:      "fixed",
      inset:         0,
      background:    BG,
      overflow:      "hidden",
      display:       "flex",
      flexDirection: "column",
      // Force dark regardless of system preference or portfolio theme
      colorScheme:   "dark",
    }}>

      {/* Progress bar — top edge */}
      <div style={{
        position:   "absolute",
        top:        0,
        left:       0,
        right:      0,
        height:     "2px",
        background: BORDER,
        zIndex:     10,
      }}>
        <div style={{
          height:     "100%",
          width:      `${progress}%`,
          background: ACCENT,
          transition: "width 0.45s cubic-bezier(0.25, 0, 0, 1)",
        }} />
      </div>

      {/* Slide content */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={idx}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.25, 0, 0, 1] }}
            style={{ position: "absolute", inset: 0 }}
          >
            {renderSlide(SLIDES[idx])}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom bar */}
      <div style={{
        display:       "flex",
        alignItems:    "center",
        justifyContent:"space-between",
        padding:       "0 28px",
        height:        "52px",
        borderTop:     `1px solid ${BORDER}`,
        flexShrink:    0,
        background:    BG,
        zIndex:        10,
      }}>

        {/* Slide counter — nudged right so it clears the Next.js dev overlay badge */}
        <div style={{
          fontFamily:    MONO,
          fontSize:      "15px",
          color:         BODY,
          letterSpacing: "0.04em",
          minWidth:      "80px",
          marginLeft:    "60px",
        }}>
          {String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </div>

        {/* Dot navigation */}
        <div style={{
          display:    "flex",
          gap:        "5px",
          alignItems: "center",
        }}>
          {SLIDES.map((s, i) => {
            const isCurrent = i === idx;
            // Section break slides get a slightly brighter dot
            const isMajor = s.type === "section-break" || s.type === "cover" || s.type === "close";
            return (
              <button
                key={i}
                onClick={() => go(i)}
                title={`Slide ${i + 1}`}
                style={{
                  all:          "unset",
                  cursor:       "pointer",
                  width:        isCurrent ? "18px" : "5px",
                  height:       "5px",
                  borderRadius: "2.5px",
                  background:   isCurrent ? ACCENT : isMajor ? "#333" : BORDER,
                  transition:   "all 0.2s ease",
                  flexShrink:   0,
                }}
              />
            );
          })}
        </div>

        {/* Arrow buttons */}
        <div style={{ display: "flex", gap: "4px", minWidth: "60px", justifyContent: "flex-end" }}>
          {[
            { label: "←", delta: -1, disabled: idx === 0 },
            { label: "→", delta:  1, disabled: idx === total - 1 },
          ].map(({ label, delta, disabled }) => (
            <button
              key={label}
              onClick={() => go(idx + delta)}
              disabled={disabled}
              style={{
                all:        "unset",
                cursor:     disabled ? "default" : "pointer",
                fontFamily: MONO,
                fontSize:   "19px",
                color:      disabled ? "#333" : BODY,
                padding:    "6px 12px",
                transition: "color 0.15s",
                borderRadius:"4px",
              }}
              onMouseEnter={e => { if (!disabled) (e.currentTarget as HTMLElement).style.color = ACCENT; }}
              onMouseLeave={e => { if (!disabled) (e.currentTarget as HTMLElement).style.color = BODY; }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Keyboard hint */}
      <KeyHint visible={showHint} />
    </div>
  );
}
