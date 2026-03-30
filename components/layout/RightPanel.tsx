import { InspectPanel } from "@/components/inspect/InspectPanel";

// ─── RightPanel ──────────────────────────────────────────────────────────────
// Tab management lives inside InspectPanel — this is just the outer container.

export function RightPanel() {
  return (
    <aside
      className="flex flex-col h-full overflow-hidden"
      style={{
        backgroundColor: "var(--shouf-panel)",
        borderLeft: "1px solid var(--shouf-border-sub)",
        width: "250px",
      }}
    >
      <InspectPanel />
    </aside>
  );
}
