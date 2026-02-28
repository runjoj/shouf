"use client";

import { useEffect, useRef } from "react";

// Layered trig noise — smooth, no dependencies
function sn(x: number, y: number, t: number): number {
  return (
    Math.sin(x * 1.4 + t) * Math.cos(y * 1.8 - t * 0.6) * 0.45 +
    Math.sin(x * 2.8 - t * 0.5) * Math.sin(y * 2.3 + t * 0.7) * 0.35 +
    Math.cos(x * 0.8 + t * 0.4) * Math.cos(y * 1.5 - t * 0.3) * 0.20
  );
}

const PALETTE = [
  { r: 232, g: 96,  b: 74  }, // coral
  { r: 218, g: 130, b: 170 }, // peach-rose
  { r: 168, g: 132, b: 218 }, // lavender
  { r: 252, g: 188, b: 90  }, // gold
  { r: 96,  g: 182, b: 240 }, // sky
];

type BlobDef = {
  bx: number; by: number;   // base position (0–1 normalized)
  nx: number; ny: number;   // noise seed
  ns: number; np: number;   // noise speed, phase
  baseR: number;            // radius as fraction of min(w,h)
  ci: number;               // color palette index
  sx: number;               // x stretch
  rot: number;              // starting rotation
  rotSpeed: number;         // rotation rate
};

const BLOBS: BlobDef[] = [
  { bx: 0.65, by: 0.44, nx: 0,  ny: 10, ns: 0.55, np: 0,   baseR: 0.13, ci: 0, sx: 2.8, rot: 0.3,  rotSpeed:  0.25 },
  { bx: 0.75, by: 0.35, nx: 5,  ny: 15, ns: 0.50, np: 1.4, baseR: 0.11, ci: 2, sx: 3.2, rot: 1.6,  rotSpeed: -0.20 },
  { bx: 0.68, by: 0.56, nx: 3,  ny: 8,  ns: 0.65, np: 2.6, baseR: 0.09, ci: 1, sx: 2.2, rot: 0.9,  rotSpeed:  0.30 },
  { bx: 0.60, by: 0.28, nx: 7,  ny: 3,  ns: 0.60, np: 0.8, baseR: 0.08, ci: 3, sx: 1.8, rot: 2.1,  rotSpeed: -0.15 },
  { bx: 0.80, by: 0.50, nx: 12, ny: 6,  ns: 0.58, np: 3.8, baseR: 0.08, ci: 4, sx: 2.0, rot: 3.5,  rotSpeed:  0.22 },
];

const N = 16; // control points per blob

// ── Surface deformation spring constants ──────────────────────────────────────
const STIFFNESS  = 0.010;
const RETAIN     = 0.82;
const DEFORM_MAX = 175;
const DEFORM_R   = 280;

