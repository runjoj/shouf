"use client";

// ─── PdsToggle ─────────────────────────────────────────────────────────────
// A design-system toggle switch component.
// Intentionally uses only var(--sh-*) tokens so it adapts to both
// light and dark mode automatically, and demonstrates the portfolio
// using its own components in the shell UI.

interface PdsToggleProps {
  /** Whether the toggle is in the on/checked state */
  checked: boolean;
  /** Called whenever the user clicks the toggle */
  onChange: (checked: boolean) => void;
  /** Size variant — sm (28×16) or md (36×20) */
  size?: "sm" | "md";
  /** Accessible label for screen readers */
  label?: string;
}

export function PdsToggle({
  checked,
  onChange,
  size = "md",
  label,
}: PdsToggleProps) {
  const sm = size === "sm";
  const trackW  = sm ? 28 : 36;
  const trackH  = sm ? 16 : 20;
  const knobSz  = sm ? 12 : 16;
  // knob travel: track width minus knob size minus the equal padding on each side
  const travel  = trackW - knobSz - (trackH - knobSz);

  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      style={{
        position:    "relative",
        display:     "inline-flex",
        alignItems:  "center",
        width:       trackW,
        height:      trackH,
        borderRadius: trackH,
        background:  checked ? "var(--sh-accent)" : "var(--sh-switch-off)",
        border:      "none",
        cursor:      "pointer",
        flexShrink:  0,
        padding:     0,
        transition:  "background 0.18s ease",
        outline:     "none",
      }}
      onFocus={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 0 0 3px var(--sh-accent-ring)";
      }}
      onBlur={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      {/* Knob */}
      <span
        style={{
          position:     "absolute",
          top:          (trackH - knobSz) / 2,
          left:         (trackH - knobSz) / 2,
          width:        knobSz,
          height:       knobSz,
          borderRadius: "50%",
          background:   "rgba(255, 255, 255, 0.95)",
          boxShadow:
            "0 1px 3px rgba(0, 0, 0, 0.30), 0 0 0 0.5px rgba(0,0,0,0.08)",
          transition: "transform 0.18s ease",
          transform:  checked ? `translateX(${travel}px)` : "translateX(0)",
        }}
      />
    </button>
  );
}
