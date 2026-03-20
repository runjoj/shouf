"use client";

import type { ComponentEntry } from "@/lib/types";
import { useAppStore } from "@/lib/store";

type NavItemProps = {
  entry: ComponentEntry;
  introDelay?: number;
};

export function NavItem({ entry, introDelay = 0 }: NavItemProps) {
  const {
    selectedComponentId,
    selectedSectionId,
    selectComponent,
    selectSection,
    setActiveMobilePanel,
    launched,
  } = useAppStore();

  // Overview entries navigate to the section grid; regular entries to their canvas
  const isOverview = !!entry.overviewFor;
  const isSelected = isOverview
    ? selectedSectionId === entry.overviewFor
    : selectedComponentId === entry.id;

  function handleClick() {
    if (isOverview) {
      selectSection(entry.overviewFor!);
    } else {
      selectSection(null);
      selectComponent(entry.id);
    }
    setActiveMobilePanel("canvas");
  }

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center gap-2 px-3 py-[5px] text-left rounded-sm transition-colors cursor-default"
      style={{
        backgroundColor: isSelected ? "var(--shouf-accent-sel)" : "transparent",
        color:           isSelected ? "var(--shouf-accent)" : "var(--shouf-text-muted)",
        ...(launched ? {} : {
          animationName:           "intro-reveal",
          animationDuration:       "220ms",
          animationTimingFunction: "ease",
          animationFillMode:       "both",
          animationDelay:          `${introDelay}ms`,
          animationPlayState:      "paused",
        }),
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
      <span
        className="shrink-0 w-[5px] h-[5px] rounded-full"
        style={{
          backgroundColor: isSelected ? "var(--shouf-accent)" : "var(--shouf-text-faint)",
        }}
      />
      <span className="text-[14px] font-medium leading-none truncate">
        {entry.name}
      </span>
    </button>
  );
}
