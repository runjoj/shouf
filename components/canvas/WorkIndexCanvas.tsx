"use client";

// ─── WorkIndexCanvas ────────────────────────────────────────────────────────
// Visual work index — large image-forward cards for each project in the Work
// section. Loads when "Work" is clicked in the left nav.
//
// Card interaction: hover lifts with accent border, click navigates to the
// project page. Framer Motion handles entrance stagger and hover spring.

import { useCallback, useRef, useState, useEffect, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { RcGlobalNavCanvas } from "./RcGlobalNavCanvas";

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
  livePreview?: ReactNode;
};

const PROJECTS: WorkProject[] = [
  {
    id: "rc-case-study",
    tag: "UX · Frontend",
    title: "Responsive Site Development",
    description:
      "A strategic shift toward a responsive, mobile-aware platform at BambooHR — from desktop-only to fully adaptive.",
    company: "BambooHR",
    livePreview: <RcGlobalNavCanvas />,
  },
  {
    id: "eu-embedded",
    tag: "UX · Design System",
    title: "Seamless Test Creation",
    description:
      "An in-platform embedded experience built entirely with Eucalyptus components — design system in production.",
    company: "BambooHR",
    extraTag: "built with Eucalyptus",
    thumbnail: "/preview.png",
  },
  {
    id: "especialty",
    tag: "UX · Frontend · Code",
    title: "eSpecialty Insurance",
    description:
      "A full redesign and rebuild of an insurance quoting platform — from MVP to a polished, scalable product with guided navigation and dynamic form architecture.",
    company: "eSpecialty",
    thumbnail: "/especialty_new_3.png",
  },
];

// ─── LivePreviewThumb ────────────────────────────────────────────────────────
// Renders a live component scaled down to fit the card thumbnail area.
// Measures the container width and computes a scale factor so the 1200px
// virtual canvas fills the thumbnail exactly. Non-interactive (pointer-events: none).

const VIRTUAL_W = 1200;
const VIRTUAL_H = 750;

function LivePreviewThumb({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      if (w > 0) setScale(w / VIRTUAL_W);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {scale > 0 && (
        <div
          style={{
            width: `${VIRTUAL_W}px`,
            height: `${VIRTUAL_H}px`,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

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
          aspectRatio: "16 / 10",
          background: "var(--shouf-hover)",
          borderBottom: "1px solid var(--shouf-border)",
          flexShrink: 0,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {project.livePreview ? (
          <LivePreviewThumb>{project.livePreview}</LivePreviewThumb>
        ) : project.thumbnail ? (
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
          padding: "20px 22px 22px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          flex: 1,
        }}
      >
        {/* Tag row */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <span
            style={{
              fontSize: "11px",
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
                fontSize: "11px",
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
            fontSize: "18px",
            fontWeight: 600,
            lineHeight: 1.3,
            color: "var(--shouf-text)",
            margin: 0,
          }}
        >
          {project.title}
        </h3>

        {/* Description */}
        <p
          style={{
            fontSize: "14px",
            lineHeight: 1.6,
            color: "var(--shouf-text-muted)",
            margin: 0,
          }}
        >
          {project.description}
        </p>

        {/* Extra tag */}
        {project.extraTag && (
          <span
            style={{
              fontSize: "11px",
              fontStyle: "italic",
              color: "var(--shouf-text-faint)",
              marginTop: "2px",
            }}
          >
            {project.extraTag}
          </span>
        )}
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
        gap: "36px",
      }}
    >
      {/* Page header */}
      <div>
        <h1
          style={{
            fontSize: "clamp(2.2rem, 3vw, 3rem)",
            fontWeight: 700,
            color: "var(--shouf-text)",
            margin: 0,
            fontFamily: "var(--font-mono)",
          }}
        >
          Work
        </h1>
      </div>

      {/* Card grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
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
