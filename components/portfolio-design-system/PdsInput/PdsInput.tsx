"use client";

// ─── PdsInput ─────────────────────────────────────────────────────────────────
// Text input component — matches the visual DNA of the portfolio's own search
// bar (same --pds-inp-* tokens used in the shell input).
//
// Expressive craft moment: switching between states reveals the token system
// in action. The background lifts from muted #F0F0F0 to white, the border
// shifts to the live accent color, and a focus ring blooms outward — all via
// CSS transitions. The ring uses var(--sh-accent-ring) so it reacts to the
// accent picker in real time, demonstrating that the token system is runtime-
// capable, not static.
//
// The `state` prop drives the visual state for the demo (default/focused/error/
// disabled). Actual keyboard focus on the real <input> also shows the focused
// style, so the component behaves correctly whether the state is set via the
// controls panel or by the user clicking into it.

import { useState } from "react";
import type { ComponentControlValues } from "@/lib/types";
import type { ReactNode } from "react";

// ─── Inline SVG icons ─────────────────────────────────────────────────────────

function MailIcon({ size }: { size: "sm" | "md" | "lg" }) {
  const dim = { sm: 12, md: 14, lg: 16 }[size];
  return (
    <svg
      width={dim}
      height={dim}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0, color: "var(--pds-inp-placeholder)" }}
    >
      <rect x="2" y="4" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2 6l6 4 6-4" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function ErrorIcon({ size }: { size: "sm" | "md" | "lg" }) {
  const dim = { sm: 12, md: 14, lg: 16 }[size];
  return (
    <svg
      width={dim}
      height={dim}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0, color: "var(--pds-inp-error-color)" }}
    >
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 5v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="11.5" r="0.75" fill="currentColor" />
    </svg>
  );
}

// ─── Size maps ────────────────────────────────────────────────────────────────

const SIZE_H    = { sm: "var(--pds-inp-h-sm)",    md: "var(--pds-inp-h-md)",    lg: "var(--pds-inp-h-lg)"    };
const SIZE_PX   = { sm: "var(--pds-inp-px-sm)",   md: "var(--pds-inp-px-md)",   lg: "var(--pds-inp-px-lg)"   };
const SIZE_FONT = { sm: "var(--pds-inp-font-sm)",  md: "var(--pds-inp-font-md)",  lg: "var(--pds-inp-font-lg)"  };
const SIZE_RAD  = { sm: "var(--pds-inp-radius-sm)",md: "var(--pds-inp-radius-md)",lg: "var(--pds-inp-radius-lg)"};
const LABEL_FONT = { sm: "11px",  md: "12px",  lg: "13px" };
const LABEL_GAP  = { sm: "4px",   md: "5px",   lg: "6px"  };

// ─── Helper text per state ────────────────────────────────────────────────────

const HELPER_TEXT: Record<string, string> = {
  default:  "We'll never share your email with anyone.",
  focused:  "We'll never share your email with anyone.",
  error:    "Please enter a valid email address.",
  disabled: "This field is currently unavailable.",
};

// ─── PdsInput ─────────────────────────────────────────────────────────────────

export type PdsInputProps = {
  size?:        "sm" | "md" | "lg";
  state?:       "default" | "focused" | "error" | "disabled";
  placeholder?: string;
  withLabel?:   boolean;
  withIcon?:    boolean;
  withHelper?:  boolean;
};

