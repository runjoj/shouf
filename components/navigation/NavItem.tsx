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

  const isDisabled = entry.disabled === true;

  // Overview entries navigate to the section grid; regular entries to their canvas
  const isOverview = !!entry.overviewFor;
  const isSelected = !isDisabled && (isOverview
    ? selectedSectionId === entry.overviewFor
    : selectedComponentId === entry.id);

  function handleClick() {
    if (isDisabled) return;
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
      className="w-full flex items-center gap-2 text-left transition-colors cursor-default"
      style={{
        padding:         "5px 12px 5px 20px",
        borderRadius:    "6px",
        backgroundColor: isSelected ? "var(--shouf-accent-sel)" : "transparent",
        color:           isDisabled ? "var(--shouf-text-faint)" : isSelected ? "var(--shouf-accent)" : "var(--shouf-text-muted)",
        opacity:         isDisabled ? 0.45 : 1,
        cursor:          isDisabled ? "default" : undefined,
        position:        "relative",
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
        if (!isSelected && !isDisabled)
          (e.currentTarget as HTMLElement).style.backgroundColor = "var(--shouf-hover)";
      }}
      onMouseLeave={(e) => {
        if (!isSelected && !isDisabled)
          (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
      }}
    >
      {/* Active indicator — 2px accent bar on the left */}
      {isSelected && (
        <span
          style={{
            position:        "absolute",
            left:            "6px",
            top:             "50%",
            transform:       "translateY(-50%)",
            width:           "2px",
            height:          "14px",
            borderRadius:    "1px",
            backgroundColor: "var(--shouf-accent)",
          }}
        />
      )}
      <span className="text-[14px] leading-tight truncate" style={{ fontWeight: isSelected ? 500 : 400 }}>
        {entry.name}
      </span>
      {entry.tag && (
        <span
          className="shrink-0 text-[10px] leading-none"
          style={{ color: "var(--shouf-text-faint)", fontStyle: "italic" }}
        >
          {entry.tag}
        </span>
      )}
      {isDisabled && entry.disabledLabel && (
        <span
          className="shrink-0 text-[10px] leading-none"
          style={{ color: "var(--shouf-text-faint)", fontStyle: "italic" }}
        >
          {entry.disabledLabel}
        </span>
      )}
    </button>
  );
}
