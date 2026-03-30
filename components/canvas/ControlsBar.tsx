"use client";

import { useAppStore } from "@/lib/store";
import { getRegistration } from "@/lib/registry";
import type { Control, ControlValue } from "@/lib/types";

// ─── Widgets ─────────────────────────────────────────────────────────────────

type WidgetProps = {
  control: Control;
  value: ControlValue;
  onChange: (v: ControlValue) => void;
};

function SelectWidget({ control, value, onChange }: WidgetProps) {
  return (
    <div
      className="relative"
      style={{ border: "1px solid var(--shouf-border)", borderRadius: "5px", backgroundColor: "var(--shouf-input-bg)" }}
    >
      <select
        value={String(value)}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none text-[12px] font-medium pl-2.5 pr-7 py-[5px] bg-transparent outline-none cursor-pointer"
        style={{ color: "var(--shouf-text)" }}
      >
        {control.options?.map((opt) => (
          <option key={opt.value} value={opt.value}
            style={{ backgroundColor: "var(--shouf-option-bg)", color: "var(--shouf-text)" }}>
            {opt.label}
          </option>
        ))}
      </select>
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
        className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
        <path d="M2 3.5L5 6.5L8 3.5" stroke="var(--shouf-text-muted)" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function BooleanWidget({ value, onChange }: WidgetProps) {
  const isOn = Boolean(value);
  return (
    <button
      role="switch"
      aria-checked={isOn}
      onClick={() => onChange(!isOn)}
      className="w-8 h-[18px] rounded-full flex items-center transition-colors cursor-pointer shrink-0"
      style={{ backgroundColor: isOn ? "var(--shouf-accent)" : "var(--shouf-switch-off)", padding: "2px" }}
    >
      <span
        className="block w-[14px] h-[14px] rounded-full bg-white transition-transform duration-150"
        style={{ transform: isOn ? "translateX(14px)" : "translateX(0)" }}
      />
    </button>
  );
}

function TextWidget({ value, onChange }: WidgetProps) {
  return (
    <input
      type="text"
      value={String(value)}
      onChange={(e) => onChange(e.target.value)}
      className="text-[12px] font-medium px-2.5 py-[5px] rounded outline-none"
      style={{ backgroundColor: "var(--shouf-input-bg)", border: "1px solid var(--shouf-border)", color: "var(--shouf-text)", width: "110px" }}
      onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = "var(--shouf-accent)")}
      onBlur={(e)  => ((e.target as HTMLInputElement).style.borderColor = "var(--shouf-border)")}
    />
  );
}

// ─── Control row ─────────────────────────────────────────────────────────────

function ControlRow({
  control,
  componentId,
}: {
  control: Control;
  componentId: string;
}) {
  const { controlValues, setControlValue } = useAppStore();
  const value    = controlValues[componentId]?.[control.id] ?? control.defaultValue;
  const onChange = (v: ControlValue) => setControlValue(componentId, control.id, v);
  const props: WidgetProps = { control, value, onChange };

  return (
    <div className="flex items-center gap-2.5 shrink-0">
      <span className="text-[12px] font-medium shrink-0" style={{ color: "var(--shouf-text-muted)", minWidth: "60px" }}>
        {control.label}
      </span>
      {control.type === "select"  && <SelectWidget  {...props} />}
      {control.type === "boolean" && <BooleanWidget {...props} />}
      {control.type === "text"    && <TextWidget    {...props} />}
    </div>
  );
}

function Divider() {
  return <div className="w-px self-stretch mx-1 shrink-0" style={{ backgroundColor: "var(--shouf-border-sub)" }} />;
}

// ─── ControlsBar ─────────────────────────────────────────────────────────────

export function ControlsBar() {
  const { selectedComponentId, controlValues, setControlValue } = useAppStore();
  const registration = selectedComponentId ? getRegistration(selectedComponentId) : undefined;

  const selects  = registration?.controls.filter((c) => c.type === "select")  ?? [];
  const booleans = registration?.controls.filter((c) => c.type === "boolean") ?? [];
  const texts    = registration?.controls.filter((c) => c.type === "text")    ?? [];

  function handleReset() {
    if (!selectedComponentId || !registration) return;
    for (const ctrl of registration.controls) {
      setControlValue(selectedComponentId, ctrl.id, ctrl.defaultValue);
    }
  }

  return (
    <div
      className="shrink-0 flex flex-col"
      style={{ borderTop: "1px solid var(--shouf-border)", backgroundColor: "var(--shouf-panel)" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-2 shrink-0"
        style={{ borderBottom: "1px solid var(--shouf-border-sub)" }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <rect x="1" y="1" width="4" height="4" rx="1" fill="var(--shouf-text-faint)" />
          <rect x="7" y="1" width="4" height="4" rx="1" fill="var(--shouf-text-faint)" />
          <rect x="1" y="7" width="4" height="4" rx="1" fill="var(--shouf-text-faint)" />
          <rect x="7" y="7" width="4" height="4" rx="1" fill="var(--shouf-text-faint)" />
        </svg>
        <span className="text-[12px] font-semibold uppercase tracking-wider"
          style={{ color: "var(--shouf-text-muted)", letterSpacing: "0.06em" }}>
          Controls
        </span>

        <div className="ml-auto flex items-center gap-3">
          {/* Status hint */}
          {!selectedComponentId && (
            <span className="text-[12px]" style={{ color: "var(--shouf-text-faint)" }}>
              Select a component to enable
            </span>
          )}
          {selectedComponentId && !registration && (
            <span className="text-[12px]" style={{ color: "var(--shouf-text-faint)" }}>
              No controls for this component yet
            </span>
          )}

          {/* Reset button */}
          {registration && (
            <button
              onClick={handleReset}
              className="text-[12px] px-2 py-0.5 rounded transition-colors"
              style={{ color: "var(--shouf-text-muted)", border: "1px solid var(--shouf-border)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--shouf-text)";
                (e.currentTarget as HTMLElement).style.borderColor = "var(--shouf-border-sub)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--shouf-text-muted)";
                (e.currentTarget as HTMLElement).style.borderColor = "var(--shouf-border)";
              }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Controls row */}
      <div className="flex items-center gap-3 px-4 pt-3 pb-4 overflow-x-auto">
        {registration && selectedComponentId ? (
          <>
            {selects.map((c) => (
              <ControlRow key={c.id} control={c} componentId={selectedComponentId} />
            ))}
            {selects.length > 0 && booleans.length > 0 && <Divider />}
            {booleans.map((c) => (
              <ControlRow key={c.id} control={c} componentId={selectedComponentId} />
            ))}
            {(selects.length > 0 || booleans.length > 0) && texts.length > 0 && <Divider />}
            {texts.map((c) => (
              <ControlRow key={c.id} control={c} componentId={selectedComponentId} />
            ))}
          </>
        ) : (
          /* Dimmed skeleton */
          [80, 60, 32, 32, 32, 32].map((w, i) => (
            <div key={i} className="flex items-center gap-2.5 opacity-20 shrink-0">
              <div className="h-2 rounded" style={{ width: "48px", backgroundColor: "var(--shouf-skeleton)" }} />
              <div className="h-[26px] rounded" style={{ width: `${w}px`, backgroundColor: "var(--shouf-skeleton)" }} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
