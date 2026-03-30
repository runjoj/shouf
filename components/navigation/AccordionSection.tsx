"use client";

import { useState } from "react";
import type { NavSection } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { NavItem } from "./NavItem";

type AccordionSectionProps = {
  section: NavSection;
  headerDelay?: number;
  itemDelays?: number[];
};

export function AccordionSection({
  section,
  headerDelay = 0,
  itemDelays = [],
}: AccordionSectionProps) {
  const { expandedSections, toggleSection, selectSection, selectComponent, setActiveMobilePanel, launched } = useAppStore();
  const isExpanded = expandedSections.has(section.id);

  // Sub-groups start expanded
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    () => new Set((section.groups ?? []).map((g) => g.label))
  );

  function toggleGroup(label: string) {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  }

  // Delays are ordered: top-level entries first, then groups in order
  let delayIdx = 0;

  return (
    <div className="flex flex-col">
      {/* Section header */}
      <button
        onClick={() => {
          toggleSection(section.id);
          // Navigate to section index page when clicking header
          if (section.navigateOnClick) {
            selectComponent(null);
            selectSection(section.id);
            setActiveMobilePanel("canvas");
          }
        }}
        className="group w-full flex items-center gap-1.5 px-3 py-[6px] text-left transition-colors"
        style={{
          color: "var(--shouf-text)",
          borderRadius: "6px",
          animationName:           "intro-reveal",
          animationDuration:       "220ms",
          animationTimingFunction: "ease",
          animationFillMode:       "both",
          animationDelay:          `${headerDelay}ms`,
          animationPlayState:      launched ? "running" : "paused",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--shouf-hover)")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")
        }
      >
        {/* Chevron */}
        <svg
          width="9"
          height="9"
          viewBox="0 0 10 10"
          fill="none"
          className="shrink-0 transition-transform duration-150"
          style={{
            transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
            color: "var(--shouf-text-muted)",
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
          className="text-[11px] font-medium uppercase tracking-wider truncate"
          style={{ color: "var(--shouf-text-muted)", letterSpacing: "0.08em" }}
        >
          {section.title}
        </span>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="flex flex-col gap-[1px] mt-[2px] mb-1">

          {/* Top-level entries */}
          {section.entries.map((entry) => {
            const d = itemDelays[delayIdx++] ?? headerDelay + 60;
            return <NavItem key={entry.id} entry={entry} introDelay={d} />;
          })}

          {/* Sub-groups */}
          {(section.groups ?? []).map((group) => {
            const isGroupExpanded = expandedGroups.has(group.label);
            // Capture delays for this group's entries before rendering
            const groupDelays = group.entries.map(() => itemDelays[delayIdx++] ?? headerDelay + 60);

            return (
              <div key={group.label} className="flex flex-col mt-1">
                {/* Sub-group header */}
                <button
                  onClick={() => toggleGroup(group.label)}
                  className="w-full flex items-center gap-1.5 px-3 py-1 text-left rounded-md transition-colors"
                  style={{ color: "var(--shouf-text-faint)" }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--shouf-hover)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")
                  }
                >
                  <svg
                    width="8"
                    height="8"
                    viewBox="0 0 10 10"
                    fill="none"
                    className="shrink-0 transition-transform duration-150"
                    style={{ transform: isGroupExpanded ? "rotate(90deg)" : "rotate(0deg)" }}
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
                    className="text-[11px] font-medium uppercase tracking-wider"
                    style={{ letterSpacing: "0.06em" }}
                  >
                    {group.label}
                  </span>
                </button>

                {/* Sub-group entries */}
                {isGroupExpanded && (
                  <div className="flex flex-col pl-2 gap-px">
                    {group.entries.map((entry, i) => (
                      <NavItem key={entry.id} entry={entry} introDelay={groupDelays[i]} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
