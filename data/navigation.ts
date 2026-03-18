import type { NavSection } from "@/lib/types";

export const navSections: NavSection[] = [
  {
    id: "portfolio-design-system",
    title: "Shouf Design System",
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
      { id: "rc-guide",  name: "Guide",             sectionId: "responsive-components" },
      { id: "rc-global-nav", name: "Global Navigation", sectionId: "responsive-components" },
    ],
  },
  {
    id: "eucalyptus",
    title: "Eucalyptus",
    entries: [
      { id: "eu-guide",            name: "Guide",            sectionId: "eucalyptus" },
      { id: "eu-statuses",         name: "Statuses",         sectionId: "eucalyptus" },
      { id: "eu-folder-container", name: "Folder Container", sectionId: "eucalyptus" },
    ],
  },
];
