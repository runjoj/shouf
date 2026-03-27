"use client";

import { useTheme } from "@/lib/theme";
import { ACCENT_PRESETS } from "@/lib/accent";
import { fireWaterRipple } from "@/lib/waterRipple";

interface AccentPickerProps {
  /** "sm" = 14px (toolbar), "md" = 18px (landing screen), "lg" = 20px (welcome screen, with ripple) */
  size?: "sm" | "md" | "lg";
}

export function AccentPicker({ size = "sm" }: AccentPickerProps) {
  const { accentId, setAccent } = useTheme();
  const sz  = size === "sm" ? 14 : size === "lg" ? 20 : 18;
  const gap = size === "sm" ? "5px" : "8px";

  return (
    <div
      style={{
        display:    "flex",
        alignItems: "center",
        gap,
      }}
    >
      {ACCENT_PRESETS.map((preset) => {
        const selected = accentId === preset.id;
        return (
          <button
            key={preset.id}
            onClick={(e) => {
              // Fire the ripple event BEFORE setAccent so the canvas can read
              // --shouf-accent while it still holds the previous colour — the
              // "from" value for the wave-carried colour transition.
              // sm = toolbar only — ripple is distracting during the intro screen.
              if (size === "sm") {
                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                fireWaterRipple(
                  rect.left + rect.width  / 2,
                  rect.top  + rect.height / 2,
                  preset.hex,
                );
              }
              setAccent(preset.id);
            }}
            title={preset.label}
            style={{
              width:          sz + 8,
              height:         sz + 8,
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              background:     "none",
              border:         "none",
              padding:        0,
              cursor:         "pointer",
              borderRadius:   "50%",
              flexShrink:     0,
            }}
          >
            <span
              style={{
                display:         "block",
                width:           sz,
                height:          sz,
                borderRadius:    "50%",
                backgroundColor: preset.hex,
                outline:         selected ? `2px solid ${preset.hex}` : "2px solid transparent",
                outlineOffset:   "2.5px",
                transition:      "outline 120ms ease, transform 120ms ease",
                transform:       selected ? "scale(1.1)" : "scale(1)",
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
