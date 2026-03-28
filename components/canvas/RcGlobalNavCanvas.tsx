"use client";

// ─── RcGlobalNavCanvas ────────────────────────────────────────────────────────
// Showcases a BambooHR-style Global Navigation component — collapsible sidebar
// + top header — in a simulated browser frame.
//
// Icon library: Font Awesome Free (fa-solid).
//
// Expressive craft moment: when the sidebar expands, labels slide in with a
// per-item stagger (10ms apart). The cascading wave of appearing text makes
// the "space ↔ information density" tradeoff feel mechanical and intentional
// — like opening a fan. Labels vanish instantly on collapse so the animation
// only rewards the reveal direction.
//
// Responsive simulation: drag handle on the right edge of the browser frame.
//   Desktop (≥ 720px) — collapsible sidebar + inline search bar in header
//   Tablet  (< 720px) — sidebar hidden, hamburger opens a drawer overlay,
//                        search icon expands to fill the header
//   Mobile  (< 500px) — same as tablet + expandable sub-nav items in the
//                        drawer, account settings panel from avatar tap,
//                        and a compact bamboo-leaf avatar circle in the header

import { useState, useCallback, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { useAppStore } from "@/lib/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faUser,
  faUsers,
  faClipboardList,
  faChartPie,
  faFile,
  faDollarSign,
  faHeartPulse,
  faDesktop,
  faGlobe,
  faCircleQuestion,
  faGear,
  faChevronLeft,
  faChevronDown,
  faChevronRight,
  faAnglesLeft,
  faAnglesRight,
  faMagnifyingGlass,
  faInbox,
  faWandMagicSparkles,
  faPeopleGroup,
  faFileLines,
  faClock,
  faUserPlus,
  faChartBar,
  faBriefcase,
  faArrowRight,
  faBars,
  faXmark,
  faFolder,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

// ─── Breakpoints ──────────────────────────────────────────────────────────────

const BP_TABLET = 720; // sidebar hides, hamburger + overlay drawer
const BP_MOBILE = 500; // mobile: sub-nav, account panel, avatar-circle header
const BP_MIN    = 320; // minimum frame width

// ─── useScrollbarFade ─────────────────────────────────────────────────────────

function useScrollbarFade<T extends HTMLElement>(fadeDelay = 800) {
  const ref      = useRef<T>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const show = () => {
      el.classList.add("is-scrolling");
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => el.classList.remove("is-scrolling"), fadeDelay);
    };
    el.addEventListener("scroll", show, { passive: true });
    return () => { el.removeEventListener("scroll", show); clearTimeout(timerRef.current); };
  }, [fadeDelay]);
  return ref;
}

// ─── Nav data ─────────────────────────────────────────────────────────────────

type NavEntry = { id: string; label: string; sublabel?: string; icon: IconDefinition; };
type NavRow   = NavEntry | "divider";

const NAV_ROWS: NavRow[] = [
  { id: "home",              label: "Home",              icon: faHouse },
  { id: "my-info",           label: "My Info",           icon: faUser },
  { id: "people",            label: "People",            icon: faUsers },
  { id: "hiring",            label: "Hiring",            icon: faClipboardList },
  { id: "reports",           label: "Reports",           icon: faChartPie },
  { id: "files",             label: "Files",             icon: faFile },
  { id: "payroll",           label: "Payroll",           icon: faDollarSign },
  { id: "benefits",          label: "Benefits",          icon: faHeartPulse },
  { id: "compensation",      label: "Compensation",      icon: faDesktop },
  "divider",
  { id: "community",         label: "Community",         icon: faPeopleGroup },
  { id: "global-employment", label: "Global Employment", sublabel: "Powered by Remote", icon: faGlobe },
  "divider",
  { id: "resources",         label: "Resources",         icon: faCircleQuestion },
  { id: "settings",          label: "Settings",          icon: faGear },
];

// Sub-items for expandable nav items
type SubEntry = { id: string; label: string; count?: number; icon: IconDefinition; };
type SubItem  = SubEntry | "divider";
const NAV_SUB_ITEMS: Record<string, SubItem[]> = {
  "reports": [
    { id: "reports-recent",     label: "Recent",             icon: faClock },
    { id: "reports-dashboards", label: "Dashboards",         icon: faChartBar },
    { id: "reports-standard",   label: "Standard Reports",   icon: faChartPie },
    { id: "reports-benchmarks", label: "Benchmarks",         icon: faDesktop },
    "divider",
    { id: "reports-custom",     label: "Custom Reports",     icon: faClipboardList },
    { id: "reports-new",        label: "New Custom Reports", icon: faWandMagicSparkles },
    "divider",
    { id: "reports-signed",     label: "Signed Documents",   icon: faFileLines },
    { id: "reports-payroll",    label: "Payroll Reports",    icon: faDollarSign },
  ],
  "files": [
    { id: "files-all",       label: "All Files",            icon: faFolder },
    { id: "files-sigs",      label: "Signature Templates",  icon: faFileLines },
    "divider",
    { id: "files-benefits",  label: "Benefits Docs",  count: 137, icon: faFile },
    { id: "files-payroll",   label: "Payroll",        count: 12,  icon: faDollarSign },
    { id: "files-trainings", label: "Trainings",      count: 23,  icon: faUsers },
    { id: "files-policies",  label: "Company Policies", count: 7, icon: faClipboardList },
  ],
};

// Account menu items (mobile drawer footer → account panel)
type AccountItem = { id: string; label: string } | "divider";
const ACCOUNT_ITEMS: AccountItem[] = [
  { id: "account-settings",  label: "Account Settings" },
  { id: "change-password",   label: "Change Password" },
  { id: "two-step",          label: "2-Step Login" },
  { id: "passkeys",          label: "Passkeys" },
  { id: "app-integrations",  label: "App Integrations" },
  { id: "api-keys",          label: "API Keys" },
  "divider",
  { id: "logout",            label: "Logout" },
];

// ─── Search data ──────────────────────────────────────────────────────────────

type SearchCategory = "People" | "Pages" | "Actions";
type SearchResult   = { id: string; label: string; sublabel: string; category: SearchCategory; icon: IconDefinition; };

