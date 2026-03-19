# AGENTS.md — Design System Portfolio

> **Read this file first at the start of every session.** It is the single source of truth for what this project is, how it works, and how to extend it correctly.

---

## PROJECT CONCEPT

A Figma × Storybook hybrid portfolio that functions as a live design system playground. The interface itself mimics the design tools hiring managers use every day — three-panel layout with a left navigator, center canvas, and right inspect panel — so the artifact communicates craft before a single component is clicked.

The portfolio is self-documenting: the UI shell is built with the same design tokens and components it showcases. Every panel, toggle, badge, and button is a real implementation drawn from the system. There is no mock or static screenshot in the shell.

**Target audience:** Design engineer hiring managers at product companies. They should be able to open this, spend five minutes clicking around, and understand exactly how Jo thinks about the relationship between design and engineering.

**Core demo loop:** Select a component from the left nav → see it live in the canvas → adjust variant/size/state via the bottom controls bar → watch the right inspect panel update with real CSS token values in real time.

---

## OWNER

**Jo Ann Saab** — designer and frontend engineer specializing in design systems.

Role: builds the bridge between design and engineering. Defines tokens, authors components in Storybook, closes the gap between how a product looks and how it actually gets built.

---

## TECH STACK

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.1.6 |
| UI Library | React | 19.2.3 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS v4 | ^4 |
| Styling (shell) | CSS custom properties (`--sh-*`) | — |
| State | React Context (`lib/store.tsx`) | — |
| Theme/Accent | React Context (`lib/theme.tsx`) | — |
| Build tooling | @tailwindcss/postcss | ^4 |
| Linting | ESLint + eslint-config-next | 16.1.6 |

**No runtime dependencies beyond React and Next.js.** No Redux, no Zustand, no UI library, no icon pack. Everything is hand-built.

**Tailwind v4 syntax:** uses `@import "tailwindcss"` and `@theme {}` blocks — no old `@tailwind base/components/utilities` directives. Utility classes are used sparingly; layout and shell chrome rely on inline styles with CSS custom properties.

**Dev server:** `cd design-system-portfolio && npm run dev -- --port 3001`

---

## ARCHITECTURE

### Layout

Three panels rendered side-by-side on desktop (≥ 1024px / `lg` breakpoint). On mobile they collapse to a single visible panel with a tab bar at the bottom.

```
┌─────────────────────────────────────────────────────────────────┐
│  LeftPanel (260px)  │  CenterPanel (flex-1)  │  RightPanel (280px) │
│  ─────────────────  │  ─────────────────────  │  ──────────────────  │
│  Logo / Search      │  CanvasHeader toolbar   │  Inspect tabs        │
│  AccordionNav       │  ComponentRenderer      │  InspectPanel        │
│    └ Welcome        │    └ canvas-grid bg     │    └ TokenRow list   │
│    └ Sections       │    └ Content layer      │                      │
│  Status bar         │  ControlsBar            │                      │
└─────────────────────────────────────────────────────────────────┘
```

**Panel widths are hardcoded constants** used in both the layout components and the `IntroAnimation.tsx` border-draw positions. If you change panel widths you must update both places:
- `LEFT_W = 260` in `IntroAnimation.tsx`
- `RIGHT_W = 280` in `IntroAnimation.tsx`
- `width: "260px"` in `LeftPanel.tsx`
- `width: "280px"` in `RightPanel.tsx`

### File Structure

