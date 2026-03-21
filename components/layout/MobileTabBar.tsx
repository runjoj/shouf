"use client";

import { useAppStore } from "@/lib/store";
import type { MobilePanel } from "@/lib/types";

// ─── Tab definitions ─────────────────────────────────────────────────────────

type TabDef = {
  id: MobilePanel;
  label: string;
  icon: React.ReactNode;
};

const TABS: TabDef[] = [
  {
    id: "navigator",
    label: "Navigator",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
        <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
        <path d="M10 4h4M10 8h4M10 12h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "canvas",
    label: "Canvas",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1.5" y="1.5" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.3" />
        <rect x="4" y="4" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.3" strokeDasharray="2 1.5" />
      </svg>
    ),
  },
  {
    id: "inspect",
    label: "Inspect",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.3" />
        <path d="M2 6h12" stroke="currentColor" strokeWidth="1.3" />
        <path d="M7 6v8" stroke="currentColor" strokeWidth="1.3" />
        <path d="M4 9h1.5M4 12h1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M9 9h3M9 12h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
];

// ─── MobileTabBar ─────────────────────────────────────────────────────────────

export function MobileTabBar() {
  const { activeMobilePanel, setActiveMobilePanel } = useAppStore();

  return (
    <div
      className="flex items-stretch border-t shrink-0"
      style={{
        borderColor:          "var(--shouf-border-sub)",
        backgroundColor:      "var(--shouf-panel)",
        paddingBottom:        "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {TABS.map((tab) => {
        const isActive = activeMobilePanel === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveMobilePanel(tab.id)}
            className="flex flex-col items-center justify-center gap-1 flex-1 py-2.5 relative transition-colors"
            style={{ color: isActive ? "var(--shouf-accent)" : "var(--shouf-text-muted)" }}
          >
            {tab.icon}
            <span className="text-[10px] font-medium">{tab.label}</span>
            {isActive && (
              <span
                className="absolute top-0 left-3 right-3 h-[2px] rounded-b"
                style={{ backgroundColor: "var(--shouf-accent)" }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
