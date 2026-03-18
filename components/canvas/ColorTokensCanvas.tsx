"use client";

import { useState, useEffect, useCallback } from "react";
import { ACCENT_PRESETS } from "@/lib/accent";
import { useTheme } from "@/lib/theme";
import { useAppStore } from "@/lib/store";


// ─── Token group definitions ──────────────────────────────────────────────────

const SURFACE_TOKENS = [
  { varName: "--sh-bg",        desc: "App background",  hasBorder: true },
  { varName: "--sh-canvas",    desc: "Center canvas",   hasBorder: true },
  { varName: "--sh-panel",     desc: "Side panels",     hasBorder: true },
  { varName: "--sh-panel-alt", desc: "Nested surfaces", hasBorder: true },
];

const BORDER_TOKENS = [
  { varName: "--sh-border",     desc: "Default border",  hasBorder: true },
  { varName: "--sh-border-sub", desc: "Hairline divider", hasBorder: true },
];

const TEXT_TOKENS = [
  { varName: "--sh-text",       desc: "Headings & body",  hasBorder: false },
  { varName: "--sh-text-muted", desc: "Secondary labels", hasBorder: false },
  { varName: "--sh-text-faint", desc: "Placeholders",     hasBorder: false },
];

const ACCENT_PRIMARY_TOKENS = [
  { varName: "--sh-accent",   desc: "Primary brand" },
  { varName: "--sh-accent-h", desc: "Hover state"   },
  { varName: "--sh-accent-a", desc: "Active state"  },
];

const ACCENT_SECONDARY_TOKENS = [
  { varName: "--sh-accent-rose", desc: "Rose secondary" },
  { varName: "--sh-accent-blue", desc: "Blue secondary" },
  { varName: "--sh-accent-sage", desc: "Sage secondary" },
];

// ─── CSS var reader ───────────────────────────────────────────────────────────

function readCSSVar(name: string): string {
  if (typeof window === "undefined") return "";
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
      <span
        style={{
          fontSize:      "10px",
          fontFamily:    "var(--font-mono)",
          letterSpacing: "0.14em",
          color:         "var(--sh-text-faint)",
          textTransform: "uppercase",
          flexShrink:    0,
          userSelect:    "none",
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1, height: "1px", backgroundColor: "var(--sh-border-sub)" }} />
    </div>
  );
}

// ─── Color swatch — display only, no ripple ───────────────────────────────────
// Clicking token swatches does nothing visually; they are reference tiles only.

function ColorSwatch({
  varName,
  desc,
  hex,
  hasBorder,
}: {
  varName:   string;
  desc:      string;
  hex:       string;
  hasBorder?: boolean;
}) {
  const [hov, setHov] = useState(false);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: "10px", flexShrink: 0 }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div
        style={{
          width:           "80px",
          height:          "64px",
          borderRadius:    "10px",
          backgroundColor: `var(${varName})`,
          border:          hasBorder ? "1px solid var(--sh-border)" : undefined,
          transform:       hov ? "scale(1.06) translateY(-3px)" : "scale(1) translateY(0)",
          boxShadow:       hov ? "0 8px 24px rgba(0,0,0,0.13)" : "0 1px 4px rgba(0,0,0,0.06)",
          transition:      "transform 160ms ease, box-shadow 160ms ease",
          cursor:          "default",
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
        <code
          style={{
            fontSize:   "10px",
            fontFamily: "var(--font-mono)",
            color:      "var(--sh-text-muted)",
            lineHeight: 1.3,
          }}
        >
          {varName}
        </code>
        <code
          style={{
            fontSize:   "10px",
            fontFamily: "var(--font-mono)",
            color:      "var(--sh-text-faint)",
          }}
        >
          {hex || "—"}
        </code>
        <span
          style={{
            fontSize:   "10px",
            color:      "var(--sh-text-faint)",
            lineHeight: 1.4,
          }}
        >
          {desc}
        </span>
      </div>
    </div>
  );
}

// ─── Preset swatch — display only, no interaction ─────────────────────────────
// Theme changes are controlled via the controls bar only.

function PresetSwatch({
  preset,
  isActive,
}: {
  preset:   (typeof ACCENT_PRESETS)[0];
  isActive: boolean;
}) {
  return (
    <div
      style={{
        display:       "flex",
        flexDirection: "column",
        alignItems:    "center",
        gap:           "10px",
        cursor:        "default",
        flexShrink:    0,
        width:         "72px",
      }}
    >
      <div
        style={{
          width:           "56px",
          height:          "56px",
          borderRadius:    "14px",
          backgroundColor: preset.hex,
          transform:       isActive ? "scale(1.08)" : "scale(1)",
          boxShadow:       isActive
            ? `0 0 0 2px var(--sh-bg), 0 0 0 4px ${preset.hex}, 0 8px 28px ${preset.hex}70`
            : `0 2px 8px ${preset.hex}35`,
          transition: "transform 160ms ease, box-shadow 200ms ease",
        }}
      />
      <span
        style={{
          fontSize:   "10px",
          fontFamily: "var(--font-mono)",
          color:      isActive ? "var(--sh-accent)" : "var(--sh-text-faint)",
          textAlign:  "center",
          lineHeight: 1.4,
          fontWeight: isActive ? 600 : 400,
          transition: "color 200ms ease",
          userSelect: "none",
        }}
      >
        {preset.label}
      </span>
    </div>
  );
}

// ─── ColorTokensCanvas ────────────────────────────────────────────────────────

