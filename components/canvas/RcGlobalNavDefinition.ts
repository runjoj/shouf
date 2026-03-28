import type { ComponentRegistration, ComponentControlValues, TokenRow } from "@/lib/types";

// ─── Breakpoint constants — must match RcGlobalNavCanvas ─────────────────────
const BP_TABLET = 720;
const BP_MOBILE = 500;

// ─── Token lookup tables ────────────────────────────────────────────────────────

const VIEWPORT_TOKENS: Record<string, { label: string; width: string; sidebar: string; header: string }> = {
  desktop: { label: "Desktop", width: "≥ 720px",  sidebar: "collapsible",   header: "inline search" },
  tablet:  { label: "Tablet",  width: "< 720px",  sidebar: "drawer overlay", header: "icon search" },
  mobile:  { label: "Mobile",  width: "< 500px",  sidebar: "drawer overlay", header: "compact avatar" },
};

// ─── getTokens ──────────────────────────────────────────────────────────────────

function getTokens(values: ComponentControlValues): TokenRow[] {
  const viewport = (values.viewport as string) || "desktop";
  const collapsed = values.collapsed === true;
  const vt = VIEWPORT_TOKENS[viewport] ?? VIEWPORT_TOKENS.desktop;

  const sidebarW = viewport === "desktop"
    ? (collapsed ? "64px" : "240px")
    : viewport === "tablet" ? "280px" : "100%";

  const headerH = viewport === "desktop" ? "60px" : "56px";

  const rows: TokenRow[] = [
    // ── Layout
    {
      id: "breakpoint",
      property: "breakpoint",
      cssValue: vt.width,
      tokenName: viewport === "mobile" ? `< ${BP_MOBILE}px` : viewport === "tablet" ? `< ${BP_TABLET}px` : `≥ ${BP_TABLET}px`,
      category: "spacing",
    },
    {
      id: "sidebar-mode",
      property: "sidebar",
      cssValue: vt.sidebar,
      tokenName: viewport === "desktop" ? "persistent" : "overlay",
      category: "spacing",
    },
    {
      id: "sidebar-width",
      property: "sidebar width",
      cssValue: sidebarW,
      tokenName: viewport === "desktop" ? "--rc-nav-sidebar-w" : "--rc-nav-drawer-w",
      category: "spacing",
    },
    {
      id: "header-height",
      property: "header height",
      cssValue: headerH,
      tokenName: "--rc-nav-header-h",
      category: "spacing",
    },
    {
      id: "nav-item-height",
      property: "item height",
      cssValue: viewport === "desktop" ? "42px" : "44px",
      tokenName: "--rc-nav-item-h",
      category: "spacing",
    },
    {
      id: "nav-padding",
      property: "sidebar padding",
      cssValue: "10px 8px",
      tokenName: "--rc-nav-padding",
      category: "spacing",
    },
    // ── Color
    {
      id: "sidebar-bg",
      property: "sidebar background",
      cssValue: "#FFFFFF",
      tokenName: "--rc-nav-sidebar-bg",
      category: "color",
    },
    {
      id: "content-bg",
      property: "content background",
      cssValue: "#F0EFEB",
      tokenName: "--rc-nav-content-bg",
      category: "color",
    },
    {
      id: "active-bg",
      property: "active background",
      cssValue: "#F5F4F1",
      tokenName: "--rc-nav-active-bg",
      category: "color",
    },
    {
      id: "active-text",
      property: "active color",
      cssValue: "#3D7A30",
      tokenName: "--rc-nav-active-text",
      category: "color",
    },
    {
      id: "nav-text",
      property: "nav text",
      cssValue: "#374151",
      tokenName: "--rc-nav-text",
      category: "color",
    },
    {
      id: "nav-icon",
      property: "icon color",
      cssValue: "#6B7280",
      tokenName: "--rc-nav-icon",
      category: "color",
    },
    {
      id: "border",
      property: "border-color",
      cssValue: "#E5E7EB",
      tokenName: "--rc-nav-border",
      category: "color",
    },
    {
      id: "divider",
      property: "divider color",
      cssValue: "#E9EAEC",
      tokenName: "--rc-nav-divider",
      category: "color",
    },
    {
      id: "brand-green",
      property: "brand accent",
      cssValue: "#3D7A30",
      tokenName: "--rc-nav-brand",
      category: "color",
    },
    // ── Typography
    {
      id: "nav-font",
      property: "font-size",
      cssValue: "13px",
      tokenName: "--rc-nav-font-size",
      category: "typography",
    },
    {
      id: "nav-weight",
      property: "font-weight",
      cssValue: "500",
      tokenName: "--rc-nav-font-weight",
      category: "typography",
    },
    {
      id: "sublabel-font",
      property: "sublabel size",
      cssValue: "10px",
      tokenName: "--rc-nav-sublabel-size",
      category: "typography",
    },
    // ── Radius
    {
      id: "item-radius",
      property: "item radius",
      cssValue: viewport === "desktop" ? "7px" : "7px",
      tokenName: "--rc-nav-item-radius",
      category: "radius",
    },
    {
      id: "frame-radius",
      property: "frame radius",
      cssValue: "10px",
      tokenName: "--rc-nav-frame-radius",
      category: "radius",
    },
    {
      id: "search-radius",
      property: "search radius",
      cssValue: "20px",
      tokenName: "--rc-nav-search-radius",
      category: "radius",
    },
  ];

  // Add viewport-specific tokens
  if (viewport !== "desktop") {
    rows.push({
      id: "drawer-shadow",
      property: "drawer shadow",
      cssValue: viewport === "mobile" ? "none" : "4px 0 24px rgba(0,0,0,0.14)",
      tokenName: "--rc-nav-drawer-shadow",
      category: "color",
    });
    rows.push({
      id: "scrim-bg",
      property: "scrim overlay",
      cssValue: "rgba(0,0,0,0.30)",
      tokenName: "--rc-nav-scrim-bg",
      category: "color",
    });
  }

  if (viewport === "desktop" && collapsed) {
    rows.push({
      id: "flyout-shadow",
      property: "flyout shadow",
      cssValue: "0 8px 24px rgba(0,0,0,0.12)",
      tokenName: "--rc-nav-flyout-shadow",
      category: "color",
    });
  }

  return rows;
}

// ─── Registration ───────────────────────────────────────────────────────────────

export const RC_GLOBAL_NAV_REGISTRATION: ComponentRegistration = {
  id: "rc-global-nav",
  controls: [
    {
      id: "viewport",
      label: "Viewport",
      type: "select",
      defaultValue: "desktop",
      options: [
        { label: "Desktop",  value: "desktop" },
        { label: "Tablet",   value: "tablet"  },
        { label: "Mobile",   value: "mobile"  },
      ],
    },
    {
      id: "collapsed",
      label: "Sidebar Collapsed",
      type: "boolean",
      defaultValue: false,
    },
  ],
  defaultValues: {
    viewport:  "desktop",
    collapsed: false,
  },
  getTokens,
};
