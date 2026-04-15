"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { ComponentControlValues } from "@/lib/types";
import type { ReactNode } from "react";
import { useTheme } from "@/lib/theme";
import {
  Broom,
  CheckCircle,
  PlusCircle,
  Trash,
} from "@phosphor-icons/react";

// ─── Sample data ────────────────────────────────────────────────────────────

const SAMPLE_TAGS = [
  "Feature", "New", "Bug", "Enhancement", "Documentation",
  "Performance", "Security", "Design", "Urgent", "Backlog",
];

const SAMPLE_STATUSES = [
  "Open", "In Progress", "Closed", "Resolved", "On Hold",
];

const FILTER_TYPES = ["Tags", "Date", "Status"] as const;
type FilterType = (typeof FILTER_TYPES)[number];

type FilterRow = {
  id: number;
  type: FilterType;
  values: string[];
  dateValue?: string;
};

// ─── Color palettes ─────────────────────────────────────────────────────────

type Palette = {
  containerBg:     string;
  containerBorder: string;
  label:           string;
  text:            string;
  muted:           string;
  chipBg:          string;
  chipColor:       string;
  inputBorder:     string;
  inputBg:         string;
  btnBg:           string;
  btnText:         string;
  dropdownBg:      string;
  dropdownHover:   string;
  dropdownBorder:  string;
  dropdownShadow:  string;
};

const LIGHT: Palette = {
  containerBg:     "#FFFFFF",
  containerBorder: "#E5E7EB",
  label:           "#052942",
  text:            "#052942",
  muted:           "#6B7280",
  chipBg:          "#E5E7EB",
  chipColor:       "#374151",
  inputBorder:     "#D1D5DB",
  inputBg:         "#FFFFFF",
  btnBg:           "#052942",
  btnText:         "#FFFFFF",
  dropdownBg:      "#FFFFFF",
  dropdownHover:   "#F3F4F6",
  dropdownBorder:  "#E5E7EB",
  dropdownShadow:  "0 4px 12px rgba(0,0,0,0.10)",
};

const DARK: Palette = {
  containerBg:     "#26292F",
  containerBorder: "#7A8494",
  label:           "#DBE4F2",
  text:            "#DBE4F2",
  muted:           "#A6AAB6",
  chipBg:          "#343842",
  chipColor:       "#DBE4F2",
  inputBorder:     "#7A8494",
  inputBg:         "#1A1C20",
  btnBg:           "#DBE4F2",
  btnText:         "#1A1C20",
  dropdownBg:      "#26292F",
  dropdownHover:   "#343842",
  dropdownBorder:  "#7A8494",
  dropdownShadow:  "0 4px 16px rgba(0,0,0,0.50)",
};

// ─── Icons (inline SVG to avoid dependency) ─────────────────────────────────

function CaretDown({ size = 14, color }: { size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill={color}>
      <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
    </svg>
  );
}

function XIcon({ size = 12, color }: { size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill={color}>
      <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
    </svg>
  );
}



// ─── Dropdown component ─────────────────────────────────────────────────────

