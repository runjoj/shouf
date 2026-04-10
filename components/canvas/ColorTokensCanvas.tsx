"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ACCENT_PRESETS } from "@/lib/accent";
import { useTheme } from "@/lib/theme";
import { useAppStore } from "@/lib/store";
import { ScrollReveal } from "./CaseStudyShared";


// ─── Token group definitions ──────────────────────────────────────────────────

const SURFACE_TOKENS = [
  { varName: "--shouf-bg",        desc: "App background",  hasBorder: true },
  { varName: "--shouf-canvas",    desc: "Center canvas",   hasBorder: true },
  { varName: "--shouf-panel",     desc: "Side panels",     hasBorder: true },
  { varName: "--shouf-panel-alt", desc: "Nested surfaces", hasBorder: true },
];

const BORDER_TOKENS = [
  { varName: "--shouf-border",     desc: "Default border",  hasBorder: true },
  { varName: "--shouf-border-sub", desc: "Hairline divider", hasBorder: true },
];

const TEXT_TOKENS = [
  { varName: "--shouf-text",       desc: "Headings & body",  hasBorder: false },
  { varName: "--shouf-text-muted", desc: "Secondary labels", hasBorder: false },
  { varName: "--shouf-text-faint", desc: "Placeholders",     hasBorder: false },
];

const ACCENT_PRIMARY_TOKENS = [
  { varName: "--shouf-accent",   desc: "Primary brand" },
  { varName: "--shouf-accent-h", desc: "Hover state"   },
  { varName: "--shouf-accent-a", desc: "Active state"  },
];

const ACCENT_SECONDARY_TOKENS = [
  { varName: "--shouf-accent-rose", desc: "Rose secondary" },
  { varName: "--shouf-accent-blue", desc: "Blue secondary" },
  { varName: "--shouf-accent-sage", desc: "Sage secondary" },
];

// ─── CSS var reader ───────────────────────────────────────────────────────────

function readCSSVar(name: string): string {
  if (typeof window === "undefined") return "";
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({ label, isSelected, onClick }: { label: string; isSelected?: boolean; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px",
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <span
        style={{
          fontSize:      "12px",
          fontFamily:    "var(--font-mono)",
          letterSpacing: "0.12em",
          color:         isSelected ? "var(--shouf-accent)" : "var(--shouf-text-muted)",
          textTransform: "uppercase",
          fontWeight:    600,
          flexShrink:    0,
          userSelect:    "none",
          transition:    "color 160ms ease",
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, var(--shouf-border-sub), transparent)" }} />
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
  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: "10px", flexShrink: 0 }}
    >
      <div
        style={{
          width:           "100px",
          height:          "80px",
          borderRadius:    "10px",
          backgroundColor: `var(${varName})`,
          border:          hasBorder ? "1px solid var(--shouf-border)" : undefined,
          boxShadow:       "0 1px 4px rgba(0,0,0,0.06)",
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <code
          style={{
            fontSize:   "12px",
            fontFamily: "var(--font-mono)",
            color:      "var(--shouf-text)",
            lineHeight: 1.3,
            fontWeight: 500,
          }}
        >
          {varName}
        </code>
        <code
          style={{
            fontSize:   "12px",
            fontFamily: "var(--font-mono)",
            color:      "var(--shouf-text-muted)",
          }}
        >
          {hex || "—"}
        </code>
        <span
          style={{
            fontSize:   "12px",
            color:      "var(--shouf-text-muted)",
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
        width:         "80px",
      }}
    >
      <div
        style={{
          width:           "64px",
          height:          "64px",
          borderRadius:    "14px",
          backgroundColor: preset.hex,
          transform:       isActive ? "scale(1.08)" : "scale(1)",
          boxShadow:       isActive
            ? `0 0 0 2px var(--shouf-bg), 0 0 0 4px ${preset.hex}, 0 8px 28px ${preset.hex}70`
            : `0 2px 8px ${preset.hex}35`,
          transition: "transform 160ms ease, box-shadow 200ms ease",
        }}
      />
      <span
        style={{
          fontSize:   "12px",
          fontFamily: "var(--font-mono)",
          color:      isActive ? "var(--shouf-accent)" : "var(--shouf-text-muted)",
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
  // syncReady guards against the first render: the init effect above schedules
  // a state update but it hasn't propagated yet when these effects first run,
  // so stale stored control values would incorrectly revert the live accent/mode.
  const syncReady = useRef(false);

  useEffect(() => {
    if (!syncReady.current) return;
    if (controlAccent && controlAccent !== accentId) {
      setAccent(controlAccent);
    }
  }, [controlAccent]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!syncReady.current) return;
    if ((controlMode === "dark" || controlMode === "light") && controlMode !== theme) {
      setTheme(controlMode as "dark" | "light");
    }
  }, [controlMode]); // eslint-disable-line react-hooks/exhaustive-deps

  // Mark sync as ready after the initial effects have all run.
  // This effect must be defined AFTER the sync effects so it runs last on mount.
  useEffect(() => {
    syncReady.current = true;
  }, []);

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

  const selectedSection = (cv.selectedSection as string) ?? "";

  function selectSection(id: string) {
    const next = selectedSection === id ? "" : id;
    setControlValue("pds-color-tokens", "selectedSection", next);
  }

  return (
    /* Full-canvas scrollable wrapper */
    <div className="canvas-scroll-pad">
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>

        {/* ── Page header ───────────────────────────────────────────────────── */}
        <ScrollReveal>
        <div style={{ marginBottom: "52px" }}>
          <h1
            style={{
              fontSize:      "26px",
              fontWeight:    600,
              color:         "var(--shouf-text)",
              margin:        "0 0 8px",
              letterSpacing: "-0.02em",
            }}
          >
            Color Tokens
          </h1>
          <p
            style={{
              fontSize:   "15px",
              fontFamily: "var(--font-mono)",
              color:      "var(--shouf-text-muted)",
              margin:     0,
            }}
          >
            Shouf Design System — semantic color primitives
          </p>
        </div>
        </ScrollReveal>

        {/* ── Accent Presets ─────────────────────────────────────────────────── */}
        <ScrollReveal>
        <section style={{ marginBottom: "56px" }}>
          <SectionHeader label="Accent Presets" />
          <p
            style={{
              fontSize:     "14px",
              color:        "var(--shouf-text-muted)",
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
        </ScrollReveal>

        {/* ── Background surface ─────────────────────────────────────────────── */}
        <ScrollReveal>
        <section style={{ marginBottom: "48px" }}>
          <SectionHeader label="Background" isSelected={selectedSection === "background"} onClick={() => selectSection("background")} />
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
        </ScrollReveal>

        {/* ── Border ─────────────────────────────────────────────────────────── */}
        <ScrollReveal>
        <section style={{ marginBottom: "48px" }}>
          <SectionHeader label="Border" isSelected={selectedSection === "border"} onClick={() => selectSection("border")} />
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
        </ScrollReveal>

        {/* ── Text ───────────────────────────────────────────────────────────── */}
        <ScrollReveal>
        <section style={{ marginBottom: "48px" }}>
          <SectionHeader label="Text" isSelected={selectedSection === "text"} onClick={() => selectSection("text")} />
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
        </ScrollReveal>

        {/* ── Accent scale ───────────────────────────────────────────────────── */}
        <ScrollReveal>
        <section style={{ marginBottom: "48px" }}>
          <SectionHeader label="Accent Scale" isSelected={selectedSection === "accent"} onClick={() => selectSection("accent")} />

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
              borderTop:  "1px solid var(--shouf-border-sub)",
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
        </ScrollReveal>

      </div>
    </div>
  );
}
