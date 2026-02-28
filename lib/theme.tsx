"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  ACCENT_PRESETS,
  DEFAULT_ACCENT_ID,
  applyAccentPreset,
  applyAccentById,
} from "./accent";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Theme = "light" | "dark";

interface ThemeCtx {
  theme:       Theme;
  toggleTheme: () => void;
  accentId:    string;
  setAccent:   (id: string) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ThemeContext = createContext<ThemeCtx | null>(null);

// ─── Helper ───────────────────────────────────────────────────────────────────

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem("pf-theme", theme);
  } catch {
    // ignore (e.g. private browsing)
  }
}

// ─── ThemeProvider ────────────────────────────────────────────────────────────

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Default to "dark" — FOUC prevention script in layout.tsx sets the
  // data-theme attr synchronously before hydration, so the visual state is
  // already correct; we just need to keep React state in sync.
  const [theme, setTheme] = useState<Theme>("dark");
  const [accentId, setAccentId] = useState<string>(DEFAULT_ACCENT_ID);

  useEffect(() => {
    // ── Sync theme with what FOUC script already applied ─────────────────────
    const existing = document.documentElement.getAttribute(
      "data-theme"
    ) as Theme | null;
    if (existing === "light" || existing === "dark") {
      setTheme(existing);
    } else {
      // No attr yet — default to dark
      applyTheme("dark");
      setTheme("dark");
    }

    // ── Restore saved accent color ────────────────────────────────────────────
    try {
      const saved = localStorage.getItem("pf-accent");
      if (saved && ACCENT_PRESETS.find((p) => p.id === saved)) {
        setAccentId(saved);
        applyAccentById(saved);
      }
    } catch { /* ignore */ }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next: Theme = prev === "light" ? "dark" : "light";
      applyTheme(next);
      return next;
    });
  };

  const setAccent = (id: string) => {
    const preset = ACCENT_PRESETS.find((p) => p.id === id);
    if (!preset) return;
    setAccentId(id);
    applyAccentPreset(preset);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, accentId, setAccent }}>
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
