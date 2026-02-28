"use client";

import { navSections } from "@/data/navigation";
import { AccordionSection } from "./AccordionSection";
import { useAppStore } from "@/lib/store";

// ─── Static delay schedule (ms after launch() fires) ─────────────────────────
// Logo = 0ms, Search = 80ms (both in LeftPanel)
// Welcome = 180ms, Section 1 header = 270ms, items at +60ms then +50ms each…

const WELCOME_DELAY = 180;

function buildDelays() {
  const sections: { sectionId: string; headerDelay: number; itemDelays: number[] }[] = [];
  let ms = 270; // first section header

  for (const section of navSections) {
    const headerDelay = ms;
    ms += 60; // gap between header and first item
    const itemDelays: number[] = [];
    for (let i = 0; i < section.entries.length; i++) {
      itemDelays.push(ms);
      ms += 50;
    }
    sections.push({ sectionId: section.id, headerDelay, itemDelays });
  }
  return sections;
}

const SECTION_DELAYS = buildDelays();

// ─── Welcome nav item ─────────────────────────────────────────────────────────

function WelcomeNavItem({ delay }: { delay: number }) {
  const { selectedComponentId, selectComponent, setActiveMobilePanel, launched } =
    useAppStore();
  const isSelected = selectedComponentId === "welcome";

  return (
    <button
      onClick={() => { selectComponent("welcome"); setActiveMobilePanel("canvas"); }}
      className="w-full flex items-center gap-2 px-3 py-[5px] text-left rounded-sm transition-colors cursor-default"
      style={{
        backgroundColor: isSelected ? "var(--sh-accent-sel)" : "transparent",
        color:           isSelected ? "var(--sh-accent)" : "var(--sh-text-muted)",
        // Intro stagger
        animationName:           "intro-reveal",
        animationDuration:       "220ms",
        animationTimingFunction: "ease",
        animationFillMode:       "both",
        animationDelay:          `${delay}ms`,
        animationPlayState:      launched ? "running" : "paused",
      }}
      onMouseEnter={(e) => {
        if (!isSelected)
          (e.currentTarget as HTMLElement).style.backgroundColor = "var(--sh-hover)";
      }}
      onMouseLeave={(e) => {
        if (!isSelected)
          (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
      }}
    >
      {/* House / home icon */}
      <svg
        width="11"
        height="11"
        viewBox="0 0 12 12"
        fill="none"
        className="shrink-0"
        style={{ color: isSelected ? "var(--sh-accent)" : "var(--sh-text-faint)" }}
      >
        <path
          d="M1 5.5L6 1L11 5.5V11H8V8H4V11H1V5.5Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-[12px] font-medium leading-none truncate">Welcome</span>
    </button>
  );
}

// ─── AccordionNav ─────────────────────────────────────────────────────────────

export function AccordionNav() {
  return (
    <nav className="flex flex-col gap-px overflow-y-auto flex-1 py-2">
      {/* Welcome — always at the very top, above all sections */}
      <WelcomeNavItem delay={WELCOME_DELAY} />

      {/* Thin divider between Welcome and the first section */}
      <div
        className="mx-3 my-1"
        style={{ height: "1px", backgroundColor: "var(--sh-border-sub)" }}
      />

      {/* Accordion sections with staggered delays */}
      {navSections.map((section, index) => {
        const delays = SECTION_DELAYS.find((d) => d.sectionId === section.id);
        return (
          <div key={section.id}>
            <AccordionSection
              section={section}
              headerDelay={delays?.headerDelay ?? 300}
              itemDelays={delays?.itemDelays ?? []}
            />
            {index < navSections.length - 1 && (
              <div
                className="mx-3 my-1"
                style={{ height: "1px", backgroundColor: "var(--sh-border-sub)" }}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
