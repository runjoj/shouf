import type { ComponentRegistration, TokenRow } from "@/lib/types";

// ─── Token data for each font family ──────────────────────────────────────────

const FAMILY_TOKENS: Record<string, TokenRow[]> = {
  playfair: [
    { id: "ff",   property: "font-family",       cssValue: "Playfair Display",  tokenName: "--font-playfair", category: "typography" },
    { id: "fw1",  property: "font-weight / Regular",  cssValue: "400",          tokenName: "—",               category: "typography" },
    { id: "fw2",  property: "font-weight / Medium",   cssValue: "500",          tokenName: "—",               category: "typography" },
    { id: "fw3",  property: "font-weight / Semibold", cssValue: "600",          tokenName: "—",               category: "typography" },
    { id: "fw4",  property: "font-weight / Bold",     cssValue: "700",          tokenName: "—",               category: "typography" },
  ],
  inter: [
    { id: "ff",   property: "font-family",       cssValue: "Inter",             tokenName: "--font-inter",    category: "typography" },
    { id: "fw1",  property: "font-weight / Regular",  cssValue: "400",          tokenName: "—",               category: "typography" },
    { id: "fw2",  property: "font-weight / Medium",   cssValue: "500",          tokenName: "—",               category: "typography" },
    { id: "fw3",  property: "font-weight / Semibold", cssValue: "600",          tokenName: "—",               category: "typography" },
  ],
  figtree: [
    { id: "ff",   property: "font-family",       cssValue: "Figtree",           tokenName: "--font-figtree",  category: "typography" },
    { id: "fw1",  property: "font-weight / Regular",  cssValue: "400",          tokenName: "—",               category: "typography" },
    { id: "fw2",  property: "font-weight / Medium",   cssValue: "500",          tokenName: "—",               category: "typography" },
    { id: "fw3",  property: "font-weight / Semibold", cssValue: "600",          tokenName: "—",               category: "typography" },
  ],
  mono: [
    { id: "ff",   property: "font-family",       cssValue: "ui-monospace, SF Mono, Menlo", tokenName: "--font-mono", category: "typography" },
    { id: "fw1",  property: "font-weight / Regular",  cssValue: "400",          tokenName: "—",               category: "typography" },
  ],
};

// ─── Token data for each type scale step ──────────────────────────────────────

const SCALE_TOKENS: Record<string, TokenRow[]> = {
  "type-8":  [
    { id: "fs",  property: "font-size", cssValue: "8px",  tokenName: "--shouf-type-8",  category: "typography" },
    { id: "use", property: "used for",  cssValue: "Box model labels",          tokenName: "—", category: "typography" },
  ],
  "type-9":  [
    { id: "fs",  property: "font-size", cssValue: "9px",  tokenName: "--shouf-type-9",  category: "typography" },
    { id: "use", property: "used for",  cssValue: "Keyboard shortcut hints",   tokenName: "—", category: "typography" },
  ],
  "type-10": [
    { id: "fs",  property: "font-size", cssValue: "10px", tokenName: "--shouf-type-10", category: "typography" },
    { id: "use", property: "used for",  cssValue: "Meta labels, token values", tokenName: "—", category: "typography" },
  ],
  "type-11": [
    { id: "fs",  property: "font-size", cssValue: "11px", tokenName: "--shouf-type-11", category: "typography" },
    { id: "use", property: "used for",  cssValue: "Nav headers, control labels", tokenName: "—", category: "typography" },
  ],
  "type-12": [
    { id: "fs",  property: "font-size", cssValue: "12px", tokenName: "--shouf-type-12", category: "typography" },
    { id: "use", property: "used for",  cssValue: "Nav items, status badges",  tokenName: "—", category: "typography" },
  ],
  "type-13": [
    { id: "fs",  property: "font-size", cssValue: "13px", tokenName: "--shouf-type-13", category: "typography" },
    { id: "use", property: "used for",  cssValue: "Body text, subheadings",    tokenName: "—", category: "typography" },
  ],
  "type-15": [
    { id: "fs",  property: "font-size", cssValue: "15px", tokenName: "--shouf-type-15", category: "typography" },
    { id: "use", property: "used for",  cssValue: "Button label (large)",      tokenName: "—", category: "typography" },
  ],
  "type-18": [
    { id: "fs",  property: "font-size", cssValue: "18px", tokenName: "--shouf-type-18", category: "typography" },
    { id: "use", property: "used for",  cssValue: "Welcome headline",          tokenName: "—", category: "typography" },
  ],
};

// ─── Default tokens shown before any selection ────────────────────────────────

const DEFAULT_TOKENS: TokenRow[] = [
  { id: "fp", property: "font-family / Display",   cssValue: "Playfair Display",           tokenName: "--font-playfair", category: "typography" },
  { id: "fi", property: "font-family / UI",        cssValue: "Inter",                      tokenName: "--font-inter",    category: "typography" },
  { id: "ff", property: "font-family / Component", cssValue: "Figtree",                    tokenName: "--font-figtree",  category: "typography" },
  { id: "fm", property: "font-family / Technical", cssValue: "ui-monospace",               tokenName: "--font-mono",     category: "typography" },
];

// ─── Registration ─────────────────────────────────────────────────────────────

export const PDS_TYPOGRAPHY_REGISTRATION: ComponentRegistration = {
  id: "pds-typography",
  controls: [
    {
      id:           "view",
      label:        "View",
      type:         "select",
      defaultValue: "by-font",
      options: [
        { label: "By Font",  value: "by-font"  },
        { label: "By Scale", value: "by-scale" },
      ],
    },
  ],
  defaultValues: { view: "by-font", selectedItem: "" },
  getTokens(values) {
    const item = (values.selectedItem as string) ?? "";
    if (item.startsWith("family:")) {
      return FAMILY_TOKENS[item.replace("family:", "")] ?? DEFAULT_TOKENS;
    }
    if (item.startsWith("scale:")) {
      return SCALE_TOKENS[item.replace("scale:", "")] ?? DEFAULT_TOKENS;
    }
    return DEFAULT_TOKENS;
  },
};
