"use client";

import type { CSSProperties } from "react";
import { useAppStore } from "@/lib/store";
import { useTheme } from "@/lib/theme";
import { isRegistered, getRegistration } from "@/lib/registry";
import { TokenRow } from "./TokenRow";
import type { TokenRow as TokenRowType } from "@/lib/types";

// ─── Intro stagger delays for right panel (ms after launch) ───────────────────
const D_HEADER  = 300;
const D_CONTENT = 470;

function rIntroStyle(delay: number, launched: boolean): CSSProperties {
  return {
    animationName:           "intro-reveal",
    animationDuration:       "220ms",
    animationTimingFunction: "ease",
    animationFillMode:       "both",
    animationDelay:          `${delay}ms`,
    animationPlayState:      launched ? "running" : "paused",
  };
}

// ─── Section header ──────────────────────────────────────────────────────────

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center px-3" style={{ height: "44px", borderBottom: "1px solid var(--shouf-border-sub)" }}>
      <span
        className="text-[12px] font-semibold uppercase tracking-wider"
        style={{ color: "var(--shouf-text-faint)", letterSpacing: "0.08em" }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Empty state ─────────────────────────────────────────────────────────────

function EmptyInspect() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-3 py-8 px-4 select-none">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="4" width="24" height="24" rx="4" stroke="var(--shouf-border)" strokeWidth="1.5" />
        <path d="M4 12h24" stroke="var(--shouf-border)" strokeWidth="1.5" />
        <path d="M12 12v16" stroke="var(--shouf-border)" strokeWidth="1.5" />
        <path d="M8 8h1M12 8h1M16 8h1" stroke="var(--shouf-text-faint)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <div className="text-center flex flex-col gap-1">
        <p className="text-xs font-medium" style={{ color: "var(--shouf-text-muted)" }}>Nothing to inspect</p>
        <p className="text-[12px]" style={{ color: "var(--shouf-text-faint)" }}>
          Select a component to see its CSS tokens
        </p>
      </div>
    </div>
  );
}

// ─── Placeholder inspect (non-registered component) ──────────────────────────

