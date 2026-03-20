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
  const { expandedSections, toggleSection, launched } = useAppStore();
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

  // Total count across top-level entries and all groups
  const totalCount =
    section.entries.length +
    (section.groups ?? []).reduce((acc, g) => acc + g.entries.length, 0);

  // Delays are ordered: top-level entries first, then groups in order
  let delayIdx = 0;

  return (
    <div className="flex flex-col">
      {/* Section header */}
      <button
        onClick={() => toggleSection(section.id)}
        className="group w-full flex items-center gap-1.5 px-3 py-2 text-left transition-colors"
        style={{
          color: "var(--shouf-text)",
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
          width="10"
          height="10"
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
          className="text-[12px] font-semibold uppercase tracking-wider truncate"
          style={{ color: "var(--shouf-text-muted)", letterSpacing: "0.06em" }}
        >
          {section.title}
        </span>

        <span
          className="ml-auto shrink-0 text-[12px] font-medium px-1.5 py-0.5 rounded"
          style={{
            backgroundColor: "var(--shouf-badge-bg)",
            color: "var(--shouf-text-faint)",
          }}
        >
          {totalCount}
        </span>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="flex flex-col pl-2 pr-1 pb-1 gap-px">

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
              <div key={group.label} className="flex flex-col mt-0.5">
                {/* Sub-group header */}
                <button
                  onClick={() => toggleGroup(group.label)}
                  className="w-full flex items-center gap-1.5 px-3 py-1 text-left rounded-sm transition-colors"
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
                    className="text-[11px] font-semibold uppercase tracking-wider"
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
