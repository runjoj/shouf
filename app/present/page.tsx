"use client";

// ─── Interview Presentation ──────────────────────────────────────────────────
// Standalone slide deck for a live design interview. Two case studies: Claude
// MCP Connector Components (lead) + Responsive Navigation (BambooHR). Paper
// ground, near-black ink, one quiet accent — restrained by design so the
// content, not the deck, does the talking.
//
// Keyboard nav: ← → arrows, spacebar, Home/End. Esc exits back to the
// portfolio. Content and images are sourced from this repo's public/ folder;
// MCP screenshots are labeled placeholders until dropped in (see
// components/presentation/ImageSlot.tsx).

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { SLIDES } from "@/components/presentation/content";
import { renderSlide } from "@/components/presentation/slides";
import { ACCENT, HAIRLINE, INK_FAINT, INK_SOFT, MONO, PAPER } from "@/components/presentation/tokens";

export default function PresentPage() {
  const router = useRouter();
  const { launch } = useAppStore();
  const [idx,       setIdx]       = useState(0);
  const [direction, setDirection] = useState(1);
  const [showHint,  setShowHint]  = useState(true);
  const hasNavigated = useRef(false);

  const total    = SLIDES.length;
  const progress = (idx / (total - 1)) * 100;

  const go = useCallback((next: number) => {
    if (next < 0 || next >= total) return;
    setDirection(next > idx ? 1 : -1);
    setIdx(next);
    if (!hasNavigated.current) {
      hasNavigated.current = true;
      setShowHint(false);
    }
  }, [idx, total]);

  // Keyboard navigation
  useEffect(() => {
    function exitToPortfolio() {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => { /* ignore */ });
      }
      // Skip the intro/typing landing when returning to the portfolio.
      launch();
      router.push("/");
    }

    function onKey(e: KeyboardEvent) {
      // Esc → exit presentation. Primary, discoverable exit so anyone who
      // lands on /present directly can leave without knowing a chord.
      if (e.key === "Escape") {
        e.preventDefault();
        exitToPortfolio();
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault();
        exitToPortfolio();
        return;
      }
      if (["ArrowRight", "ArrowDown", " "].includes(e.key)) {
        e.preventDefault();
        go(idx + 1);
      } else if (["ArrowLeft", "ArrowUp"].includes(e.key)) {
        e.preventDefault();
        go(idx - 1);
      } else if (e.key === "Home") {
        go(0);
      } else if (e.key === "End") {
        go(total - 1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, idx, total, router, launch]);

  // Hide hint after 5s regardless
  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 5000);
    return () => clearTimeout(t);
  }, []);

  // Auto-fullscreen: if not already fullscreen (e.g. page opened directly),
  // request it on the first user interaction — browsers require a gesture.
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.fullscreenElement) return;
    function enter() {
      const el = document.documentElement;
      if (!document.fullscreenElement && el.requestFullscreen) {
        el.requestFullscreen().catch(() => { /* ignore */ });
      }
      window.removeEventListener("keydown",   enter);
      window.removeEventListener("pointerdown", enter);
    }
    window.addEventListener("keydown",   enter, { once: true });
    window.addEventListener("pointerdown", enter, { once: true });
    return () => {
      window.removeEventListener("keydown",   enter);
      window.removeEventListener("pointerdown", enter);
    };
  }, []);

  // Restrained crossfade with a whisper of vertical drift — no flashy motion.
  const variants = {
    enter:  (dir: number) => ({ opacity: 0, y: dir > 0 ? 10 : -10 }),
    center: { opacity: 1, y: 0 },
    exit:   (dir: number) => ({ opacity: 0, y: dir > 0 ? -10 : 10 }),
  };

  return (
    <div
      style={{
        position:      "fixed",
        inset:         0,
        background:    PAPER,
        overflow:      "hidden",
        display:       "flex",
        flexDirection: "column",
        colorScheme:   "light",
      }}
    >
      {/* Progress — top hairline, quiet accent fill */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: HAIRLINE, zIndex: 10 }}>
        <div style={{ height: "100%", width: `${progress}%`, background: ACCENT, transition: "width 0.45s cubic-bezier(0.25, 0, 0, 1)" }} />
      </div>

      {/* Slide content */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={idx}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.32, ease: [0.25, 0, 0, 1] }}
            style={{ position: "absolute", inset: 0 }}
          >
            {renderSlide(SLIDES[idx])}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          padding:        "0 28px",
          height:         "50px",
          borderTop:      `1px solid ${HAIRLINE}`,
          flexShrink:     0,
          background:     PAPER,
          zIndex:         10,
        }}
      >
        {/* Slide counter — nudged right so it clears the Next.js dev overlay badge */}
        <div style={{ fontFamily: MONO, fontSize: "14px", color: INK_SOFT, letterSpacing: "0.04em", minWidth: "80px", marginLeft: "60px" }}>
          {String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </div>

        {/* Dot navigation */}
        <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
          {SLIDES.map((s, i) => {
            const isCurrent = i === idx;
            const isMajor = s.type === "divider" || s.type === "title" || s.type === "close";
            return (
              <button
                key={i}
                onClick={() => go(i)}
                title={`Slide ${i + 1}`}
                style={{
                  all:          "unset",
                  cursor:       "pointer",
                  width:        isCurrent ? "18px" : "5px",
                  height:       "5px",
                  borderRadius: "2.5px",
                  background:   isCurrent ? ACCENT : isMajor ? "#C9C2AE" : HAIRLINE,
                  transition:   "all 0.2s ease",
                  flexShrink:   0,
                }}
              />
            );
          })}
        </div>

        {/* Arrow buttons */}
        <div style={{ display: "flex", gap: "4px", minWidth: "60px", justifyContent: "flex-end" }}>
          {[
            { label: "←", delta: -1, disabled: idx === 0 },
            { label: "→", delta:  1, disabled: idx === total - 1 },
          ].map(({ label, delta, disabled }) => (
            <button
              key={label}
              onClick={() => go(idx + delta)}
              disabled={disabled}
              style={{
                all:          "unset",
                cursor:       disabled ? "default" : "pointer",
                fontFamily:   MONO,
                fontSize:     "18px",
                color:        disabled ? "#C9C2AE" : INK_SOFT,
                padding:      "6px 12px",
                transition:   "color 0.15s",
                borderRadius: "4px",
              }}
              onMouseEnter={e => { if (!disabled) (e.currentTarget as HTMLElement).style.color = ACCENT; }}
              onMouseLeave={e => { if (!disabled) (e.currentTarget as HTMLElement).style.color = INK_SOFT; }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Keyboard hint */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              position:      "fixed",
              bottom:        "70px",
              left:          "50%",
              transform:     "translateX(-50%)",
              fontFamily:    MONO,
              fontSize:      "14px",
              color:         INK_SOFT,
              letterSpacing: "0.04em",
              pointerEvents: "none",
              zIndex:        20,
              whiteSpace:    "nowrap",
            }}
          >
            &larr; &rarr; arrow keys to navigate
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent exit hint — small, quiet, top-right */}
      <div
        style={{
          position:      "fixed",
          top:           "14px",
          right:         "18px",
          fontFamily:    MONO,
          fontSize:      "11px",
          color:         INK_FAINT,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          pointerEvents: "none",
          zIndex:        20,
          userSelect:    "none",
        }}
      >
        Esc to exit
      </div>
    </div>
  );
}
