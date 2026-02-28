import type { NavSection } from "@/lib/types";

export const navSections: NavSection[] = [
  {
    id: "portfolio-design-system",
    title: "Portfolio Design System",
    entries: [
      { id: "pds-color-tokens", name: "Color Tokens", sectionId: "portfolio-design-system" },
      { id: "pds-typography", name: "Typography Scale", sectionId: "portfolio-design-system" },
      { id: "pds-spacing", name: "Spacing System", sectionId: "portfolio-design-system" },
      { id: "pds-button", name: "Button", sectionId: "portfolio-design-system" },
      { id: "pds-input", name: "Input", sectionId: "portfolio-design-system" },
      { id: "pds-badge", name: "Badge", sectionId: "portfolio-design-system" },
    ],
  },
  {
    id: "responsive-components",
    title: "Responsive Components",
    entries: [
      { id: "rc-navbar", name: "Navbar", sectionId: "responsive-components" },
      { id: "rc-hero", name: "Hero Section", sectionId: "responsive-components" },
      { id: "rc-card", name: "Card", sectionId: "responsive-components" },
      { id: "rc-grid", name: "Grid Layout", sectionId: "responsive-components" },
      { id: "rc-footer", name: "Footer", sectionId: "responsive-components" },
    ],
  },
  {
    id: "eucalyptus",
    title: "Eucalyptus",
    entries: [
      { id: "eu-button", name: "Button", sectionId: "eucalyptus" },
      { id: "eu-card", name: "Card", sectionId: "eucalyptus" },
      { id: "eu-modal", name: "Modal", sectionId: "eucalyptus" },
      { id: "eu-badge", name: "Badge", sectionId: "eucalyptus" },
      { id: "eu-tooltip", name: "Tooltip", sectionId: "eucalyptus" },
    ],
  },
];
