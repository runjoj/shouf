// ─── Presentation slide types ──────────────────────────────────────────────

export type Slide =
  | { type: "title"; kicker: string; title: string; sub: string | string[] }
  | { type: "divider"; num: string; title: string; company: string; role: string }
  | {
      type: "statement";
      label: string;
      headline: string;
      body?: string;
      body2?: string;
      size?: "sm" | "md" | "lg";
      // Optional supporting reasons, rendered beneath the copy — for decisions
      // that hinge on a few named trade-offs. "row" (default) is a compact
      // single line of small items; "grid" is a larger 2×2 with heading-sized
      // labels, for when the reasons carry more weight.
      points?: Array<{ label: string; detail: string }>;
      pointsLayout?: "row" | "grid";
      // Numbered by default; set false for comparisons (e.g. A vs B) where an
      // ordinal would imply a sequence that isn't there.
      numberedPoints?: boolean;
      // A concrete "case in point" set off in a bordered callout beneath the copy.
      example?: { label?: string; text: string };
    }
  | {
      type: "image";
      label: string;
      headline?: string;
      src: string;
      alt: string;
      caption?: string;
      placeholderNote?: string;
      align?: "center" | "left";
      maxHeight?: string;
      framed?: boolean;
    }
  | {
      type: "two-image";
      label: string;
      headline?: string;
      images: Array<{ src: string; alt: string; caption: string }>;
    }
  | {
      type: "stats";
      label: string;
      headline?: string;
      stats: Array<{ value: string; label: string }>;
      note?: string;
    }
  | {
      type: "diagram";
      label: string;
      headline: string;
      body?: string;
      diagram: "theme-contrast";
      image?: { src: string; alt: string; placeholderNote?: string };
    }
  | {
      type: "responsive-pair";
      label: string;
      headline?: string;
      caption?: string;
      // Each column is a vertical stack (e.g. light on top of dark). `framed`
      // draws a hairline edge — needed for near-white light-mode cards so they
      // don't float on the paper ground; dark cards read fine bare.
      desktop: Array<{ src: string; alt: string; placeholderNote?: string; framed?: boolean }>;
      mobile: Array<{ src: string; alt: string; placeholderNote?: string; framed?: boolean }>;
      // Per-image cap. Defaults small for stacked columns; raise it when each
      // column holds a single image that should read large.
      imageMaxHeight?: string;
      // Device labels ("Desktop" / "Mobile") — on by default; drop them when the
      // form factor is already obvious from the images and space is precious.
      showDeviceLabels?: boolean;
      // Override the two-column grid template. Default gives desktop ~1.9× the
      // mobile column; widen it to push the desktop shot larger.
      columnRatio?: string;
      // Gap between the desktop and mobile columns.
      columnGap?: string;
    }
  | { type: "timeline"; label: string; headline: string; body?: string }
  | { type: "live-nav"; label: string; headline?: string; caption?: string }
  | {
      type: "list";
      label: string;
      headline?: string;
      items: string[];
      note?: string;
    }
  | { type: "quote"; quote: string; attribution?: string }
  | { type: "questions"; label?: string }
  | { type: "close"; name: string };
