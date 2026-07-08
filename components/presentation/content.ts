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
    body:     "The connector embeds BambooHR inside the Claude API, so employees can reach their HR data without leaving the conversation to log in.",
    size:     "md",
  },
  {
    type:     "statement",
    label:    "Business Impact",
    headline: "The AI surface is becoming a product, not a side integration.",
    size:     "sm",
    pointsLayout: "grid",
    points: [
      { label: "Build once, everywhere", detail: "One surface serves Claude, ChatGPT, and future clients like Slack or SMS with no per-client rework. The highest-leverage property of the whole investment." },
      { label: "The whole workforce",    detail: "Not just admins. Managers and employees reach leave, approvals, and onboarding at the moments that matter, inside the assistant they already use." },
      { label: "Branded, not a feed",    detail: "Showing up as interactive BambooHR, not plain text, is what wins head-to-head evaluations and stands out in connector directories." },
      { label: "The cost of absence",    detail: "If BambooHR is missing or generic in the AI surface, the relationship erodes and a competitor's experience fills the gap." },
    ],
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
    type:     "statement",
    label:    "Key Decision",
    headline: "Premade experiences, not UI generated on the fly.",
    body:     "The connector could have generated a bespoke interface for every question. We shipped a fixed set of experiences instead.",
    size:     "md",
    pointsLayout: "grid",
    points: [
      { label: "Guarded actions", detail: "Premade UI lets users take sensitive actions, like deleting a record, that many AI surfaces block agents from doing on their own." },
      { label: "Deterministic & on-brand", detail: "We keep full brand control and a consistent look. AI-generated widgets drift and render differently every conversation." },
      { label: "Token cost", detail: "Customers pay for their own tokens. Generating a full experience each turn is slower and more expensive for them." },
      { label: "Simpler and leaner", detail: "Far less to build and maintain than generating UI at runtime, and lightweight by choice rather than pulling in Fabric's ~2MB." },
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
    label:    "Custom Brand Colors",
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
    label:    "Theme Examples",
    headline: "Light and dark themes that work with custom branding.",
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
    label:    "Process",
    headline: "Using Figma vs Product Sandbox",
    size:     "md",
    pointsLayout: "grid",
    numberedPoints: false,
    points: [
      { label: "Sandbox", detail: "New features built with our design system, inside a mirrored product environment. Prototypes that feel like the product, testable with users, shareable with devs." },
      { label: "Figma",   detail: "Design system changes, and net-new work outside the system: new chart.js charting, the MCP connector." },
    ],
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
    label:    "Challenges",
    headline: "Designing against moving guidelines, and for experiences that don't exist yet.",
    size:     "sm",
    pointsLayout: "grid",
    points: [
      { label: "Many rulebooks",  detail: "Built to Claude's guidelines, but broad enough to hold under Slack's and OpenAI's too. One system, every host." },
      { label: "Ambiguous rules", detail: "The guidelines were open to interpretation. We had to judge how strictly to follow before approval: too cautious risked the deadline, too loose risked rework." },
      { label: "Built outside Fabric", detail: "Fabric has no dark mode, so adding it when using minimal components would be over-engineering. Decided to use custom components instead." },
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
    type:  "image",
    label: "The Problem",
    headline: "Stacked nav levels compete for the same horizontal space.",
    src:   "/nav_levels.png",
    alt:   "Multiple nav layers stacked",
    caption: "Three nav layers compete for space. Users lose track of where they are.",
    framed: false,
    maxHeight: "calc(100vh - 170px)",
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
    headline: "Nested navigation, not stacked.",
    body:     "Remove stacked navigation levels entirely. Nest them inside the left nav, with fly-out menus when it collapses. One pattern that holds on mobile, on desktop with split panes, and when the Ask BambooHR AI panel takes the screen.",
    size:     "md",
  },
  {
    type:  "live-nav",
    label: "Live Prototype",
  },
  {
    type:     "statement",
    label:    "Challenges",
    headline: "Architectural constraints resulted in poor UX.",
    body:     "Navigation components live in a separate repo, and each link is an API call into another repo's pages. Nesting every layer would mean an API call per level, and worse performance right where it matters most.",
    size:     "md",
  },
  {
    type:     "timeline",
    label:    "Solution",
    headline: "Improved navigation in a phased rollout.",
    images: [
      { src: "/phased.png",   alt: "Phased navigation rollout, view one" },
      { src: "/phased_2.png", alt: "Phased navigation rollout, view two" },
    ],
  },
  {
    type:  "questions",
    label: "Responsive Navigation",
  },

  // ─── Close ───────────────────────────────────────────────────────────────
  { type: "close", name: "Jo Ann Saab" },
];
