"use client";

import { useAppStore } from "@/lib/store";
import { ScrollReveal } from "./CaseStudyShared";

// ─── Font family data ─────────────────────────────────────────────────────────
// Each entry drives both the By Font specimen and the By Scale family labels.

const FONT_FAMILIES = [
  {
    id:          "manrope",
    name:        "Manrope",
    purpose:     "Display",
    purposeDesc: "Headings and branding",
    stack:       "var(--font-manrope), sans-serif",
    pangram:     "A wizard's job is to vex chumps quickly in fog.",
    weights:     [400, 500, 600, 700, 800] as number[],
    weightLabels: ["Regular", "Medium", "Semibold", "Bold", "ExtraBold"],
  },
  {
    id:          "inter",
    name:        "Inter",
    purpose:     "UI",
    purposeDesc: "Interface and body text",
    stack:       "var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif",
    pangram:     "Pack my box with five dozen liquor jugs.",
    weights:     [400, 500, 600] as number[],
    weightLabels: ["Regular", "Medium", "Semibold"],
  },
  {
    id:          "figtree",
    name:        "Figtree",
    purpose:     "Component",
    purposeDesc: "Eucalyptus design system",
    stack:       "var(--font-figtree), sans-serif",
    pangram:     "How quickly daft jumping zebras vex.",
    weights:     [400, 500, 600] as number[],
    weightLabels: ["Regular", "Medium", "Semibold"],
  },
  {
    id:          "mono",
    name:        "Monospace",
    purpose:     "Technical",
    purposeDesc: "Code tokens and system values",
    stack:       "var(--font-mono)",
    pangram:     "Sphinx of black quartz, judge my vow.",
    weights:     [400] as number[],
    weightLabels: ["Regular"],
  },
] as const;

// ─── Type scale data ──────────────────────────────────────────────────────────

const TYPE_SCALE = [
  { id: "type-8",  token: "--shouf-type-8",  px: "8px",  usedFor: "Box model labels",           familyId: "mono"  },
  { id: "type-9",  token: "--shouf-type-9",  px: "9px",  usedFor: "Keyboard shortcut hints",    familyId: "inter" },
  { id: "type-10", token: "--shouf-type-10", px: "10px", usedFor: "Meta labels, token values",  familyId: "inter" },
  { id: "type-11", token: "--shouf-type-11", px: "11px", usedFor: "Nav headers, control labels",familyId: "inter" },
  { id: "type-12", token: "--shouf-type-12", px: "12px", usedFor: "Nav items, status badges",   familyId: "inter" },
  { id: "type-13", token: "--shouf-type-13", px: "13px", usedFor: "Body text, subheadings",     familyId: "inter" },
  { id: "type-15", token: "--shouf-type-15", px: "15px", usedFor: "Button label (large)",       familyId: "inter" },
  { id: "type-18", token: "--shouf-type-18", px: "18px", usedFor: "Welcome headline",           familyId: "mono"  },
];

// ─── Stagger animation helper ─────────────────────────────────────────────────

function revealStyle(index: number) {
  return {
    animationName:           "intro-reveal",
    animationDuration:       "300ms",
    animationTimingFunction: "ease",
    animationFillMode:       "both",
    animationDelay:          `${index * 150}ms`,
  };
}

// ─── By Font view ─────────────────────────────────────────────────────────────

