import type { ComponentRegistration, ComponentControlValues, TokenRow } from "@/lib/types";

// ─── Static lookup tables (drive both the component and the inspect panel) ────

const SIZE_TOKENS = {
  sm: { h: "28px", px: "10px", font: "11.5px", radius: "6px"  },
  md: { h: "36px", px: "12px", font: "13px",   radius: "8px"  },
  lg: { h: "44px", px: "14px", font: "15px",   radius: "10px" },
} as const;

// State-specific visual tokens — mirrored in globals.css as --pds-inp-* vars.
// Note: focused border uses var(--sh-accent) so it responds to the accent picker.

const STATE_TOKENS = {
  default: {
    bg:          "#F0F0F0",
    border:      "#E5E5E5",
    ring:        null,
    color:       "#111111",
    placeholder: "#AAAAAA",
  },
  focused: {
    bg:          "#FFFFFF",
    border:      "var(--sh-accent)",
    ring:        "0 0 0 3px var(--sh-accent-ring)",
    color:       "#111111",
    placeholder: "#AAAAAA",
  },
  error: {
    bg:          "rgba(229, 62, 62, 0.05)",
    border:      "#E53E3E",
    ring:        "0 0 0 3px rgba(229, 62, 62, 0.22)",
    color:       "#111111",
    placeholder: "#AAAAAA",
  },
  disabled: {
    bg:          "#F0F0F0",
    border:      "#E5E5E5",
    ring:        null,
    color:       "#AAAAAA",
    placeholder: "#BBBBBB",
  },
} as const;

// ─── getTokens ─────────────────────────────────────────────────────────────────
// Called by InspectPanel with the current control values.
// Returns the token rows that reflect what the component is actually rendering.

function getTokens(values: ComponentControlValues): TokenRow[] {
  const size  = (values.size  as string) || "md";
  const state = (values.state as string) || "default";

  const sv = SIZE_TOKENS[size  as keyof typeof SIZE_TOKENS];
  const st = STATE_TOKENS[state as keyof typeof STATE_TOKENS];

  const tokenSuffix = state === "default" ? "" : `-${state}`;

  const rows: TokenRow[] = [
    {
      id:        "bg",
      property:  "background",
      cssValue:  st.bg,
      tokenName: `--pds-inp-bg${tokenSuffix}`,
      category:  "color",
    },
    {
      id:        "border",
      property:  "border-color",
      cssValue:  st.border,
      tokenName: `--pds-inp-border${tokenSuffix}`,
      category:  "color",
    },
    {
      id:        "color",
      property:  "color",
      cssValue:  st.color,
      tokenName: "--pds-inp-color",
      category:  "color",
    },
    {
      id:        "placeholder",
      property:  "color (placeholder)",
      cssValue:  st.placeholder,
      tokenName: "--pds-inp-placeholder",
      category:  "color",
    },
  ];

  // Ring only present in focused / error states
  if (st.ring !== null) {
    rows.push({
      id:        "ring",
      property:  "box-shadow",
      cssValue:  st.ring,
      tokenName: `--pds-inp-ring${tokenSuffix}`,
      category:  "shadow",
    });
  }

  // Size tokens
  rows.push(
    {
      id:        "height",
      property:  "height",
      cssValue:  sv.h,
      tokenName: `--pds-inp-h-${size}`,
      category:  "spacing",
    },
    {
      id:        "padding",
      property:  "padding",
      cssValue:  `0 ${sv.px}`,
      tokenName: `--pds-inp-px-${size}`,
      category:  "spacing",
    },
    {
      id:        "radius",
      property:  "border-radius",
      cssValue:  sv.radius,
      tokenName: `--pds-inp-radius-${size}`,
      category:  "radius",
    },
    {
      id:        "font",
      property:  "font-size",
      cssValue:  sv.font,
      tokenName: `--pds-inp-font-${size}`,
      category:  "typography",
    },
  );

  return rows;
}

// ─── Registration ──────────────────────────────────────────────────────────────

export const PDS_INPUT_REGISTRATION: ComponentRegistration = {
  id: "pds-input",
  controls: [
    {
      id:           "size",
      label:        "Size",
      type:         "select",
      defaultValue: "md",
      options: [
        { label: "Small",  value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large",  value: "lg" },
      ],
    },
    {
      id:           "state",
      label:        "State",
      type:         "select",
      defaultValue: "default",
      options: [
        { label: "Default",  value: "default"  },
        { label: "Focused",  value: "focused"  },
        { label: "Error",    value: "error"    },
        { label: "Disabled", value: "disabled" },
      ],
    },
    {
      id:           "placeholder",
      label:        "Placeholder",
      type:         "text",
      defaultValue: "Search components…",
    },
    { id: "withLabel",  label: "Show Label",   type: "boolean", defaultValue: false },
    { id: "withIcon",   label: "Prefix Icon",  type: "boolean", defaultValue: true  },
    { id: "withHelper", label: "Helper Text",  type: "boolean", defaultValue: false },
    {
      id:           "kbd",
      label:        "Shortcut",
      type:         "text",
      defaultValue: "⌘K",
    },
  ],
  defaultValues: {
    size:        "md",
    state:       "default",
    placeholder: "Search components…",
    withLabel:   false,
    withIcon:    true,
    withHelper:  false,
    kbd:         "⌘K",
  },
  getTokens,
};