type Goo = { ox: number; oy: number; vx: number; vy: number };

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef  = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true })!;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width  = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);
    requestAnimationFrame(resize);

    let t = 0, raf: number;

    const goo: Goo[][] = BLOBS.map(() =>
      Array.from({ length: N }, () => ({ ox: 0, oy: 0, vx: 0, vy: 0 }))
    );

    // ── Dark mode detection — watches data-theme attribute (not class) ─────────
    let isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const applyFilter = () => {
      canvas.style.filter = isDark ? "blur(28px) saturate(1.15)" : "blur(12px)";
    };
    applyFilter();
    const mo = new MutationObserver(() => {
      isDark = document.documentElement.getAttribute("data-theme") === "dark";
      applyFilter();
    });
    mo.observe(document.documentElement, { attributeFilter: ["data-theme"] });

    // ── Draw blob ──────────────────────────────────────────────────────────────
    const drawBlob = (
      cx: number, cy: number,
      rx: number, ry: number,
      rotation: number,
      nOff: number,
      g: Goo[],
      c: { r: number; g: number; b: number },
    ) => {
      const cosR = Math.cos(rotation);
      const sinR = Math.sin(rotation);

      const pt = (i: number) => {
        const a   = (i * Math.PI * 2) / N;
        const n   = sn(Math.cos(a) * 1.2 + nOff, Math.sin(a) * 1.2 + nOff, t * 0.45);
        const dr  = 1 + n * 0.45;
        const lx  = Math.cos(a) * rx * dr;
        const ly  = Math.sin(a) * ry * dr;
        const idx = ((i % N) + N) % N;
        return {
          x: cx + cosR * lx - sinR * ly + g[idx].ox,
          y: cy + sinR * lx + cosR * ly + g[idx].oy,
        };
      };

      ctx.beginPath();
      const p0 = pt(0);
      ctx.moveTo(p0.x, p0.y);
      for (let i = 1; i <= N; i++) {
        const p  = pt(i);
        const pp = pt(i - 1);
        ctx.quadraticCurveTo(pp.x, pp.y, (pp.x + p.x) / 2, (pp.y + p.y) / 2);
      }
      ctx.closePath();

      const ao   = isDark ? [0.72, 0.50, 0.22, 0.07] : [0.58, 0.38, 0.16, 0.05];
      const maxR = Math.max(rx, ry) * 1.1;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
      grad.addColorStop(0,    `rgba(${c.r},${c.g},${c.b},${ao[0]})`);
      grad.addColorStop(0.35, `rgba(${c.r},${c.g},${c.b},${ao[1]})`);
      grad.addColorStop(0.65, `rgba(${c.r},${c.g},${c.b},${ao[2]})`);
      grad.addColorStop(0.85, `rgba(${c.r},${c.g},${c.b},${ao[3]})`);
      grad.addColorStop(1,    `rgba(${c.r},${c.g},${c.b},0)`);
      ctx.fillStyle = grad;
      ctx.fill();
    };

    // ── Animation loop ────────────────────────────────────────────────────────
    const tick = () => {
      const w = canvas.width;
      const h = canvas.height;
      const m = Math.min(w, h);
      const { x: mx, y: my } = mouseRef.current;

      ctx.clearRect(0, 0, w, h);
      t += 0.009;

      ctx.globalCompositeOperation = "screen";

      BLOBS.forEach((b, bi) => {
        const driftX   = sn(b.nx,     b.ny,     t * b.ns + b.np) * 0.13 * w;
        const driftY   = sn(b.nx + 1, b.ny + 1, t * b.ns + b.np) * 0.09 * h;
        const bx       = w * b.bx + driftX;
        const by       = h * b.by + driftY;
        const pulse    = 1 + sn(b.nx + 2, b.ny + 2, t * 0.3) * 0.12;
        const baseR    = m * b.baseR * pulse;
        const rotation = b.rot + t * b.rotSpeed + sn(b.nx + 3, b.ny + 3, t * 0.2) * 0.6;
        const rx       = baseR * b.sx;
        const ry       = baseR;
        const cosR     = Math.cos(rotation);
        const sinR     = Math.sin(rotation);

        for (let i = 0; i < N; i++) {
          const gi  = goo[bi][i];
          const a   = (i * Math.PI * 2) / N;
          const n   = sn(Math.cos(a) * 1.2 + b.nx, Math.sin(a) * 1.2 + b.nx, t * 0.45);
          const dr  = 1 + n * 0.45;
          const lx  = Math.cos(a) * rx * dr;
          const ly  = Math.sin(a) * ry * dr;

          const px  = bx + cosR * lx - sinR * ly;
          const py  = by + sinR * lx + cosR * ly;

          const dx   = px - mx;
          const dy   = py - my;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const t01  = Math.max(0, 1 - dist / DEFORM_R);
          const infl = t01 * t01;

          const pux   = dist > 0.5 ? dx / dist : 0;
          const puy   = dist > 0.5 ? dy / dist : 0;
          const tgtOx = pux * DEFORM_MAX * infl;
          const tgtOy = puy * DEFORM_MAX * infl;

          gi.vx  = gi.vx * RETAIN + (tgtOx - gi.ox) * STIFFNESS;
          gi.vy  = gi.vy * RETAIN + (tgtOy - gi.oy) * STIFFNESS;
          gi.ox += gi.vx;
          gi.oy += gi.vy;
        }

        drawBlob(bx, by, rx, ry, rotation, b.nx, goo[bi], PALETTE[b.ci]);
      });

      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position:      "absolute",
        top:           0,
        left:          0,
        right:         0,
        bottom:        0,
        width:         "100%",
        height:        "100%",
        pointerEvents: "none",
        zIndex:        0,
      }}
    />
  );
}
