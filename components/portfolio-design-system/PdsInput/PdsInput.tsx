"use client";

// ─── PdsInput ─────────────────────────────────────────────────────────────────
// Search / text input component — matches the visual DNA of the portfolio's own
// left-panel search bar. Both the shell search and the canvas demo render this
// exact component, so the design spec is always in sync.
//
// The component is forwardRef-capable so the shell can focus it programmatically
// (e.g. ⌘K keyboard shortcut in LeftPanel).
//
// Expressive craft moment: switching between states reveals the token system
// in action. The background lifts from muted #F0F0F0 to white, the border
// shifts to the live accent color, and a focus ring blooms outward — all via
// CSS transitions. The ring uses var(--shouf-accent-ring) so it reacts to the
// accent picker in real time, demonstrating that the token system is runtime-
// capable, not static.

import { useState, forwardRef } from "react";
import type { ComponentControlValues } from "@/lib/types";
import type { ReactNode } from "react";

// ─── Inline SVG icons ─────────────────────────────────────────────────────────

function SearchIcon({ size }: { size: "sm" | "md" | "lg" }) {
  const dim = { sm: 12, md: 13, lg: 15 }[size];
  return (
    <svg
      width={dim}
      height={dim}
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0, color: "var(--shouf-inp-placeholder)" }}
    >
      <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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
      style={{ flexShrink: 0, color: "var(--shouf-inp-error-color)" }}
    >
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 5v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="11.5" r="0.75" fill="currentColor" />
    </svg>
  );
}

// ─── Size maps ────────────────────────────────────────────────────────────────

const SIZE_H    = { sm: "var(--shouf-inp-h-sm)",     md: "var(--shouf-inp-h-md)",     lg: "var(--shouf-inp-h-lg)"     };
const SIZE_PX   = { sm: "var(--shouf-inp-px-sm)",    md: "var(--shouf-inp-px-md)",    lg: "var(--shouf-inp-px-lg)"    };
const SIZE_FONT = { sm: "var(--shouf-inp-font-sm)",   md: "var(--shouf-inp-font-md)",   lg: "var(--shouf-inp-font-lg)"   };
const SIZE_RAD  = { sm: "var(--shouf-inp-radius-sm)", md: "var(--shouf-inp-radius-md)", lg: "var(--shouf-inp-radius-lg)" };
const LABEL_FONT = { sm: "11px", md: "12px", lg: "13px" };
const LABEL_GAP  = { sm: "4px",  md: "5px",  lg: "6px"  };
// kbd badge font scales with input size
const KBD_FONT   = { sm: "10.5px", md: "12px", lg: "13px" };
const KBD_PX     = { sm: "4px",  md: "5px",  lg: "6px"  };

// ─── Helper text per state ────────────────────────────────────────────────────

const HELPER_TEXT: Record<string, string> = {
  default:  "Type to filter components by name or category.",
  focused:  "Type to filter components by name or category.",
  error:    "No results found. Try a different search term.",
  disabled: "Search is currently unavailable.",
};

// ─── PdsInput ─────────────────────────────────────────────────────────────────

