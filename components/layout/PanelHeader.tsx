import type { ReactNode } from "react";

type PanelHeaderProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
};

export function PanelHeader({ title, subtitle, actions }: PanelHeaderProps) {
  return (
    <div
      className="shrink-0 flex items-center gap-3 px-4 h-[44px]"
      style={{ borderBottom: "1px solid #222228" }}
    >
      <div className="flex flex-col justify-center gap-px flex-1 min-w-0">
        <span className="text-[14px] font-semibold leading-none truncate"
          style={{ color: "#e2e2e8" }}>
          {title}
        </span>
        {subtitle && (
          <span className="text-[12px] leading-none truncate"
            style={{ color: "#484852" }}>
            {subtitle}
          </span>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-1.5 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}
