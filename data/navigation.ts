import type { NavSection } from "@/lib/types";

export const navSections: NavSection[] = [
  {
    id: "portfolio-design-system",
    title: "Shouf Design System",
    entries: [
      { id: "pds-overview",     name: "Overview",         sectionId: "portfolio-design-system" },
      { id: "pds-color-tokens", name: "Color Tokens",     sectionId: "portfolio-design-system" },
      { id: "pds-typography",   name: "Typography Scale", sectionId: "portfolio-design-system" },
      { id: "pds-spacing",      name: "Spacing System",   sectionId: "portfolio-design-system" },
      { id: "pds-button",       name: "Button",           sectionId: "portfolio-design-system" },
      { id: "pds-input",        name: "Input",            sectionId: "portfolio-design-system" },
    ],
  },
  {
    id: "eucalyptus",
    title: "Eucalyptus Design System",
    entries: [
      { id: "eu-overview",         name: "Overview",         sectionId: "eucalyptus" },
      { id: "eu-statuses",         name: "Statuses",         sectionId: "eucalyptus" },
      { id: "eu-folder-container", name: "Folder Container", sectionId: "eucalyptus" },
      { id: "eu-radio",            name: "Radio",            sectionId: "eucalyptus" },
      { id: "eu-filters",          name: "Filters",          sectionId: "eucalyptus" },
    ],
  },
];
