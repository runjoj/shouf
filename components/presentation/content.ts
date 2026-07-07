import type { Slide } from "./types";

// ─── Slide content ──────────────────────────────────────────────────────────
// Sparse by design — headers and short supporting lines only. The depth gets
// narrated live; these slides are the spine, not the transcript.

export const SLIDES: Slide[] = [
  // ─── Title ─────────────────────────────────────────────────────────────
  {
    type:  "title",
    kicker: "Case Study Presentation",
    title: "Jo Ann Saab",
    sub:   ["Claude MCP UI", "Responsive Navigation"],
  },

  // ─── Case Study 01 · Claude MCP Connector Components ────────────────────
  {
    type:   "divider",
    num:    "01",
    title:  "Claude MCP UI",
    company:"BambooHR × Claude",
    role:   "Design Systems · Theming & Accessibility",
  },
  {
    type:     "statement",
    label:    "Context",
    headline: "A component set for the Claude MCP connector.",
    body:     "The connector embeds BambooHR inside the Claude API. Developer-facing, built for a customer-themeable surface, at a time when nothing in the library or the product had dark mode yet.",
    size:     "md",
  },
  {
    type:  "list",
    label: "Scope",
    headline: "Five API experiences, shipped first.",
    items: [
      "Request time off",
      "Approve time off",
      "View time off balance",
      "View team members",
      "View employee profile",
    ],
    note: "The set the team focused on first. These are the highest-traffic actions people reach for inside a conversation.",
  },
  {
    type:     "responsive-pair",
    label:    "One of the Five: View Employee Profile",
    desktop:  [{ src: "/employee_desktop.png", alt: "Employee profile card inline in a Claude conversation, desktop" }],
    mobile:   [{ src: "/employee_mobile.png",  alt: "Employee profile card inline in a Claude conversation, mobile" }],
    imageMaxHeight: "clamp(480px, 82vh, 900px)",
    columnRatio: "minmax(0, 2.7fr) minmax(0, 0.95fr)",
    showDeviceLabels: false,
  },
  {
    type:  "image",
    label: "View Employee Profile, Expanded",
    src:   "/employee_fullscreen_desktop.png",
    alt:   "Employee profile expanded to full screen",
    maxHeight: "calc(100vh - 210px)",
    framed: false,
  },
  {
    type:     "statement",
    label:    "Key Decision",
    headline: "Premade experiences, not UI generated on the fly.",
    body:     "The connector could have generated a bespoke interface for every question. We shipped a fixed set of experiences instead.",
    size:     "md",
    points: [
      { label: "Token cost",  detail: "Customers pay for their own tokens. Regenerating a full experience each turn is slow and expensive for them." },
      { label: "Consistency", detail: "A fixed set stays predictable and on-brand. Every user sees the same considered experience." },
      { label: "Simpler build", detail: "Far less to develop and maintain than generating and validating UI at runtime." },
    ],
  },
  {
    type:     "statement",
    label:    "Theming",
    headline: "Theming inside Claude's system, with a dark mode we didn't have.",
    body:     "The components themed on Claude's own style variables. Our brand came through in the accents only.",
    body2:    "Dark mode was required too, even though nothing in our product or design system had one to build from.",
    size:     "md",
  },
  {
    type:     "diagram",
    label:    "How It Holds",
    headline: "Customers pick the color. The system pins roles to fixed steps.",
    diagram:  "theme-contrast",
    image: {
      src: "/themepicker.png",
      alt: "Theme picker with hue slider and shade preview swatches",
      placeholderNote: "theme picker UI: hue slider and shade previews",
    },
  },
  {
    type:     "responsive-pair",
    label:    "Technical Ownership",
    headline: "Themed, dark, and responsive. The same component on every surface.",
    columnGap: "24px",
    desktop:  [
      { src: "/light_desktop.png",  alt: "MCP component, light mode, desktop width" },
      { src: "/orange_desktop.png", alt: "MCP component, dark mode, desktop width" },
    ],
    mobile:   [
      { src: "/light_mobile.png",  alt: "MCP component, light mode, mobile width" },
      { src: "/orange_mobile.png", alt: "MCP component, dark mode, mobile width" },
    ],
  },
  {
    type:     "statement",
    label:    "Challenges",
    headline: "Designing against moving guidelines, and for experiences that don't exist yet.",
    size:     "sm",
    points: [
      { label: "Many rulebooks",  detail: "Built to Claude's guidelines, but broad enough to hold under Slack's and OpenAI's too. One system, every host." },
      { label: "Ambiguous rules", detail: "The guidelines were open to interpretation. We had to judge how strictly to follow before approval: too cautious risked the deadline, too loose risked rework." },
      { label: "Future-proofing", detail: "Architecting components to extend across many API endpoints, and eventually to combine them dynamically for richer experiences." },
    ],
  },
  {
    type:  "questions",
    label: "Claude MCP UI",
  },

  // ─── Case Study 02 · Responsive Navigation ──────────────────────────────
  {
    type:   "divider",
    num:    "02",
    title:  "Responsive Navigation",
    company:"BambooHR",
    role:   "Fabric Design System",
  },
  {
    type:  "stats",
    label: "The Constraint",
    stats: [
      { value: "95%",    label: "of the product had no responsive behavior" },
      { value: "19%",    label: "of users (528K people) were on mobile over 90 days" },
      { value: "2300px", label: "minimum width required just to dock a dialog" },
    ],
    note: "And staying desktop-first was getting more expensive every quarter.",
  },
  {
    type:     "statement",
    label:    "Business Impact",
    headline: "Four strategic priorities, all blocked on responsiveness.",
    size:     "sm",
    pointsLayout: "grid",
    points: [
      { label: "VPAT & revenue",     detail: "Accessibility posture and VPAT readiness directly drive enterprise and regulated-industry deals." },
      { label: "Competitive parity", detail: "Rippling and HiBob already ship it. Its absence reads as technical lag." },
      { label: "AI-ready surfaces",  detail: "Surfaces like Ask BambooHR can adapt to context and screen instead of feeling bolted on." },
      { label: "Mobile scale",       detail: "Responsive-by-default lets Native Mobile embed complex web features, closing a 40:1 engineering gap." },
    ],
  },
  {
    type:  "two-image",
    label: "The Problem",
    headline: "Stacked nav levels compete for the same horizontal space.",
    images: [
      { src: "/presentation_nav1.png", alt: "Multiple nav layers stacked", caption: "Three nav layers compete for space. Users lose track of where they are." },
      { src: "/presentation_nav2.png", alt: "Header stacks break on mobile", caption: "Repeated headers pack context into tighter frames. Mobile breaks entirely." },
    ],
  },
  {
    type:  "image",
    label: "Research",
    headline: "Two rounds of customer interviews.",
    src:   "/testing_navigation.png",
    alt:   "Usability testing sessions for responsive navigation",
    caption: "12 moderated sessions on wireframes for directional signal, then 15 unmoderated sessions on a working prototype, focused on how people moved between breakpoints.",
  },
  {
    type:     "statement",
    label:    "Key Decision",
    headline: "Embed responsiveness into Fabric.",
    body:     "Remove stacked navigation levels entirely. Nest them inside the left nav, with fly-out menus when it collapses. One pattern that holds on mobile, on desktop with split panes, and when the Ask BambooHR AI panel takes the screen.",
    size:     "md",
  },
  {
    type:  "live-nav",
    label: "Live Prototype",
    headline: "One pattern, every breakpoint.",
    caption: "Drag the right edge to resize. The nav restructures itself at the tablet and mobile breakpoints.",
  },
  {
    type:     "timeline",
    label:    "Technical Ownership",
    headline: "A phased rollout, built around a real architectural constraint.",
    body:     "Nav components live in a separate repo, and each link is an API call into another repo's pages. Nesting every layer would mean an API call per level, and worse performance right where it matters most.",
  },
  {
    type:     "statement",
    label:    "Challenges",
    headline: "Going responsive broke things before it fixed them.",
    body:     "Early phases regressed real workflows. We rolled back, adjusted, and pushed the timeline before Early Access rather than ship something broken.",
    size:     "md",
    example: {
      label: "Example: Modals",
      text:  "We swapped the modal's fixed size prop, which supported three non-responsive sizes, for fit-to-content. Teams that relied on it to dictate layout lost their guardrails, and their modals broke. We restored the prop on desktop, kept it responsive on mobile, and left a more durable fix for later.",
    },
  },
  {
    type:  "questions",
    label: "Responsive Navigation",
  },

  // ─── Close ───────────────────────────────────────────────────────────────
  { type: "close", name: "Jo Ann Saab" },
];
