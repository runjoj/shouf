"use client";

import { useAppStore } from "@/lib/store";
import { navSections } from "@/data/navigation";

// ─── No-Selection State ─────────────────────────────────────────────────────

function NoSelectionState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 select-none">
      {/* Icon placeholder */}
      <div
        className="flex items-center justify-center w-14 h-14 rounded-xl"
        style={{ backgroundColor: "var(--shouf-hover)", border: "1px solid var(--shouf-border)", color: "var(--shouf-text-faint)" }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect
            x="3" y="3" width="18" height="18" rx="3"
            stroke="currentColor" strokeWidth="1.5"
          />
          <path
            d="M3 9h18M9 3v18"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-sm font-medium" style={{ color: "var(--shouf-text-muted)" }}>
          No component selected
        </p>
        <p className="text-xs" style={{ color: "var(--shouf-text-faint)" }}>
          Choose a component from the navigator to preview it here
        </p>
      </div>
    </div>
  );
}

// ─── Placeholder Component State ────────────────────────────────────────────

function PlaceholderComponentState({ componentId }: { componentId: string }) {
  // Find the entry name for display
  const entry = navSections
    .flatMap((s) => s.entries)
    .find((e) => e.id === componentId);

  const section = navSections.find((s) => s.id === entry?.sectionId);

  return (
    <div className="flex flex-col items-center justify-center gap-5 select-none">
      {/* Breadcrumb */}
      {entry && section && (
        <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "#484852" }}>
          <span>{section.title}</span>
          <span>/</span>
          <span style={{ color: "#8a8a96" }}>{entry.name}</span>
        </div>
      )}

      {/* Placeholder component card */}
      <div
        className="flex flex-col items-center justify-center gap-3 w-64 h-40 rounded-xl"
        style={{
          backgroundColor: "#18181c",
          border: "1px solid #2c2c33",
          boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
        }}
      >
        {/* Shimmer placeholder lines */}
        <div className="flex flex-col gap-2 w-40">
          <div
            className="h-3 rounded-full"
            style={{ backgroundColor: "#2c2c33", width: "80%" }}
          />
          <div
            className="h-2 rounded-full"
            style={{ backgroundColor: "#222228", width: "60%" }}
          />
          <div
            className="h-2 rounded-full"
            style={{ backgroundColor: "#222228", width: "70%" }}
          />
        </div>
        <div
          className="h-7 rounded-md"
          style={{ backgroundColor: "#2c2c33", width: "96px" }}
        />
      </div>

      {entry && (
        <p className="text-xs" style={{ color: "#484852" }}>
          <span style={{ color: "#5b6af5" }}>{entry.name}</span>
          {" "}— component placeholder
        </p>
      )}
    </div>
  );
}

// ─── EmptyCanvas ────────────────────────────────────────────────────────────

export function EmptyCanvas() {
  const { selectedComponentId } = useAppStore();

  return (
    <div className="canvas-grid flex-1 flex items-center justify-center">
      {selectedComponentId ? (
        <PlaceholderComponentState componentId={selectedComponentId} />
      ) : (
        <NoSelectionState />
      )}
    </div>
  );
}
