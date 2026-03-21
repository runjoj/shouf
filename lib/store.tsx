"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type {
  AppStore,
  MobilePanel,
  ControlValue,
  ComponentControlValues,
} from "./types";
import { navSections } from "@/data/navigation";
import { COMPONENT_REGISTRY } from "./registry";

// ─── Context ───────────────────────────────────────────────────────────────────

const AppContext = createContext<AppStore | null>(null);

// ─── Seed controlValues from registry defaults ─────────────────────────────────

function buildInitialControlValues(): Record<string, ComponentControlValues> {
  const result: Record<string, ComponentControlValues> = {};
  for (const [id, reg] of Object.entries(COMPONENT_REGISTRY)) {
    result[id] = { ...reg.defaultValues };
  }
  return result;
}

// ─── Provider ──────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [selectedSectionId,   setSelectedSectionId]   = useState<string | null>(null);
  const [activeMobilePanel, setActiveMobilePanel] = useState<MobilePanel>("canvas");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    () => new Set(navSections.map((s) => s.id))
  );
  const [controlValues, setControlValuesState] = useState<
    Record<string, ComponentControlValues>
  >(buildInitialControlValues);
  const [launched, setLaunched] = useState(false);

  const selectComponent = useCallback((id: string | null) => {
    setSelectedComponentId(id);
  }, []);

  // Navigate to a section grid. Non-null id also clears the component selection
  // so the grid always opens fresh with no tile pre-highlighted.
  const selectSection = useCallback((id: string | null) => {
    setSelectedSectionId(id);
    if (id !== null) setSelectedComponentId(null);
  }, []);

  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  }, []);

  const setControlValue = useCallback(
    (componentId: string, controlId: string, value: ControlValue) => {
      setControlValuesState((prev) => ({
        ...prev,
        [componentId]: {
          ...prev[componentId],
          [controlId]: value,
        },
      }));
    },
    []
  );

  // Called by IntroAnimation when assembly completes — reveals panels, selects Welcome
  const launch = useCallback(() => {
    setSelectedComponentId("welcome");
    setSelectedSectionId(null);
    setLaunched(true);
  }, []);

  // Navigate to Welcome page (logo click) — does not replay intro
  const reset = useCallback(() => {
    setSelectedComponentId("welcome");
    setSelectedSectionId(null);
  }, []);

  const store = useMemo<AppStore>(
    () => ({
      selectedComponentId,
      selectedSectionId,
      activeMobilePanel,
      expandedSections,
      controlValues,
      launched,
      selectComponent,
      selectSection,
      setActiveMobilePanel,
      toggleSection,
      setControlValue,
      launch,
      reset,
    }),
    [
      selectedComponentId,
      selectedSectionId,
      activeMobilePanel,
      expandedSections,
      controlValues,
      launched,
      selectComponent,
      selectSection,
      toggleSection,
      setControlValue,
      launch,
      reset,
    ]
  );

  return <AppContext.Provider value={store}>{children}</AppContext.Provider>;
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function useAppStore(): AppStore {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppStore must be used within AppProvider");
  return ctx;
}
