import type { ComponentRegistration } from "@/lib/types";
import { ACCENT_PRESETS } from "@/lib/accent";

export const PDS_COLOR_TOKENS_REGISTRATION: ComponentRegistration = {
  id: "pds-color-tokens",
  controls: [
    {
      id:           "accent",
      label:        "Theme",
      type:         "select",
      defaultValue: "chartreuse",
      options:      ACCENT_PRESETS.map((p) => ({ label: p.label, value: p.id })),
    },
    {
      id:           "mode",
      label:        "Mode",
      type:         "select",
      defaultValue: "dark",
      options:      [
        { label: "Dark",  value: "dark"  },
        { label: "Light", value: "light" },
      ],
    },
  ],
  defaultValues: { accent: "chartreuse", mode: "dark" },
  getTokens() { return []; },
};