function Dropdown({
  value,
  options,
  onChange,
  palette,
  exclude,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  palette: Palette;
  exclude?: string[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const visible = options.filter((o) => o === value || !exclude?.includes(o));

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 12px",
          minWidth: "120px",
          minHeight: "38px",
          boxSizing: "border-box",
          background: palette.inputBg,
          border: `1px solid ${palette.inputBorder}`,
          borderRadius: "6px",
          color: palette.text,
          fontSize: "16px",
          fontWeight: 500,
          fontFamily: "inherit",
          cursor: "pointer",
          outline: "none",
        }}
      >
        <span style={{ flex: 1, textAlign: "left" }}>{value}</span>
        <CaretDown color={palette.muted} />
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            minWidth: "100%",
            background: palette.dropdownBg,
            border: `1px solid ${palette.dropdownBorder}`,
            borderRadius: "6px",
            boxShadow: palette.dropdownShadow,
            zIndex: 10,
            overflow: "hidden",
          }}
        >
          {visible.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              style={{
                display: "block",
                width: "100%",
                padding: "8px 12px",
                textAlign: "left",
                background: "transparent",
                border: "none",
                color: palette.text,
                fontSize: "16px",
                fontFamily: "inherit",
                cursor: "pointer",
                outline: "none",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = palette.dropdownHover; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Tag input with typeahead ───────────────────────────────────────────────

function TagInput({
  values,
  onAdd,
  onRemove,
  available,
  palette,
}: {
  values: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
  available: string[];
  palette: Palette;
}) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions = query.length > 0
    ? available.filter(
        (t) => !values.includes(t) && t.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const showDropdown = focused && suggestions.length > 0;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={containerRef} style={{ position: "relative", flex: 1 }}>
      <div
        onClick={() => inputRef.current?.focus()}
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "6px",
          padding: "6px 10px",
          minHeight: "38px",
          background: palette.inputBg,
          border: `1px solid ${palette.inputBorder}`,
          borderRadius: "6px",
          cursor: "text",
        }}
      >
        {values.map((tag) => (
          <span
            key={tag}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "3px 8px",
              background: palette.chipBg,
              color: palette.chipColor,
              borderRadius: "4px",
              fontSize: "14px",
              fontWeight: 500,
              lineHeight: 1.2,
              whiteSpace: "nowrap",
            }}
          >
            {tag}
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(tag); }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "1px",
                outline: "none",
              }}
            >
              <XIcon size={10} color={palette.chipColor} />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && query === "" && values.length > 0) {
              onRemove(values[values.length - 1]);
            }
            if (e.key === "Enter" && suggestions.length > 0) {
              e.preventDefault();
              onAdd(suggestions[0]);
              setQuery("");
            }
          }}
          placeholder={values.length === 0 ? "Type to search..." : ""}
          style={{
            flex: 1,
            minWidth: "60px",
            border: "none",
            outline: "none",
            background: "transparent",
            color: palette.text,
            fontSize: "16px",
            fontFamily: "inherit",
            padding: "2px 0",
          }}
        />
      </div>
      {showDropdown && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            background: palette.dropdownBg,
            border: `1px solid ${palette.dropdownBorder}`,
            borderRadius: "6px",
            boxShadow: palette.dropdownShadow,
            zIndex: 10,
            overflow: "hidden",
            maxHeight: "160px",
            overflowY: "auto",
          }}
        >
          {suggestions.map((tag) => (
            <button
              key={tag}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => { onAdd(tag); setQuery(""); inputRef.current?.focus(); }}
              style={{
                display: "block",
                width: "100%",
                padding: "8px 12px",
                textAlign: "left",
                background: "transparent",
                border: "none",
                color: palette.text,
                fontSize: "16px",
                fontFamily: "inherit",
                cursor: "pointer",
                outline: "none",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = palette.dropdownHover; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Status chip picker ─────────────────────────────────────────────────────

function StatusInput({
  values,
  onToggle,
  palette,
}: {
  values: string[];
  onToggle: (status: string) => void;
  palette: Palette;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", flex: 1 }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "6px",
          padding: "6px 10px",
          minHeight: "38px",
          background: palette.inputBg,
          border: `1px solid ${palette.inputBorder}`,
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        {values.length === 0 && (
          <span style={{ color: palette.muted, fontSize: "16px" }}>Select status...</span>
        )}
        {values.map((s) => (
          <span
            key={s}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "3px 8px",
              background: palette.chipBg,
              color: palette.chipColor,
              borderRadius: "4px",
              fontSize: "14px",
              fontWeight: 500,
              lineHeight: 1.2,
              whiteSpace: "nowrap",
            }}
          >
            {s}
            <button
              onClick={(e) => { e.stopPropagation(); onToggle(s); }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "1px",
                outline: "none",
              }}
            >
              <XIcon size={10} color={palette.chipColor} />
            </button>
          </span>
        ))}
      </div>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            background: palette.dropdownBg,
            border: `1px solid ${palette.dropdownBorder}`,
            borderRadius: "6px",
            boxShadow: palette.dropdownShadow,
            zIndex: 10,
            overflow: "hidden",
          }}
        >
          {SAMPLE_STATUSES.map((s) => {
            const active = values.includes(s);
            return (
              <button
                key={s}
                onClick={() => onToggle(s)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  width: "100%",
                  padding: "8px 12px",
                  textAlign: "left",
                  background: "transparent",
                  border: "none",
                  color: palette.text,
                  fontSize: "16px",
                  fontFamily: "inherit",
                  cursor: "pointer",
                  fontWeight: active ? 600 : 400,
                  outline: "none",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = palette.dropdownHover; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{
                  width: "14px",
                  height: "14px",
                  borderRadius: "3px",
                  border: `1.5px solid ${active ? palette.btnBg : palette.inputBorder}`,
                  background: active ? palette.btnBg : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  {active && <XIcon size={8} color={palette.btnText} />}
                </span>
                {s}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Chevron icons for month nav ────────────────────────────────────────────

function ChevronLeft({ size = 14, color }: { size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill={color}>
      <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z" />
    </svg>
  );
}

function ChevronRight({ size = 14, color }: { size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill={color}>
      <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
    </svg>
  );
}

// ─── Date picker (single-month calendar) ────────────────────────────────────

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function DateInput({
  value,
  onChange,
  palette,
}: {
  value: string;
  onChange: (v: string) => void;
  palette: Palette;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  }

  function selectDay(day: number) {
    const m = String(viewMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    onChange(`${viewYear}-${m}-${d}`);
    setOpen(false);
  }

  const displayValue = value
    ? new Date(value + "T00:00:00").toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      })
    : "";

  const selectedDay =
    value &&
    parseInt(value.slice(0, 4)) === viewYear &&
    parseInt(value.slice(5, 7)) - 1 === viewMonth
      ? parseInt(value.slice(8, 10))
      : null;

  const todayDay =
    today.getFullYear() === viewYear && today.getMonth() === viewMonth
      ? today.getDate()
      : null;

  return (
    <div ref={ref} style={{ position: "relative", flex: 1 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          width: "100%",
          padding: "8px 10px",
          minHeight: "38px",
          background: palette.inputBg,
          border: `1px solid ${palette.inputBorder}`,
          borderRadius: "6px",
          color: value ? palette.text : palette.muted,
          fontSize: "16px",
          fontFamily: "inherit",
          cursor: "pointer",
          outline: "none",
          textAlign: "left",
          boxSizing: "border-box",
        }}
      >
        {displayValue || "Select date..."}
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            background: palette.dropdownBg,
            border: `1px solid ${palette.dropdownBorder}`,
            borderRadius: "6px",
            boxShadow: palette.dropdownShadow,
            zIndex: 10,
            padding: "12px",
            width: "252px",
          }}
        >
          {/* Month/year header with nav */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "8px",
          }}>
            <button
              onClick={prevMonth}
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "4px", outline: "none", display: "flex",
              }}
            >
              <ChevronLeft color={palette.text} />
            </button>
            <span style={{
              color: palette.text, fontSize: "13px", fontWeight: 600,
            }}>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <button
              onClick={nextMonth}
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "4px", outline: "none", display: "flex",
              }}
            >
              <ChevronRight color={palette.text} />
            </button>
          </div>

          {/* Weekday headers */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "2px",
            marginBottom: "4px",
          }}>
            {WEEKDAYS.map((d) => (
              <span key={d} style={{
                textAlign: "center",
                fontSize: "11px",
                fontWeight: 500,
                color: palette.muted,
                padding: "2px 0",
              }}>
                {d}
              </span>
            ))}
          </div>

          {/* Day grid — only days in this month */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "2px",
          }}>
            {/* Empty cells before the 1st */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <span key={`e-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isSelected = day === selectedDay;
              const isToday = day === todayDay;
              return (
                <button
                  key={day}
                  onClick={() => selectDay(day)}
                  style={{
                    width: "30px",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontFamily: "inherit",
                    fontWeight: isSelected || isToday ? 600 : 400,
                    background: isSelected ? palette.btnBg : "transparent",
                    color: isSelected ? palette.btnText : palette.text,
                    border: isToday && !isSelected
                      ? `1px solid ${palette.inputBorder}`
                      : "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    outline: "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.background = palette.dropdownHover;
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.background = "transparent";
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── EuFilters ──────────────────────────────────────────────────────────────

let nextId = 2;

const INITIAL_ROWS: FilterRow[] = [
  { id: 1, type: "Tags", values: ["Feature", "New"] },
];

export function EuFilters() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [rows, setRows] = useState<FilterRow[]>(INITIAL_ROWS);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  const palette = theme === "dark" ? DARK : LIGHT;

  const usedTypes = rows.map((r) => r.type);

  const updateRow = useCallback((id: number, patch: Partial<FilterRow>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }, []);

  const deleteRow = useCallback((id: number) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const addRow = useCallback(() => {
    const available = FILTER_TYPES.filter((t) => !usedTypes.includes(t));
    if (available.length === 0) return;
    setRows((prev) => [...prev, { id: nextId++, type: available[0], values: [] }]);
  }, [usedTypes]);

  const clearAll = useCallback(() => {
    setRows([{ id: 1, type: "Tags", values: [] }]);
  }, []);

  return (
    <div
      className="eu-scope"
      style={{
        // Expressive craft moment: the entire filter panel fades in as a unit,
        // then individual row additions animate in — layered reveals that show
        // the UI building itself, echoing how a user progressively refines a query.
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(6px)",
        transition: "opacity 250ms ease, transform 250ms ease",
      }}
    >
      <div
        style={{
          background: palette.containerBg,
          border: `1px solid ${palette.containerBorder}`,
          borderRadius: "8px",
          padding: "16px",
          width: "480px",
          maxWidth: "100%",
          boxShadow: "0 1px 4px rgba(0,0,0,0.30)",
          transition: "background-color 180ms ease, border-color 180ms ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "12px",
          }}
        >
          <span style={{ color: palette.label, fontSize: "14px", fontWeight: 600 }}>
            Filters
          </span>
          <button
            onClick={clearAll}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "none",
              border: "none",
              color: palette.text,
              fontSize: "14px",
              fontWeight: 500,
              fontFamily: "inherit",
              cursor: "pointer",
              padding: "4px 0",
              outline: "none",
            }}
          >
            <Broom size={18} color={palette.text} weight="fill" />
            Clear all
          </button>
        </div>

        {/* Filter rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {rows.map((row) => (
            <div
              key={row.id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "16px",
              }}
            >
              <Dropdown
                value={row.type}
                options={[...FILTER_TYPES]}
                exclude={usedTypes.filter((t) => t !== row.type)}
                onChange={(v) => updateRow(row.id, {
                  type: v as FilterType,
                  values: [],
                  dateValue: "",
                })}
                palette={palette}
              />

              {row.type === "Tags" && (
                <TagInput
                  values={row.values}
                  available={SAMPLE_TAGS}
                  onAdd={(tag) => updateRow(row.id, { values: [...row.values, tag] })}
                  onRemove={(tag) => updateRow(row.id, { values: row.values.filter((v) => v !== tag) })}
                  palette={palette}
                />
              )}
              {row.type === "Status" && (
                <StatusInput
                  values={row.values}
                  onToggle={(s) =>
                    updateRow(row.id, {
                      values: row.values.includes(s)
                        ? row.values.filter((v) => v !== s)
                        : [...row.values, s],
                    })
                  }
                  palette={palette}
                />
              )}
              {row.type === "Date" && (
                <DateInput
                  value={row.dateValue ?? ""}
                  onChange={(v) => updateRow(row.id, { dateValue: v })}
                  palette={palette}
                />
              )}

              <button
                onClick={() => deleteRow(row.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "38px",
                  minHeight: "38px",
                  alignSelf: "stretch",
                  boxSizing: "border-box",
                  padding: 0,
                  background: palette.containerBg,
                  border: `1px solid ${palette.containerBorder}`,
                  borderRadius: "6px",
                  cursor: "pointer",
                  flexShrink: 0,
                  outline: "none",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                }}
              >
                <Trash size={18} color={palette.text} weight="fill" />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "12px",
          }}
        >
          <button
            onClick={addRow}
            disabled={usedTypes.length >= FILTER_TYPES.length}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "none",
              border: "none",
              color: usedTypes.length >= FILTER_TYPES.length ? palette.muted : palette.text,
              fontSize: "14px",
              fontWeight: 500,
              fontFamily: "inherit",
              cursor: usedTypes.length >= FILTER_TYPES.length ? "default" : "pointer",
              padding: "4px 0",
              outline: "none",
            }}
          >
            <PlusCircle
              size={18}
              color={usedTypes.length >= FILTER_TYPES.length ? palette.muted : palette.text}
              weight="regular"
            />
            Add another filter
          </button>

          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 12px",
              background: palette.containerBg,
              border: `1px solid ${palette.containerBorder}`,
              color: palette.text,
              fontSize: "14px",
              fontWeight: 600,
              fontFamily: "inherit",
              cursor: "pointer",
              borderRadius: "6px",
              outline: "none",
              boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
            }}
          >
            <CheckCircle size={18} color={palette.btnBg} weight="fill" />
            Save &amp; apply
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Renderer ───────────────────────────────────────────────────────────────

export function EuFiltersRenderer(values: ComponentControlValues): ReactNode {
  void values;
  return <EuFilters />;
}