export function ColorTokensCanvas() {
  const [hexValues, setHexValues] = useState<Record<string, string>>({});
  const { theme, setTheme, accentId, setAccent } = useTheme();
  const { controlValues, setControlValue } = useAppStore();
  const cv = controlValues["pds-color-tokens"] ?? {};

  // ── Derive displayed accent/mode from controls (fall back to live theme) ─────
  const controlAccent = (cv.accent as string) || accentId;
  const controlMode   = (cv.mode   as string) || theme;

  // ── One-time init: seed controls from current live theme state ────────────────
  useEffect(() => {
    setControlValue("pds-color-tokens", "accent", accentId);
    setControlValue("pds-color-tokens", "mode",   theme);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Controls → theme: apply when control value changes ───────────────────────
  useEffect(() => {
    if (controlAccent && controlAccent !== accentId) {
      setAccent(controlAccent);
    }
  }, [controlAccent]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if ((controlMode === "dark" || controlMode === "light") && controlMode !== theme) {
      setTheme(controlMode as "dark" | "light");
    }
  }, [controlMode]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Read all live CSS var hex values ─────────────────────────────────────────
  const refreshHex = useCallback(() => {
    const allTokens = [
      ...SURFACE_TOKENS,
      ...BORDER_TOKENS,
      ...TEXT_TOKENS,
      ...ACCENT_PRIMARY_TOKENS,
      ...ACCENT_SECONDARY_TOKENS,
    ];
    const values: Record<string, string> = {};
    for (const t of allTokens) {
      values[t.varName] = readCSSVar(t.varName);
    }
    setHexValues(values);
  }, []);

  useEffect(() => {
    refreshHex();
  }, [refreshHex, accentId, theme]);

  const hex = (varName: string) => hexValues[varName] || "";

  return (
    /* Full-canvas scrollable wrapper */
    <div
      style={{
        alignSelf: "stretch",
        width:     "100%",
        overflowY: "auto",
        padding:   "48px 40px 64px",
      }}
    >
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>

        {/* ── Page header ───────────────────────────────────────────────────── */}
        <div style={{ marginBottom: "52px" }}>
          <h1
            style={{
              fontSize:      "22px",
              fontWeight:    600,
              color:         "var(--sh-text)",
              margin:        "0 0 6px",
              letterSpacing: "-0.02em",
            }}
          >
            Color Tokens
          </h1>
          <p
            style={{
              fontSize:   "14px",
              fontFamily: "var(--font-mono)",
              color:      "var(--sh-text-faint)",
              margin:     0,
            }}
          >
            Shouf Design System — semantic color primitives
          </p>
        </div>

        {/* ── Accent Presets ─────────────────────────────────────────────────── */}
        <section style={{ marginBottom: "56px" }}>
          <SectionHeader label="Accent Presets" />
          <p
            style={{
              fontSize:     "12px",
              color:        "var(--sh-text-faint)",
              marginBottom: "28px",
              lineHeight:   1.6,
            }}
          >
            Use the Theme control below to change the global accent color.
          </p>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {ACCENT_PRESETS.map((preset) => (
              <PresetSwatch
                key={preset.id}
                preset={preset}
                isActive={preset.id === controlAccent}
              />
            ))}
          </div>
        </section>

        {/* ── Background surface ─────────────────────────────────────────────── */}
        <section style={{ marginBottom: "48px" }}>
          <SectionHeader label="Background" />
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {SURFACE_TOKENS.map((t) => (
              <ColorSwatch
                key={t.varName}
                varName={t.varName}
                desc={t.desc}
                hex={hex(t.varName)}
                hasBorder={t.hasBorder}
              />
            ))}
          </div>
        </section>

        {/* ── Border ─────────────────────────────────────────────────────────── */}
        <section style={{ marginBottom: "48px" }}>
          <SectionHeader label="Border" />
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {BORDER_TOKENS.map((t) => (
              <ColorSwatch
                key={t.varName}
                varName={t.varName}
                desc={t.desc}
                hex={hex(t.varName)}
                hasBorder={t.hasBorder}
              />
            ))}
          </div>
        </section>

        {/* ── Text ───────────────────────────────────────────────────────────── */}
        <section style={{ marginBottom: "48px" }}>
          <SectionHeader label="Text" />
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {TEXT_TOKENS.map((t) => (
              <ColorSwatch
                key={t.varName}
                varName={t.varName}
                desc={t.desc}
                hex={hex(t.varName)}
                hasBorder={t.hasBorder}
              />
            ))}
          </div>
        </section>

        {/* ── Accent scale ───────────────────────────────────────────────────── */}
        <section style={{ marginBottom: "48px" }}>
          <SectionHeader label="Accent Scale" />

          {/* Primary trio — main / hover / active */}
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "32px" }}>
            {ACCENT_PRIMARY_TOKENS.map((t) => (
              <ColorSwatch
                key={t.varName}
                varName={t.varName}
                desc={t.desc}
                hex={hex(t.varName)}
              />
            ))}
          </div>

          {/* Secondaries — rose / blue / sage */}
          <div
            style={{
              borderTop:  "1px solid var(--sh-border-sub)",
              paddingTop: "24px",
              display:    "flex",
              gap:        "20px",
              flexWrap:   "wrap",
            }}
          >
            {ACCENT_SECONDARY_TOKENS.map((t) => (
              <ColorSwatch
                key={t.varName}
                varName={t.varName}
                desc={t.desc}
                hex={hex(t.varName)}
              />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
