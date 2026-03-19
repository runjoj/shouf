"use client";

import { useState } from "react";
import type { ComponentControlValues } from "@/lib/types";
import type { ReactNode } from "react";

// ─── Spinner ────────────────────────────────────────────────────────────────

function Spinner({ size }: { size: "sm" | "md" | "lg" }) {
  const dim = { sm: 12, md: 14, lg: 16 }[size];
  return (
    <svg
      width={dim}
      height={dim}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={{ animation: "pds-spin 0.65s linear infinite", flexShrink: 0 }}
    >
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" />
      <path
        d="M8 2a6 6 0 0 1 6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ─── Arrow icon ─────────────────────────────────────────────────────────────

function ArrowIcon({ size }: { size: "sm" | "md" | "lg" }) {
  const dim = { sm: 11, md: 13, lg: 14 }[size];
  return (
    <svg
      width={dim}
      height={dim}
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M2 6h8M7 3l3 3-3 3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── PdsButton ───────────────────────────────────────────────────────────────

export type PdsButtonProps = {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  label?: string;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  iconOnly?: boolean;
  onClick?: () => void;
};

export function PdsButton({
  variant = "primary",
  size = "md",
  label = "Get Started",
  disabled = false,
  loading = false,
  fullWidth = false,
  iconOnly = false,
  onClick,
}: PdsButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const isDisabled = disabled || loading;

  // Resolve background — falls back through hover/active states
  const bg = (() => {
    if (isDisabled) return `var(--shouf-btn-${variant}-bg)`;
    if (pressed)    return `var(--shouf-btn-${variant}-bg-active, var(--shouf-btn-${variant}-bg-hover, var(--shouf-btn-${variant}-bg)))`;
    if (hovered)    return `var(--shouf-btn-${variant}-bg-hover, var(--shouf-btn-${variant}-bg))`;
    return                  `var(--shouf-btn-${variant}-bg)`;
  })();

  // Resolve border color — secondary gets a brighter border on hover
  const borderColor = (() => {
    if (!isDisabled && hovered)
      return `var(--shouf-btn-${variant}-border-hover, var(--shouf-btn-${variant}-border))`;
    return `var(--shouf-btn-${variant}-border)`;
  })();

  // Resolve text color — ghost gets brighter text on hover
  const color = (() => {
    if (variant === "ghost" && !isDisabled && hovered)
      return "var(--shouf-btn-ghost-color-hover)";
    return `var(--shouf-btn-${variant}-color)`;
  })();

  // Resolve shadow
  const shadow = (() => {
    if (isDisabled) return "none";
    if (hovered)    return `var(--shouf-btn-${variant}-shadow-hover, var(--shouf-btn-${variant}-shadow))`;
    return                  `var(--shouf-btn-${variant}-shadow)`;
  })();

  const style: React.CSSProperties = {
    display:         "inline-flex",
    alignItems:      "center",
    justifyContent:  "center",
    height:          `var(--shouf-btn-h-${size})`,
    width:           iconOnly ? `var(--shouf-btn-h-${size})` : fullWidth ? "100%" : "auto",
    maxWidth:        fullWidth && !iconOnly ? "320px" : undefined,
    paddingLeft:     iconOnly ? "0" : `var(--shouf-btn-px-${size})`,
    paddingRight:    iconOnly ? "0" : `var(--shouf-btn-px-${size})`,
    gap:             iconOnly ? "0" : `var(--shouf-btn-gap-${size})`,
    fontSize:        `var(--shouf-btn-font-${size})`,
    fontWeight:      500,
    letterSpacing:   "var(--shouf-btn-letter-spacing)",
    lineHeight:      1,
    fontFamily:      "inherit",
    borderRadius:    `var(--shouf-btn-radius-${size})`,
    backgroundColor: bg,
    color,
    border:          `1px solid ${borderColor}`,
    boxShadow:       shadow,
    opacity:         disabled && !loading ? 0.42 : 1,
    cursor:          disabled ? "not-allowed" : loading ? "progress" : "pointer",
    transition:      [
      "background-color 130ms ease",
      "box-shadow 130ms ease",
      "border-color 130ms ease",
      "color 130ms ease",
      "opacity 150ms ease",
    ].join(", "),
    userSelect:      "none",
    outline:         "none",
    flexShrink:      0,
    whiteSpace:      "nowrap",
  };

  // Button content
  const content = (() => {
    if (loading) {
      return (
        <>
          <Spinner size={size} />
          {!iconOnly && (
            <span style={{ opacity: 0.75, fontSize: "inherit" }}>Loading…</span>
          )}
        </>
      );
    }
    if (iconOnly) {
      return <ArrowIcon size={size} />;
    }
    return (
      <>
        <span style={{ fontSize: "inherit" }}>{label}</span>
        <ArrowIcon size={size} />
      </>
    );
  })();

  return (
    <button
      style={style}
      disabled={disabled}
      aria-disabled={isDisabled}
      aria-busy={loading}
      onClick={!isDisabled ? onClick : undefined}
      onMouseEnter={() => !isDisabled && setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => !isDisabled && setPressed(true)}
      onMouseUp={() => setPressed(false)}
    >
      {content}
    </button>
  );
}

// ─── Renderer function (used by registry → ComponentRenderer) ────────────────

export function PdsButtonRenderer(values: ComponentControlValues): ReactNode {
  return (
    <PdsButton
      variant={values.variant  as PdsButtonProps["variant"]}
      size={values.size        as PdsButtonProps["size"]}
      label={String(values.label ?? "Get Started")}
      disabled={Boolean(values.disabled)}
      loading={Boolean(values.loading)}
      fullWidth={Boolean(values.fullWidth)}
      iconOnly={Boolean(values.iconOnly)}
    />
  );
}
