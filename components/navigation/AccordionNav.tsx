"use client";

import { navSections } from "@/data/navigation";
import { AccordionSection } from "./AccordionSection";
import { useAppStore } from "@/lib/store";

// ─── Static delay schedule (ms after launch() fires) ─────────────────────────
// Logo = 0ms, Search = 80ms (both in LeftPanel)
// Welcome = 180ms, About = 230ms, Work = 280ms, Section 1 header = 330ms, items at +60ms then +50ms each…

const WELCOME_DELAY = 180;
const ABOUT_DELAY   = 230;

function buildDelays() {
  const sections: { sectionId: string; headerDelay: number; itemDelays: number[] }[] = [];
  let ms = 330; // first section header (after Welcome 180, About 230, Work 280)

  for (const section of navSections) {
    const headerDelay = ms;
    ms += 60; // gap between header and first item
    const itemDelays: number[] = [];
    // top-level entries
    for (let i = 0; i < section.entries.length; i++) {
      itemDelays.push(ms);
      ms += 50;
    }
    // grouped entries
    for (const group of (section.groups ?? [])) {
      for (let i = 0; i < group.entries.length; i++) {
        itemDelays.push(ms);
        ms += 50;
      }
    }
    sections.push({ sectionId: section.id, headerDelay, itemDelays });
  }
  return sections;
}

const SECTION_DELAYS = buildDelays();

// ─── Top-level nav item (Welcome, About, Work) ─────────────────────────────

type TopNavItemProps = {
  label: string;
  delay: number;
  isSelected: boolean;
  onClick: () => void;
};

function TopNavItem({ label, delay, isSelected, onClick }: TopNavItemProps) {
  const { launched } = useAppStore();

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center text-left transition-colors cursor-default"
      style={{
        padding:         "6px 12px",
        borderRadius:    "6px",
        backgroundColor: isSelected ? "var(--shouf-accent-sel)" : "transparent",
        color:           isSelected ? "var(--shouf-accent)" : "var(--shouf-text-muted)",
        position:        "relative",
        animationName:           "intro-reveal",
        animationDuration:       "220ms",
        animationTimingFunction: "ease",
        animationFillMode:       "both",
        animationDelay:          `${delay}ms`,
        animationPlayState:      launched ? "running" : "paused",
      }}
      onMouseEnter={(e) => {
        if (!isSelected)
          (e.currentTarget as HTMLElement).style.backgroundColor = "var(--shouf-hover)";
      }}
      onMouseLeave={(e) => {
        if (!isSelected)
          (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
      }}
    >
      {/* Active indicator — 2px accent bar on the left */}
      {isSelected && (
        <span
          style={{
            position:        "absolute",
            left:            "4px",
            top:             "50%",
            transform:       "translateY(-50%)",
            width:           "2px",
            height:          "16px",
            borderRadius:    "1px",
            backgroundColor: "var(--shouf-accent)",
          }}
        />
      )}
      <span
        className="text-[14px] leading-none truncate"
        style={{ fontWeight: isSelected ? 600 : 500 }}
      >
        {label}
      </span>
    </button>
  );
}

// ─── AccordionNav ─────────────────────────────────────────────────────────────

const WORK_DELAY = 280;

export function AccordionNav() {
  const { selectedComponentId, selectedSectionId, selectComponent, selectSection, setActiveMobilePanel } = useAppStore();

  return (
    <nav className="flex flex-col gap-[2px] overflow-y-auto flex-1 px-2 py-2">
      {/* Top-level pages */}
      <TopNavItem
        label="Welcome"
        delay={WELCOME_DELAY}
        isSelected={selectedComponentId === "welcome"}
        onClick={() => { selectSection(null); selectComponent("welcome"); setActiveMobilePanel("canvas"); }}
      />
      <TopNavItem
        label="About"
        delay={ABOUT_DELAY}
        isSelected={selectedComponentId === "about"}
        onClick={() => { selectSection(null); selectComponent("about"); setActiveMobilePanel("canvas"); }}
      />
      <TopNavItem
        label="Work"
        delay={WORK_DELAY}
        isSelected={selectedSectionId === "work" && selectedComponentId === null}
        onClick={() => { selectComponent(null); selectSection("work"); setActiveMobilePanel("canvas"); }}
      />

      {/* Divider */}
      <div
        className="mx-1 my-[6px]"
        style={{ height: "1px", backgroundColor: "var(--shouf-border-sub)" }}
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
                className="mx-1 my-[6px]"
                style={{ height: "1px", backgroundColor: "var(--shouf-border-sub)" }}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
