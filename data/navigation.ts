import type { NavSection } from "@/lib/types";

export const navSections: NavSection[] = [
  {
    id: "responsive-components",
    title: "Responsive Components",
    entries: [
      { id: "rc-overview",   name: "Overview",           sectionId: "responsive-components", overviewFor: "responsive-components" },
      { id: "rc-guide",      name: "Responsive Case Study", sectionId: "responsive-components" },
      { id: "rc-global-nav", name: "Global Navigation",  sectionId: "responsive-components" },
    ],
  },
  {
    id: "eucalyptus",
    title: "Eucalyptus",
    entries: [
      { id: "eu-overview", name: "Overview",                 sectionId: "eucalyptus", overviewFor: "eucalyptus" },
      { id: "eu-embedded", name: "Embedded Experience",      sectionId: "eucalyptus" },
      { id: "eu-guide",    name: "Design System Case Study", sectionId: "eucalyptus" },
    ],
    groups: [
      {
        label: "Components",
        entries: [
          { id: "eu-statuses",         name: "Statuses",         sectionId: "eucalyptus" },
          { id: "eu-folder-container", name: "Folder Container", sectionId: "eucalyptus" },
        ],
      },
    ],
  },
  {
    id: "portfolio-design-system",
    title: "Shouf Library",
    entries: [
      { id: "pds-overview", name: "Overview",                 sectionId: "portfolio-design-system", overviewFor: "portfolio-design-system" },
      { id: "pds-guide",    name: "Design System Case Study", sectionId: "portfolio-design-system" },
    ],
    groups: [
      {
        label: "Foundations",
        entries: [
          { id: "pds-color-tokens", name: "Color Tokens",     sectionId: "portfolio-design-system" },
          { id: "pds-typography",   name: "Typography Scale", sectionId: "portfolio-design-system" },
          { id: "pds-spacing",      name: "Spacing System",   sectionId: "portfolio-design-system" },
        ],
      },
      {
        label: "Components",
        entries: [
          { id: "pds-button", name: "Button", sectionId: "portfolio-design-system" },
          { id: "pds-input",  name: "Input",  sectionId: "portfolio-design-system" },
        ],
      },
    ],
  },
];
