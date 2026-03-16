// ─── Water Ripple Event Bus ───────────────────────────────────────────────────
// Tiny pub/sub so AccentPicker can fire a ripple without prop drilling or
// context changes. Uses window CustomEvent so the bus is a true singleton
// regardless of how many module instances Turbopack creates.

type RippleListener = (x: number, y: number, hex: string) => void;

const EVENT_NAME = "sh-water-ripple";

/** Call from AccentPicker click handler to trigger the water ripple. */
export function fireWaterRipple(x: number, y: number, hex: string): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { x, y, hex } }));
}

/** Subscribe to ripple events. Returns an unsubscribe function. */
export function onWaterRipple(fn: RippleListener): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (e: Event) => {
    const { x, y, hex } = (e as CustomEvent<{ x: number; y: number; hex: string }>).detail;
    fn(x, y, hex);
  };
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}