const ALL_RESULTS: SearchResult[] = [
  { id: "p1",  label: "Alice Johnson",      sublabel: "Senior Engineer · Engineering",     category: "People",  icon: faUser },
  { id: "p2",  label: "Marcus Webb",        sublabel: "Product Designer · Design",         category: "People",  icon: faUser },
  { id: "p3",  label: "Priya Patel",        sublabel: "Engineering Manager · Engineering", category: "People",  icon: faUser },
  { id: "p4",  label: "Derek Okonkwo",      sublabel: "Recruiter · Hiring",                category: "People",  icon: faUser },
  { id: "p5",  label: "Sarah Chen",         sublabel: "Head of People Ops · HR",           category: "People",  icon: faUser },
  { id: "p6",  label: "James Rivera",       sublabel: "Data Analyst · Analytics",          category: "People",  icon: faUser },
  { id: "pg1", label: "Reports Dashboard",  sublabel: "Analytics & reporting",             category: "Pages",   icon: faChartBar },
  { id: "pg2", label: "Hiring Pipeline",    sublabel: "Open roles & candidates",           category: "Pages",   icon: faClipboardList },
  { id: "pg3", label: "Benefits Summary",   sublabel: "Health, dental, vision",            category: "Pages",   icon: faHeartPulse },
  { id: "pg4", label: "Employee Directory", sublabel: "All employees",                     category: "Pages",   icon: faUsers },
  { id: "pg5", label: "Files & Documents",  sublabel: "Shared company docs",               category: "Pages",   icon: faFileLines },
  { id: "pg6", label: "Compensation Bands", sublabel: "Salary ranges by level",            category: "Pages",   icon: faDesktop },
  { id: "a1",  label: "Request Time Off",   sublabel: "Submit a PTO request",              category: "Actions", icon: faClock },
  { id: "a2",  label: "Add New Employee",   sublabel: "Onboard a team member",             category: "Actions", icon: faUserPlus },
  { id: "a3",  label: "Post a New Job",     sublabel: "Create a job listing",              category: "Actions", icon: faBriefcase },
  { id: "a4",  label: "Generate Report",    sublabel: "Custom analytics report",           category: "Actions", icon: faChartBar },
  { id: "a5",  label: "Run Payroll",        sublabel: "Process this pay period",           category: "Actions", icon: faDollarSign },
];

// ─── BambooHR palette ─────────────────────────────────────────────────────────

const C = {
  sidebarBg:      "#FFFFFF",
  headerBg:       "#FFFFFF",
  border:         "#E5E7EB",
  activeBg:       "#F5F4F1",
  activeText:     "#3D7A30",
  activeIcon:     "#3D7A30",
  navText:        "#374151",
  navIcon:        "#6B7280",
  contentBg:      "#F0EFEB",
  divider:        "#E9EAEC",
  avatarBorder:   "#D5D5D5",
  askBg:          "#3D7A30",
  askBgHover:     "#2E5E24",
  askText:        "#FFFFFF",
  searchFocus:    "#3D7A30",
  dropdownBg:     "#FFFFFF",
  dropdownShadow: "0 8px 24px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06)",
  handleBg:       "#D1D5DB",
  handleHover:    "#3D7A30",
  subItemText:    "#6B7280",
};

// ─── Canvas ───────────────────────────────────────────────────────────────────

// Viewport preset widths for the controls bar "Viewport" select
const VIEWPORT_WIDTHS: Record<string, number | null> = {
  desktop: null,   // full width
  tablet:  680,    // just below BP_TABLET (720)
  mobile:  380,    // between BP_MIN (320) and BP_MOBILE (500)
};

