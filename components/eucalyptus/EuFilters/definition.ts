import type { ComponentRegistration, ComponentControlValues, TokenRow } from "@/lib/types";

// ─── Token values (match --eu-filter-* in globals.css) ──────────────────────

const TOKENS = {
  // Light mode
  containerBg:    "#FFFFFF",
  containerBorder: "#E5E7EB",
  labelColor:     "#052942",
  textColor:      "#052942",
  mutedColor:     "#6B7280",
  chipBg:         "#E5E7EB",
  chipColor:      "#374151",
  inputBorder:    "#D1D5DB",
  inputBg:        "#FFFFFF",
  btnPrimaryBg:   "#052942",
  btnPrimaryText: "#FFFFFF",
  dangerColor:    "#052942",
  // Shared
  containerRadius: "8px",
  containerPad:    "16px",
  rowGap:          "12px",
  innerGap:        "16px",
  chipRadius:      "4px",
  chipPx:          "8px",
  chipPy:          "4px",
  chipFont:        "13px",
  inputRadius:     "6px",
  fontSize:        "14px",
  fontWeight:      "500",
  btnRadius:       "6px",
  btnPx:           "12px",
  btnPy:           "8px",
} as const;

// ─── getTokens ───────────────────────────────────────────────────────────────

function getTokens(_values: ComponentControlValues): TokenRow[] {
  return [
    {
      id:        "container-bg",
      property:  "background",
      cssValue:  TOKENS.containerBg,
      tokenName: "--eu-filter-container-bg",
      category:  "color",
    },
    {
      id:        "container-border",
      property:  "border-color",
      cssValue:  TOKENS.containerBorder,
      tokenName: "--eu-filter-container-border",
      category:  "color",
    },
    {
      id:        "label-color",
      property:  "label color",
      cssValue:  TOKENS.labelColor,
      tokenName: "--eu-filter-label-color",
      category:  "color",
    },
    {
      id:        "chip-bg",
      property:  "chip background",
      cssValue:  TOKENS.chipBg,
      tokenName: "--eu-filter-chip-bg",
      category:  "color",
    },
    {
      id:        "chip-color",
      property:  "chip color",
      cssValue:  TOKENS.chipColor,
      tokenName: "--eu-filter-chip-color",
      category:  "color",
    },
    {
      id:        "btn-primary-bg",
      property:  "button background",
      cssValue:  TOKENS.btnPrimaryBg,
      tokenName: "--eu-filter-btn-primary-bg",
      category:  "color",
    },
    {
      id:        "container-radius",
      property:  "container radius",
      cssValue:  TOKENS.containerRadius,
      tokenName: "--eu-filter-container-radius",
      category:  "radius",
    },
    {
      id:        "chip-radius",
      property:  "chip radius",
      cssValue:  TOKENS.chipRadius,
      tokenName: "--eu-filter-chip-radius",
      category:  "radius",
    },
    {
      id:        "font-size",
      property:  "font-size",
      cssValue:  TOKENS.fontSize,
      tokenName: "--eu-filter-font-size",
      category:  "typography",
    },
    {
      id:        "font-weight",
      property:  "font-weight",
      cssValue:  TOKENS.fontWeight,
      tokenName: "--eu-filter-fw",
      category:  "typography",
    },
    {
      id:        "container-pad",
      property:  "container padding",
      cssValue:  TOKENS.containerPad,
      tokenName: "--eu-filter-container-pad",
      category:  "spacing",
    },
    {
      id:        "row-gap",
      property:  "row gap",
      cssValue:  TOKENS.rowGap,
      tokenName: "--eu-filter-row-gap",
      category:  "spacing",
    },
    {
      id:        "inner-gap",
      property:  "inner gap",
      cssValue:  TOKENS.innerGap,
      tokenName: "--eu-filter-inner-gap",
      category:  "spacing",
    },
  ];
}

// ─── Registration ─────────────────────────────────────────────────────────────

export const EU_FILTERS_REGISTRATION: ComponentRegistration = {
  id: "eu-filters",
  controls: [],
  defaultValues: {},
  getTokens,
};
