"use client";

import { useAppStore } from "@/lib/store";
import { AccordionNav } from "@/components/navigation/AccordionNav";

// ─── Intro delay schedule for left-panel elements ─────────────────────────────
// These are ms after launch() fires. AccordionNav items continue from 270ms+.
const LOGO_DELAY   = 0;
const SEARCH_DELAY = 80;

// ─── Logo mark ───────────────────────────────────────────────────────────────

function LogoMark() {
  const { reset, launched } = useAppStore();
  return (
    <button
      onClick={reset}
      style={{
        background: "none",
        border:     "none",
        padding:    0,
        cursor:     "pointer",
        display:    "flex",
        alignItems: "center",
        // Intro stagger
        animationName:           "intro-reveal",
        animationDuration:       "250ms",
        animationTimingFunction: "ease",
        animationFillMode:       "both",
        animationDelay:          `${LOGO_DELAY}ms`,
        animationPlayState:      launched ? "running" : "paused",
      }}
      title="Back to Welcome"
    >
      <div className="flex items-center gap-2">
        <div
          className="w-[22px] h-[22px] rounded-md flex items-center justify-center"
          style={{ backgroundColor: "var(--sh-accent)" }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect x="2" y="2" width="3.5" height="3.5" rx="0.75" fill="#111111" />
            <rect x="6.5" y="2" width="3.5" height="3.5" rx="0.75" fill="#111111" fillOpacity="0.5" />
            <rect x="2" y="6.5" width="3.5" height="3.5" rx="0.75" fill="#111111" fillOpacity="0.5" />
            <rect x="6.5" y="6.5" width="3.5" height="3.5" rx="0.75" fill="#111111" fillOpacity="0.75" />
          </svg>
        </div>
        <span className="text-[13px] font-bold tracking-tight" style={{ color: "var(--sh-text)" }}>
          DS Portfolio
        </span>
      </div>
    </button>
  );
}

// ─── Search bar placeholder ──────────────────────────────────────────────────

function SearchBar() {
  const { launched } = useAppStore();
  return (
    <div
      className="px-3 py-2"
      style={{
        // Intro stagger
        animationName:           "intro-reveal",
        animationDuration:       "220ms",
        animationTimingFunction: "ease",
        animationFillMode:       "both",
        animationDelay:          `${SEARCH_DELAY}ms`,
        animationPlayState:      launched ? "running" : "paused",
      }}
    >
      <div
        className="flex items-center gap-2 px-2.5 py-[6px] rounded-md"
        style={{ backgroundColor: "var(--sh-input-bg)", border: "1px solid var(--sh-border)" }}
      >
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
          <circle cx="5.5" cy="5.5" r="3.5" stroke="var(--sh-text-faint)" strokeWidth="1.5" />
          <path d="M8.5 8.5L11 11" stroke="var(--sh-text-faint)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span className="text-[11px]" style={{ color: "var(--sh-text-faint)" }}>
          Search components…
        </span>
        <span
          className="ml-auto text-[9px] px-1 py-px rounded"
          style={{ backgroundColor: "var(--sh-border)", color: "var(--sh-text-faint)" }}
        >
          ⌘K
        </span>
      </div>
    </div>
  );
}

// ─── LeftPanel ───────────────────────────────────────────────────────────────

export function LeftPanel() {
  return (
    <aside
      className="flex flex-col h-full overflow-hidden"
      style={{
        backgroundColor: "var(--sh-panel)",
        borderRight: "1px solid var(--sh-border-sub)",
        width: "260px",
        minWidth: "260px",
      }}
    >
      {/* Top bar with logo */}
      <div
        className="shrink-0 flex items-center px-4 h-[42px]"
        style={{ borderBottom: "1px solid var(--sh-border-sub)" }}
      >
        <LogoMark />
      </div>

      {/* Search */}
      <SearchBar />

      {/* Accordion navigation + Welcome item */}
      <AccordionNav />

      {/* Bottom status bar */}
      <div
        className="shrink-0 flex items-center gap-2 px-3 py-2"
        style={{ borderTop: "1px solid var(--sh-border-sub)" }}
      >
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--sh-accent-sage)" }} />
        <span className="text-[10px]" style={{ color: "var(--sh-text-faint)" }}>
          v1.0.0-shell
        </span>
      </div>
    </aside>
  );
}
