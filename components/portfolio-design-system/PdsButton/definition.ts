import type { ComponentRegistration, ComponentControlValues, TokenRow } from "@/lib/types";

// ─── Static lookup tables (drive both the component and the inspect panel) ────

const SIZE_TOKENS = {
  sm: { h: "28px",  px: "12px", font: "11.5px", radius: "6px",  gap: "6px"  },
  md: { h: "36px",  px: "16px", font: "13px",   radius: "8px",  gap: "8px"  },
  lg: { h: "44px",  px: "20px", font: "15px",   radius: "10px", gap: "10px" },
} as const;

const VARIANT_TOKENS = {
  primary: {
    bg:     "#C8E000",
    color:  "#111111",
    border: "transparent",
    shadow: "0 1px 2px rgba(200,224,0,0.30), inset 0 1px 0 rgba(255,255,255,0.22)",
  },
  secondary: {
    bg:     "transparent",
    color:  "#111111",
    border: "rgba(200,224,0,0.45)",
    shadow: "none",
  },
  ghost: {
    bg:     "transparent",
    color:  "#777777",
    border: "transparent",
    shadow: "none",
  },
} as const;

// ─── getTokens ─────────────────────────────────────────────────────────────────
// Called by InspectPanel with the current control values.
// Returns the real token rows that reflect what the component is actually using.

function getTokens(values: ComponentControlValues): TokenRow[] {
  const variant = (values.variant as string) || "primary";
  const size    = (values.size    as string) || "md";

  const sv = SIZE_TOKENS[size    as keyof typeof SIZE_TOKENS];
  const vv = VARIANT_TOKENS[variant as keyof typeof VARIANT_TOKENS];

  return [
    // ── Visual / variant tokens
    {
      id: "bg",
      property: "background",
      cssValue: vv.bg,
      tokenName: `--pds-btn-${variant}-bg`,
      category: "color",
    },
    {
      id: "color",
      property: "color",
      cssValue: vv.color,
      tokenName: `--pds-btn-${variant}-color`,
      category: "color",
    },
    {
      id: "border",
      property: "border-color",
      cssValue: vv.border,
      tokenName: `--pds-btn-${variant}-border`,
      category: "color",
    },
    {
      id: "shadow",
      property: "box-shadow",
      cssValue: vv.shadow,
      tokenName: `--pds-btn-${variant}-shadow`,
      category: "shadow",
    },
    // ── Size tokens
    {
      id: "height",
      property: "height",
      cssValue: sv.h,
      tokenName: `--pds-btn-h-${size}`,
      category: "spacing",
    },
    {
      id: "padding",
      property: "padding",
      cssValue: `0 ${sv.px}`,
      tokenName: `--pds-btn-px-${size}`,
      category: "spacing",
    },
    {
      id: "radius",
      property: "border-radius",
      cssValue: sv.radius,
      tokenName: `--pds-btn-radius-${size}`,
      category: "radius",
    },
    {
      id: "gap",
      property: "gap",
      cssValue: sv.gap,
      tokenName: `--pds-btn-gap-${size}`,
      category: "spacing",
    },
    // ── Typography tokens
    {
      id: "font-size",
      property: "font-size",
      cssValue: sv.font,
      tokenName: `--pds-btn-font-${size}`,
      category: "typography",
    },
    {
      id: "font-weight",
      property: "font-weight",
      cssValue: "500",
      tokenName: "--pds-btn-font-weight",
      category: "typography",
    },
    {
      id: "letter-spacing",
      property: "letter-spacing",
      cssValue: "-0.01em",
      tokenName: "--pds-btn-letter-spacing",
      category: "typography",
    },
  ];
}

// ─── Registration ──────────────────────────────────────────────────────────────

export const PDS_BUTTON_REGISTRATION: ComponentRegistration = {
  id: "pds-button",
  controls: [
    {
      id: "variant",
      label: "Variant",
      type: "select",
      defaultValue: "primary",
      options: [
        { label: "Primary",   value: "primary"   },
        { label: "Secondary", value: "secondary" },
        { label: "Ghost",     value: "ghost"     },
      ],
    },
    {
      id: "size",
      label: "Size",
      type: "select",
      defaultValue: "md",
      options: [
        { label: "Small",  value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large",  value: "lg" },
      ],
    },
    {
      id: "label",
      label: "Label",
      type: "text",
      defaultValue: "Get Started",
    },
    { id: "disabled",  label: "Disabled",   type: "boolean", defaultValue: false },
    { id: "loading",   label: "Loading",    type: "boolean", defaultValue: false },
    { id: "fullWidth", label: "Full Width", type: "boolean", defaultValue: false },
    { id: "iconOnly",  label: "Icon Only",  type: "boolean", defaultValue: false },
  ],
  defaultValues: {
    variant:   "primary",
    size:      "md",
    label:     "Get Started",
    disabled:  false,
    loading:   false,
    fullWidth: false,
    iconOnly:  false,
  },
  getTokens,
};
