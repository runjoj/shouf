import type { ComponentRegistration, ComponentControlValues, TokenRow } from "@/lib/types";

// ─── Size scale ──────────────────────────────────────────────────────────────
// Three headline sizes — matches the font-size values used in WelcomeCanvas.
// Changing these values requires updating the SIZE_MAP in WelcomeCanvas too.

const SIZE_TOKENS = {
  sm: { fontSize: "clamp(1.55rem, 2vw, 2rem)",       tokenName: "--welcome-font-sm" },
  md: { fontSize: "clamp(2rem, 2.65vw, 2.65rem)",    tokenName: "--welcome-font-md" },
  lg: { fontSize: "clamp(2.4rem, 3.3vw, 3.3rem)",    tokenName: "--welcome-font-lg" },
} as const;

// ─── getTokens ───────────────────────────────────────────────────────────────
// Returns the CSS tokens used by the WelcomeCanvas h2 headline.
// The inspect panel calls this with the current control values so changing
// the Headline size control updates the token readout in real time.

function getTokens(values: ComponentControlValues): TokenRow[] {
  const size = (values.size as string) || "md";
  const sv   = SIZE_TOKENS[size as keyof typeof SIZE_TOKENS] ?? SIZE_TOKENS.md;

  return [
    { id: "color",       property: "color",          cssValue: "var(--shouf-text)",       tokenName: "--shouf-text",          category: "color"      },
    { id: "color-sub",   property: "color (subhead)", cssValue: "var(--shouf-text-muted)", tokenName: "--shouf-text-muted",    category: "color"      },
    { id: "font-family", property: "font-family",     cssValue: "var(--font-mono)",        tokenName: "--font-mono",           category: "typography" },
    { id: "font-size",   property: "font-size",       cssValue: sv.fontSize,               tokenName: sv.tokenName,            category: "typography" },
    { id: "font-weight", property: "font-weight",     cssValue: "700",                     tokenName: "--welcome-font-weight", category: "typography" },
    { id: "line-height", property: "line-height",     cssValue: "1.35",                    tokenName: "--welcome-line-height", category: "typography" },
  ];
}

// ─── Registration ─────────────────────────────────────────────────────────────
// "welcome" is registered so the inspect panel shows the headline's real type
// tokens and the controls bar lets visitors resize the headline live —
// demonstrating that every value is a token, not a magic number.

export const WELCOME_REGISTRATION: ComponentRegistration = {
  id: "welcome",
  controls: [
    {
      id:           "size",
      label:        "Headline",
      type:         "select",
      defaultValue: "lg",
      options: [
        { label: "Small",  value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large",  value: "lg" },
      ],
    },
  ],
  defaultValues: { size: "lg" },
  getTokens,
};
