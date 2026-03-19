import { InspectPanel } from "@/components/inspect/InspectPanel";

// ─── RightPanel ──────────────────────────────────────────────────────────────
// Tab management lives inside InspectPanel — this is just the outer container.

export function RightPanel() {
  return (
    <aside
      className="flex flex-col h-full overflow-hidden"
      style={{
        backgroundColor: "var(--sh-panel)",
        borderLeft: "1px solid var(--sh-border-sub)",
        width: "280px",
      }}
    >
      <InspectPanel />
    </aside>
  );
}
