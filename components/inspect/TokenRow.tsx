import type { TokenRow as TokenRowType, TokenCategory } from "@/lib/types";

// ─── Category accent colors ──────────────────────────────────────────────────

const CATEGORY_COLORS: Record<TokenCategory, string> = {
  color:      "var(--shouf-accent)",       // lavender
  shadow:     "var(--shouf-accent-blue)",  // soft blue
  typography: "var(--shouf-accent-blue)",  // soft blue
  spacing:    "var(--shouf-accent-rose)",  // dusty rose
  radius:     "var(--shouf-accent-rose)",  // dusty rose
};

type TokenRowProps = {
  row: TokenRowType;
  isEmpty?: boolean;
};

export function TokenRow({ row, isEmpty = false }: TokenRowProps) {
  if (isEmpty) {
    return (
      <div className="flex items-center justify-between py-2 px-3 rounded-md opacity-30">
        <div className="h-2 rounded-full" style={{ width: "80px", backgroundColor: "var(--shouf-skeleton)" }} />
        <div className="h-2 rounded-full" style={{ width: "60px", backgroundColor: "var(--shouf-skeleton)" }} />
      </div>
    );
  }

  const accentColor = CATEGORY_COLORS[row.category];

  return (
    <div
      className="group flex items-center justify-between py-[7px] px-3 rounded-md transition-colors"
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--shouf-hover)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")
      }
    >
      {/* Left: property + token */}
      <div className="flex flex-col gap-0.5">
        <span className="text-[12px] font-medium" style={{ color: "var(--shouf-text)" }}>
          {row.property}
        </span>
        <span className="text-[12px] font-mono" style={{ color: "var(--shouf-text-faint)" }}>
          {row.tokenName}
        </span>
      </div>

      {/* Right: css value with category dot (hidden for typography) */}
      <div className="flex items-center gap-2">
        <span className="text-[12px] font-mono" style={{ color: "var(--shouf-text-muted)" }}>
          {row.cssValue}
        </span>
        {row.category !== "typography" && (
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: row.category === "color" ? row.cssValue : accentColor }}
            title={row.category}
          />
        )}
      </div>
    </div>
  );
}