```
app/
  layout.tsx          — Root layout, ThemeProvider, AppProvider, FOUC script
  page.tsx            — Renders <AppShell />
  globals.css         — All CSS tokens (--sh-*, --pds-btn-*), keyframes, .canvas-grid

components/
  canvas/
    ComponentRenderer.tsx   — Routes to WelcomeCanvas / LiveComponentCanvas / PlaceholderState. Welcome centering: content div has paddingRight: showWelcome ? "260px" : 0 to shift flex center to viewport midpoint.
    ControlsBar.tsx         — Bottom bar, reads registry controls, drives controlValues
    SectionGridCanvas.tsx   — Section overview grid. Tiles show live renderers OR custom previews (CUSTOM_TILE_PREVIEWS map) for full-canvas components (Color Tokens, Typography, Spacing, Nav, Guides).
    AboutCanvas.tsx         — About page content rendered as a canvas state (not a separate route). Scroll container owns overflowY:auto. All SVG hover animations live here.
    ColorTokensCanvas.tsx   — Full-canvas color token documentation, swatches + accent presets
    TypographyCanvas.tsx    — Full-canvas type scale documentation
    SpacingCanvas.tsx       — Full-canvas spacing scale documentation
    EuGuideCanvas.tsx       — Eucalyptus guide (no controls/inspect panels)
    RcGlobalNavCanvas.tsx   — rc-global-nav, single self-contained file
    EmptyCanvas.tsx         — (Legacy — may not be in active use)
    HeroCanvas.tsx          — (Legacy — predates current intro animation)
  inspect/
    InspectPanel.tsx        — Inspect content only. Tabs (Properties/Docs) were removed — no tab bar, no tab switching.
    TokenRow.tsx            — Single token row with color swatch
    VariantToggle.tsx       — Toggle row used in inspect panel
  layout/
    AppShell.tsx            — Shell skeleton + IntroAnimation overlay + accent picker
    CenterPanel.tsx         — CanvasHeader toolbar + ComponentRenderer + ControlsBar
    IntroAnimation.tsx      — Dark overlay, border-draw animation, skip logic
    LeftPanel.tsx           — Logo, search bar placeholder, AccordionNav
    RightPanel.tsx          — Wraps InspectPanel
    MobileTabBar.tsx        — Bottom tab bar for mobile
    PanelHeader.tsx         — Shared panel header component
    LandingScreen.tsx       — (Legacy — predates current intro, not in active use)
  navigation/
    AccordionNav.tsx        — Welcome item + all AccordionSection instances with stagger delays
    AccordionSection.tsx    — Collapsible section header + NavItem list
    NavItem.tsx             — Individual nav item with intro stagger animation
  portfolio-design-system/
    PdsButton/
      definition.ts         — Pure data: controls[], defaultValues, getTokens()
      PdsButton.tsx         — Real component + PdsButtonRenderer export
  ui/
    AccentPicker.tsx        — Six color swatch buttons, reads/writes theme context
    PdsToggle.tsx           — The toggle switch (used for --mode toggle in toolbar)

data/
  navigation.ts       — navSections array (three sections, 16 entries total)

lib/
  accent.ts           — ACCENT_PRESETS, buildAccentVars(), applyAccentPreset()
  registry.ts         — COMPONENT_REGISTRY + COMPONENT_RENDERERS maps, isRegistered()
  store.tsx           — AppProvider + useAppStore hook (React Context)
  theme.tsx           — ThemeProvider + useTheme hook
  types.ts            — All TypeScript types
```

### State Management

All app state lives in `lib/store.tsx` as a React Context. No external state library.

| State | Type | Purpose |
|---|---|---|
| `selectedComponentId` | `string \| null` | Which nav entry is active; `"welcome"` for Welcome screen |
| `activeMobilePanel` | `"navigator" \| "canvas" \| "inspect"` | Which panel is visible on mobile |
| `expandedSections` | `Set<string>` | Which accordion sections are open (all open by default) |
| `controlValues` | `Record<string, ComponentControlValues>` | Per-component control state, seeded from registry defaults |
| `launched` | `boolean` | Whether the intro animation has completed |

Key actions: `launch()` sets `launched=true` and `selectedComponentId="welcome"`. `reset()` navigates back to welcome without replaying the intro.

Theme and accent state live separately in `lib/theme.tsx`. Both are persisted to `localStorage` (`pf-theme`, `pf-accent`).

### Component Registry Pattern

Every real component requires exactly three things:

