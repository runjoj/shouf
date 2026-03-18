"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  ACCENT_PRESETS,
  DEFAULT_ACCENT_ID,
  applyAccentPreset,
} from "./accent";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Theme = "light" | "dark";

interface ThemeCtx {
  theme:       Theme;
  toggleTheme: () => void;
  setTheme:    (t: Theme) => void;
  accentId:    string;
  setAccent:   (id: string) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ThemeContext = createContext<ThemeCtx | null>(null);

// ─── Helper ───────────────────────────────────────────────────────────────────

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try { localStorage.setItem("pf-theme", theme); } catch { /* ignore */ }
}

// ─── ThemeProvider ────────────────────────────────────────────────────────────

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme,    setTheme]    = useState<Theme>("dark");
  const [accentId, setAccentId] = useState<string>(DEFAULT_ACCENT_ID);

  // ── One-time init: read persisted theme + accent, apply both ────────────────
  useEffect(() => {
    const existing = document.documentElement.getAttribute("data-theme") as Theme | null;
    const t: Theme = (existing === "light" || existing === "dark") ? existing : "dark";
    if (!existing) applyTheme(t);
    setTheme(t);

    try {
      const savedAccent = localStorage.getItem("pf-accent");
      const preset =
        ACCENT_PRESETS.find((p) => p.id === savedAccent) ??
        ACCENT_PRESETS.find((p) => p.id === DEFAULT_ACCENT_ID)!;
      setAccentId(preset.id);
      applyAccentPreset(preset, t);
    } catch { /* ignore */ }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Re-apply accent whenever theme switches so fg colours update ─────────────
  // useRef avoids the stale-closure problem: the ref mutates synchronously
  // so the next effect invocation always sees the current value.
  const didInit = useRef(false);
  useEffect(() => {
    if (!didInit.current) { didInit.current = true; return; }
    const preset = ACCENT_PRESETS.find((p) => p.id === accentId) ?? ACCENT_PRESETS[0];
    applyAccentPreset(preset, theme);
  }, [theme]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Public API ───────────────────────────────────────────────────────────────

  const toggleTheme = () => {
    setTheme((prev) => {
      const next: Theme = prev === "light" ? "dark" : "light";
      applyTheme(next);
      // Apply accent synchronously with the surface change — if we defer to the
      // useEffect the accent stays at its old-theme value for one paint frame,
      // causing a visible flash of the wrong colour on the new background.
      const preset = ACCENT_PRESETS.find((p) => p.id === accentId) ?? ACCENT_PRESETS[0];
      applyAccentPreset(preset, next);
      return next;
    });
  };

  const setThemeDirect = (t: Theme) => {
    applyTheme(t);
    const preset = ACCENT_PRESETS.find((p) => p.id === accentId) ?? ACCENT_PRESETS[0];
    applyAccentPreset(preset, t);
    setTheme(t);
  };

  const setAccent = (id: string) => {
    const preset = ACCENT_PRESETS.find((p) => p.id === id);
    if (!preset) return;
    setAccentId(id);
    applyAccentPreset(preset, theme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme: setThemeDirect, accentId, setAccent }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ─── useTheme ─────────────────────────────────────────────────────────────────

export function useTheme(): ThemeCtx {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
