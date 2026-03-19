"use client";

import type { ComponentEntry } from "@/lib/types";
import { useAppStore } from "@/lib/store";

type NavItemProps = {
  entry: ComponentEntry;
  /** ms delay after launch() fires; item uses animation-fill-mode:both so
      it stays at opacity:0 while the intro overlay is covering it, then
      fades in with this delay once launched=true. */
  introDelay?: number;
};

export function NavItem({ entry, introDelay = 0 }: NavItemProps) {
  const { selectedComponentId, selectComponent, selectSection, setActiveMobilePanel, launched } =
    useAppStore();

  const isSelected = selectedComponentId === entry.id;

  function handleClick() {
    // Exit grid mode so the solo component canvas renders instead of the grid.
    selectSection(null);
    selectComponent(entry.id);
    setActiveMobilePanel("canvas");
  }

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center gap-2 px-3 py-[5px] text-left rounded-sm transition-colors cursor-default"
      style={{
        backgroundColor: isSelected ? "var(--shouf-accent-sel)" : "transparent",
        color:           isSelected ? "var(--shouf-accent)" : "var(--shouf-text-muted)",
        // Intro stagger only — once the intro has played, items appear instantly
        // so reopening an accordion feels snappy rather than sluggish.
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
      {/* Entry dot */}
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