1. **`definition.ts`** — Pure data file, no React imports. Exports a `ComponentRegistration` object with `id`, `controls[]`, `defaultValues`, and `getTokens(values) → TokenRow[]`.

2. **`ComponentFile.tsx`** — The real styled React component. Also exports a `ComponentRenderer(values) → ReactNode` function for use in the registry.

3. **Registration in `lib/registry.ts`** — Add to both `COMPONENT_REGISTRY` (for inspect/controls) and `COMPONENT_RENDERERS` (for canvas rendering).

Components that are not yet registered render as `PlaceholderState` in the canvas (skeleton mock-up with "coming soon" label).

### Intro Animation Sequence

On first page load, `IntroAnimation.tsx` runs a ~5 second assembly sequence:

1. **0ms** — Dark screen (`#111111`). `WelcomeCanvas` renders above the overlay (z-index 55) and begins typing the headline word-by-word in its **final DOM position** at `18px` monospace — no repositioning ever occurs.
2. **0–1320ms** — Headline types (12 words × 110ms/word). Cursor blinks throughout.
3. **1320–1820ms** — Cursor visible for 500ms after last word, then hides.
4. **1820ms** — Left panel border draws in (450ms, scaleY transform).
5. **2020ms** — Right panel border draws in (450ms).
6. **2220ms** — Toolbar border draws in (450ms, scaleX).
7. **2870ms** — `launch()` called: overlay fades (700ms), `launched=true`, `selectedComponentId="welcome"`. All nav/toolbar elements animate in with staggered `intro-reveal` keyframe.
8. **4170ms** — Canvas dot-grid background fades in (800ms, `intro-canvas-fade` keyframe).

Any key press or click instantly skips to the assembled state.

**Critical constraint:** The headline in `WelcomeCanvas` is the single source of truth. `IntroAnimation.tsx` no longer renders any text — it only draws the border lines and manages the overlay. Do not move typing logic back into the overlay.

---

## WELCOME SCREEN

The Welcome screen is not a separate route or page — it is a canvas state. `selectedComponentId === "welcome"` causes `ComponentRenderer` to render `WelcomeCanvas`.

**Welcome is the first item in the left nav**, above all accordion sections, rendered by `WelcomeNavItem` inside `AccordionNav.tsx`. It uses a home/house icon and the label "Welcome."

**Typing animation:** `WelcomeCanvas` manages its own word-by-word typing via `useEffect` timers. The h2 headline renders at `18px`, `fontFamily: MONO`, `fontWeight: 400`, `lineHeight: 1.35`, in its final position from the very first frame. Nothing moves or resizes.

**After `launched=true`:** The logo mark, subhead paragraph, and nav hint fade in via opacity transitions (100ms, 200ms stagger). The h2 was already visible and doesn't change.

**Color swatch / Accent picker** appears in two places:
- **Bottom-right of the welcome screen:** Rendered in `AppShell.tsx`, fades in when `launched=true`. Labeled `--accent` in monospace.
- **Top toolbar (CenterPanel):** Rendered as the last item in the `CanvasHeader` toolbar, with a `D_ACCENT_TOOL=480ms` intro stagger.

---

## COLOR SYSTEM

### How It Works

All shell colors use CSS custom properties prefixed `--sh-*`. They are defined on `:root` (light mode defaults) with overrides in `@media (prefers-color-scheme: dark)` and explicit `[data-theme="dark"]` / `[data-theme="light"]` attribute blocks in `globals.css`.

Components reference `var(--sh-xxx)` via inline `style={{}}` props. **Zero hardcoded hex values in component files** (except `#111111` for dark-on-light text enforcement and the intro overlay background).

The accent color (`--sh-accent` and related tokens) is overridden at runtime by `applyAccentPreset()` in `lib/accent.ts`, which writes directly to `document.documentElement.style`. This does not involve CSS file changes — it's inline style overrides.

### Light Mode Tokens (`:root` defaults)

