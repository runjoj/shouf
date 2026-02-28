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
  const { selectedComponentId, selectComponent, setActiveMobilePanel, launched } =
    useAppStore();

  const isSelected = selectedComponentId === entry.id;

  function handleClick() {
    selectComponent(entry.id);
    setActiveMobilePanel("canvas");
  }

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center gap-2 px-3 py-[5px] text-left rounded-sm transition-colors cursor-default"
      style={{
        backgroundColor: isSelected ? "var(--sh-accent-sel)" : "transparent",
        color:           isSelected ? "var(--sh-accent)" : "var(--sh-text-muted)",
        // Intro stagger — paused until launched, then animates in with delay
        animationName:       "intro-reveal",
        animationDuration:   "220ms",
        animationTimingFunction: "ease",
        animationFillMode:   "both",
        animationDelay:      `${introDelay}ms`,
        animationPlayState:  launched ? "running" : "paused",
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
      {/* Entry dot */}
      <span
        className="shrink-0 w-[5px] h-[5px] rounded-full"
        style={{
          backgroundColor: isSelected ? "var(--sh-accent)" : "var(--sh-text-faint)",
        }}
      />
      <span className="text-[12px] font-medium leading-none truncate">
        {entry.name}
      </span>
    </button>
  );
}