export function PdsInput({
  size        = "md",
  state       = "default",
  placeholder = "you@example.com",
  withLabel   = true,
  withIcon    = false,
  withHelper  = false,
}: PdsInputProps) {
  // Track real DOM focus so the component stays interactive even when
  // the state prop is set to "default".
  const [isFocused, setIsFocused] = useState(false);

  const isDisabled   = state === "disabled";
  const showError    = state === "error";
  // Show focused ring if: state is "focused" OR user has actually focused the input
  const showFocused  = state === "focused" || (state === "default" && isFocused);

  // ── Resolve current visual state ──────────────────────────────────────────
  const bg = showError   ? "var(--pds-inp-bg-error)"
           : isDisabled  ? "var(--pds-inp-bg)"
           : showFocused ? "var(--pds-inp-bg-focus)"
           : "var(--pds-inp-bg)";

  const borderColor = showError   ? "var(--pds-inp-border-error)"
                    : showFocused ? "var(--pds-inp-border-focus)"
                    : "var(--pds-inp-border)";

  // Ring implemented as box-shadow — transitions smoothly between states
  const ring = showError   ? "0 0 0 3px var(--pds-inp-ring-error)"
             : showFocused ? "0 0 0 3px var(--pds-inp-ring-focus)"
             : "none";

  const textColor = isDisabled ? "var(--pds-inp-placeholder)" : "var(--pds-inp-color)";

  // ── Layout ────────────────────────────────────────────────────────────────

  const wrapperStyle: React.CSSProperties = {
    display:       "inline-flex",
    flexDirection: "column",
    gap:           LABEL_GAP[size],
    width:         "280px",
    minWidth:      "180px",
    maxWidth:      "100%",
  };

  const inputRowStyle: React.CSSProperties = {
    display:         "flex",
    alignItems:      "center",
    gap:             "8px",
    height:          SIZE_H[size],
    paddingLeft:     SIZE_PX[size],
    paddingRight:    SIZE_PX[size],
    backgroundColor: bg,
    border:          `1px solid ${borderColor}`,
    borderRadius:    SIZE_RAD[size],
    boxShadow:       ring,
    opacity:         isDisabled ? 0.5 : 1,
    cursor:          isDisabled ? "not-allowed" : "text",
    transition: [
      "background-color 180ms ease",
      "border-color 150ms ease",
      "box-shadow 200ms ease",
    ].join(", "),
  };

  const inputStyle: React.CSSProperties = {
    flex:            1,
    minWidth:        0,
    height:          "100%",
    background:      "transparent",
    border:          "none",
    outline:         "none",
    fontSize:        SIZE_FONT[size],
    fontFamily:      "inherit",
    color:           textColor,
    cursor:          isDisabled ? "not-allowed" : "text",
    lineHeight:      1,
  };

  const labelStyle: React.CSSProperties = {
    fontSize:    LABEL_FONT[size],
    fontWeight:  500,
    color:       "var(--pds-inp-label-color)",
    userSelect:  "none",
    lineHeight:  1,
  };

  const helperStyle: React.CSSProperties = {
    fontSize:  "11.5px",
    color:     showError ? "var(--pds-inp-error-color)" : "var(--pds-inp-helper-color)",
    lineHeight: 1.4,
    marginTop: "1px",
  };

  return (
    <div style={wrapperStyle}>
      {withLabel && (
        <label style={labelStyle}>
          Email address
        </label>
      )}

      <div style={inputRowStyle}>
        {/* Prefix icon — shows before the text */}
        {withIcon && <MailIcon size={size} />}

        <input
          type="text"
          // pds-inp class hooks the global ::placeholder rule for token-based color
          className="pds-inp"
          placeholder={placeholder}
          disabled={isDisabled}
          style={inputStyle}
          onFocus={() => !isDisabled && setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-invalid={showError}
          aria-disabled={isDisabled}
        />

        {/* Error indicator icon — appears at the right edge when state=error */}
        {showError && <ErrorIcon size={size} />}
      </div>

      {withHelper && (
        <span style={helperStyle}>
          {HELPER_TEXT[state]}
        </span>
      )}
    </div>
  );
}

// ─── Renderer function (used by registry → ComponentRenderer) ────────────────

export function PdsInputRenderer(values: ComponentControlValues): ReactNode {
  return (
    <PdsInput
      size={values.size               as PdsInputProps["size"]}
      state={values.state             as PdsInputProps["state"]}
      placeholder={String(values.placeholder ?? "you@example.com")}
      withLabel={Boolean(values.withLabel)}
      withIcon={Boolean(values.withIcon)}
      withHelper={Boolean(values.withHelper)}
    />
  );
}
