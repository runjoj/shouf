"use client";

// ─── WorkIndexCanvas ────────────────────────────────────────────────────────
// Visual work index — large image-forward cards for each project in the Work
// section. Loads when "Work" is clicked in the left nav.
//
// Card interaction: hover lifts with accent border, click navigates to the
// project page. Framer Motion handles entrance stagger and hover spring.

import { useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useAppStore } from "@/lib/store";

// ─── Project data ────────────────────────────────────────────────────────────

type WorkProject = {
  id: string;
  tag: string;
  title: string;
  description: string;
  company: string;
  extraTag?: string;
  disabled?: boolean;
  thumbnail?: string;
  thumbnailZoom?: number; // scale factor to crop outer padding/chrome from screenshots
};

const PROJECTS: WorkProject[] = [
  {
    id: "product-sandbox",
    tag: "Coming Soon",
    title: "Product Sandbox",
    description: "",
    company: "",
    disabled: true,
  },
  {
    id: "project-artemis",
    tag: "Product Design · Design System",
    title: "Project Artemis",
    description:
      "A 90-day initiative to accelerate the hypothesis-to-impact loop through AI-orchestrated workflows — shipping production-ready features at high velocity without compromising design craft.",
    company: "BambooHR",
    thumbnail: "/artemis_tile_2.png",
  },
  {
    id: "rc-case-study",
    tag: "Product Design · Design System",
    title: "Responsive Navigation",
    description:
      "A strategic shift toward a responsive, mobile-aware platform at BambooHR — from desktop-only to fully adaptive.",
    company: "BambooHR",
    thumbnail: "/responsive_component.png",
    thumbnailZoom: 1.02,
  },
  {
    id: "onboarding-flow",
    tag: "Product Design",
    title: "Onboarding Flow",
    description:
      "A streamlined first-run experience that took users from sign-up to a successful test run in 15 minutes — lifting completion from 12% to 78%.",
    company: "Qualiti",
    thumbnail: "/overview_flow.png",
  },
  {
    id: "eu-embedded",
    tag: "Product Design · Frontend",
    title: "Seamless Test Creation",
    description:
      "An in-platform embedded experience built entirely with Eucalyptus components — design system in production.",
    company: "Qualiti",
    extraTag: "built with Eucalyptus",
    thumbnail: "/preview.png",
  },
  {
    id: "ql-user-profiles",
    tag: "Product Design",
    title: "User Profiles",
    description: "",
    company: "Qualiti",
    thumbnail: "/all_users.jpg",
  },
  {
    id: "ql-redesign",
    tag: "Product Design",
    title: "Qualiti Portal Redesign",
    description:
      "A full redesign of an AI-powered test management portal — from internal prototype to a user-centered product.",
    company: "Qualiti",
    thumbnail: "/dashboard.png",
  },
  {
    id: "especialty",
    tag: "Product Design · Frontend · Code",
    title: "eSpecialty Insurance",
    description:
      "A full redesign and rebuild of an insurance quoting platform — from MVP to a polished, scalable product with guided navigation and dynamic form architecture.",
    company: "eSpecialty",
    thumbnail: "/especialty_new_3.png",
  },
];



// ─── Card ────────────────────────────────────────────────────────────────────

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.45, ease: [0.25, 0, 0, 1] as [number, number, number, number] },
  }),
};

function WorkCard({
  project,
  index,
  onSelect,
}: {
  project: WorkProject;
  index: number;
  onSelect: (id: string) => void;
}) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.button
      custom={index}
      variants={prefersReduced ? undefined : cardVariants}
      initial={prefersReduced ? false : "hidden"}
      animate="visible"
      whileHover={project.disabled ? undefined : { y: -4, transition: { duration: 0.2 } }}
      onClick={() => !project.disabled && onSelect(project.id)}
      style={{
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
        border: "1px solid var(--shouf-border)",
        borderRadius: "12px",
        background: "var(--shouf-panel)",
        overflow: "hidden",
        cursor: project.disabled ? "default" : "pointer",
        opacity: project.disabled ? 0.45 : 1,
        width: "100%",
        outline: "none",
        padding: 0,
      }}
      onFocus={(e) => {
        if (!project.disabled)
          e.currentTarget.style.borderColor = "var(--shouf-accent)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "var(--shouf-border)";
      }}
      onMouseEnter={(e) => {
        if (!project.disabled) {
          e.currentTarget.style.borderColor = "var(--shouf-accent)";
          e.currentTarget.style.boxShadow =
            "0 8px 24px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--shouf-border)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          width: "100%",
          aspectRatio: "16 / 11.7",
          background: "var(--shouf-hover)",
          flexShrink: 0,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {project.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.thumbnail}
            alt={`${project.title} preview`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "left top",
              display: "block",
              ...(project.thumbnailZoom
                ? { transform: `scale(${project.thumbnailZoom})`, transformOrigin: "center center" }
                : {}),
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: "13px",
                fontFamily: "var(--font-mono)",
                color: "var(--shouf-text-faint)",
                letterSpacing: "0.04em",
                userSelect: "none",
              }}
            >
              Coming soon
            </span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div
        style={{
          padding: "16px 20px 18px",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}
      >
        {/* Tag row */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <span
            style={{
              fontSize: "13px",
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--shouf-accent)",
            }}
          >
            {project.tag}
          </span>
          {project.company && (
            <span
              style={{
                fontSize: "13px",
                fontFamily: "var(--font-mono)",
                color: "var(--shouf-text-faint)",
              }}
            >
              · {project.company}
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: "20px",
            fontWeight: 600,
            lineHeight: 1.3,
            color: "var(--shouf-text)",
            margin: 0,
          }}
        >
          {project.title}
        </h3>
      </div>
    </motion.button>
  );
}

// ─── WorkIndexCanvas ─────────────────────────────────────────────────────────

export function WorkIndexCanvas() {
  const { selectComponent, selectSection, setActiveMobilePanel } = useAppStore();

  const handleSelect = useCallback(
    (id: string) => {
      selectSection(null);
      selectComponent(id);
      setActiveMobilePanel("canvas");
    },
    [selectComponent, selectSection, setActiveMobilePanel],
  );

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "40px 48px 60px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      {/* Page header */}
      <div>
        <h1
          style={{
            fontSize: "58px",
            fontWeight: 700,
            color: "var(--shouf-text)",
            margin: 0,
            fontFamily: "var(--font-mono)",
          }}
        >
          Work
        </h1>
        {/* Expressive craft: gradient divider separates heading from content */}
        <div
          style={{
            height:     "1px",
            marginTop:  "20px",
            background: "linear-gradient(to right, transparent, var(--shouf-border-sub) 15%, var(--shouf-border-sub) 50%, transparent)",
          }}
        />
      </div>

      {/* Card grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "24px",
        }}
      >
        {PROJECTS.map((project, i) => (
          <WorkCard
            key={project.id}
            project={project}
            index={i}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </div>
  );
}
