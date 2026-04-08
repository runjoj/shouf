"use client";

import { navSections } from "@/data/navigation";
import { useAppStore } from "@/lib/store";
import { NavItem } from "./NavItem";

// ─── Static delay schedule (ms after launch() fires) ─────────────────────────

function buildDelays() {
  const sections: { sectionId: string; headerDelay: number; itemDelays: number[] }[] = [];
  let ms = 180;

  for (const section of navSections) {
    const headerDelay = ms;
    ms += 60;
    const itemDelays: number[] = [];
    for (let i = 0; i < section.entries.length; i++) {
      itemDelays.push(ms);
      ms += 50;
    }
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

// ─── Section banner ──────────────────────────────────────────────────────────
// Non-collapsible prominent label for each design system section.

function SectionBanner({
  title,
  delay,
}: {
  title: string;
  delay: number;
}) {
  const { launched } = useAppStore();

  return (
    <div
      className="px-3 pt-2 pb-1"
      style={{
        animationName:           "intro-reveal",
        animationDuration:       "220ms",
        animationTimingFunction: "ease",
        animationFillMode:       "both",
        animationDelay:          `${delay}ms`,
        animationPlayState:      launched ? "running" : "paused",
      }}
    >
      <span
        className="text-[12px] font-semibold uppercase tracking-wider"
        style={{
          color:         "var(--shouf-text)",
          letterSpacing: "0.08em",
          fontFamily:    "var(--font-mono)",
        }}
      >
        {title}
      </span>
    </div>
  );
}

// ─── AccordionNav ─────────────────────────────────────────────────────────────
// Flat nav — section banners are always visible, no collapse/expand.

export function AccordionNav() {
  return (
    <nav className="flex flex-col gap-[2px] overflow-y-auto flex-1 px-2 pt-0 pb-2">
      {navSections.map((section, index) => {
        const delays = SECTION_DELAYS.find((d) => d.sectionId === section.id);
        let delayIdx = 0;

        return (
          <div key={section.id}>
            {/* Divider between sections */}
            {index > 0 && (
              <div
                className="mx-1 my-[6px]"
                style={{ height: "1px", backgroundColor: "var(--shouf-border-sub)" }}
              />
            )}

            {/* Section banner */}
            <SectionBanner
              title={section.title}
              delay={delays?.headerDelay ?? 300}
            />

            {/* Entries — always visible */}
            <div className="flex flex-col gap-[1px] mt-[2px] mb-1">
              {section.entries.map((entry) => {
                const d = delays?.itemDelays[delayIdx++] ?? 300;
                return <NavItem key={entry.id} entry={entry} introDelay={d} />;
              })}

              {/* Sub-groups */}
              {(section.groups ?? []).map((group) => {
                const groupDelays = group.entries.map(() => delays?.itemDelays[delayIdx++] ?? 300);
                return (
                  <div key={group.label} className="flex flex-col mt-1">
                    <div className="px-3 py-1">
                      <span
                        className="text-[10px] font-medium uppercase tracking-wider"
                        style={{ color: "var(--shouf-text-faint)", letterSpacing: "0.06em" }}
                      >
                        {group.label}
                      </span>
                    </div>
                    <div className="flex flex-col gap-px">
                      {group.entries.map((entry, i) => (
                        <NavItem key={entry.id} entry={entry} introDelay={groupDelays[i]} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </nav>
  );
}
