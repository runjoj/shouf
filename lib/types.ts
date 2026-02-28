// ─── Navigation ────────────────────────────────────────────────────────────────

export type ComponentEntry = {
  id: string;
  name: string;
  sectionId: string;
};

export type NavSection = {
  id: string;
  title: string;
  entries: ComponentEntry[];
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
  activeMobilePanel: MobilePanel;
  expandedSections: Set<string>;
  controlValues: Record<string, ComponentControlValues>;
  /** Whether the intro animation has completed and panels are revealed */
  launched: boolean;
};

export type AppActions = {
  selectComponent: (id: string | null) => void;
  setActiveMobilePanel: (panel: MobilePanel) => void;
  toggleSection: (sectionId: string) => void;
  setControlValue: (componentId: string, controlId: string, value: ControlValue) => void;
  /** Called by IntroAnimation when assembly completes — reveals panels, selects Welcome */
  launch: () => void;
  /** Navigate back to the Welcome page (logo click) — does not replay intro */
  reset: () => void;
};

export type AppStore = AppState & AppActions;
