import type { ComponentRegistration, ComponentControlValues, TokenRow } from "@/lib/types";

// ─── Token values ────────────────────────────────────────────────────────────

const BASE = {
  selectedBg:    "#E0E5ED",
  selectedColor: "#052942",
  defaultColor:  "#525151",
  countColor:    "#9CA3AF",
  rowRadius:     "6px",
  fontSize:      "14px",
  fontWeightDefault: "400",
  fontWeightSelected: "600",
  fontFamily:    "Figtree",
} as const;

const PADDING = {
  default: { py: "5px", px: "10px" },
  compact: { py: "3px", px: "8px"  },
} as const;

const SIZE = {
  default: { rowHeight: "28px", rowGap: "6px" },
  compact: { rowHeight: "24px", rowGap: "4px" },
} as const;

const CARD_WIDTH = "200px";

// ─── getTokens ───────────────────────────────────────────────────────────────

function getTokens(values: ComponentControlValues): TokenRow[] {
  const isCompact = values.size === "compact";
  const pad = isCompact ? PADDING.compact : PADDING.default;
  const sz  = isCompact ? SIZE.compact   : SIZE.default;

  return [
    // Color & effect
    {
      id:        "selected-bg",
      property:  "background",
      cssValue:  BASE.selectedBg,
      tokenName: "--eu-folder-selected-bg",
      category:  "color",
    },
    {
      id:        "selected-color",
      property:  "color",
      cssValue:  BASE.selectedColor,
      tokenName: "--eu-folder-selected-color",
      category:  "color",
    },
    {
      id:        "default-color",
      property:  "color (default)",
      cssValue:  BASE.defaultColor,
      tokenName: "--eu-folder-default-color",
      category:  "color",
    },
    {
      id:        "count-color",
      property:  "color (count)",
      cssValue:  BASE.countColor,
      tokenName: "--eu-folder-count-color",
      category:  "color",
    },
    // Typography
    {
      id:        "font-size",
      property:  "font-size",
      cssValue:  BASE.fontSize,
      tokenName: "--eu-folder-font-size",
      category:  "typography",
    },
    {
      id:        "font-weight",
      property:  "font-weight",
      cssValue:  BASE.fontWeightDefault,
      tokenName: "--eu-folder-fw",
      category:  "typography",
    },
    // Box
    {
      id:        "height",
      property:  "row height",
      cssValue:  sz.rowHeight,
      tokenName: "--eu-folder-row-height",
      category:  "spacing",
    },
    {
      id:        "width",
      property:  "card width",
      cssValue:  CARD_WIDTH,
      tokenName: "--eu-folder-width",
      category:  "spacing",
    },
    {
      id:        "gap",
      property:  "row gap",
      cssValue:  sz.rowGap,
      tokenName: "--eu-folder-row-gap",
      category:  "spacing",
    },
    {
      id:        "radius",
      property:  "border-radius",
      cssValue:  BASE.rowRadius,
      tokenName: "--eu-folder-row-radius",
      category:  "radius",
    },
    {
      id:        "padding",
      property:  "padding",
      cssValue:  `${pad.py} ${pad.px}`,
      tokenName: "--eu-folder-row-p",
      category:  "spacing",
    },
  ];
}

// ─── Registration ─────────────────────────────────────────────────────────────

export const EU_FOLDER_CONTAINER_REGISTRATION: ComponentRegistration = {
  id: "eu-folder-container",
  controls: [
    {
      id:           "showIcons",
      label:        "Show Icons",
      type:         "boolean",
      defaultValue: true,
    },
    {
      id:           "showCounts",
      label:        "Show Counts",
      type:         "boolean",
      defaultValue: true,
    },
  ],
  defaultValues: {
    selected:   "contact",
    size:       "default",
    showIcons:  true,
    showCounts: true,
  },
  getTokens,
};
