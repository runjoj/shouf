import type { TokenRow as TokenRowType, TokenCategory } from "@/lib/types";

// ─── Category accent colors ──────────────────────────────────────────────────

const CATEGORY_COLORS: Record<TokenCategory, string> = {
  color:      "var(--sh-accent)",       // lavender
  shadow:     "var(--sh-accent-blue)",  // soft blue
  typography: "var(--sh-accent-blue)",  // soft blue
  spacing:    "var(--sh-accent-rose)",  // dusty rose
  radius:     "var(--sh-accent-rose)",  // dusty rose
};

type TokenRowProps = {
  row: TokenRowType;
  isEmpty?: boolean;
};

export function TokenRow({ row, isEmpty = false }: TokenRowProps) {
  if (isEmpty) {
    return (
      <div className="flex items-center justify-between py-2 px-3 rounded-md opacity-30">
        <div className="h-2 rounded-full" style={{ width: "80px", backgroundColor: "var(--sh-skeleton)" }} />
        <div className="h-2 rounded-full" style={{ width: "60px", backgroundColor: "var(--sh-skeleton)" }} />
      </div>
    );
  }

  const accentColor = CATEGORY_COLORS[row.category];

  return (
    <div
      className="group flex items-center justify-between py-[7px] px-3 rounded-md transition-colors"
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--sh-hover)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")
      }
    >
      {/* Left: property + token */}
      <div className="flex flex-col gap-0.5">
        <span className="text-[11px] font-medium" style={{ color: "var(--sh-text)" }}>
          {row.property}
        </span>
        <span className="text-[10px] font-mono" style={{ color: "var(--sh-text-faint)" }}>
          {row.tokenName}
        </span>
      </div>

      {/* Right: css value with category dot */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-mono" style={{ color: "var(--sh-text-muted)" }}>
          {row.cssValue}
        </span>
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: accentColor }}
          title={row.category}
        />
      </div>
    </div>
  );
}