export type PdsInputProps = {
  size?:        "sm" | "md" | "lg";
  state?:       "default" | "focused" | "error" | "disabled";
  placeholder?: string;
  withLabel?:   boolean;
  withIcon?:    boolean;
  withHelper?:  boolean;
  // kbd: optional keyboard shortcut badge shown on the right (e.g. "⌘K")
  kbd?:         string;
  // fullWidth: stretches to 100% of the parent instead of the fixed 280px demo width
  fullWidth?:   boolean;
  // Controlled value / change / keydown — used when PdsInput is embedded in the shell
  value?:       string;
  onChange?:    (value: string) => void;
  onKeyDown?:   (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export const PdsInput = forwardRef<HTMLInputElement, PdsInputProps>(
  function PdsInput(
    {
      size        = "md",
      state       = "default",
      placeholder = "Search components…",
      withLabel   = false,
      withIcon    = true,
      withHelper  = false,
      kbd         = "",
      fullWidth   = false,
      value,
      onChange,
      onKeyDown,
    },
    ref,
  ) {
    // Track real DOM focus so the component stays interactive even when
    // state prop is "default" (as it is in the shell's left panel).
    const [isFocused, setIsFocused] = useState(false);

    const isDisabled  = state === "disabled";
    const showError   = state === "error";
    // Show focused ring if: state is "focused" OR user has actually focused the input
    const showFocused = state === "focused" || (state === "default" && isFocused);

    // ── Resolve current visual state ────────────────────────────────────────
    const bg = showError   ? "var(--shouf-inp-bg-error)"
             : isDisabled  ? "var(--shouf-inp-bg)"
             : showFocused ? "var(--shouf-inp-bg-focus)"
             : "var(--shouf-inp-bg)";

    const borderColor = showError   ? "var(--shouf-inp-border-error)"
                      : showFocused ? "var(--shouf-inp-border-focus)"
                      : "var(--shouf-inp-border)";

    // Ring implemented as box-shadow — transitions smoothly between states
    const ring = showError   ? "0 0 0 3px var(--shouf-inp-ring-error)"
               : showFocused ? "0 0 0 3px var(--shouf-inp-ring-focus)"
               : "none";

    const textColor = isDisabled ? "var(--shouf-inp-placeholder)" : "var(--shouf-inp-color)";

    // ── Layout ──────────────────────────────────────────────────────────────

    const wrapperStyle: React.CSSProperties = {
      display:       fullWidth ? "flex" : "inline-flex",
      flexDirection: "column",
      gap:           LABEL_GAP[size],
      width:         fullWidth ? "100%" : "280px",
      minWidth:      fullWidth ? undefined : "180px",
      maxWidth:      "100%",
    };

    const inputRowStyle: React.CSSProperties = {
      display:         "flex",
      alignItems:      "center",
      gap:             "7px",
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
      flex:       1,
      minWidth:   0,
      height:     "100%",
      background: "transparent",
      border:     "none",
      outline:    "none",
      fontSize:   SIZE_FONT[size],
      fontFamily: "inherit",
      color:      textColor,
      cursor:     isDisabled ? "not-allowed" : "text",
      lineHeight: 1,
    };

    const labelStyle: React.CSSProperties = {
      fontSize:   LABEL_FONT[size],
      fontWeight: 500,
      color:      "var(--shouf-inp-label-color)",
      userSelect: "none",
      lineHeight: 1,
    };

    const helperStyle: React.CSSProperties = {
      fontSize:   "11.5px",
      color:      showError ? "var(--shouf-inp-error-color)" : "var(--shouf-inp-helper-color)",
      lineHeight: 1.4,
      marginTop:  "1px",
    };

    // kbd badge — shown when a shortcut is provided and the input is not in error
    const kbdStyle: React.CSSProperties = {
      display:         "inline-flex",
      alignItems:      "center",
      flexShrink:      0,
      fontSize:        KBD_FONT[size],
      fontFamily:      "inherit",
      lineHeight:      1,
      color:           "var(--shouf-inp-color)",
      opacity:         0.5,
      backgroundColor: "var(--shouf-border)",
      border:          "1px solid var(--shouf-border)",
      padding:         `2px ${KBD_PX[size]}`,
      borderRadius:    "4px",
      fontWeight:      500,
      userSelect:      "none",
    };

    return (
      <div style={wrapperStyle}>
        {withLabel && (
          <label style={labelStyle}>Search</label>
        )}

        <div style={inputRowStyle}>
          {withIcon && <SearchIcon size={size} />}

          <input
            ref={ref}
            type="search"
            // pds-inp class hooks the global ::placeholder rule for token-based color
            className="pds-inp"
            placeholder={placeholder}
            disabled={isDisabled}
            style={inputStyle}
            // Controlled mode when value/onChange are provided; uncontrolled otherwise
            {...(value !== undefined ? { value } : {})}
            onChange={onChange ? (e) => onChange(e.target.value) : undefined}
            onKeyDown={onKeyDown}
            onFocus={() => !isDisabled && setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            aria-label={withLabel ? undefined : "Search"}
            aria-invalid={showError}
            aria-disabled={isDisabled}
          />

          {/* Right-side slot: error icon takes priority over kbd badge */}
          {showError ? (
            <ErrorIcon size={size} />
          ) : kbd ? (
            <span style={kbdStyle}>{kbd}</span>
          ) : null}
        </div>

        {withHelper && (
          <span style={helperStyle}>{HELPER_TEXT[state]}</span>
        )}
      </div>
    );
  },
);

// ─── Renderer function (used by registry → ComponentRenderer) ────────────────

export function PdsInputRenderer(values: ComponentControlValues): ReactNode {
  return (
    <PdsInput
      size={values.size           as PdsInputProps["size"]}
      state={values.state         as PdsInputProps["state"]}
      placeholder={String(values.placeholder ?? "Search components…")}
      withLabel={Boolean(values.withLabel)}
      withIcon={Boolean(values.withIcon)}
      withHelper={Boolean(values.withHelper)}
      kbd={String(values.kbd ?? "")}
    />
  );
}
