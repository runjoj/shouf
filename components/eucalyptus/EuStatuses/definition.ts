import type { ComponentRegistration, ComponentControlValues, TokenRow } from "@/lib/types";

// ─── Token tables (match --eu-status-* in globals.css) ─────────────────────────

const VARIANT_TOKENS = {
  repaired: { bg: "#D9D3F8", color: "#000000" },
  running:  { bg: "#2FC291", color: "#040708" },
  queued:   { bg: "#D9DAE2", color: "#000000" },
  failed:   { bg: "#FF6161", color: "#040708" },
  passed:   { bg: "#B5E9DD", color: "#000000" },
  added:    { bg: "#D9D3F8", color: "#000000" },
  deleted:  { bg: "#0F1012", color: "#FFFFFF" },
} as const;

const SIZE_TOKENS = {
  sm: { font: "11px", px: "8px",  py: "4px", gap: "4px", circle: "22px" },
  md: { font: "12px", px: "10px", py: "5px", gap: "5px", circle: "22px" },
} as const;

// ─── getTokens ─────────────────────────────────────────────────────────────────
// The canvas lets the user click any badge (pill or circle) to drive inspect.
// `selected` (variant id) and `selectedType` ("pill" | "circle") are hidden
// from the controls bar — they live in defaultValues but not in controls[].

function getTokens(values: ComponentControlValues): TokenRow[] {
  const selectedId   = ((values.selected     as string) || "repaired") as keyof typeof VARIANT_TOKENS;
  const selectedType = ((values.selectedType as string) || "pill") as "pill" | "circle";
  const size         = ((values.size         as string) || "md")       as keyof typeof SIZE_TOKENS;

  const vv = VARIANT_TOKENS[selectedId] ?? VARIANT_TOKENS.repaired;
  const sv = SIZE_TOKENS[size];

  const radius      = selectedType === "circle" ? "50%" : "4px";
  const radiusToken = selectedType === "circle"
    ? "--eu-status-radius-circle"
    : "--eu-status-radius-pill";

  return [
    {
      id:        "bg",
      property:  "background",
      cssValue:  vv.bg,
      tokenName: `--eu-status-${selectedId}-bg`,
      category:  "color",
    },
    {
      id:        "color",
      property:  "color",
      cssValue:  vv.color,
      tokenName: `--eu-status-${selectedId}-color`,
      category:  "color",
    },
    {
      id:        "radius",
      property:  "border-radius",
      cssValue:  radius,
      tokenName: radiusToken,
      category:  "radius",
    },
    {
      id:        "font-size",
      property:  "font-size",
      cssValue:  sv.font,
      tokenName: `--eu-status-font-${size}`,
      category:  "typography",
    },
    {
      id:        "font-weight",
      property:  "font-weight",
      cssValue:  "500",
      tokenName: "--eu-status-fw",
      category:  "typography",
    },
    {
      id:        "padding",
      property:  selectedType === "circle" ? "width / height" : "padding",
      cssValue:  selectedType === "circle" ? sv.circle : `${sv.py} ${sv.px}`,
      tokenName: selectedType === "circle"
        ? `--eu-status-circle-${size}`
        : `--eu-status-p-${size}`,
      category: "spacing",
    },
    {
      id:        "gap",
      property:  "gap",
      cssValue:  sv.gap,
      tokenName: `--eu-status-gap-${size}`,
      category:  "spacing",
    },
  ];
}

// ─── Registration ───────────────────────────────────────────────────────────────

export const EU_STATUSES_REGISTRATION: ComponentRegistration = {
  id: "eu-statuses",
  controls: [
    {
      id:           "size",
      label:        "Size",
      type:         "select",
      defaultValue: "md",
      options: [
        { label: "Small",  value: "sm" },
        { label: "Medium", value: "md" },
      ],
    },
  ],
  defaultValues: {
    size:         "md",
    // Driven by clicking in the canvas — not exposed in the controls bar:
    selected:     "repaired",
    selectedType: "pill",
  },
  getTokens,
};
