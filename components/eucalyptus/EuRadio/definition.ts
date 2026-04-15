import type { ComponentRegistration, ComponentControlValues, TokenRow } from "@/lib/types";

// ─── Token values (match --eu-radio-* in globals.css) ───────────────────────

const TOKENS = {
  // Light mode — selected
  selectedBorder: "#052942",
  selectedBg:     "rgba(21, 89, 136, 0.12)",
  selectedText:   "#052942",
  selectedDot:    "#052942",
  // Light mode — unselected
  unselectedBorder: "#D1D5DB",
  unselectedBg:     "#FFFFFF",
  unselectedText:   "#525151",
  unselectedRing:   "#D1D5DB",
  // Dark mode — selected
  darkSelectedBorder: "#FFFFFF",
  darkSelectedBg:     "#FFFFFF",
  darkSelectedText:   "#052942",
  darkSelectedDot:    "#052942",
  // Dark mode — unselected
  darkUnselectedBorder: "#7A8494",
  darkUnselectedBg:     "#26292F",
  darkUnselectedText:   "#DBE4F2",
  darkUnselectedRing:   "#7A8494",
  // Shared
  radius:        "3px",
  indicatorSize: "20px",
  fontSize:      "16px",
  fontWeight:    "400",
  px:            "16px",
  py:            "14px",
  gap:           "12px",
} as const;

// ─── getTokens ───────────────────────────────────────────────────────────────

function getTokens(values: ComponentControlValues): TokenRow[] {
  const isSelected = (values.selected as string) === "true";
  const state = isSelected ? "selected" : "unselected";

  // Token values reflect light-mode; dark-mode overrides happen via CSS vars at runtime.
  const borderColor = isSelected ? TOKENS.selectedBorder : TOKENS.unselectedBorder;
  const bg          = isSelected ? TOKENS.selectedBg     : TOKENS.unselectedBg;
  const textColor   = isSelected ? TOKENS.selectedText   : TOKENS.unselectedText;

  return [
    {
      id:        "border",
      property:  "border-color",
      cssValue:  borderColor,
      tokenName: `--eu-radio-${state}-border`,
      category:  "color",
    },
    {
      id:        "bg",
      property:  "background",
      cssValue:  bg,
      tokenName: `--eu-radio-${state}-bg`,
      category:  "color",
    },
    {
      id:        "text",
      property:  "color",
      cssValue:  textColor,
      tokenName: `--eu-radio-${state}-text`,
      category:  "color",
    },
    {
      id:        "indicator",
      property:  "indicator color",
      cssValue:  isSelected ? TOKENS.selectedDot : TOKENS.unselectedRing,
      tokenName: `--eu-radio-${state}-indicator`,
      category:  "color",
    },
    {
      id:        "radius",
      property:  "border-radius",
      cssValue:  TOKENS.radius,
      tokenName: "--eu-radio-radius",
      category:  "radius",
    },
    {
      id:        "font-size",
      property:  "font-size",
      cssValue:  TOKENS.fontSize,
      tokenName: "--eu-radio-font-size",
      category:  "typography",
    },
    {
      id:        "font-weight",
      property:  "font-weight",
      cssValue:  TOKENS.fontWeight,
      tokenName: "--eu-radio-fw",
      category:  "typography",
    },
    {
      id:        "padding",
      property:  "padding",
      cssValue:  `${TOKENS.py} ${TOKENS.px}`,
      tokenName: "--eu-radio-p",
      category:  "spacing",
    },
    {
      id:        "gap",
      property:  "gap",
      cssValue:  TOKENS.gap,
      tokenName: "--eu-radio-gap",
      category:  "spacing",
    },
    {
      id:        "indicator-size",
      property:  "indicator size",
      cssValue:  TOKENS.indicatorSize,
      tokenName: "--eu-radio-indicator-size",
      category:  "spacing",
    },
  ];
}

// ─── Registration ─────────────────────────────────────────────────────────────

export const EU_RADIO_REGISTRATION: ComponentRegistration = {
  id: "eu-radio",
  controls: [
    {
      id:           "selected",
      label:        "Selected",
      type:         "boolean",
      defaultValue: true,
    },
  ],
  defaultValues: {
    selected: "true",
  },
  getTokens,
};
