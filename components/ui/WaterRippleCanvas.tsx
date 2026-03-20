"use client";

import { useEffect, useRef } from "react";
import { onWaterRipple } from "@/lib/waterRipple";
import { ACCENT_PRESETS } from "@/lib/accent";

// ─── Animation constants ───────────────────────────────────────────────────────

const DURATION   = 1400; // ms — slow, tide-like wash across the screen
const MAX_RADIUS = 1200; // px — ring expands to this radius
const LINE_WIDTH = 200;  // px — very wide stroke; heavy blur turns it into a soft wash

// ─── Easing ────────────────────────────────────────────────────────────────────
// Cubic ease-out: snappy initial expansion, long gentle deceleration.
// Smoother than quadratic — the wave decelerates more gracefully at the edges.

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

// ─── Accent var resolver ───────────────────────────────────────────────────────
// Maps each --shouf-accent-* var name to its concrete colour value for a given
// preset so we can set explicit property values on each cascade target.

// fg* = theme-correct foreground (dark in light-mode, bright in dark-mode)
// bg* = always-bright decoration rgb (used for translucent tints)
function resolveVar(
  varName: string,
  fgR: number, fgG: number, fgB: number,
  bgR: number, bgG: number, bgB: number,
  hexH: string, hexA: string,
): string {
  switch (varName.trim()) {
    case "--shouf-accent":      return `rgb(${fgR},${fgG},${fgB})`;
    case "--shouf-accent-h":    return hexH;
    case "--shouf-accent-a":    return hexA;
    case "--shouf-accent-sel":  return `rgba(${bgR},${bgG},${bgB},0.15)`;
    case "--shouf-accent-ring": return `rgba(${bgR},${bgG},${bgB},0.30)`;
    case "--shouf-box-border":  return `rgba(${fgR},${fgG},${fgB},0.28)`;
    case "--shouf-box-bg":      return `rgba(${bgR},${bgG},${bgB},0.06)`;
    case "--shouf-box-inner":   return `rgba(${bgR},${bgG},${bgB},0.18)`;
    default:                 return `rgb(${fgR},${fgG},${fgB})`;
  }
}

// ─── DOM helpers ───────────────────────────────────────────────────────────────

// Only cascade these vars — they are all derived from the dynamic accent colour.
// Fixed palette vars like --shouf-accent-sage/rose/blue are intentionally excluded.
const CASCADE_VARS = new Set([
  "--shouf-accent", "--shouf-accent-h", "--shouf-accent-a",
  "--shouf-accent-sel", "--shouf-accent-ring",
  "--shouf-box-border", "--shouf-box-bg", "--shouf-box-inner",
]);

// Parse every CSS property in an element's inline style that references a
// cascadeable --shouf-accent var (e.g. "background-color: var(--shouf-accent-sel)").
function getAccentEntries(el: HTMLElement): Array<{ prop: string; varName: string }> {
  const attr = el.getAttribute("style") ?? "";
  const result: Array<{ prop: string; varName: string }> = [];
  for (const rule of attr.split(";")) {
    const ci = rule.indexOf(":");
    if (ci < 0) continue;
    const prop  = rule.slice(0, ci).trim();
    const value = rule.slice(ci + 1).trim();
    const m     = value.match(/var\((--shouf-accent[^)]*)\)/);
    if (m && CASCADE_VARS.has(m[1])) result.push({ prop, varName: m[1] });
  }
  return result;
}

