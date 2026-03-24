"use client";

// ─── LeftPanel ─────────────────────────────────────────────────────────────────
// Contains the logo, the live search bar, and the accordion nav.
//
// Search: filters all nav entries by name. Results appear in a portal-based
// dropdown (escapes the panel's overflow:hidden). Keyboard nav: ↑↓ to move,
// Enter to select, Escape to dismiss. Matching text is highlighted with the
// accent color — an expressive moment that shows the token system is live.

import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAppStore } from "@/lib/store";
import { AccordionNav } from "@/components/navigation/AccordionNav";
import { PdsInput } from "@/components/portfolio-design-system/PdsInput/PdsInput";
import { navSections } from "@/data/navigation";
import type { ComponentEntry } from "@/lib/types";

// ─── Intro delay schedule ─────────────────────────────────────────────────────
// ms after launch() fires. AccordionNav items continue from 270ms+.
const LOGO_DELAY   = 0;
const SEARCH_DELAY = 80;

// ─── Section metadata for search result labels ────────────────────────────────
// Colors map to shell accent tokens so they work in light + dark mode.

const SECTION_META: Record<string, { short: string; color: string }> = {
  "portfolio-design-system": { short: "Shouf",      color: "var(--shouf-accent)"      },
  "responsive-components":   { short: "Responsive", color: "var(--shouf-accent-blue)" },
  "eucalyptus":              { short: "Eucalyptus", color: "var(--shouf-accent-sage)" },
};

// Flattened list of every nav entry — the search index.
// Includes both top-level entries and nested group entries.
const ALL_ENTRIES: ComponentEntry[] = navSections.flatMap((s) => [
  ...s.entries,
  ...(s.groups ?? []).flatMap((g) => g.entries),
]);

// ─── HighlightMatch ───────────────────────────────────────────────────────────
// Expressive craft moment: the matched substring is tinted with the live
// accent color, showing the token system in action during search.

