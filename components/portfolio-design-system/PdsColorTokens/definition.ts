import type { ComponentRegistration, TokenRow } from "@/lib/types";
import { ACCENT_PRESETS } from "@/lib/accent";

// ─── Token data for each section ─────────────────────────────────────────────

const SECTION_TOKENS: Record<string, TokenRow[]> = {
  background: [
    { id: "bg",      property: "background",      cssValue: "var(--shouf-bg)",        tokenName: "--shouf-bg",        category: "color" },
    { id: "canvas",  property: "canvas",          cssValue: "var(--shouf-canvas)",    tokenName: "--shouf-canvas",    category: "color" },
    { id: "panel",   property: "panel",           cssValue: "var(--shouf-panel)",     tokenName: "--shouf-panel",     category: "color" },
    { id: "panelA",  property: "panel-alt",       cssValue: "var(--shouf-panel-alt)", tokenName: "--shouf-panel-alt", category: "color" },
  ],
  border: [
    { id: "border",  property: "border",          cssValue: "var(--shouf-border)",     tokenName: "--shouf-border",     category: "color" },
    { id: "borderS", property: "border-sub",      cssValue: "var(--shouf-border-sub)", tokenName: "--shouf-border-sub", category: "color" },
  ],
  text: [
    { id: "text",    property: "text",            cssValue: "var(--shouf-text)",       tokenName: "--shouf-text",       category: "color" },
    { id: "muted",   property: "text-muted",      cssValue: "var(--shouf-text-muted)", tokenName: "--shouf-text-muted", category: "color" },
    { id: "faint",   property: "text-faint",      cssValue: "var(--shouf-text-faint)", tokenName: "--shouf-text-faint", category: "color" },
  ],
  accent: [
    { id: "accent",  property: "accent",          cssValue: "var(--shouf-accent)",      tokenName: "--shouf-accent",      category: "color" },
    { id: "accentH", property: "accent-hover",    cssValue: "var(--shouf-accent-h)",    tokenName: "--shouf-accent-h",    category: "color" },
    { id: "accentA", property: "accent-active",   cssValue: "var(--shouf-accent-a)",    tokenName: "--shouf-accent-a",    category: "color" },
    { id: "rose",    property: "accent-rose",     cssValue: "var(--shouf-accent-rose)", tokenName: "--shouf-accent-rose", category: "color" },
    { id: "blue",    property: "accent-blue",     cssValue: "var(--shouf-accent-blue)", tokenName: "--shouf-accent-blue", category: "color" },
    { id: "sage",    property: "accent-sage",     cssValue: "var(--shouf-accent-sage)", tokenName: "--shouf-accent-sage", category: "color" },
  ],
};

// ─── Default tokens — overview of all semantic families ──────────────────────

const DEFAULT_TOKENS: TokenRow[] = [
  { id: "bg",     property: "background",  cssValue: "var(--shouf-bg)",        tokenName: "--shouf-bg",        category: "color" },
  { id: "border", property: "border",      cssValue: "var(--shouf-border)",    tokenName: "--shouf-border",    category: "color" },
  { id: "text",   property: "text",        cssValue: "var(--shouf-text)",      tokenName: "--shouf-text",      category: "color" },
  { id: "accent", property: "accent",      cssValue: "var(--shouf-accent)",    tokenName: "--shouf-accent",    category: "color" },
];

// ─── Registration ─────────────────────────────────────────────────────────────

export const PDS_COLOR_TOKENS_REGISTRATION: ComponentRegistration = {
  id: "pds-color-tokens",
  controls: [
    {
      id:           "accent",
      label:        "Theme",
      type:         "select",
      defaultValue: "chartreuse",
      options:      ACCENT_PRESETS.map((p) => ({ label: p.label, value: p.id })),
    },
    {
      id:           "mode",
      label:        "Mode",
      type:         "select",
      defaultValue: "dark",
      options:      [
        { label: "Dark",  value: "dark"  },
        { label: "Light", value: "light" },
      ],
    },
  ],
  defaultValues: { accent: "chartreuse", mode: "dark", selectedSection: "" },
  getTokens(values) {
    const sel = (values.selectedSection as string) ?? "";
    if (sel && SECTION_TOKENS[sel]) {
      return SECTION_TOKENS[sel];
    }
    return DEFAULT_TOKENS;
  },
};
