"use client";

import type { NavSection } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { NavItem } from "./NavItem";

type AccordionSectionProps = {
  section: NavSection;
  /** ms delay (after launch) for the section header to animate in */
  headerDelay?: number;
  /** ms delays (after launch) for each entry, in order */
  itemDelays?: number[];
};

export function AccordionSection({
  section,
  headerDelay = 0,
  itemDelays = [],
}: AccordionSectionProps) {
  const { expandedSections, toggleSection, selectSection, launched } = useAppStore();
  const isExpanded = expandedSections.has(section.id);

  return (
    <div className="flex flex-col">
      {/* Section header — clicking navigates to the section grid AND toggles
          the accordion. The grid remains visible even if the accordion is
          collapsed; selectedSectionId and expandedSections are independent. */}
      <button
        onClick={() => { toggleSection(section.id); selectSection(section.id); }}
        className="group w-full flex items-center gap-1.5 px-3 py-2 text-left transition-colors"
        style={{
          color: "var(--sh-text)",
          // Intro stagger — header fades in with its delay
          animationName:           "intro-reveal",
          animationDuration:       "220ms",
          animationTimingFunction: "ease",
          animationFillMode:       "both",
          animationDelay:          `${headerDelay}ms`,
          animationPlayState:      launched ? "running" : "paused",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--sh-hover)")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")
        }
      >
        {/* Chevron */}
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          className="shrink-0 transition-transform duration-150"
          style={{
            transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
            color: "var(--sh-text-muted)",
          }}
        >
          <path
            d="M3 2L7 5L3 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <span
          className="text-[11px] font-semibold uppercase tracking-wider truncate"
          style={{ color: "var(--sh-text-muted)", letterSpacing: "0.06em" }}
        >
          {section.title}
        </span>

        {/* Entry count badge */}
        <span
          className="ml-auto shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded"
          style={{
            backgroundColor: "var(--sh-badge-bg)",
            color: "var(--sh-text-faint)",
          }}
        >
          {section.entries.length}
        </span>
      </button>

      {/* Entries */}
      {isExpanded && (
        <div className="flex flex-col pl-2 pr-1 pb-1 gap-px">
          {section.entries.map((entry, i) => (
            <NavItem
              key={entry.id}
              entry={entry}
              introDelay={itemDelays[i] ?? headerDelay + 60 + i * 50}
            />
          ))}
        </div>
      )}
    </div>
  );
}
