"use client";

import { useState, useEffect } from "react";
import type { ComponentControlValues } from "@/lib/types";
import type { ReactNode } from "react";
import { useAppStore } from "@/lib/store";
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
  const props = { size, weight: "fill" } as const;
  switch (id) {
    case "repaired": return <MagicWand      {...props} />;
    case "running":  return <PersonSimpleRun {...props} />;
    case "queued":   return <Rows            {...props} />;
    case "failed":   return <X               {...props} />;
    case "passed":   return <Check           {...props} />;
    case "added":    return <Plus            {...props} />;
    case "deleted":  return <Trash           {...props} />;
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
  const [mounted, setMounted] = useState(false);

  // Trigger the stagger-in animation shortly after mount
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  const iconSize   = size === "sm" ? 10 : 11;
  const circleSize = 22; // fixed 22×22 for both sizes
  const pillPx     = size === "sm" ? "8px"  : "10px";
  const pillPy     = size === "sm" ? "4px"  : "5px"; // 11+4+4=19 / 12+5+5=22px height
  const fontSize   = size === "sm" ? "11px" : "12px";
  const iconGap    = size === "sm" ? "4px"  : "5px";

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
        gap:           "10px",
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
              gap:        "10px",
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
                height:          "22px",
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