| Token | Value | Usage |
|---|---|---|
| `--sh-bg` | `#FFFFFF` | Main page background |
| `--sh-canvas` | `#F5F5F5` | Canvas dot-grid background |
| `--sh-canvas-dot` | `#E0E0E0` | Canvas dot color |
| `--sh-panel` | `#F7F7F7` | Left/right panel surface |
| `--sh-panel-alt` | `#F0F0F0` | Secondary surfaces (inputs) |
| `--sh-border` | `#E5E5E5` | Standard borders |
| `--sh-border-sub` | `#DCDCDC` | Subtle borders, panel dividers |
| `--sh-text` | `#111111` | Primary text |
| `--sh-text-muted` | `#777777` | Secondary text |
| `--sh-text-faint` | `#AAAAAA` | Tertiary / placeholder text |
| `--sh-accent` | `#C8E000` | Primary accent (chartreuse default) |
| `--sh-accent-h` | `#B4CC00` | Accent hover |
| `--sh-accent-a` | `#A0B800` | Accent active/pressed |
| `--sh-accent-rose` | `#E896A8` | Secondary accent (dusty rose) |
| `--sh-accent-blue` | `#7EC4E0` | Tertiary accent (sky blue) |
| `--sh-accent-sage` | `#96C4A4` | Quaternary accent (sage green) |
| `--sh-accent-sel` | `rgba(200,224,0,0.14)` | Selected nav item background |
| `--sh-accent-ring` | `rgba(200,224,0,0.35)` | Focus ring |
| `--sh-hover` | `rgba(0,0,0,0.04)` | Default hover state |
| `--sh-hover-str` | `rgba(0,0,0,0.06)` | Stronger hover (toolbar buttons) |
| `--sh-badge-bg` | `rgba(0,0,0,0.05)` | Badge/chip background |
| `--sh-input-bg` | `#F0F0F0` | Input / search background |
| `--sh-switch-off` | `#D0D0D0` | Toggle off state track |
| `--sh-skeleton` | `#E5E5E5` | Skeleton loader primary |
| `--sh-skeleton-alt` | `#EEEEEE` | Skeleton loader secondary |
| `--sh-accent-text` | `#111111` | Text on accent backgrounds (always dark) |

### Dark Mode Tokens (`@media (prefers-color-scheme: dark)` and `[data-theme="dark"]`)

| Token | Value | Usage |
|---|---|---|
| `--sh-bg` | `#111111` | Main page background |
| `--sh-canvas` | `#0E0E0E` | Canvas background |
| `--sh-canvas-dot` | `#1E1E1E` | Canvas dot color |
| `--sh-panel` | `#1A1A1A` | Panel surfaces |
| `--sh-panel-alt` | `#222222` | Secondary surfaces |
| `--sh-border` | `#2E2E2E` | Standard borders |
| `--sh-border-sub` | `#282828` | Subtle borders |
| `--sh-text` | `#F5F5F5` | Primary text |
| `--sh-text-muted` | `#888888` | Secondary text |
| `--sh-text-faint` | `#505050` | Tertiary text |
| `--sh-accent` | `#C8E000` | Primary accent (same chartreuse, pops on dark) |
| `--sh-accent-h` | `#D4EE00` | Accent hover (slightly brighter on dark) |
| `--sh-accent-a` | `#E0FA00` | Accent active (brighter still) |
| `--sh-accent-rose` | `#E896A8` | Secondary accent |
| `--sh-accent-blue` | `#7EC4E0` | Tertiary accent |
| `--sh-accent-sage` | `#96C4A4` | Quaternary accent |
| `--sh-accent-sel` | `rgba(200,224,0,0.15)` | Selected nav item background |
| `--sh-accent-ring` | `rgba(200,224,0,0.30)` | Focus ring |
| `--sh-hover` | `rgba(255,255,255,0.04)` | Hover state |
| `--sh-hover-str` | `rgba(255,255,255,0.07)` | Stronger hover |
| `--sh-badge-bg` | `rgba(255,255,255,0.06)` | Badge background |
| `--sh-input-bg` | `#222222` | Input background |
| `--sh-switch-off` | `#2E2E2E` | Toggle off state |
| `--sh-skeleton` | `#2E2E2E` | Skeleton primary |
| `--sh-skeleton-alt` | `#222222` | Skeleton secondary |
| `--sh-accent-text` | `#111111` | Text on accent (always dark — chartreuse is light even in dark mode) |

