// ─── Accent Preset Definitions ────────────────────────────────────────────────
// Pure data — no React. Safe to import in server and client contexts.

export type AccentPreset = {
  id:   string;
  label: string;
  hex:  string;
  r:    number;
  g:    number;
  b:    number;
  hexH: string; // hover (slightly brighter in dark mode)
  hexA: string; // active (brighter still)
};

export const ACCENT_PRESETS: AccentPreset[] = [
  { id: "chartreuse", label: "Chartreuse",    hex: "#C8E000", r: 200, g: 224, b: 0,   hexH: "#D4EE00", hexA: "#E0FA00" },
  { id: "mint",       label: "Electric Mint", hex: "#00D4A0", r: 0,   g: 212, b: 160, hexH: "#00C090", hexA: "#00AC80" },
  { id: "coral",      label: "Bright Coral",  hex: "#FF4D6D", r: 255, g: 77,  b: 109, hexH: "#FF3A5C", hexA: "#E63354" },
  { id: "cyan",       label: "Vivid Cyan",    hex: "#00C2E0", r: 0,   g: 194, b: 224, hexH: "#00AFCC", hexA: "#009BB8" },
  { id: "lavender",   label: "Lavender",      hex: "#A594E8", r: 165, g: 148, b: 232, hexH: "#9482D8", hexA: "#8370C8" },
  { id: "pink",       label: "Hot Pink",      hex: "#FF6EB4", r: 255, g: 110, b: 180, hexH: "#FF5AA8", hexA: "#E84D99" },
];

export const DEFAULT_ACCENT_ID = "chartreuse";

// ─── Build all CSS vars for a given accent preset ─────────────────────────────

export function buildAccentVars(p: AccentPreset): Record<string, string> {
  const { hex, r, g, b, hexH, hexA } = p;
  return {
    // Shell tokens
    "--sh-accent":                      hex,
    "--sh-accent-h":                    hexH,
    "--sh-accent-a":                    hexA,
    "--sh-accent-sel":                  `rgba(${r},${g},${b},0.15)`,
    "--sh-accent-ring":                 `rgba(${r},${g},${b},0.30)`,
    "--sh-box-border":                  `rgba(${r},${g},${b},0.28)`,
    "--sh-box-bg":                      `rgba(${r},${g},${b},0.06)`,
    "--sh-box-inner":                   `rgba(${r},${g},${b},0.18)`,
    "--sh-accent-text":                 "#111111",
    // PDS Button primary variant
    "--pds-btn-primary-bg":             hex,
    "--pds-btn-primary-bg-hover":       hexH,
    "--pds-btn-primary-bg-active":      hexA,
    "--pds-btn-primary-color":          "#111111",
    // PDS Button secondary variant
    "--pds-btn-secondary-color":        hex,
    "--pds-btn-secondary-border":       `rgba(${r},${g},${b},0.40)`,
    "--pds-btn-secondary-border-hover": `rgba(${r},${g},${b},0.70)`,
    "--pds-btn-secondary-bg-hover":     `rgba(${r},${g},${b},0.10)`,
    "--pds-btn-secondary-bg-active":    `rgba(${r},${g},${b},0.16)`,
  };
}

// ─── Apply preset to :root inline styles ──────────────────────────────────────

export function applyAccentPreset(preset: AccentPreset): void {
  const el = document.documentElement;
  const vars = buildAccentVars(preset);
  for (const [k, v] of Object.entries(vars)) {
    el.style.setProperty(k, v);
  }
  try { localStorage.setItem("pf-accent", preset.id); } catch { /* ignore */ }
}

export function applyAccentById(id: string): void {
  const preset = ACCENT_PRESETS.find((p) => p.id === id) ?? ACCENT_PRESETS[0];
  applyAccentPreset(preset);
}
