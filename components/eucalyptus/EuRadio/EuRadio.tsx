"use client";

import { useState, useEffect } from "react";
import type { ComponentControlValues } from "@/lib/types";
import type { ReactNode } from "react";
import { useTheme } from "@/lib/theme";

// ─── Color palettes ────────────────────────────────────────────────────────
// Light and dark variants match --eu-radio-* tokens in globals.css.

const LIGHT = {
  selected: {
    border: "#052942",
    bg:     "rgba(21, 89, 136, 0.12)",
    text:   "#052942",
    dot:    "#052942",
  },
  unselected: {
    border: "#D1D5DB",
    bg:     "#FFFFFF",
    text:   "#525151",
    dot:    "#D1D5DB",
  },
} as const;

const DARK = {
  selected: {
    border: "#FFFFFF",
    bg:     "#FFFFFF",
    text:   "#052942",
    dot:    "#052942",
  },
  unselected: {
    border: "#7A8494",
    bg:     "#26292F",
    text:   "#DBE4F2",
    dot:    "#7A8494",
  },
} as const;

// ─── Radio indicator SVG ───────────────────────────────────────────────────

function RadioIndicator({ checked, color, size = 20 }: { checked: boolean; color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="9" stroke={color} strokeWidth={checked ? 2 : 1.5} />
      {checked && <circle cx="10" cy="10" r="5" fill={color} />}
    </svg>
  );
}

// ─── EuRadio ────────────────────────────────────────────────────────────────

export function EuRadio({ selected = true }: { selected?: boolean }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  const palette = theme === "dark" ? DARK : LIGHT;
  const colors = selected ? palette.selected : palette.unselected;

  return (
    <div
      className="eu-scope"
      style={{
        display: "flex",
        alignItems: "flex-start",
        // Expressive craft moment: the radio smoothly transitions between
        // selected/unselected when toggled from the controls bar, letting
        // the viewer see the state change as a design decision, not a jump cut.
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(5px)",
        transition: "opacity 200ms ease, transform 200ms ease",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          minWidth: "320px",
          padding: "14px 16px",
          backgroundColor: colors.bg,
          border: `2px solid ${colors.border}`,
          borderRadius: "3px",
          fontFamily: "inherit",
          transition: "background-color 180ms ease, border-color 180ms ease",
        }}
      >
        <span
          style={{
            fontSize: "16px",
            fontWeight: 400,
            color: colors.text,
            lineHeight: 1.3,
            transition: "color 180ms ease",
          }}
        >
          Username &amp; password
        </span>

        <span style={{ flexShrink: 0, display: "flex" }}>
          <RadioIndicator checked={selected} color={colors.dot} />
        </span>
      </div>
    </div>
  );
}

// ─── Renderer (registry → ComponentRenderer) ────────────────────────────────

export function EuRadioRenderer(values: ComponentControlValues): ReactNode {
  const sel = values.selected;
  const isSelected = sel === true || sel === "true";
  return <EuRadio selected={isSelected} />;
}