function dist(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

// ─── Cascade target ────────────────────────────────────────────────────────────

interface CascadeTarget {
  el:       HTMLElement;
  distance: number;
  revealed: boolean;
  entries:  Array<{ prop: string; varName: string }>;
}

// Query all elements whose inline style uses any --shouf-accent var, compute their
// distance from the ripple origin, and freeze them at their current computed
// colours so they don't immediately respond when setAccent updates :root.
// (AccentPicker fires the ripple event BEFORE calling setAccent, so we get
// the old colour here and the freeze holds until we individually reveal each
// element as the ring reaches its distance threshold.)
function buildTargets(originX: number, originY: number): CascadeTarget[] {
  const els     = document.querySelectorAll<HTMLElement>("[style*='--shouf-accent']");
  const targets: CascadeTarget[] = [];

  for (const el of els) {
    const entries = getAccentEntries(el);
    if (!entries.length) continue;

    const rect = el.getBoundingClientRect();
    if (!rect.width && !rect.height) continue;

    // Freeze each accent property at its current computed RGBA value.
    for (const { prop } of entries) {
      const val = getComputedStyle(el).getPropertyValue(prop).trim();
      if (val && val !== "rgba(0, 0, 0, 0)" && val !== "transparent") {
        el.style.setProperty(prop, val);
      }
    }

    // Pre-load the transition so it fires the moment we change the property.
    el.style.setProperty(
      "transition",
      entries.map(e => `${e.prop} 200ms ease`).join(", "),
    );

    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    targets.push({ el, distance: dist(originX, originY, cx, cy), revealed: false, entries });
  }

  return targets.sort((a, b) => a.distance - b.distance);
}

// Transition this element from its frozen colour to the new accent colour,
// then restore the CSS var reference so the element stays in sync with :root.
// We MUST NOT removeProperty — React set these via its style prop as
// var(--shouf-accent-*), so removing the property leaves no source for the colour
// and the element goes transparent. Instead we restore the CSS var expression;
// :root already holds the new accent (setAccent ran after the ripple fired),
// so the var resolves to the correct new colour immediately.
function revealTarget(
  target:  CascadeTarget,
  fgR: number, fgG: number, fgB: number,
  bgR: number, bgG: number, bgB: number,
  hexH: string, hexA: string,
) {
  for (const { prop, varName } of target.entries) {
    target.el.style.setProperty(prop, resolveVar(varName, fgR, fgG, fgB, bgR, bgG, bgB, hexH, hexA));
  }
  // After the 200ms transition completes, restore CSS var references so the
  // element re-links to :root and will pick up any future accent changes.
  // Register in pendingRestores so a rapid second click can flush immediately.
  const timerId = setTimeout(() => {
    for (const { prop, varName } of target.entries) {
      target.el.style.setProperty(prop, `var(${varName})`);
    }
    target.el.style.removeProperty("transition");
    const idx = pendingRestores.findIndex(r => r.el === target.el);
    if (idx !== -1) pendingRestores.splice(idx, 1);
  }, 250);

  pendingRestores.push({ el: target.el, entries: target.entries, timerId });
}

// ─── Active ripple ─────────────────────────────────────────────────────────────

interface ActiveRipple {
  x: number; y: number;
  // Foreground: theme-correct text/indicator colour
  r: number; g: number; b: number;
  // Decoration: always-bright rgb for translucent tints
  bgR: number; bgG: number; bgB: number;
  hexH: string; hexA: string;
  startTime: number;
  targets: CascadeTarget[];
}

// ─── WaterRippleCanvas ─────────────────────────────────────────────────────────
//
// Full-viewport fixed <canvas>, pointer-events:none, filter:blur(20px).
// A single ring expands from the exact toolbar swatch position:
//   radius  2 → 1200px over 1400ms, cubic ease-out (slow, tide-like feel)
//   opacity 1 → 0 as it expands  (1 - easeOut)
//   stroke  200px wide + 20px blur = broad, diffuse wash of colour
//
// As the ring expands it acts as a colour wave: every UI element whose inline
// style uses a --shouf-accent var is frozen at the old colour at click time.
// When the ring radius crosses that element's distance from the origin, the
// element transitions to the new accent colour over 200ms ease.
// Elements closest to the swatch change first; distant elements change last.

// ─── Pending restore registry ──────────────────────────────────────────────────
// Tracks elements that have been revealed (concrete colour set) but whose CSS
// var reference has not yet been restored by the 250ms setTimeout.
// When a new ripple fires we flush this immediately so buildTargets finds them
// via [style*='--shouf-accent'] and can freeze them at the current colour before
// the new setAccent call changes :root.

interface PendingRestore {
  el:      HTMLElement;
  entries: Array<{ prop: string; varName: string }>;
  timerId: ReturnType<typeof setTimeout>;
}

// Module-level so it is shared across renders of WaterRippleCanvas.
const pendingRestores: PendingRestore[] = [];

function flushPendingRestores() {
  for (const r of pendingRestores) {
    clearTimeout(r.timerId);
    for (const { prop, varName } of r.entries) {
      r.el.style.setProperty(prop, `var(${varName})`);
    }
    r.el.style.removeProperty("transition");
  }
  pendingRestores.length = 0;
}

export function WaterRippleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rippleRef = useRef<ActiveRipple | null>(null);
  const rafRef    = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Size canvas to viewport ───────────────────────────────────────────────
    function resize() {
      if (!canvas) return;
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // ── rAF draw loop ─────────────────────────────────────────────────────────
    function draw(now: number) {
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const rip = rippleRef.current;
      if (rip) {
        const t      = Math.max(0, Math.min((now - rip.startTime) / DURATION, 1));
        const e      = easeOut(t);
        const radius  = 2 + (MAX_RADIUS - 2) * e;
        const opacity = (1 - e) * 0.25; // faint wash — element transitions are the noticeable part

        if (opacity > 0.001) {
          ctx.beginPath();
          ctx.arc(rip.x, rip.y, radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${rip.bgR},${rip.bgG},${rip.bgB},${opacity.toFixed(4)})`;
          ctx.lineWidth   = LINE_WIDTH;
          ctx.stroke();
        }

        // Reveal each cascade target the first time the ring radius exceeds
        // its distance from the origin.
        for (const target of rip.targets) {
          if (!target.revealed && radius >= target.distance) {
            target.revealed = true;
            revealTarget(target, rip.r, rip.g, rip.b, rip.bgR, rip.bgG, rip.bgB, rip.hexH, rip.hexA);
          }
        }

        if (t >= 1) rippleRef.current = null;
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    // ── Subscribe to accent click events ──────────────────────────────────────
    // AccentPicker fires this event BEFORE calling setAccent(), so at this
    // point :root --shouf-accent still holds the previous colour — exactly when
    // we need to freeze targets at the old computed values.
    const unsub = onWaterRipple((x, y, hex) => {
      // Match preset by hex (always the bright/dark-mode swatch colour).
      const preset  = ACCENT_PRESETS.find(
        p => p.hex.toLowerCase() === hex.toLowerCase(),
      ) ?? ACCENT_PRESETS[0];

      // Use theme-appropriate foreground values so the reveal transition
      // paints elements at the correct accessible colour, not the bright
      // dark-mode value, which would cause a visible flash in light mode.
      const isLight = document.documentElement.getAttribute("data-theme") === "light";
      const fgR  = isLight ? preset.lR  : preset.r;
      const fgG  = isLight ? preset.lG  : preset.g;
      const fgB  = isLight ? preset.lB  : preset.b;
      const hexH = isLight ? preset.lightHexH : preset.hexH;
      const hexA = isLight ? preset.lightHexA : preset.hexA;

      // Flush any elements still frozen from a previous ripple so they appear
      // in the [style*='--shouf-accent'] query and participate in this cascade.
      flushPendingRestores();

      const targets = buildTargets(x, y);
      rippleRef.current = {
        x, y,
        r: fgR, g: fgG, b: fgB,
        bgR: preset.r, bgG: preset.g, bgB: preset.b, // bright rgb for tints
        hexH, hexA,
        startTime: performance.now(),
        targets,
      };
    });

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      unsub();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      "fixed",
        inset:         0,
        pointerEvents: "none",
        zIndex:        9990,
        filter:        "blur(30px)",
      }}
    />
  );
}
