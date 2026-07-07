// ─── Presentation design tokens ────────────────────────────────────────────
// A deliberately separate, quieter palette from the portfolio shell. Paper,
// not screen: warm off-white ground, near-black ink, one muted accent used
// only where it earns its place (progress fill, current-slide dot, tiny
// labels). No brand green, no gradients, no drop shadows.

export const PAPER       = "#F7F5F0";  // slide ground
export const PAPER_DIM    = "#EFEBE2";  // card / divider tint
export const INK          = "#18160F";  // headlines, primary text
export const INK_SOFT     = "#54503F";  // body copy
export const INK_FAINT    = "#8B8471";  // captions, tertiary chrome
export const HAIRLINE     = "#DCD6C7";  // borders
export const ACCENT       = "#966A3F";  // the one quiet accent — muted clay
export const ACCENT_TINT  = "rgba(150,106,63,0.10)";

export const SANS = "var(--font-instrument-sans), var(--font-manrope), system-ui, sans-serif";
export const BODY_FONT = "var(--font-inter), var(--font-manrope), system-ui, sans-serif";
export const MONO = "ui-monospace, 'SF Mono', Menlo, monospace";