### Accent Color Presets

The accent system overrides `--sh-accent`, `--sh-accent-h`, `--sh-accent-a`, and all alpha variants at runtime. It also overrides the PDS Button primary variant tokens. Selections persist in `localStorage` as `pf-accent`.

| ID | Label | Hex | Notes |
|---|---|---|---|
| `chartreuse` | Chartreuse | `#C8E000` | **Default.** High contrast, brand-forward. |
| `mint` | Electric Mint | `#00D4A0` | Cool green, fresh feel. |
| `coral` | Bright Coral | `#FF4D6D` | Warm, energetic. |
| `cyan` | Vivid Cyan | `#00C2E0` | Tech/product feel. |
| `lavender` | Lavender | `#A594E8` | Softer, designer-coded. |
| `pink` | Hot Pink | `#FF6EB4` | Bold and playful. |

**Contrast rule:** All accent colors are light/vivid. `--sh-accent-text` is always `#111111`. Never use white text on these accents — the contrast math doesn't hold. This is enforced in `buildAccentVars()` in `lib/accent.ts`.

### Inspect Panel Dot Colors

TokenRow category dots use fixed accent colors regardless of the active accent preset:
- `color` → `var(--sh-accent)` (active accent)
- `shadow` → `var(--sh-accent-blue)`
- `typography` → `var(--sh-accent-blue)`
- `spacing` → `var(--sh-accent-rose)`
- `radius` → `var(--sh-accent-rose)`

---

## COMPONENT REGISTRY

### Portfolio Design System

| ID | Name | Status | Notes |
|---|---|---|---|
| `pds-color-tokens` | Color Tokens | ✅ **Built** | Full-canvas swatch grid — accent presets, surface, border, text, accent scale. No renderer (full canvas only). |
| `pds-typography` | Typography Scale | ✅ **Built** | Full-canvas type ramp. No renderer (full canvas only). |
| `pds-spacing` | Spacing System | ✅ **Built** | Full-canvas spacing scale. No renderer (full canvas only). |
| `pds-button` | Button | ✅ **Built** | Primary/Secondary/Ghost variants, sm/md/lg sizes, Disabled/Loading/Full Width/Icon Only toggles. Fully wired: live canvas, reactive controls, live inspect panel tokens. |
| `pds-input` | Input | ✅ **Built** | Search input. forwardRef, controlled mode, kbd badge, fullWidth. Used in shell search bar and canvas demo — single source of truth for both. |

### Responsive Components

| ID | Name | Status | Notes |
|---|---|---|---|
| `rc-global-nav` | Global Nav | ✅ **Built** | BambooHR-style collapsible sidebar + top header. Three responsive breakpoints, accordion sub-nav, flyout on hover, portal-based dropdowns. See architecture notes below. |
| `rc-navbar` | Navbar | 🔲 Placeholder | Needs responsive nav with mobile hamburger |
| `rc-hero` | Hero Section | 🔲 Placeholder | Needs full-width hero with headline + CTA |
| `rc-card` | Card | 🔲 Placeholder | Needs card component with image/content/actions |
| `rc-grid` | Grid Layout | 🔲 Placeholder | Needs responsive grid demonstration |
| `rc-footer` | Footer | 🔲 Placeholder | Needs footer layout component |

### rc-global-nav Architecture

**File:** `components/canvas/RcGlobalNavCanvas.tsx` — single self-contained file, `"use client"`.

**Icon library:** Font Awesome Free (`@fortawesome/react-fontawesome`, `@fortawesome/free-solid-svg-icons`). This component is the exception to the zero-dependency rule — FA is already installed. Eucalyptus components use Phosphor Icons if/when icon libraries are needed.

