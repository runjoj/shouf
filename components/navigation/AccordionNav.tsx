"use client";

import { navSections } from "@/data/navigation";
import { AccordionSection } from "./AccordionSection";

// ─── Static delay schedule (ms after launch() fires) ─────────────────────────
// Logo = 0ms, Search = 80ms (both in LeftPanel)
// Welcome/About/Work now in top bar. Section 1 header = 180ms, items at +60ms then +50ms each…

function buildDelays() {
  const sections: { sectionId: string; headerDelay: number; itemDelays: number[] }[] = [];
  let ms = 180; // first section header (earlier now that top nav items moved to top bar)

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

// ─── AccordionNav ─────────────────────────────────────────────────────────────
// Design system sections only — Welcome/About/Work are now in the top bar.

export function AccordionNav() {
  return (
    <nav className="flex flex-col gap-[2px] overflow-y-auto flex-1 px-2 py-2">
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
