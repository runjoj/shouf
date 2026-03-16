"use client";

import { useTheme } from "@/lib/theme";
import { ACCENT_PRESETS } from "@/lib/accent";
import { fireWaterRipple } from "@/lib/waterRipple";

interface AccentPickerProps {
  /** "sm" = 14px (toolbar), "md" = 18px (landing screen) */
  size?: "sm" | "md";
}

export function AccentPicker({ size = "sm" }: AccentPickerProps) {
  const { accentId, setAccent } = useTheme();
  const sz = size === "sm" ? 14 : 18;

  return (
    <div
      style={{
        display:    "flex",
        alignItems: "center",
        gap:        size === "sm" ? "5px" : "8px",
      }}
    >
      {ACCENT_PRESETS.map((preset) => {
        const selected = accentId === preset.id;
        return (
          <button
            key={preset.id}
            onClick={(e) => {
              // Fire the ripple event BEFORE setAccent so the canvas can read
              // --sh-accent while it still holds the previous colour — the
              // "from" value for the wave-carried colour transition.
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
