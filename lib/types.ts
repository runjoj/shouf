// ─── Navigation ────────────────────────────────────────────────────────────────

export type ComponentEntry = {
  id: string;
  name: string;
  sectionId: string;
  /** When set, clicking this entry navigates to the section grid for this sectionId */
  overviewFor?: string;
  /** Small muted descriptor shown after the name (e.g. "built with Eucalyptus") */
  tag?: string;
  /** When true, the item is dimmed and not clickable */
  disabled?: boolean;
  /** Label shown when disabled (e.g. "coming soon") */
  disabledLabel?: string;
};

export type NavSubGroup = {
  label: string;
  entries: ComponentEntry[];
};

export type NavSection = {
  id: string;
  title: string;
  entries: ComponentEntry[];   // top-level items (not in any sub-group)
  groups?: NavSubGroup[];      // optional collapsible sub-groups
  /** When true, clicking the section header also navigates to the section index page */
  navigateOnClick?: boolean;
};

// ─── Panel ─────────────────────────────────────────────────────────────────────

export type MobilePanel = "navigator" | "canvas" | "inspect";

// ─── Controls ──────────────────────────────────────────────────────────────────

export type ControlType = "toggle" | "select" | "boolean" | "number" | "text";

export type ControlOption = {
  label: string;
  value: string;
};

export type Control = {
  id: string;
  label: string;
  type: ControlType;
  defaultValue: string | boolean | number;
  options?: ControlOption[];
};

// ─── Inspect ───────────────────────────────────────────────────────────────────

export type TokenCategory = "spacing" | "color" | "typography" | "radius" | "shadow";

export type TokenRow = {
  id: string;
  property: string;
  cssValue: string;
  tokenName: string;
  category: TokenCategory;
};

export type VariantToggleItem = {
  id: string;
  label: string;
  value: boolean;
};

// ─── Component Registry ────────────────────────────────────────────────────────

export type ControlValue = string | boolean | number;
export type ComponentControlValues = Record<string, ControlValue>;

export type ComponentRegistration = {
  id: string;
  controls: Control[];
  defaultValues: ComponentControlValues;
  getTokens: (values: ComponentControlValues) => TokenRow[];
};

// ─── Store ─────────────────────────────────────────────────────────────────────

export type AppState = {
  selectedComponentId: string | null;
  /** When set, the center canvas shows the section grid for this section id */
  selectedSectionId: string | null;
  activeMobilePanel: MobilePanel;
  expandedSections: Set<string>;
  controlValues: Record<string, ComponentControlValues>;
  /** Whether the intro animation has completed and panels are revealed */
  launched: boolean;
  /** Set when user skips typing (key/click) — WelcomeCanvas snaps to full text */
  introSkipped: boolean;
};

export type AppActions = {
  selectComponent: (id: string | null) => void;
  /**
   * Navigate to a section grid view. Passing non-null also clears selectedComponentId
   * so the grid opens with nothing pre-selected. Passing null exits grid mode.
   */
  selectSection: (id: string | null) => void;
  setActiveMobilePanel: (panel: MobilePanel) => void;
  toggleSection: (sectionId: string) => void;
  setControlValue: (componentId: string, controlId: string, value: ControlValue) => void;
  /** Called by IntroAnimation when assembly completes — reveals panels, selects Welcome */
  launch: () => void;
  /** Navigate back to the Welcome page (logo click) — does not replay intro */
  reset: () => void;
  /** Signal that the user skipped the typing animation */
  skipIntroTyping: () => void;
};

export type AppStore = AppState & AppActions;
