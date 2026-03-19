import type { ComponentRegistration, TokenRow } from "@/lib/types";

// ─── Spacing step data ────────────────────────────────────────────────────────

export const SPACE_STEPS = [
  { id: "4",  px: 4,  token: "--shouf-space-4",  rem: "0.25rem", usedFor: "Icon padding, micro gaps, scrollbar width"        },
  { id: "8",  px: 8,  token: "--shouf-space-8",  rem: "0.5rem",  usedFor: "Compact padding, icon-to-label gap"               },
  { id: "12", px: 12, token: "--shouf-space-12", rem: "0.75rem", usedFor: "Nav item padding, control vertical padding"       },
  { id: "16", px: 16, token: "--shouf-space-16", rem: "1rem",    usedFor: "Default padding, panel gutters, section gaps"     },
  { id: "20", px: 20, token: "--shouf-space-20", rem: "1.25rem", usedFor: "Button horizontal padding (large), canvas edges"  },
  { id: "24", px: 24, token: "--shouf-space-24", rem: "1.5rem",  usedFor: "Card padding, content section spacing"            },
  { id: "32", px: 32, token: "--shouf-space-32", rem: "2rem",    usedFor: "Major layout gaps, canvas inner padding"          },
  { id: "48", px: 48, token: "--shouf-space-48", rem: "3rem",    usedFor: "Page section spacing, large canvas padding"       },
  { id: "64", px: 64, token: "--shouf-space-64", rem: "4rem",    usedFor: "Hero section, major vertical rhythm"              },
] as const;

// ─── Spacing options for controls ─────────────────────────────────────────────

const PAD_OPTIONS = [
  { label: "4px",  value: "4"  },
  { label: "8px",  value: "8"  },
  { label: "12px", value: "12" },
  { label: "16px", value: "16" },
  { label: "20px", value: "20" },
  { label: "24px", value: "24" },
];

const GAP_OPTIONS = [
  { label: "4px",  value: "4"  },
  { label: "8px",  value: "8"  },
  { label: "12px", value: "12" },
  { label: "16px", value: "16" },
  { label: "20px", value: "20" },
];

const RADIUS_OPTIONS = [
  { label: "4px",  value: "4"  },
  { label: "8px",  value: "8"  },
  { label: "12px", value: "12" },
  { label: "16px", value: "16" },
  { label: "24px", value: "24" },
];

// ─── Registration ─────────────────────────────────────────────────────────────

export const PDS_SPACING_REGISTRATION: ComponentRegistration = {
  id: "pds-spacing",
  controls: [
    {
      id:           "padding",
      label:        "Padding",
      type:         "select",
      defaultValue: "16",
      options:      PAD_OPTIONS,
    },
    {
      id:           "gap",
      label:        "Gap",
      type:         "select",
      defaultValue: "12",
      options:      GAP_OPTIONS,
    },
    {
      id:           "borderRadius",
      label:        "Radius",
      type:         "select",
      defaultValue: "12",
      options:      RADIUS_OPTIONS,
    },
  ],
  defaultValues: { padding: "16", gap: "12", borderRadius: "12", selectedToken: "" },
  getTokens(values) {
    const sel = (values.selectedToken as string) ?? "";

    // ── A specific scale row is clicked — show its full token details ──────────
    if (sel) {
      const step = SPACE_STEPS.find((s) => s.id === sel);
      if (step) {
        return [
          { id: "token", property: "token name",     cssValue: step.token,   tokenName: step.token,   category: "typography" },
          { id: "px",    property: "px value",       cssValue: `${step.px}px`, tokenName: "—",        category: "typography" },
          { id: "rem",   property: "rem equivalent", cssValue: step.rem,     tokenName: "—",          category: "typography" },
          { id: "use",   property: "used for",       cssValue: step.usedFor, tokenName: "—",          category: "typography" },
        ] satisfies TokenRow[];
      }
    }

    // ── Default — show the demo card's current spacing as box model tokens ─────
    const pad = values.padding as string;
    const gap = values.gap     as string;
    const rad = values.borderRadius as string;
    return [
      { id: "padding", property: "padding",       cssValue: `${pad}px`, tokenName: `--shouf-space-${pad}`, category: "spacing" },
      { id: "gap",     property: "gap",           cssValue: `${gap}px`, tokenName: `--shouf-space-${gap}`, category: "spacing" },
      { id: "radius",  property: "border-radius", cssValue: `${rad}px`, tokenName: `--shouf-space-${rad}`, category: "radius"  },
    ] satisfies TokenRow[];
  },
};