function HighlightMatch({ text, query }: { text: string; query: string }) {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark
        style={{
          background:   "var(--shouf-accent-sel)",
          color:        "inherit",
          borderRadius: "2px",
          padding:      "0 1px",
        }}
      >
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

// ─── SearchDropdown ───────────────────────────────────────────────────────────
// Rendered via createPortal so it escapes the panel's overflow:hidden.
// Positioned below the search container using getBoundingClientRect.

function SearchDropdown({
  anchorEl,
  results,
  activeIndex,
  query,
  onSelect,
  onClose,
}: {
  anchorEl:    HTMLDivElement | null;
  results:     ComponentEntry[];
  activeIndex: number;
  query:       string;
  onSelect:    (entry: ComponentEntry) => void;
  onClose:     () => void;
}) {
  const r = anchorEl?.getBoundingClientRect();
  if (!r) return null;

  // Align to the input element inside the px-3 (12px) wrapper padding
  const left  = r.left + 12;
  const width = r.width - 24;
  const top   = r.bottom + 4;

  return createPortal(
    <>
      {/* Backdrop — click anywhere outside to dismiss */}
      <div
        style={{ position: "fixed", inset: 0, zIndex: 9000 }}
        onMouseDown={onClose}
      />

      {/* Results panel */}
      <div
        style={{
          position:        "fixed",
          top,
          left,
          width,
          zIndex:          9001,
          backgroundColor: "var(--shouf-panel)",
          border:          "1px solid var(--shouf-border)",
          borderRadius:    "8px",
          boxShadow:       "0 4px 20px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06)",
          overflow:        "hidden",
          animation:       "search-in 100ms ease both",
        }}
      >
        {results.length === 0 ? (
          <div
            style={{
              padding:  "10px 12px",
              fontSize: "12px",
              color:    "var(--shouf-text-faint)",
            }}
          >
            No results for &ldquo;{query}&rdquo;
          </div>
        ) : (
          <div style={{ padding: "4px" }}>
            {results.map((entry, i) => {
              const meta     = SECTION_META[entry.sectionId] ?? { short: entry.sectionId, color: "var(--shouf-text-faint)" };
              const isActive = i === activeIndex;
              return (
                <button
                  key={entry.id}
                  // preventDefault prevents the input from blurring on mousedown
                  onMouseDown={(e) => { e.preventDefault(); onSelect(entry); }}
                  style={{
                    display:      "flex",
                    alignItems:   "center",
                    gap:          "8px",
                    width:        "100%",
                    padding:      "6px 8px",
                    border:       "none",
                    borderRadius: "5px",
                    background:   isActive ? "var(--shouf-accent-sel)" : "transparent",
                    cursor:       "pointer",
                    textAlign:    "left",
                    transition:   "background 60ms ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "var(--shouf-hover)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  }}
                >
                  {/* Section color indicator */}
                  <div
                    style={{
                      width:           "6px",
                      height:          "6px",
                      borderRadius:    "50%",
                      flexShrink:      0,
                      backgroundColor: meta.color,
                    }}
                  />

                  {/* Entry name with match highlight */}
                  <span
                    style={{
                      flex:       1,
                      fontSize:   "12px",
                      color:      "var(--shouf-text)",
                      lineHeight: 1.3,
                    }}
                  >
                    <HighlightMatch text={entry.name} query={query} />
                  </span>

                  {/* Section tag */}
                  <span
                    style={{
                      fontSize:        "10px",
                      color:           "var(--shouf-text-faint)",
                      backgroundColor: "var(--shouf-panel-alt)",
                      padding:         "2px 5px",
                      borderRadius:    "4px",
                      flexShrink:      0,
                    }}
                  >
                    {meta.short}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>,
    document.body,
  );
}

// ─── Logo mark ────────────────────────────────────────────────────────────────

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
        animationName:           "intro-reveal",
        animationDuration:       "250ms",
        animationTimingFunction: "ease",
        animationFillMode:       "both",
        animationDelay:          `${LOGO_DELAY}ms`,
        animationPlayState:      launched ? "running" : "paused",
      }}
      title="Back to Welcome"
    >
      <span className="text-[14px] font-bold" style={{ color: "var(--shouf-text)", fontFamily: "var(--font-manrope)", letterSpacing: "0.75px" }}>
        helloitsjo
      </span>
    </button>
  );
}

// ─── Search bar ───────────────────────────────────────────────────────────────
// Uses PdsInput (controlled) so the shell and canvas demo share the same spec.
// ⌘K focuses the input from anywhere. The dropdown renders via portal.

function SearchBar() {
  const { launched, selectComponent } = useAppStore();
  const inputRef     = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [query,       setQuery]       = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  // Portal guard — createPortal needs document.body (not available during SSR)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // ⌘K / Ctrl+K global shortcut → focus input
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

  // Filter entries by query (case-insensitive substring)
  const results =
    query.trim().length > 0
      ? ALL_ENTRIES.filter((e) =>
          e.name.toLowerCase().includes(query.toLowerCase())
        )
      : [];

  const isOpen = mounted && query.trim().length > 0;

  // Reset keyboard cursor whenever the result list changes
  useEffect(() => { setActiveIndex(-1); }, [query]);

  const navigate = (entry: ComponentEntry) => {
    selectComponent(entry.id);
    setQuery("");
    setActiveIndex(-1);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = activeIndex >= 0 ? results[activeIndex] : results[0];
      if (target) navigate(target);
    } else if (e.key === "Escape") {
      setQuery("");
      setActiveIndex(-1);
      inputRef.current?.blur();
    }
  };

  return (
    <div
      ref={containerRef}
      className="px-3 py-2"
      style={{
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
        kbd={query ? "" : "⌘K"}
        value={query}
        onChange={setQuery}
        onKeyDown={handleKeyDown}
        fullWidth
      />

      {isOpen && (
        <SearchDropdown
          anchorEl={containerRef.current}
          results={results}
          activeIndex={activeIndex}
          query={query}
          onSelect={navigate}
          onClose={() => { setQuery(""); setActiveIndex(-1); }}
        />
      )}
    </div>
  );
}

// ─── LeftPanel ────────────────────────────────────────────────────────────────

export function LeftPanel() {
  return (
    <aside
      className="flex flex-col h-full overflow-hidden"
      style={{
        backgroundColor: "var(--shouf-panel)",
        borderRight:     "1px solid var(--shouf-border-sub)",
        width:           "260px",
        minWidth:        "260px",
      }}
    >
      {/* Top bar with logo */}
      <div
        className="shrink-0 flex items-center px-4 h-[44px]"
        style={{ borderBottom: "1px solid var(--shouf-border-sub)" }}
      >
        <LogoMark />
      </div>

      {/* Live search */}
      <SearchBar />

      {/* Accordion navigation */}
      <AccordionNav />

      {/* Bottom status bar */}
      <div
        className="shrink-0 flex items-center gap-2 px-3 py-2"
        style={{ borderTop: "1px solid var(--shouf-border-sub)" }}
      >
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--shouf-accent-sage)" }} />
        <span className="text-[12px]" style={{ color: "var(--shouf-text-faint)" }}>
          v1.0.0-shell
        </span>
      </div>
    </aside>
  );
}