**Responsive breakpoints** (canvas width, not window width — driven by `ResizeObserver` on the simulated browser frame):
- `BP_TABLET = 720` — sidebar hides, hamburger shows, overlay drawer for nav
- `BP_MOBILE = 500` — same as tablet + compact avatar, expandable drawer sub-items, account panel from avatar tap
- `BP_MIN = 320` — minimum resizable frame width

**Portal pattern:** The flyout panel and search dropdown both use `createPortal(…, document.body)` with `position: fixed` + `getBoundingClientRect()` for positioning. This avoids `overflow: hidden` clipping inside the canvas frame. Use this same pattern for any other absolutely-positioned overlays in canvas components.

**Accordion sub-items with dividers:**
```tsx
type SubEntry = { id: string; label: string; count?: number; icon: IconDefinition };
type SubItem  = SubEntry | "divider";
```
The `"divider"` string sentinel is checked with `if (sub === "divider") return <hr …>` in both the desktop sidebar and the drawer. The `NavFlyout` sub-component does **not** yet handle dividers — adding divider sub-items to flyout-only rows will produce a TypeScript warning and a blank button.

**Left border line on open accordions:**
- Container: `marginLeft: "19-20px"`, `borderLeft: "1.5px solid #F0F1F3"`, `paddingLeft: "11-12px"`
- Sub-item buttons: `marginLeft: "8px"` (creates visual gap between line and highlight)
- Group dividers: `<hr style={{ borderTop: "1px solid #F0F1F3" }}>` — same color as the vertical line

**BambooHR color palette** is defined as module-level constants (`const C = { … }`) inside the file — not CSS tokens. This is intentional: the component simulates a third-party product and must not inherit the portfolio shell's theme.

**Expressive craft moment:** Sidebar expand stagger — nav labels slide in 10ms apart per item, creating a fan-opening effect. Labels vanish instantly on collapse so the animation only rewards the reveal direction.

### Eucalyptus

Eucalyptus is a real design system Jo built (separate from the portfolio system). These components need to be recreated from screenshots and design references to demonstrate that system's visual language — they have a distinct aesthetic from the Portfolio Design System components.

| ID | Name | Status | Notes |
|---|---|---|---|
| `eu-button` | Button | 🔲 Placeholder | Eucalyptus visual style — rebuild from reference |
| `eu-card` | Card | 🔲 Placeholder | Rebuild from reference |
| `eu-modal` | Modal | 🔲 Placeholder | Rebuild from reference |
| `eu-badge` | Badge | 🔲 Placeholder | Rebuild from reference |
| `eu-tooltip` | Tooltip | 🔲 Placeholder | Rebuild from reference |

---

## CONVENTIONS

### Build in Components
Every visual element has a purpose-built component. No one-off divs with mixed concerns. Shell chrome uses shell token components; PDS examples use PDS token components.

