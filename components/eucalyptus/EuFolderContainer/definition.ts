import type { ComponentRegistration, ComponentControlValues, TokenRow } from "@/lib/types";

// ─── Token table ────────────────────────────────────────────────────────────────
// Two states: selected row vs default row.
// Clicking a row in the canvas always shows the "selected" state tokens —
// the inspect panel teaches the full selected-row design spec on each click.

const TOKENS = {
  selectedBg:      "#E0E5ED",
  selectedColor:   "#052942",
  defaultBg:       "transparent",
  defaultColor:    "#525151",
  countDefault:    "#9CA3AF",
  countSelected:   "#052942",
  rowRadius:       "6px",
  rowPx:           "10px",
  rowPy:           "5px",
  fontSize:        "14px",
  fontWeight:      "400",
  fontFamily:      "Figtree",
} as const;

// ─── getTokens ──────────────────────────────────────────────────────────────────
// `selected` is the id of the active folder row, driven by canvas click.
// The inspect panel always reflects the selected-row design tokens.

function getTokens(_values: ComponentControlValues): TokenRow[] {
  return [
    {
      id:        "selected-bg",
      property:  "background",
      cssValue:  TOKENS.selectedBg,
      tokenName: "--eu-folder-selected-bg",
      category:  "color",
    },
    {
      id:        "selected-color",
      property:  "color",
      cssValue:  TOKENS.selectedColor,
      tokenName: "--eu-folder-selected-color",
      category:  "color",
    },
    {
      id:        "default-color",
      property:  "color (default)",
      cssValue:  TOKENS.defaultColor,
      tokenName: "--eu-folder-default-color",
      category:  "color",
    },
    {
      id:        "count-color",
      property:  "color (count)",
      cssValue:  TOKENS.countDefault,
      tokenName: "--eu-folder-count-color",
      category:  "color",
    },
    {
      id:        "row-radius",
      property:  "border-radius",
      cssValue:  TOKENS.rowRadius,
      tokenName: "--eu-folder-row-radius",
      category:  "radius",
    },
    {
      id:        "font-size",
      property:  "font-size",
      cssValue:  TOKENS.fontSize,
      tokenName: "--eu-folder-font-size",
      category:  "typography",
    },
    {
      id:        "font-weight",
      property:  "font-weight",
      cssValue:  TOKENS.fontWeight,
      tokenName: "--eu-folder-fw",
      category:  "typography",
    },
    {
      id:        "row-padding",
      property:  "padding",
      cssValue:  `${TOKENS.rowPy} ${TOKENS.rowPx}`,
      tokenName: "--eu-folder-row-p",
      category:  "spacing",
    },
  ];
}

// ─── Registration ───────────────────────────────────────────────────────────────

export const EU_FOLDER_CONTAINER_REGISTRATION: ComponentRegistration = {
  id: "eu-folder-container",
  controls: [],
  defaultValues: {
    // Driven by clicking a row — not exposed in the controls bar:
    selected: "contact",
  },
  getTokens,
};