function ByFontView({
  selectedItem,
  onSelect,
}: {
  selectedItem: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {FONT_FAMILIES.map((family, index) => {
        const itemKey    = `family:${family.id}`;
        const isSelected = selectedItem === itemKey;

        return (
          <div
            key={family.id}
            onClick={() => onSelect(itemKey)}
            style={{
              ...revealStyle(index),
              cursor:        "pointer",
              padding:       "20px 16px",
              borderRadius:  "10px",
              border:        isSelected ? "1px solid var(--shouf-border)" : "1px solid transparent",
              backgroundColor: "transparent",
              transition:    "background-color 160ms ease, border-color 160ms ease",
            }}
            onMouseEnter={(e) => {
              if (!isSelected) (e.currentTarget as HTMLElement).style.backgroundColor = "var(--shouf-hover-str)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
            }}
          >
            {/* Purpose label — small caps monospace */}
            <div
              style={{
                fontSize:      "12px",
                fontFamily:    "var(--font-mono)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color:         isSelected ? "var(--shouf-accent)" : "var(--shouf-text-muted)",
                fontWeight:    600,
                marginBottom:  "16px",
                userSelect:    "none",
                transition:    "color 160ms ease",
              }}
            >
              {family.purpose} — {family.purposeDesc}
            </div>

            {/* Font name — large, in that font */}
            <div
              style={{
                fontSize:     "44px",
                fontFamily:   family.stack,
                fontWeight:   400,
                lineHeight:   1,
                color:        "var(--shouf-text)",
                marginBottom: "20px",
                letterSpacing: family.id === "mono" ? "-0.02em" : "-0.01em",
              }}
            >
              {family.name}
            </div>

            {/* Pangram */}
            <div
              style={{
                fontSize:     "18px",
                fontFamily:   family.stack,
                fontWeight:   400,
                lineHeight:   1.55,
                color:        "var(--shouf-text)",
                marginBottom: "28px",
              }}
            >
              {family.pangram}
            </div>

            {/* Weight specimens */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "36px" }}>
              {family.weights.map((weight, wi) => (
                <div
                  key={weight}
                  style={{ display: "flex", flexDirection: "column", gap: "6px" }}
                >
                  <div
                    style={{
                      fontSize:   "20px",
                      fontFamily: family.stack,
                      fontWeight: weight,
                      color:      "var(--shouf-text)",
                      lineHeight: 1,
                    }}
                  >
                    Aa
                  </div>
                  <div
                    style={{
                      fontSize:   "12px",
                      fontFamily: "var(--font-mono)",
                      color:      "var(--shouf-text-muted)",
                      lineHeight: 1.4,
                    }}
                  >
                    {weight} — {family.weightLabels[wi]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── By Scale view ────────────────────────────────────────────────────────────

function ByScaleView({
  selectedItem,
  onSelect,
}: {
  selectedItem: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0px" }}>
      {TYPE_SCALE.map((step, index) => {
        const family     = FONT_FAMILIES.find((f) => f.id === step.familyId)!;
        const itemKey    = `scale:${step.id}`;
        const isSelected = selectedItem === itemKey;

        return (
          <div
            key={step.id}
            onClick={() => onSelect(itemKey)}
            style={{
              ...revealStyle(index),
              display:       "flex",
              alignItems:    "baseline",
              gap:           "24px",
              padding:       "14px 0",
              borderBottom:  "1px solid var(--shouf-border-sub)",
              cursor:        "pointer",
              backgroundColor: isSelected ? "var(--shouf-hover)" : "transparent",
              paddingLeft:   isSelected ? "12px" : "0",
              paddingRight:  isSelected ? "12px" : "0",
              marginLeft:    isSelected ? "-12px" : "0",
              marginRight:   isSelected ? "-12px" : "0",
              transition:    "background-color 120ms ease, padding-left 120ms ease, padding-right 120ms ease, margin 120ms ease",
            }}
          >
            {/* Live text at actual size */}
            <div
              style={{
                fontSize:   step.px,
                fontFamily: family.stack,
                fontWeight: 400,
                color:      "var(--shouf-text)",
                lineHeight: 1,
                flex:       1,
                minWidth:   0,
                whiteSpace: "nowrap",
                overflow:   "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {step.usedFor}
            </div>

            {/* Token name */}
            <div
              style={{
                fontSize:   "13px",
                fontFamily: "var(--font-mono)",
                color:      "var(--shouf-text)",
                flexShrink: 0,
                minWidth:   "120px",
              }}
            >
              {step.token}
            </div>

            {/* px value */}
            <div
              style={{
                fontSize:   "13px",
                fontFamily: "var(--font-mono)",
                color:      "var(--shouf-text-muted)",
                flexShrink: 0,
                minWidth:   "32px",
                textAlign:  "right",
              }}
            >
              {step.px}
            </div>

            {/* Family label */}
            <div
              style={{
                fontSize:      "12px",
                fontFamily:    "var(--font-mono)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color:         "var(--shouf-text-muted)",
                flexShrink:    0,
                minWidth:      "60px",
                textAlign:     "right",
              }}
            >
              {family.purpose}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── TypographyCanvas ─────────────────────────────────────────────────────────

export function TypographyCanvas() {
  const { selectedComponentId, controlValues, setControlValue } = useAppStore();
  const values       = controlValues["pds-typography"] ?? {};
  const view         = (values.view as string) ?? "by-font";
  const selectedItem = (values.selectedItem as string) ?? "";

  function handleSelect(itemId: string) {
    if (!selectedComponentId) return;
    // Toggle off if already selected
    const next = selectedItem === itemId ? "" : itemId;
    setControlValue("pds-typography", "selectedItem", next);
  }

  return (
    <div className="canvas-scroll-pad">
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>

        {/* ── Page header ─────────────────────────────────────────────────── */}
        <ScrollReveal>
        <div style={{ marginBottom: "56px", ...revealStyle(0) }}>
          <h1
            style={{
              fontSize:      "26px",
              fontWeight:    600,
              color:         "var(--shouf-text)",
              margin:        "0 0 8px",
              letterSpacing: "-0.02em",
            }}
          >
            Typography Scale
          </h1>
          <p
            style={{
              fontSize:   "15px",
              fontFamily: "var(--font-mono)",
              color:      "var(--shouf-text-muted)",
              margin:     0,
            }}
          >
            Shouf Design System — four families, one scale
          </p>
          <p
            style={{
              fontSize:   "13px",
              color:      "var(--shouf-text-faint)",
              margin:     "12px 0 0",
              lineHeight: 1.5,
            }}
          >
            Click a family or scale step to inspect its tokens in the right panel.
          </p>
        </div>
        </ScrollReveal>

        {/* ── Content ─────────────────────────────────────────────────────── */}
        {view === "by-font"  && (
          <ByFontView  selectedItem={selectedItem} onSelect={handleSelect} />
        )}
        {view === "by-scale" && (
          <ByScaleView selectedItem={selectedItem} onSelect={handleSelect} />
        )}

      </div>
    </div>
  );
}
