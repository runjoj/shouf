"use client";

import { useRef, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { AccordionNav } from "@/components/navigation/AccordionNav";
import { PdsInput } from "@/components/portfolio-design-system/PdsInput/PdsInput";

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
        <span className="text-[14px] font-bold tracking-tight" style={{ color: "var(--sh-text)" }}>
          helloitsjo
        </span>
      </div>
    </button>
  );
}

// ─── Search bar ───────────────────────────────────────────────────────────────
// Uses PdsInput so the shell search and the canvas demo share the exact same
// component — design spec is always in sync. ⌘K (or Ctrl+K) focuses the input.

function SearchBar() {
  const { launched } = useAppStore();
  const inputRef = useRef<HTMLInputElement>(null);

  // ⌘K / Ctrl+K focuses the search input
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div
      className="px-3 py-2"
      style={{
        // Intro stagger — same timing as before
        animationName:           "intro-reveal",
        animationDuration:       "220ms",
        animationTimingFunction: "ease",
        animationFillMode:       "both",
        animationDelay:          `${SEARCH_DELAY}ms`,
        animationPlayState:      launched ? "running" : "paused",
      }}
    >
      <PdsInput
        ref={inputRef}
        size="sm"
        withLabel={false}
        withIcon={true}
        withHelper={false}
        placeholder="Search components…"
        kbd="⌘K"
        fullWidth
      />
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
        className="shrink-0 flex items-center px-4 h-[44px]"
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
        <span className="text-[12px]" style={{ color: "var(--sh-text-faint)" }}>
          v1.0.0-shell
        </span>
      </div>
    </aside>
  );
}
