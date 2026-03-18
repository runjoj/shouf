"use client";

import { useAppStore } from "@/lib/store";

// ─── Font family data ─────────────────────────────────────────────────────────
// Each entry drives both the By Font specimen and the By Scale family labels.

const FONT_FAMILIES = [
  {
    id:          "playfair",
    name:        "Playfair Display",
    purpose:     "Display",
    purposeDesc: "Headings and expressive moments",
    stack:       "var(--font-playfair), Georgia, serif",
    pangram:     "A wizard's job is to vex chumps quickly in fog.",
    weights:     [400, 500, 600, 700] as number[],
    weightLabels: ["Regular", "Medium", "Semibold", "Bold"],
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
  { id: "type-8",  token: "--pds-type-8",  px: "8px",  usedFor: "Box model labels",           familyId: "mono"  },
  { id: "type-9",  token: "--pds-type-9",  px: "9px",  usedFor: "Keyboard shortcut hints",    familyId: "inter" },
  { id: "type-10", token: "--pds-type-10", px: "10px", usedFor: "Meta labels, token values",  familyId: "inter" },
  { id: "type-11", token: "--pds-type-11", px: "11px", usedFor: "Nav headers, control labels",familyId: "inter" },
  { id: "type-12", token: "--pds-type-12", px: "12px", usedFor: "Nav items, status badges",   familyId: "inter" },
  { id: "type-13", token: "--pds-type-13", px: "13px", usedFor: "Body text, subheadings",     familyId: "inter" },
  { id: "type-15", token: "--pds-type-15", px: "15px", usedFor: "Button label (large)",       familyId: "inter" },
  { id: "type-18", token: "--pds-type-18", px: "18px", usedFor: "Welcome headline",           familyId: "mono"  },
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
    <div style={{ display: "flex", flexDirection: "column", gap: "72px" }}>
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
              paddingLeft:   isSelected ? "16px" : "0",
              borderLeft:    isSelected ? "2px solid var(--sh-accent)" : "2px solid transparent",
              transition:    "padding-left 160ms ease, border-color 160ms ease",
            }}
          >
            {/* Purpose label — small caps monospace */}
            <div
              style={{
                fontSize:      "10px",
                fontFamily:    "var(--font-mono)",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color:         "var(--sh-text-faint)",
                marginBottom:  "16px",
                userSelect:    "none",
              }}
            >
              {family.purpose} — {family.purposeDesc}
            </div>

            {/* Font name — large, in that font */}
            <div
              style={{
                fontSize:     "40px",
                fontFamily:   family.stack,
                fontWeight:   400,
                lineHeight:   1,
                color:        "var(--sh-text)",
                marginBottom: "20px",
                letterSpacing: family.id === "mono" ? "-0.02em" : "-0.01em",
              }}
            >
              {family.name}
            </div>

            {/* Pangram */}
            <div
              style={{
                fontSize:     "17px",
                fontFamily:   family.stack,
                fontWeight:   400,
                lineHeight:   1.55,
                color:        "var(--sh-text-muted)",
                marginBottom: "28px",
              }}
            >
              {family.pangram}
            </div>

            {/* Weight specimens */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "32px" }}>
              {family.weights.map((weight, wi) => (
                <div
                  key={weight}
                  style={{ display: "flex", flexDirection: "column", gap: "4px" }}
                >
                  <div
                    style={{
                      fontSize:   "16px",
                      fontFamily: family.stack,
                      fontWeight: weight,
                      color:      "var(--sh-text)",
                      lineHeight: 1,
                    }}
                  >
                    Aa
                  </div>
                  <div
                    style={{
                      fontSize:   "10px",
                      fontFamily: "var(--font-mono)",
                      color:      "var(--sh-text-faint)",
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
              borderBottom:  "1px solid var(--sh-border-sub)",
              cursor:        "pointer",
              backgroundColor: isSelected ? "var(--sh-hover)" : "transparent",
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
                color:      "var(--sh-text)",
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
                fontSize:   "12px",
                fontFamily: "var(--font-mono)",
                color:      "var(--sh-text-muted)",
                flexShrink: 0,
                minWidth:   "120px",
              }}
            >
              {step.token}
            </div>

            {/* px value */}
            <div
              style={{
                fontSize:   "12px",
                fontFamily: "var(--font-mono)",
                color:      "var(--sh-text-faint)",
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
                fontSize:      "10px",
                fontFamily:    "var(--font-mono)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color:         "var(--sh-text-faint)",
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
    <div
      style={{
        alignSelf: "stretch",
        width:     "100%",
        overflowY: "auto",
        padding:   "52px 48px 80px",
      }}
    >
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>

        {/* ── Page header ─────────────────────────────────────────────────── */}
        <div style={{ marginBottom: "56px", ...revealStyle(0) }}>
          <h1
            style={{
              fontSize:      "22px",
              fontWeight:    600,
              color:         "var(--sh-text)",
              margin:        "0 0 6px",
              letterSpacing: "-0.02em",
            }}
          >
            Typography Scale
          </h1>
          <p
            style={{
              fontSize:   "14px",
              fontFamily: "var(--font-mono)",
              color:      "var(--sh-text-faint)",
              margin:     0,
            }}
          >
            Shouf Design System — four families, one scale
          </p>
        </div>

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
