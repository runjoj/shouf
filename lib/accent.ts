// ─── Accent Preset Definitions ────────────────────────────────────────────────
// Pure data — no React. Safe to import in server and client contexts.
//
// Each preset carries two colour sets:
//   Dark mode  → hex/hexH/hexA/r/g/b  — vibrant, high-luminance; readable on dark bg
//   Light mode → lightHex/lightHexH/lightHexA/lR/lG/lB — darkened for 4.5:1+ on white
//
// Button backgrounds always use the dark-mode (bright) values — the #111111
// label on top passes WCAG in both modes regardless of the surface.

export type AccentPreset = {
  id:    string;
  label: string;
  // ── Dark-mode / decoration values ─────────────────────────────────────────
  hex:   string; // base
  hexH:  string; // hover
  hexA:  string; // active
  r: number; g: number; b: number;
  // ── Light-mode foreground values (WCAG AA ≥ 4.5:1 on #FFFFFF) ────────────
  lightHex:  string;
  lightHexH: string;
  lightHexA: string;
  lR: number; lG: number; lB: number;
};

export const ACCENT_PRESETS: AccentPreset[] = [
  // Chartreuse — dark: vibrant lime; light: olive (#646F00 → 5.3:1 on white)
  {
    id: "chartreuse", label: "Chartreuse",
    hex: "#C8E000", hexH: "#D4EE00", hexA: "#E0FA00", r: 200, g: 224, b: 0,
    lightHex: "#646F00", lightHexH: "#535C00", lightHexA: "#424800", lR: 100, lG: 111, lB: 0,
  },
  // Electric Mint — dark: cyan-green; light: deep teal (#007A60 → 4.9:1 on white)
  {
    id: "mint", label: "Electric Mint",
    hex: "#00D4A0", hexH: "#00C090", hexA: "#00AC80", r: 0, g: 212, b: 160,
    lightHex: "#007A60", lightHexH: "#006850", lightHexA: "#005640", lR: 0, lG: 122, lB: 96,
  },
  // Bright Coral — dark: vivid red-pink; light: deep rose (#C22040 → 5.9:1 on white)
  {
    id: "coral", label: "Bright Coral",
    hex: "#FF4D6D", hexH: "#FF3A5C", hexA: "#E63354", r: 255, g: 77, b: 109,
    lightHex: "#C22040", lightHexH: "#AD1C38", lightHexA: "#981830", lR: 194, lG: 32, lB: 64,
  },
  // Vivid Cyan — dark: sky blue; light: deep teal-blue (#006E87 → 5.7:1 on white)
  {
    id: "cyan", label: "Vivid Cyan",
    hex: "#00C2E0", hexH: "#00AFCC", hexA: "#009BB8", r: 0, g: 194, b: 224,
    lightHex: "#006E87", lightHexH: "#005E73", lightHexA: "#004E60", lR: 0, lG: 110, lB: 135,
  },
  // Lavender — dark: brighter violet (#B4A0FF, 8.6:1); light: deep purple (#6B4FCC, 5.6:1)
  {
    id: "lavender", label: "Lavender",
    hex: "#B4A0FF", hexH: "#A492F5", hexA: "#9484EB", r: 180, g: 160, b: 255,
    lightHex: "#6B4FCC", lightHexH: "#5D44B5", lightHexA: "#4F3A9E", lR: 107, lG: 79, lB: 204,
  },
  // Hot Pink — dark: bright magenta (#FF80CC, 8.5:1); light: deep rose (#C40078, 5.8:1)
  {
    id: "pink", label: "Hot Pink",
    hex: "#FF80CC", hexH: "#FF6EC0", hexA: "#F05CB0", r: 255, g: 128, b: 204,
    lightHex: "#C40078", lightHexH: "#AC006A", lightHexA: "#94005C", lR: 196, lG: 0, lB: 120,
  },
];

export const DEFAULT_ACCENT_ID = "chartreuse";

// ─── Build all CSS vars for a given accent preset + theme ─────────────────────
//
// Foreground tokens (--sh-accent*) use light values in light mode so text/
// indicators meet WCAG 4.5:1 on the white/near-white surfaces.
// Button backgrounds always use the bright values — #111111 text on a vivid
// accent passes with room to spare regardless of theme.

export function buildAccentVars(
  p: AccentPreset,
  theme: "light" | "dark"
): Record<string, string> {
  // Foreground colours depend on theme
  const fg  = theme === "light" ? p.lightHex  : p.hex;
  const fgH = theme === "light" ? p.lightHexH : p.hexH;
  const fgA = theme === "light" ? p.lightHexA : p.hexA;
  const fR  = theme === "light" ? p.lR : p.r;
  const fG  = theme === "light" ? p.lG : p.g;
  const fB  = theme === "light" ? p.lB : p.b;
  // Button / decoration always bright
  const { hex, hexH, hexA, r, g, b } = p;

  return {
    // ── Shell foreground tokens ──────────────────────────────────────────────
    "--sh-accent":                      fg,
    "--sh-accent-h":                    fgH,
    "--sh-accent-a":                    fgA,
    // Decorative tints use bright rgb so the tint looks vibrant not muddy
    "--sh-accent-sel":                  `rgba(${r},${g},${b},0.15)`,
    "--sh-accent-ring":                 `rgba(${r},${g},${b},0.30)`,
    "--sh-box-border":                  `rgba(${fR},${fG},${fB},0.28)`,
    "--sh-box-bg":                      `rgba(${r},${g},${b},0.06)`,
    "--sh-box-inner":                   `rgba(${r},${g},${b},0.18)`,
    "--sh-accent-text":                 "#111111",
    // ── PDS Button primary — always bright bg + dark label ──────────────────
    "--pds-btn-primary-bg":             hex,
    "--pds-btn-primary-bg-hover":       hexH,
    "--pds-btn-primary-bg-active":      hexA,
    "--pds-btn-primary-color":          "#111111",
    // ── PDS Button secondary — fg colour used for text/border ───────────────
    "--pds-btn-secondary-color":              fg,
    "--pds-btn-secondary-border":             `rgba(${fR},${fG},${fB},0.40)`,
    "--pds-btn-secondary-border-hover":       `rgba(${fR},${fG},${fB},0.70)`,
    "--pds-btn-secondary-bg-hover":           `rgba(${fR},${fG},${fB},0.10)`,
    "--pds-btn-secondary-bg-active":          `rgba(${fR},${fG},${fB},0.16)`,
  };
}

// ─── Apply preset to :root inline styles ──────────────────────────────────────

export function applyAccentPreset(preset: AccentPreset, theme: "light" | "dark"): void {
  const el   = document.documentElement;
  const vars = buildAccentVars(preset, theme);
  for (const [k, v] of Object.entries(vars)) {
    el.style.setProperty(k, v);
  }
  try { localStorage.setItem("pf-accent", preset.id); } catch { /* ignore */ }
}

export function applyAccentById(id: string, theme: "light" | "dark"): void {
  const preset = ACCENT_PRESETS.find((p) => p.id === id) ?? ACCENT_PRESETS[0];
  applyAccentPreset(preset, theme);
}