### Never Hardcode Values
All colors, spacing, radius, shadow, and typography values come from CSS custom properties. Components reference `var(--sh-*)` or `var(--pds-*)` tokens, never raw hex or pixel values (except where a token literally doesn't exist yet — document those as technical debt).

### Dark Text on Light Accents
All six accent presets are light/vivid. `--sh-accent-text` is always `#111111`. This is hardcoded in `buildAccentVars()` and must never change. Do not use `var(--sh-text)` on accent backgrounds — it inverts in light mode.

### The Portfolio Eats Its Own Cooking
The shell UI uses the same components it documents:
- The `--mode` toggle in the toolbar is `PdsToggle` from the system (`components/ui/PdsToggle.tsx`)
- Nav selected states use `--sh-accent-sel` (the same token used in component selected states)
- The font scale, spacing, and border radius in the shell reference the same token scale documented in the PDS section

When new PDS components are built, they should be used in the shell where appropriate — not separate ad-hoc implementations.

### Definition/Renderer Split
`definition.ts` is pure data (no React, no JSX). `ComponentFile.tsx` is the component (React, styles). This keeps type definitions importable from server contexts and prevents accidental entanglement of data and rendering concerns.

### Inline Styles for Shell Tokens
Shell chrome uses `style={{ color: "var(--sh-text)" }}` rather than Tailwind utilities for theme-aware values. Tailwind utilities are acceptable for layout (`flex`, `items-center`, `gap-2`, etc.) and non-token properties.

### Panel Visibility System

`AppShell.tsx` controls whether the right inspect panel and controls bar are visible based on which component is selected.

```ts
const NO_PANELS = new Set(["welcome", "about", "rc-guide", "eu-guide"]);
const showPanels = !!selectedComponentId && !NO_PANELS.has(selectedComponentId);
```

- Right panel: wrapped in a clip div with `width: showPanels ? 280 : 0`, `overflow: "hidden"`, `transition: "width 300ms cubic-bezier(0.25, 0, 0, 1)"`. `RightPanel`'s aside has no `minWidth` so it collapses cleanly.
- Controls bar: `maxHeight: showPanels ? 88 : 0` transition (avoids `height: auto` animation limitation). `CONTROLS_H = 88` is the measured height.
- Add new "no panels" pages to `NO_PANELS` — do not add a special case in `CenterPanel`.

### About Page (In-Shell)

About is a canvas state, not a Next.js route. `selectedComponentId === "about"` renders `AboutCanvas` inside `ComponentRenderer`. The standalone `/about` route still exists but is superseded. `AboutNavItem` in `AccordionNav.tsx` calls `selectComponent("about")` — not `router.push`.

### Animation Play State Pattern
Nav items (`NavItem.tsx`) only apply the intro stagger animation when `!launched`. After launch, re-mounting items (e.g., reopening an accordion) appear instantly with no delay. The pattern:
```tsx
...(launched ? {} : {
  animationName: "intro-reveal",
  animationFillMode: "both",
  animationDelay: `${introDelay}ms`,
  animationPlayState: "paused",
})
```
Toolbar elements and section headers still use the older always-applied pattern (they don't unmount/remount so it's not an issue).

---

## WHAT STILL NEEDS BUILDING

### Eucalyptus Components

All five Eucalyptus components need to be built from screenshots and design references. The Eucalyptus system has a distinct visual language from the Portfolio Design System. Before building each one, reference the design artifacts to ensure the aesthetic is correct — don't use PDS tokens for these.

### Responsive Components

- `rc-global-nav` — ✅ Built. BambooHR-style global nav; accordion sub-nav, flyout, drawer, responsive simulation via drag handle.
- `rc-navbar` — Fully responsive nav with logo, links, mobile hamburger and drawer. Should actually resize/respond when the canvas viewport controls are used.
- `rc-hero`, `rc-card`, `rc-grid`, `rc-footer` — Full implementations demonstrating responsive behavior.

### Responsive Canvas Viewport

The Desktop/Tablet/Mobile viewport controls in the toolbar are currently non-functional buttons. These should constrain the canvas width to simulate responsive breakpoints, allowing the Responsive Components section to actually demonstrate responsiveness.

### Mobile Polish

The mobile single-panel layout with tab bar exists but has not been extensively tested. The intro animation should be reviewed on mobile viewport widths — the border-draw positions are hardcoded to desktop panel widths.

---

## PROMPTING NOTES FOR FUTURE SESSIONS

### Always Do First
1. **Read this file** (`AGENTS.md`) before touching any code.
2. Check `lib/registry.ts` to understand what's currently registered.
3. Check `data/navigation.ts` to understand the nav structure.

### Hard Rules — Never Break Without Explicit Instruction

- **Do not change the three-panel layout** (widths, structure, or panel responsibilities).
- **Do not change the intro animation sequence** (timing, border positions, stagger schedule) unless explicitly asked. The timing constants in `IntroAnimation.tsx` and the word-typing constants in `ComponentRenderer.tsx` must stay in sync — if you change one, change both.
- **Do not move the typing logic back into `IntroAnimation.tsx`**. The headline types inside `WelcomeCanvas` at its final DOM position. This is intentional and was specifically engineered to prevent repositioning.
- **Do not modify dark mode and light mode simultaneously** unless the user explicitly asks for both. The token tables are long and errors are easy to introduce.
- **Do not add runtime dependencies** without discussing the tradeoff. The zero-dependency constraint is intentional.
- **Do not use hardcoded hex values** in component files. Add a token to `globals.css` first.

### When Adding a New Component

Follow the PDS Button pattern exactly:
1. Create `components/portfolio-design-system/PdsComponentName/definition.ts` — pure data, `ComponentRegistration` export.
2. Create `components/portfolio-design-system/PdsComponentName/PdsComponentName.tsx` — real component + `PdsComponentNameRenderer` export.
3. Register both in `lib/registry.ts`.
4. Add the entry to `data/navigation.ts` if it doesn't already exist.
5. Confirm `ControlsBar` picks up the new controls (it reads from the registry automatically).
6. Confirm the inspect panel shows real token values (test by changing variant/size).

For Eucalyptus components, use the same pattern but under `components/eucalyptus/EuComponentName/`.

### Accent Colors
All six presets use light/vivid colors. `--sh-accent-text` is always `#111111`. When writing new components that use the accent as a background, always use `var(--sh-accent-text)` for text on top — never `var(--sh-text)`.

### CSS Token Naming
- Shell chrome: `--sh-*`
- PDS Button: `--pds-btn-*`
- Future PDS components: `--pds-[component]-*`
- Eucalyptus components: `--eu-[component]-*`

### State Access Pattern
```tsx
const { selectedComponentId, launched, controlValues } = useAppStore();
const { theme, toggleTheme, accentId, setAccent } = useTheme();
```

### Do Not Touch
- `lib/types.ts` — all types live here; changes cascade everywhere
- `app/layout.tsx` — contains the FOUC prevention script that runs before hydration
- The `animationPlayState` pattern on nav items and toolbar elements — it is load-bearing for the intro stagger

---

## EXPRESSIVE CRAFT MOMENTS

Every page and component in this portfolio should contain at least one moment of expressive web storytelling — an animation, interaction, or visual detail that shows craft beyond functional UI. This is intentional and a core requirement of the portfolio, not an afterthought.

**The guiding question for every new page or component:** *What is the expressive moment here?*

The system is the canvas. The storytelling lives inside it.

### Principles

- **Considered, not gratuitous.** Moments should feel purposeful — chosen because they reveal something about the content, not added to impress. An animation that makes a concept clearer is always preferable to one that merely looks good.
- **Enhances understanding, never distracts.** The expressive moment should make the user more aware of meaning, not less aware of it. If it competes with the content, cut it.
- **Proportional to context.** A data visualization has room for more expression than a button component. Match the intensity of the moment to the weight of the content it lives in.
- **Craft in the details.** Expression doesn't require spectacle. A carefully tuned easing curve, a well-timed fade, or a path that draws itself on hover can carry as much weight as a complex animation.

### Examples in this project

- **Intro animation** — The border-draw assembly sequence is an expressive moment: the tool assembles itself in front of you, implying that it was built, not handed down.
- **Typing headline** — The word-by-word monospace type mimics someone writing in a code editor — it establishes Jo's voice before she speaks.
- **About page fact animations** — Each SVG sketch draws itself on hover, tying a unique visual metaphor to each biographical fact. The heartbeat line for "military veteran," the cedar tree for "Lebanese American." Content and craft unified.
- **Accent picker** — The ability to swap the accent color live is itself expressive: it shows that the token system is real and runtime-capable, not a static mock.

### When building anything new

1. Identify the expressive moment before writing any code.
2. It can be micro (a hover state with a custom easing) or macro (a canvas-level interaction). Scale to context.
3. Document the intention in a code comment so future sessions understand it was deliberate.
4. If you cannot identify a natural expressive moment, that is a signal to reconsider the design — not a reason to skip it.