export function RcGlobalNavCanvas() {
  const { controlValues, setControlValue } = useAppStore();
  const viewportControl = (controlValues["rc-global-nav"]?.viewport as string) ?? "desktop";
  const collapsedControl = controlValues["rc-global-nav"]?.collapsed === true;

  const [frameWidth, setFrameWidth] = useState<number | null>(null);
  const [collapsed,  setCollapsed]  = useState(false);

  // On mobile viewports, start at the minimum frame width so the component
  // demo opens in its compact mobile navigation mode rather than filling
  // the full canvas width.
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setFrameWidth(BP_MIN);
    }
  }, []);

  // ── Sync viewport control → frame width ─────────────────────────────────
  const skipSyncRef = useRef(false);
  useEffect(() => {
    if (skipSyncRef.current) { skipSyncRef.current = false; return; }
    setFrameWidth(VIEWPORT_WIDTHS[viewportControl] ?? null);
  }, [viewportControl]);

  // ── Sync collapsed control → sidebar state ──────────────────────────────
  useEffect(() => {
    // Only apply on desktop — tablet/mobile don't have a persistent sidebar
    if (!isTabletRef.current) setCollapsed(collapsedControl);
  }, [collapsedControl]);
  const isTabletRef = useRef(false);
  const [activeId,   setActiveId]   = useState("reports");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showBadge,  setShowBadge]  = useState(false);

  // Mobile-specific state: lives here so it resets when drawer closes
  const [accountOpen,    setAccountOpen]    = useState(false);
  const [expandedItems,  setExpandedItems]  = useState<Set<string>>(new Set());

  // Desktop sidebar accordion + collapsed flyout
  const [expandedSidebarItems, setExpandedSidebarItems] = useState<Set<string>>(new Set());
  const [flyout,  setFlyout]  = useState<{ id: string; x: number; y: number } | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const toggleSidebarItem = useCallback((id: string) => {
    setExpandedSidebarItems((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  // Flyout: show immediately on hover, hide after short delay to let pointer
  // travel from the collapsed button over to the flyout panel.
  const showFlyout = useCallback((id: string, x: number, y: number) => {
    clearTimeout(hoverTimer.current);
    setFlyout({ id, x, y });
  }, []);
  const hideFlyoutSoon = useCallback(() => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setFlyout(null), 180);
  }, []);
  const keepFlyout = useCallback(() => clearTimeout(hoverTimer.current), []);

  // Close flyout when sidebar expands (no longer needed) or on click-outside
  useEffect(() => { if (!collapsed) setFlyout(null); }, [collapsed]);
  useEffect(() => () => clearTimeout(hoverTimer.current), []);

  const canvasRef  = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const frameRef   = useRef<HTMLDivElement>(null);
  const dragState  = useRef<{ startX: number; startWidth: number } | null>(null);
  const badgeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Measure the wrapper (inside padding) — this is the actual available space
  const [measuredWidth, setMeasuredWidth] = useState(0);
  useLayoutEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const obs = new ResizeObserver(() => setMeasuredWidth(el.clientWidth));
    obs.observe(el);
    setMeasuredWidth(el.clientWidth);
    return () => obs.disconnect();
  }, []);

  // Clamp frameWidth to canvas when browser shrinks — keeps handle visible
  useEffect(() => {
    if (frameWidth !== null && measuredWidth > 0 && frameWidth > measuredWidth) {
      setFrameWidth(measuredWidth);
    }
  }, [measuredWidth, frameWidth]);

  const resolvedWidth = frameWidth ?? measuredWidth;
  const isTablet = resolvedWidth > 0 && resolvedWidth < BP_TABLET;
  const isMobile = resolvedWidth > 0 && resolvedWidth < BP_MOBILE;
  isTabletRef.current = isTablet;

  // ── Sync resolved breakpoint → viewport dropdown ────────────────────────
  const prevViewportLabel = useRef(viewportControl);
  useEffect(() => {
    if (resolvedWidth <= 0) return;
    const newLabel = isMobile ? "mobile" : isTablet ? "tablet" : "desktop";
    if (newLabel !== prevViewportLabel.current) {
      prevViewportLabel.current = newLabel;
      skipSyncRef.current = true; // prevent circular update
      setControlValue("rc-global-nav", "viewport", newLabel);
    }
  }, [resolvedWidth, isMobile, isTablet, setControlValue]);

  // ── Sync collapsed state → controls bar ─────────────────────────────────
  useEffect(() => {
    if (collapsed !== collapsedControl && !isTablet) {
      setControlValue("rc-global-nav", "collapsed", collapsed);
    }
  }, [collapsed]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-close drawer / reset on breakpoint transitions
  const prevIsTablet = useRef(false);
  useEffect(() => {
    if (!isTablet && prevIsTablet.current) {
      // Returning to desktop — close drawer and restore sidebar
      setDrawerOpen(false);
      setCollapsed(false);
    }
    if (isTablet && !prevIsTablet.current) {
      setDrawerOpen(false);
    }
    prevIsTablet.current = isTablet;
  }, [isTablet]);

  // Close account panel when drawer closes
  useEffect(() => {
    if (!drawerOpen) {
      setAccountOpen(false);
      setExpandedItems(new Set());
    }
  }, [drawerOpen]);

  const toggleCollapse  = useCallback(() => setCollapsed((v) => !v), []);
  const toggleDrawer    = useCallback(() => setDrawerOpen((v) => !v), []);
  const toggleExpand    = useCallback((id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const navRef      = useScrollbarFade<HTMLElement>();
  const activeEntry = NAV_ROWS.find((r): r is NavEntry => r !== "divider" && r.id === activeId);

  // ── Resize drag ───────────────────────────────────────────────────────────
  const startDrag = useCallback((startX: number) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    dragState.current = { startX, startWidth: frameRef.current?.clientWidth ?? wrapper.clientWidth };
    setIsDragging(true);
    setShowBadge(true);
    clearTimeout(badgeTimer.current);
  }, []);

  const onHandleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    startDrag(e.clientX);
  }, [startDrag]);

  const onHandleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    startDrag(e.touches[0].clientX);
  }, [startDrag]);

  useEffect(() => {
    if (!isDragging) return;
    const applyDrag = (clientX: number) => {
      const state   = dragState.current;
      const wrapper = wrapperRef.current;
      if (!state || !wrapper) return;
      const maxW = wrapper.clientWidth;
      const next = Math.max(BP_MIN, Math.min(maxW, state.startWidth + (clientX - state.startX)));
      setFrameWidth(next >= maxW - 8 ? null : next);
    };
    const onMouseMove = (e: MouseEvent) => applyDrag(e.clientX);
    const onTouchMove = (e: TouchEvent) => { e.preventDefault(); applyDrag(e.touches[0].clientX); };
    const onEnd = () => {
      setIsDragging(false);
      dragState.current = null;
      badgeTimer.current = setTimeout(() => setShowBadge(false), 1400);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup",   onEnd);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend",  onEnd);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup",   onEnd);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend",  onEnd);
    };
  }, [isDragging]);

  useEffect(() => () => clearTimeout(badgeTimer.current), []);

  return (
    <div
      ref={canvasRef}
      style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden", padding: "20px 24px 24px", background: "var(--shouf-canvas)", position: "relative", userSelect: isDragging ? "none" : undefined }}
    >
      {/* Canvas label */}
      <div style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--shouf-text)", marginBottom: "14px", letterSpacing: "0.04em", flexShrink: 0, display: "flex", alignItems: "center", gap: "10px" }}>
        <span>
          Responsive Components / Global Navigation — click items and the{" "}
          <span style={{ color: "var(--shouf-accent)" }}>«</span> toggle to interact
        </span>
        {showBadge ? (
          <span style={{ fontSize: "10px", fontFamily: "var(--font-mono)", padding: "2px 8px", borderRadius: "4px", background: isMobile ? "rgba(200,160,0,0.12)" : isTablet ? "rgba(61, 122, 48, 0.12)" : "var(--shouf-hover)", color: isMobile ? "#9B6F00" : isTablet ? "#3D7A30" : "var(--shouf-text)", border: `1px solid ${isMobile ? "rgba(200,160,0,0.25)" : isTablet ? "rgba(61,122,48,0.25)" : "var(--shouf-border)"}`, whiteSpace: "nowrap" }}>
            {frameWidth !== null ? `${frameWidth}px` : `${measuredWidth}px`}
            {isMobile ? " · mobile" : isTablet ? " · tablet" : " · desktop"}
          </span>
        ) : (
          <span style={{ color: "var(--shouf-text-muted)" }}>
            — drag{" "}<span style={{ display: "inline-block", width: "3px", height: "10px", borderRadius: "2px", background: "currentColor", verticalAlign: "middle", margin: "0 2px" }} />{" "}right edge to resize
          </span>
        )}
      </div>

      {/* Frame + handle wrapper */}
      <div ref={wrapperRef} style={{ flex: 1, minHeight: 0, display: "flex", alignItems: "stretch", position: "relative", overflow: "hidden" }}>

        {/* ── Browser frame ─────────────────────────────────────────────────── */}
        <div
          ref={frameRef}
          style={{ flex: frameWidth === null ? 1 : undefined, width: frameWidth !== null ? `${frameWidth}px` : undefined, maxWidth: "100%", minWidth: `${BP_MIN}px`, display: "flex", flexDirection: "column", borderRadius: "10px", border: `1px solid ${isDragging ? C.handleHover : "var(--shouf-border)"}`, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)", background: C.sidebarBg, transition: isDragging ? "none" : "border-color 200ms ease", position: "relative" }}
        >
          {/* App layout */}
          <div style={{ flex: 1, display: "flex", minHeight: 0, overflow: "hidden", position: "relative" }}>

            {/* Desktop sidebar */}
            {!isTablet && (
              <aside style={{ width: collapsed ? "60px" : "248px", minWidth: collapsed ? "60px" : "248px", background: C.sidebarBg, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", transition: "width 220ms cubic-bezier(0.4,0,0.2,1), min-width 220ms cubic-bezier(0.4,0,0.2,1)", overflow: "hidden" }}>
                <nav ref={navRef} className="rc-nav-scroll" style={{ flex: 1, padding: "10px 8px", overflowY: "auto", overflowX: "hidden", display: "flex", flexDirection: "column", gap: "1px" }}>
                  {NAV_ROWS.map((row, i) => {
                    if (row === "divider") return <hr key={`div-${i}`} style={{ border: "none", borderTop: `1px solid ${C.divider}`, margin: "5px 4px", flexShrink: 0 }} />;
                    const hasSubItems = !!NAV_SUB_ITEMS[row.id];
                    const isExpanded  = !collapsed && expandedSidebarItems.has(row.id);
                    return (
                      <div key={row.id}>
                        <NavButton
                          row={row}
                          isActive={activeId === row.id}
                          collapsed={collapsed}
                          labelIndex={i}
                          hasSubItems={hasSubItems}
                          isExpanded={isExpanded || (collapsed && flyout?.id === row.id)}
                          onClick={() => { setActiveId(row.id); setFlyout(null); }}
                          onToggleSub={() => toggleSidebarItem(row.id)}
                          onShowFlyout={(x, y) => showFlyout(row.id, x, y)}
                          onHideFlyout={hideFlyoutSoon}
                        />
                        {/* Inline accordion when expanded (desktop non-collapsed) */}
                        {hasSubItems && isExpanded && (
                          <div style={{ marginLeft: "20px", borderLeft: "1.5px solid #F0F1F3", paddingLeft: "12px", paddingBottom: "4px" }}>
                            {NAV_SUB_ITEMS[row.id].map((sub, si) => {
                              if (sub === "divider") return <hr key={`sd-${si}`} style={{ border: "none", borderTop: "1px solid #F0F1F3", margin: "3px 0" }} />;
                              return (
                                <button
                                  key={sub.id}
                                  onClick={() => setActiveId(sub.id)}
                                  style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", height: "36px", padding: "0 8px 0 0", marginLeft: "8px", border: "none", background: activeId === sub.id ? C.activeBg : "transparent", borderRadius: "6px", cursor: "pointer", textAlign: "left", transition: "background 60ms ease", animation: "rc-nav-label-in 160ms cubic-bezier(0.2,0,0,1) both" }}
                                  onMouseEnter={(e) => { if (activeId !== sub.id) (e.currentTarget as HTMLElement).style.background = "#F3F4F6"; }}
                                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = activeId === sub.id ? C.activeBg : "transparent"; }}
                                >
                                  <span style={{ width: "18px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <FontAwesomeIcon icon={sub.icon} style={{ width: 15, height: 15, color: activeId === sub.id ? C.activeIcon : C.navIcon }} />
                                  </span>
                                  <span style={{ fontSize: "13px", color: activeId === sub.id ? C.activeText : C.navText, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {sub.label}
                                  </span>
                                  {sub.count != null && (
                                    <span style={{ fontSize: "10px", color: "#9CA3AF", flexShrink: 0 }}>({sub.count})</span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </nav>
                <div style={{ padding: "12px 8px 14px", borderTop: `1px solid ${C.border}`, display: "flex", flexDirection: "column", alignItems: collapsed ? "center" : "stretch", gap: "8px", flexShrink: 0 }}>
                  {/* Avatar row — shows name when expanded */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: collapsed ? 0 : "0 4px" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="https://i.pravatar.cc/64?u=joann" alt="User avatar" width={36} height={36} style={{ width: "36px", height: "36px", borderRadius: "50%", border: `2px solid ${C.avatarBorder}`, objectFit: "cover", flexShrink: 0, display: "block" }} />
                    {!collapsed && (
                      <div style={{ overflow: "hidden" }}>
                        <div style={{ fontSize: "14px", fontWeight: 600, color: C.navText, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Jessica Cordovoa</div>
                        <div style={{ fontSize: "11px", color: "#9CA3AF", whiteSpace: "nowrap" }}>jessica@acme.com</div>
                      </div>
                    )}
                  </div>
                  <CollapseButton collapsed={collapsed} onClick={toggleCollapse} />
                </div>
              </aside>
            )}

            {/* Tablet / Mobile drawer overlay */}
            {isTablet && drawerOpen && (
              <>
                {/* Scrim */}
                <div onClick={() => setDrawerOpen(false)} style={{ position: "absolute", inset: 0, zIndex: 15, background: "rgba(0,0,0,0.30)", animation: "rc-search-in 160ms ease both" }} />

                {/* Drawer panel */}
                <div
                  style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: isMobile ? "100%" : "280px", background: C.sidebarBg, borderRight: isMobile ? "none" : `1px solid ${C.border}`, display: "flex", flexDirection: "column", zIndex: 20, boxShadow: isMobile ? "none" : "4px 0 24px rgba(0,0,0,0.14)", animation: "rc-drawer-in 200ms cubic-bezier(0.4,0,0.2,1) both", overflow: "hidden" }}
                >
                  {accountOpen ? (
                    // ── Account panel ─────────────────────────────────────
                    <AccountPanel onClose={() => setAccountOpen(false)} />
                  ) : (
                    // ── Nav drawer ────────────────────────────────────────
                    <>
                      {/* Drawer header */}
                      <div style={{ display: "flex", alignItems: "center", padding: "18px 16px 12px", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="/desktop.png" alt="bambooHR" style={{ height: "20px", width: "auto", display: "block" }} />
                        </div>
                        <button onClick={() => setDrawerOpen(false)} style={{ width: "30px", height: "30px", borderRadius: "6px", border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: C.navIcon, flexShrink: 0 }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#F3F4F6"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                          <FontAwesomeIcon icon={faXmark} style={{ width: 14, height: 14 }} />
                        </button>
                      </div>

                      {/* Drawer nav */}
                      <nav className="rc-nav-scroll" style={{ flex: 1, padding: "8px 8px", overflowY: "auto", overflowX: "hidden", display: "flex", flexDirection: "column", gap: "1px" }}>
                        {NAV_ROWS.map((row, i) => {
                          if (row === "divider") return <hr key={`ddiv-${i}`} style={{ border: "none", borderTop: `1px solid ${C.divider}`, margin: "5px 4px", flexShrink: 0 }} />;

                          const hasSubItems = !!NAV_SUB_ITEMS[row.id];
                          const isExpanded  = expandedItems.has(row.id);

                          return (
                            <div key={row.id}>
                              <DrawerNavButton
                                row={row}
                                isActive={activeId === row.id}
                                hasSubItems={hasSubItems}
                                isExpanded={isExpanded}
                                labelIndex={i}
                                onClick={() => {
                                  if (hasSubItems) {
                                    toggleExpand(row.id);
                                  } else {
                                    setActiveId(row.id);
                                    setDrawerOpen(false);
                                  }
                                }}
                              />
                              {/* Sub-items (expanded) */}
                              {hasSubItems && isExpanded && (
                                <div style={{ marginLeft: "22px", borderLeft: "1.5px solid #F0F1F3", paddingLeft: "12px", paddingBottom: "4px" }}>
                                  {NAV_SUB_ITEMS[row.id].map((sub, si) => {
                                    if (sub === "divider") return <hr key={`dsd-${si}`} style={{ border: "none", borderTop: "1px solid #F0F1F3", margin: "4px 0" }} />;
                                    return (
                                      <button
                                        key={sub.id}
                                        onClick={() => { setActiveId(sub.id); setDrawerOpen(false); }}
                                        style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", height: "40px", padding: "0 10px 0 0", marginLeft: "8px", border: "none", background: activeId === sub.id ? C.activeBg : "transparent", borderRadius: "6px", cursor: "pointer", textAlign: "left", transition: "background 60ms ease" }}
                                        onMouseEnter={(e) => { if (activeId !== sub.id) (e.currentTarget as HTMLElement).style.background = "#F3F4F6"; }}
                                        onMouseLeave={(e) => { if (activeId !== sub.id) (e.currentTarget as HTMLElement).style.background = activeId === sub.id ? C.activeBg : "transparent"; }}
                                      >
                                        <span style={{ width: "20px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                          <FontAwesomeIcon icon={sub.icon} style={{ width: 16, height: 16, color: activeId === sub.id ? C.activeIcon : C.navIcon }} />
                                        </span>
                                        <span style={{ fontSize: "14px", color: activeId === sub.id ? C.activeText : C.navText, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                          {sub.label}
                                        </span>
                                        {sub.count != null && (
                                          <span style={{ fontSize: "11px", color: "#9CA3AF", flexShrink: 0 }}>
                                            ({sub.count})
                                          </span>
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </nav>

                      {/* Drawer footer: avatar + name (+ chevron in mobile → opens account panel) */}
                      <button
                        onClick={isMobile ? () => setAccountOpen(true) : undefined}
                        style={{ padding: "12px 16px 16px", display: "flex", alignItems: "center", gap: "10px", flexShrink: 0, background: "transparent", border: "none", borderTop: `1px solid ${C.border}`, cursor: isMobile ? "pointer" : "default", width: "100%", textAlign: "left", transition: "background 80ms ease" }}
                        onMouseEnter={(e) => { if (isMobile) (e.currentTarget as HTMLElement).style.background = "#F3F4F6"; }}
                        onMouseLeave={(e) => { if (isMobile) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="https://i.pravatar.cc/64?u=jessica" alt="Jessica Cordovoa" width={36} height={36} style={{ width: "36px", height: "36px", borderRadius: "50%", border: `2px solid ${C.avatarBorder}`, objectFit: "cover", flexShrink: 0 }} />
                        <span style={{ fontSize: "14px", fontWeight: 500, color: C.navText, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          Jessica Cordovoa
                        </span>
                        {isMobile && (
                          <FontAwesomeIcon icon={faChevronRight} style={{ width: 11, height: 11, color: "#9CA3AF", flexShrink: 0 }} />
                        )}
                      </button>
                    </>
                  )}
                </div>
              </>
            )}

            {/* Main area */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "visible", position: "relative" }}>

              {/* Desktop header */}
              {!isTablet && (
                <header style={{ height: "64px", minHeight: "64px", background: C.headerBg, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", padding: "0 20px", gap: "12px", flexShrink: 0, position: "relative", zIndex: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", marginRight: "auto", flexShrink: 0 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/desktop.png" alt="bambooHR" style={{ height: "20px", width: "auto", display: "block" }} />
                  </div>
                  <SearchBar />
                  <button style={{ width: "36px", height: "36px", borderRadius: "50%", border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 100ms ease" }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#F3F4F6"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                    <FontAwesomeIcon icon={faInbox} style={{ width: 17, height: 17, color: C.navIcon }} />
                  </button>
                  <AskButton />
                </header>
              )}

              {/* Tablet / Mobile header */}
              {isTablet && (
                <ResponsiveHeader
                  drawerOpen={drawerOpen}
                  isMobile={isMobile}
                  onToggleDrawer={toggleDrawer}
                />
              )}

              {/* Content */}
              <div style={{ flex: 1, padding: "16px", overflow: "auto", background: "#F8F8F6" }}>
                <div style={{ width: "100%", height: "100%", minHeight: "180px", borderRadius: "12px", background: C.contentBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "12px", fontFamily: "var(--font-mono)", color: "#B5AFA7", letterSpacing: "0.03em" }}>
                    {activeEntry?.label ?? "Content area"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Collapsed-sidebar flyout — portal so it escapes overflow:hidden ── */}
        {flyout && (() => {
          const entry    = NAV_ROWS.find((r): r is NavEntry => r !== "divider" && r.id === flyout.id);
          const subItems = NAV_SUB_ITEMS[flyout.id] ?? [];
          if (!entry) return null;
          return (
            <NavFlyout
              key={flyout.id}
              entry={entry}
              subItems={subItems}
              position={flyout}
              activeId={activeId}
              onSelect={(id) => { setActiveId(id); setFlyout(null); }}
              onMouseEnter={keepFlyout}
              onMouseLeave={hideFlyoutSoon}
            />
          );
        })()}

        {/* Resize handle — touch-friendly: padded hit area, touch events */}
        <div
          onMouseDown={onHandleMouseDown}
          onTouchStart={onHandleTouchStart}
          title="Drag to resize"
          style={{ position: "absolute", left: frameWidth !== null ? `min(${frameWidth}px, 100%) ` : "100%", top: "50%", transform: "translate(-50%, -50%)", width: "8px", height: "40px", borderRadius: "4px", background: isDragging ? C.handleHover : C.handleBg, cursor: "col-resize", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", transition: isDragging ? "none" : "background 150ms ease", boxShadow: isDragging ? `0 0 0 3px rgba(61, 122, 48, 0.20)` : "none", touchAction: "none" }}
          onMouseEnter={(e) => { if (!isDragging) e.currentTarget.style.background = C.handleHover; }}
          onMouseLeave={(e) => { if (!isDragging) e.currentTarget.style.background = C.handleBg; }}
        >
          <svg width="4" height="20" viewBox="0 0 4 20" fill="none">
            <circle cx="2" cy="5"  r="1.5" fill={isDragging ? "#fff" : "#9CA3AF"} />
            <circle cx="2" cy="10" r="1.5" fill={isDragging ? "#fff" : "#9CA3AF"} />
            <circle cx="2" cy="15" r="1.5" fill={isDragging ? "#fff" : "#9CA3AF"} />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ─── AccountPanel ─────────────────────────────────────────────────────────────
// Replaces the nav drawer content when the avatar row is tapped in mobile mode.

function AccountPanel({ onClose }: { onClose: () => void }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Header: avatar + name + × */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://i.pravatar.cc/64?u=jessica" alt="Jessica Cordovoa" width={40} height={40} style={{ width: "40px", height: "40px", borderRadius: "50%", border: `2px solid ${C.avatarBorder}`, objectFit: "cover", flexShrink: 0 }} />
        <span style={{ fontSize: "15px", fontWeight: 600, color: C.navText, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          Jessica Cordovoa
        </span>
        <button onClick={onClose} style={{ width: "30px", height: "30px", borderRadius: "6px", border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: C.navIcon, flexShrink: 0 }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#F3F4F6"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
          <FontAwesomeIcon icon={faXmark} style={{ width: 14, height: 14 }} />
        </button>
      </div>

      {/* Account items */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
        {ACCOUNT_ITEMS.map((item, i) => {
          if (item === "divider") return <hr key={`adiv-${i}`} style={{ border: "none", borderTop: `1px solid ${C.divider}`, margin: "6px 16px" }} />;
          return (
            <button
              key={item.id}
              style={{ display: "block", width: "100%", padding: "11px 20px", border: "none", background: "transparent", cursor: "pointer", textAlign: "left", fontSize: "14px", color: item.id === "logout" ? "#DC2626" : C.navText, transition: "background 60ms ease" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#F3F4F6"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── ResponsiveHeader ─────────────────────────────────────────────────────────
// Shared header for tablet + mobile. Two inner states:
//   default — hamburger | logo/avatar | (spacer) | search-icon | inbox | Ask
//   search  — [full-width search input] [×]
//
// Mobile difference: shows a compact bamboo-leaf avatar circle instead of
// the bambooHR wordmark (saves horizontal space in narrow frames).

function ResponsiveHeader({
  drawerOpen,
  isMobile,
  onToggleDrawer,
}: {
  drawerOpen:     boolean;
  isMobile:       boolean;
  onToggleDrawer: () => void;
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query,      setQuery]      = useState("");
  const [hovered,    setHovered]    = useState<string | null>(null);
  const [dropRect,   setDropRect]   = useState<{ top: number; left: number; width: number } | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const wrapperRef     = useRef<HTMLDivElement>(null);
  const dropRef        = useScrollbarFade<HTMLDivElement>();

  const openSearch  = useCallback(() => {
    setSearchOpen(true);
    requestAnimationFrame(() => searchInputRef.current?.focus());
  }, []);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setQuery("");
    setDropRect(null);
  }, []);

  const updateRect = useCallback(() => {
    if (!wrapperRef.current) return;
    const r = wrapperRef.current.getBoundingClientRect();
    setDropRect({ top: r.bottom + 4, left: r.left, width: r.width });
  }, []);

  useEffect(() => {
    if (!searchOpen) return;
    const t = setTimeout(updateRect, 50);
    window.addEventListener("scroll", updateRect, true);
    window.addEventListener("resize", updateRect);
    return () => { clearTimeout(t); window.removeEventListener("scroll", updateRect, true); window.removeEventListener("resize", updateRect); };
  }, [searchOpen, updateRect]);

  const q        = query.trim().toLowerCase();
  const filtered = q ? ALL_RESULTS.filter((r) => r.label.toLowerCase().includes(q) || r.sublabel.toLowerCase().includes(q)) : ALL_RESULTS.slice(0, 6);
  const groups: { category: SearchCategory; items: SearchResult[] }[] = [];
  for (const cat of ["People", "Pages", "Actions"] as SearchCategory[]) {
    const items = filtered.filter((r) => r.category === cat);
    if (items.length) groups.push({ category: cat, items });
  }

  const dropdown = searchOpen && dropRect && groups.length > 0 ? (
    <div
      ref={dropRef}
      className="rc-nav-scroll"
      style={{ position: "fixed", top: dropRect.top, left: dropRect.left, width: `${dropRect.width}px`, background: C.dropdownBg, borderRadius: "0 0 10px 10px", border: `1px solid ${C.searchFocus}`, borderTop: "none", boxShadow: C.dropdownShadow, zIndex: 9999, overflowY: "auto", maxHeight: "260px", animation: "rc-search-in 120ms ease both" }}
    >
      {groups.map(({ category, items }) => (
        <div key={category}>
          <div style={{ padding: "8px 16px 4px", fontSize: "10px", fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.07em" }}>{category}</div>
          {items.map((result) => (
            <SearchResultRow key={result.id} result={result} isHovered={hovered === result.id} onHover={setHovered} onSelect={closeSearch} />
          ))}
        </div>
      ))}
    </div>
  ) : null;

  return (
    <header style={{ height: "56px", minHeight: "56px", background: C.headerBg, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", padding: "0 12px", gap: "4px", flexShrink: 0, position: "relative", zIndex: 10, overflow: "visible" }}>
      {searchOpen ? (
        // Search takeover mode
        <>
          <div ref={wrapperRef} style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px", border: `1.5px solid ${C.searchFocus}`, borderRadius: "20px", padding: "0 14px", height: "36px", background: "#FFFFFF", boxShadow: `0 0 0 3px rgba(61, 122, 48, 0.12)` }}>
            <FontAwesomeIcon icon={faMagnifyingGlass} style={{ width: 13, height: 13, color: C.searchFocus, flexShrink: 0 }} />
            <input ref={searchInputRef} value={query} onChange={(e) => { setQuery(e.target.value); updateRect(); }} placeholder="Search..." style={{ border: "none", outline: "none", background: "transparent", fontSize: "14px", color: "#374151", width: "100%", fontFamily: "inherit" }} />
          </div>
          <button onClick={closeSearch} style={{ width: "34px", height: "34px", borderRadius: "6px", border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: C.navIcon }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#F3F4F6"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
            <FontAwesomeIcon icon={faXmark} style={{ width: 15, height: 15 }} />
          </button>
          {typeof document !== "undefined" && dropdown ? createPortal(dropdown, document.body) : null}
        </>
      ) : (
        // Default header
        <>
          {/* Hamburger */}
          <button onClick={onToggleDrawer} style={{ width: "36px", height: "36px", borderRadius: "7px", border: "none", background: drawerOpen ? C.activeBg : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: drawerOpen ? C.activeIcon : C.navIcon, transition: "background 100ms ease" }} onMouseEnter={(e) => { if (!drawerOpen) (e.currentTarget as HTMLElement).style.background = "#F3F4F6"; }} onMouseLeave={(e) => { if (!drawerOpen) (e.currentTarget as HTMLElement).style.background = drawerOpen ? C.activeBg : "transparent"; }}>
            <FontAwesomeIcon icon={faBars} style={{ width: 16, height: 16 }} />
          </button>

          {/* Logo — wordmark on tablet, compact leaf-circle on mobile */}
          {isMobile ? (
            // Compact mobile logo (32×32)
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/mobile.png" alt="bambooHR" style={{ width: "32px", height: "32px", display: "block", flexShrink: 0, marginLeft: "2px" }} />
          ) : (
            // Tablet: wordmark
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/desktop.png" alt="bambooHR" style={{ height: "17px", width: "auto", display: "block", paddingLeft: "4px" }} />
          )}

          <div style={{ flex: 1 }} />

          {/* Search icon */}
          <button onClick={openSearch} style={{ width: "36px", height: "36px", borderRadius: "50%", border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 100ms ease" }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#F3F4F6"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
            <FontAwesomeIcon icon={faMagnifyingGlass} style={{ width: 15, height: 15, color: C.navIcon }} />
          </button>

          {/* Inbox */}
          <button style={{ width: "36px", height: "36px", borderRadius: "50%", border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 100ms ease" }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#F3F4F6"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
            <FontAwesomeIcon icon={faInbox} style={{ width: 15, height: 15, color: C.navIcon }} />
          </button>

          <AskButton />
        </>
      )}
    </header>
  );
}

// ─── DrawerNavButton ──────────────────────────────────────────────────────────
// Nav button inside the drawer — supports an optional expand chevron for
// items with sub-items (mobile only).

function DrawerNavButton({
  row,
  isActive,
  hasSubItems,
  isExpanded,
  labelIndex,
  onClick,
}: {
  row:          NavEntry;
  isActive:     boolean;
  hasSubItems:  boolean;
  isExpanded:   boolean;
  labelIndex:   number;
  onClick:      () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{ display: "flex", alignItems: "center", gap: "12px", height: "46px", padding: "0 10px", borderRadius: "8px", border: "none", cursor: "pointer", width: "100%", textAlign: "left", background: isActive ? C.activeBg : "transparent", color: isActive ? C.activeText : C.navText, transition: "background 80ms ease", flexShrink: 0, animation: `rc-nav-label-in 200ms cubic-bezier(0.2,0,0,1) ${labelIndex * 8}ms both` }}
      onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "#F3F4F6"; }}
      onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
    >
      <span style={{ width: "20px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: isActive ? C.activeIcon : C.navIcon }}>
        <FontAwesomeIcon icon={row.icon} style={{ width: 17, height: 17 }} />
      </span>
      <span style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
        <span style={{ fontSize: "14px", fontWeight: isActive ? 600 : 400, lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{row.label}</span>
        {row.sublabel && <span style={{ fontSize: "10px", color: "#9CA3AF", lineHeight: 1.3 }}>{row.sublabel}</span>}
      </span>
      {hasSubItems && (
        <FontAwesomeIcon
          icon={faChevronDown}
          style={{ width: 10, height: 10, color: "#9CA3AF", flexShrink: 0, transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 200ms ease" }}
        />
      )}
    </button>
  );
}

// ─── SearchBar (desktop) ──────────────────────────────────────────────────────

function SearchBar() {
  const [query,    setQuery]    = useState("");
  const [focused,  setFocused]  = useState(false);
  const [hovered,  setHovered]  = useState<string | null>(null);
  const [dropRect, setDropRect] = useState<{ top: number; left: number; width: number } | null>(null);

  const wrapperRef  = useRef<HTMLDivElement>(null);
  const dropdownRef = useScrollbarFade<HTMLDivElement>();

  const updateRect = useCallback(() => {
    if (!wrapperRef.current) return;
    const r = wrapperRef.current.getBoundingClientRect();
    setDropRect({ top: r.bottom + 6, left: r.left, width: Math.max(r.width, 320) });
  }, []);

  useEffect(() => {
    if (!focused) return;
    updateRect();
    window.addEventListener("scroll", updateRect, true);
    window.addEventListener("resize", updateRect);
    return () => { window.removeEventListener("scroll", updateRect, true); window.removeEventListener("resize", updateRect); };
  }, [focused, updateRect]);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node) && dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setFocused(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [dropdownRef]);

  const q        = query.trim().toLowerCase();
  const filtered = q ? ALL_RESULTS.filter((r) => r.label.toLowerCase().includes(q) || r.sublabel.toLowerCase().includes(q) || r.category.toLowerCase().includes(q)) : ALL_RESULTS.slice(0, 8);
  const groups: { category: SearchCategory; items: SearchResult[] }[] = [];
  for (const cat of ["People", "Pages", "Actions"] as SearchCategory[]) {
    const items = filtered.filter((r) => r.category === cat);
    if (items.length) groups.push({ category: cat, items });
  }

  const open = focused && dropRect !== null;
  const dropdown = open && dropRect ? (
    <div ref={dropdownRef} className="rc-nav-scroll" style={{ position: "fixed", top: dropRect.top, left: dropRect.left, width: "340px", background: C.dropdownBg, borderRadius: "10px", border: `1px solid ${C.border}`, boxShadow: C.dropdownShadow, zIndex: 9999, overflowY: "auto", maxHeight: "360px", animation: "rc-search-in 140ms cubic-bezier(0.2,0,0,1) both" }}>
      {groups.length === 0 ? (
        <div style={{ padding: "20px 16px", textAlign: "center", fontSize: "13px", color: "#9CA3AF" }}>No results for &ldquo;{query}&rdquo;</div>
      ) : (
        groups.map(({ category, items }) => (
          <div key={category}>
            <div style={{ padding: "10px 16px 4px", fontSize: "10px", fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.07em" }}>{category}</div>
            {items.map((result) => <SearchResultRow key={result.id} result={result} isHovered={hovered === result.id} onHover={setHovered} onSelect={() => { setFocused(false); setQuery(""); }} />)}
          </div>
        ))
      )}
      {groups.length > 0 && (
        <div style={{ padding: "8px 16px", borderTop: `1px solid ${C.divider}`, display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "#9CA3AF", cursor: "pointer" }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#F3F4F6"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
          <FontAwesomeIcon icon={faMagnifyingGlass} style={{ width: 10, height: 10 }} />
          <span>Search all results{query ? ` for "${query}"` : ""}</span>
          <FontAwesomeIcon icon={faArrowRight} style={{ width: 9, height: 9, marginLeft: "auto" }} />
        </div>
      )}
    </div>
  ) : null;

  return (
    <>
      <div ref={wrapperRef} style={{ position: "relative", flexShrink: 1, width: "300px", minWidth: "140px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", border: `1.5px solid ${focused ? C.searchFocus : C.border}`, borderRadius: "20px", padding: "0 16px", height: "36px", width: "100%", background: focused ? "#FFFFFF" : "#F3F4F6", transition: "border-color 120ms ease, background 120ms ease, box-shadow 120ms ease", cursor: "text", boxShadow: focused ? `0 0 0 3px rgba(61, 122, 48, 0.12)` : "none" }} onClick={() => { setFocused(true); updateRect(); }}>
          <FontAwesomeIcon icon={faMagnifyingGlass} style={{ width: 13, height: 13, color: focused ? C.searchFocus : "#9CA3AF", flexShrink: 0, transition: "color 120ms ease" }} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => { setFocused(true); updateRect(); }} placeholder="Search..." style={{ border: "none", outline: "none", background: "transparent", fontSize: "14px", color: "#374151", width: "100%", fontFamily: "inherit" }} />
          {query && (
            <button onMouseDown={(e) => { e.preventDefault(); setQuery(""); }} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: 0, flexShrink: 0, color: "#9CA3AF" }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
          )}
        </div>
      </div>
      {typeof document !== "undefined" && dropdown ? createPortal(dropdown, document.body) : null}
    </>
  );
}

// ─── SearchResultRow ──────────────────────────────────────────────────────────

function SearchResultRow({ result, isHovered, onHover, onSelect }: { result: SearchResult; isHovered: boolean; onHover: (id: string | null) => void; onSelect: () => void; }) {
  return (
    <button onMouseEnter={() => onHover(result.id)} onMouseLeave={() => onHover(null)} onClick={onSelect} style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "8px 16px", border: "none", cursor: "pointer", background: isHovered ? C.activeBg : "transparent", textAlign: "left", transition: "background 60ms ease" }}>
      <span style={{ width: "28px", height: "28px", borderRadius: "6px", background: isHovered ? "rgba(61, 122, 48, 0.12)" : "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 60ms ease" }}>
        <FontAwesomeIcon icon={result.icon} style={{ width: 12, height: 12, color: isHovered ? C.activeIcon : "#6B7280" }} />
      </span>
      <span style={{ display: "flex", flexDirection: "column", gap: "1px", overflow: "hidden" }}>
        <span style={{ fontSize: "13px", fontWeight: 400, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{result.label}</span>
        <span style={{ fontSize: "11px", color: "#9CA3AF", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{result.sublabel}</span>
      </span>
    </button>
  );
}

// ─── NavButton (desktop sidebar) ─────────────────────────────────────────────
// Supports three modes:
//  • Expanded + no sub-items   → plain click selects the item
//  • Expanded + has sub-items  → chevron shown; click toggles inline accordion
//  • Collapsed + has sub-items → hover shows a flyout to the right

function NavButton({
  row, isActive, collapsed, labelIndex,
  hasSubItems = false, isExpanded = false,
  onClick, onToggleSub, onShowFlyout, onHideFlyout,
}: {
  row: NavEntry; isActive: boolean; collapsed: boolean; labelIndex: number;
  hasSubItems?: boolean; isExpanded?: boolean;
  onClick: () => void;
  onToggleSub?: () => void;
  onShowFlyout?: (x: number, y: number) => void;
  onHideFlyout?: () => void;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  const handleClick = () => {
    if (!collapsed && hasSubItems) { onToggleSub?.(); }
    else { onClick(); }
  };

  const handleMouseEnter = () => {
    if (!collapsed || !btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    if (hasSubItems) {
      onShowFlyout?.(r.right + 6, r.top);
    } else {
      setTooltipPos({ x: r.right + 8, y: r.top + r.height / 2 });
    }
  };

  const handleMouseLeave = () => {
    if (collapsed && hasSubItems) onHideFlyout?.();
    setTooltipPos(null);
  };

  return (
    <>
    {/* Custom tooltip for collapsed items without a flyout */}
    {tooltipPos && typeof document !== "undefined" && createPortal(
      <div style={{
        position:      "fixed",
        top:           tooltipPos.y,
        left:          tooltipPos.x,
        transform:     "translateY(-50%)",
        background:    "#1F2937",
        color:         "#F9FAFB",
        fontSize:      "12px",
        fontWeight:    500,
        padding:       "5px 10px",
        borderRadius:  "6px",
        whiteSpace:    "nowrap",
        pointerEvents: "none",
        zIndex:        9999,
        boxShadow:     "0 2px 8px rgba(0,0,0,0.20)",
        letterSpacing: "-0.01em",
      }}>
        {row.label}
      </div>,
      document.body
    )}
    <button
      ref={btnRef}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ display: "flex", alignItems: "center", gap: "12px", height: "44px", padding: collapsed ? "0" : "0 10px", borderRadius: "8px", border: "none", cursor: "pointer", width: "100%", textAlign: "left", background: (!collapsed && (isActive || isExpanded)) ? C.activeBg : "transparent", color: isActive ? C.activeText : C.navText, justifyContent: collapsed ? "center" : "flex-start", transition: "background 80ms ease", flexShrink: 0 }}
    >
      <span style={{ width: collapsed ? "42px" : "20px", height: collapsed ? "42px" : "auto", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: isActive ? C.activeIcon : C.navIcon, transition: "color 80ms ease", borderRadius: (collapsed && isActive) ? "10px" : "0", background: (collapsed && isActive) ? C.activeBg : "transparent" }}>
        <FontAwesomeIcon icon={row.icon} style={{ width: 17, height: 17 }} />
      </span>
      {!collapsed && (
        <>
          <span style={{ display: "flex", flexDirection: "column", overflow: "hidden", whiteSpace: "nowrap", flex: 1, animation: "rc-nav-label-in 200ms cubic-bezier(0.2,0,0,1) both", animationDelay: `${labelIndex * 10}ms` }}>
            <span style={{ fontSize: "14px", fontWeight: isActive ? 600 : 400, lineHeight: 1.3 }}>{row.label}</span>
            {row.sublabel && <span style={{ fontSize: "10px", color: "#9CA3AF", lineHeight: 1.3 }}>{row.sublabel}</span>}
          </span>
          {hasSubItems && (
            <FontAwesomeIcon
              icon={faChevronDown}
              style={{ width: 9, height: 9, color: "#9CA3AF", flexShrink: 0, transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 200ms ease" }}
            />
          )}
        </>
      )}
    </button>
    </>
  );
}

// ─── NavFlyout ────────────────────────────────────────────────────────────────
// Portal-based flyout that appears to the right of a collapsed nav item.
// Shown on hover; stays open while the pointer is over the button OR the panel.

function NavFlyout({
  entry, subItems, position, activeId,
  onSelect, onMouseEnter, onMouseLeave,
}: {
  entry: NavEntry;
  subItems: SubItem[];
  position: { x: number; y: number };
  activeId: string;
  onSelect: (id: string) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const flyout = (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position:     "fixed",
        top:          position.y,
        left:         position.x,
        minWidth:     "210px",
        background:   "#FFFFFF",
        borderRadius: "10px",
        border:       `1px solid ${C.border}`,
        boxShadow:    "0 8px 24px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06)",
        zIndex:       9999,
        overflow:     "hidden",
        animation:    "rc-search-in 120ms cubic-bezier(0.2,0,0,1) both",
      }}
    >
      {/* Category header */}
      <div style={{ padding: "10px 14px 6px", fontSize: "10px", fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: `1px solid ${C.divider}` }}>
        {entry.label}
      </div>
      {subItems.map((sub, si) => {
        if (sub === "divider") return <hr key={`fd-${si}`} style={{ border: "none", borderTop: `1px solid ${C.divider}`, margin: "3px 0" }} />;
        return (
          <button
            key={sub.id}
            onClick={() => onSelect(sub.id)}
            style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "10px 14px", border: "none", background: activeId === sub.id ? C.activeBg : "transparent", cursor: "pointer", textAlign: "left", transition: "background 60ms ease" }}
            onMouseEnter={(e) => { if (activeId !== sub.id) (e.currentTarget as HTMLElement).style.background = "#F3F4F6"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = activeId === sub.id ? C.activeBg : "transparent"; }}
          >
            <span style={{ width: "20px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <FontAwesomeIcon icon={sub.icon} style={{ width: 14, height: 14, color: activeId === sub.id ? C.activeIcon : C.navIcon }} />
            </span>
            <span style={{ fontSize: "14px", color: activeId === sub.id ? C.activeText : C.navText, flex: 1 }}>{sub.label}</span>
            {sub.count != null && <span style={{ fontSize: "11px", color: "#9CA3AF", flexShrink: 0 }}>({sub.count})</span>}
          </button>
        );
      })}
    </div>
  );
  return typeof document !== "undefined" ? createPortal(flyout, document.body) : null;
}

// ─── CollapseButton ───────────────────────────────────────────────────────────

function CollapseButton({ collapsed, onClick }: { collapsed: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      style={{ width: collapsed ? "42px" : "100%", height: "34px", borderRadius: "7px", border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start", flexShrink: 0, transition: "background 100ms ease, width 220ms cubic-bezier(0.4,0,0.2,1)", gap: "8px", color: C.navIcon, padding: collapsed ? 0 : "0 10px" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#F3F4F6"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
    >
      <FontAwesomeIcon icon={collapsed ? faAnglesRight : faAnglesLeft} style={{ width: 13, height: 13, flexShrink: 0 }} />
      {!collapsed && <span style={{ fontSize: "13px", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden" }}>Collapse</span>}
    </button>
  );
}

// ─── AskButton ────────────────────────────────────────────────────────────────

function AskButton() {
  return (
    <button
      style={{ display: "flex", alignItems: "center", gap: "7px", background: "#FFFFFF", color: "#3D7A30", border: "1.5px solid #3D7A30", borderRadius: "20px", padding: "0 16px", height: "36px", fontSize: "14px", fontWeight: 500, cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap", transition: "background 100ms ease, color 100ms ease" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(61,122,48,0.06)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#FFFFFF"; }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icon.png" alt="" aria-hidden="true" style={{ width: "14px", height: "14px", display: "block", flexShrink: 0 }} />
      Ask
    </button>
  );
}
