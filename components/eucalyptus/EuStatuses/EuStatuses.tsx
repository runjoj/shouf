"use client";

import { useState, useEffect } from "react";
import type { ComponentControlValues } from "@/lib/types";
import type { ReactNode } from "react";
import { useAppStore } from "@/lib/store";
import { useTheme } from "@/lib/theme";
import {
  MagicWand,
  PersonSimpleRun,
  Rows,
  X,
  Check,
  Plus,
  Trash,
} from "@phosphor-icons/react";

// ─── Variant data ───────────────────────────────────────────────────────────────
// Colors match --eu-status-* tokens in globals.css and VARIANT_TOKENS in definition.ts.
// Running / Failed / Passed use vivid fills; others use tinted/pastel backgrounds.

const VARIANTS = [
  { id: "repaired", label: "Repaired", bg: "#D9D3F8", color: "#000000" },
  { id: "running",  label: "Running",  bg: "#2FC291", color: "#040708" },
  { id: "queued",   label: "Queued",   bg: "#D9DAE2", color: "#000000" },
  { id: "failed",   label: "Failed",   bg: "#FF6161", color: "#040708" },
  { id: "passed",   label: "Passed",   bg: "#B5E9DD", color: "#000000" },
  { id: "added",    label: "Added",    bg: "#D9D3F8", color: "#000000" },
  { id: "deleted",  label: "Deleted",  bg: "#0F1012", color: "#FFFFFF" },
] as const;

type VariantId = (typeof VARIANTS)[number]["id"];

// ─── Icon map ────────────────────────────────────────────────────────────────────
// Phosphor icons — weight="fill" for solid, filled icon style.

function getIcon(id: VariantId, size: number): ReactNode {
  const fill = { size, weight: "fill" } as const;
  const bold = { size, weight: "bold" } as const;
  switch (id) {
    case "repaired": return <MagicWand      {...fill} />;
    case "running":  return <PersonSimpleRun {...fill} />;
    case "queued":   return <Rows            {...fill} />;
    case "failed":   return <X               {...bold} />;
    case "passed":   return <Check           {...bold} />;
    case "added":    return <Plus            {...bold} />;
    case "deleted":  return <Trash           {...fill} />;
  }
}

// ─── EuStatuses ─────────────────────────────────────────────────────────────────

export type EuStatusesProps = {
  size?:         "sm" | "md";
  selected?:     string;
  selectedType?: string;
};

export function EuStatuses({
  size = "md",
}: EuStatusesProps) {
  const { selectedComponentId, setControlValue } = useAppStore();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Dark-mode-only outline for the near-black "Deleted" chip so it doesn't
  // disappear against the dark page background.
  const deletedOutline =
    theme === "dark" ? "inset 0 0 0 1px #7A8494" : "none";

  // Trigger the stagger-in animation shortly after mount
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  const iconSize   = size === "sm" ? 11 : 14;
  const circleSize = size === "sm" ? 24 : 28;
  const pillPx     = size === "sm" ? "9px"  : "12px";
  const pillPy     = size === "sm" ? "5px"  : "6px";
  const fontSize   = size === "sm" ? "12px" : "14px";
  const iconGap    = size === "sm" ? "5px"  : "6px";

  // Clicking any badge or circle writes to the store, which flows back in as
  // `values.selected` / `values.selectedType` and updates the inspect panel.
  // Expressive craft moment: the inspect panel becomes a live property viewer
  // driven by which specific badge shape you tap — teaching radius + color simultaneously.
  function handleClick(variantId: string, type: "pill" | "circle") {
    if (!selectedComponentId) return;
    setControlValue(selectedComponentId, "selected",     variantId);
    setControlValue(selectedComponentId, "selectedType", type);
  }

  return (
    <div
      className="eu-scope"
      style={{
        display:       "flex",
        flexDirection: "column",
        gap:           "14px",
        alignItems:    "flex-start",
      }}
    >
      {VARIANTS.map((v, i) => {
        return (
          <div
            key={v.id}
            style={{
              display:    "flex",
              alignItems: "center",
              gap:        "14px",
              // Stagger-in on mount
              opacity:    mounted ? 1 : 0,
              transform:  mounted ? "translateY(0)" : "translateY(5px)",
              transition: `opacity 200ms ease ${i * 40}ms, transform 200ms ease ${i * 40}ms`,
            }}
          >
            {/* ── Pill badge (icon + text) ─────────────────────────── */}
            <button
              onClick={() => handleClick(v.id, "pill")}
              style={{
                display:         "inline-flex",
                alignItems:      "center",
                gap:             iconGap,
                paddingLeft:     pillPx,
                paddingRight:    pillPx,
                height:          `${circleSize}px`,
                backgroundColor: v.bg,
                color:           v.color,
                borderRadius:    "4px",
                fontSize,
                fontWeight:      500,
                lineHeight:      1,
                fontFamily:      "inherit",
                border:          "none",
                cursor:          "pointer",
                userSelect:      "none",
                whiteSpace:      "nowrap",
                flexShrink:      0,
                outline:         "none",
                boxShadow:       v.id === "deleted" ? deletedOutline : "none",
              }}
            >
              {getIcon(v.id, iconSize)}
              <span style={{ fontSize: "inherit" }}>{v.label}</span>
            </button>

            {/* ── Icon-only circle ─────────────────────────────────── */}
            <button
              onClick={() => handleClick(v.id, "circle")}
              style={{
                display:         "inline-flex",
                alignItems:      "center",
                justifyContent:  "center",
                width:           `${circleSize}px`,
                height:          `${circleSize}px`,
                backgroundColor: v.bg,
                color:           v.color,
                borderRadius:    "50%",
                border:          "none",
                cursor:          "pointer",
                flexShrink:      0,
                outline:         "none",
                boxShadow:       v.id === "deleted" ? deletedOutline : "none",
              }}
            >
              {getIcon(v.id, iconSize)}
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ─── Renderer (registry → ComponentRenderer) ────────────────────────────────────

export function EuStatusesRenderer(values: ComponentControlValues): ReactNode {
  return (
    <EuStatuses
      size={(values.size         as "sm" | "md") ?? "md"}
      selected={(values.selected     as string)  ?? "repaired"}
      selectedType={(values.selectedType as string)  ?? "pill"}
    />
  );
}