function PlaceholderInspect() {
  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <SectionHeader label="CSS Values & Tokens" />
      <div className="flex flex-col py-2 px-1 gap-0.5">
        {[85, 70, 90, 65, 80, 75, 60, 88].map((w, i) => (
          <div key={i} className="flex items-center justify-between py-[7px] px-3 rounded opacity-20">
            <div className="h-2 rounded-full" style={{ width: `${Math.round(w * 0.55)}px`, backgroundColor: "var(--shouf-skeleton)" }} />
            <div className="h-2 rounded-full" style={{ width: `${Math.round(w * 0.42)}px`, backgroundColor: "var(--shouf-skeleton)" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Spacing section ─────────────────────────────────────────────────────────

function SpacingSection({ tokens }: { tokens: TokenRowType[] }) {
  const get = (id: string) => tokens.find((t) => t.id === id)?.cssValue ?? "—";
  const height = get("height");
  const width  = get("width");
  const px     = get("padding").replace("0 ", "");
  const radius = get("radius");
  const gap    = get("gap");

  return (
    <div className="flex flex-col" style={{ borderTop: "1px solid var(--shouf-border-sub)" }}>
      <SectionHeader label="Box" />
      <div className="flex flex-col gap-2 px-3 py-3">
        {/* Box model diagram */}
        <div className="relative flex items-center justify-center" style={{ height: "72px" }}>
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              border: "1px solid var(--shouf-box-border)",
              borderRadius: "6px",
              backgroundColor: "var(--shouf-box-bg)",
            }}
          >
            <div style={{ height: "22px", width: "52px", backgroundColor: "var(--shouf-box-inner)", borderRadius: "3px" }} />
            <span className="absolute text-[12px] font-mono left-1.5 top-1" style={{ color: "var(--shouf-accent)", opacity: 0.8 }}>
              h: {height}
            </span>
            <span className="absolute text-[12px] font-mono right-1.5 top-1" style={{ color: "var(--shouf-accent)", opacity: 0.8 }}>
              w: {width}
            </span>
            <span className="absolute text-[12px] font-mono left-1.5 bottom-1" style={{ color: "var(--shouf-accent-rose)", opacity: 0.8 }}>
              p: {px}
            </span>
            <span className="absolute text-[12px] font-mono right-1.5 bottom-1" style={{ color: "var(--shouf-accent-rose)", opacity: 0.8 }}>
              gap: {gap}
            </span>
          </div>
        </div>
        {/* Values grid */}
        <div className="grid grid-cols-2 gap-1">
          {([["Height", height], ["Width", width], ["Padding", px], ["Radius", radius], ["Gap", gap]] as [string, string][]).map(([label, val]) => (
            <div key={label} className="flex items-center justify-between px-2 py-1.5 rounded"
              style={{ backgroundColor: "var(--shouf-input-bg)" }}>
              <span className="text-[12px]" style={{ color: "var(--shouf-text-faint)" }}>{label}</span>
              <span className="text-[12px] font-mono" style={{ color: "var(--shouf-text-muted)" }}>{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Live inspect ─────────────────────────────────────────────────────────────

function LiveInspect({ componentId }: { componentId: string }) {
  const { controlValues } = useAppStore();
  const registration = getRegistration(componentId)!;
  const values       = controlValues[componentId] ?? registration.defaultValues;
  const tokens       = registration.getTokens(values);

  const colorTokens = tokens.filter((t) => t.category === "color" || t.category === "shadow");
  const typeTokens  = tokens.filter((t) => t.category === "typography");
  const sizeTokens  = tokens.filter((t) => t.category === "spacing" || t.category === "radius");

  const hasColor = colorTokens.length > 0;
  const hasType  = typeTokens.length > 0;
  const hasSize  = sizeTokens.length > 0;

  return (
    <div className="flex flex-col overflow-y-auto flex-1">
      {hasColor && (
        <div className="flex flex-col">
          <SectionHeader label="Color & Effect" />
          <div className="flex flex-col py-1">
            {colorTokens.map((row) => <TokenRow key={row.id} row={row} />)}
          </div>
        </div>
      )}

      {hasType && (
        <div className="flex flex-col" style={hasColor ? { borderTop: "1px solid var(--shouf-border-sub)" } : {}}>
          <SectionHeader label="Typography" />
          <div className="flex flex-col py-1">
            {typeTokens.map((row) => <TokenRow key={row.id} row={row} />)}
          </div>
        </div>
      )}

      {hasSize && <SpacingSection tokens={sizeTokens} />}

      {!hasColor && !hasType && !hasSize && (
        <div className="flex flex-col flex-1 items-center justify-center gap-2 px-4 py-8 select-none">
          <p className="text-[12px] text-center" style={{ color: "var(--shouf-text-faint)" }}>
            Select a component to inspect tokens
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Variant chip ─────────────────────────────────────────────────────────────

function VariantChip({ componentId }: { componentId: string }) {
  const { controlValues } = useAppStore();
  const variant = controlValues[componentId]?.variant as string | undefined;
  if (!variant) return null;
  return (
    <span
      className="text-[12px] font-medium px-2 py-0.5 rounded shrink-0"
      style={{
        backgroundColor: "var(--shouf-accent-sel)",
        color:           "var(--shouf-accent)",
        border:          "1px solid var(--shouf-accent-ring)",
      }}
    >
      {variant}
    </span>
  );
}

// ─── InspectPanel ─────────────────────────────────────────────────────────────

export function InspectPanel() {
  const { selectedComponentId, controlValues, launched } = useAppStore();
  const registered = selectedComponentId ? isRegistered(selectedComponentId) : false;
  const hasVariant = !!(selectedComponentId && registered && controlValues[selectedComponentId]?.variant);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Inspect content */}
      <div
        className="flex flex-col flex-1 overflow-hidden"
        style={rIntroStyle(D_CONTENT, launched)}
      >
        {!selectedComponentId && <EmptyInspect />}
        {selectedComponentId && !registered  && <PlaceholderInspect />}
        {selectedComponentId &&  registered  && <LiveInspect componentId={selectedComponentId} />}
      </div>
    </div>
  );
}
