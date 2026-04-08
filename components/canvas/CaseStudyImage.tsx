"use client";

// ─── CaseStudyImage ────────────────────────────────────────────────────────
// Clickable case study image that opens in a near-fullscreen lightbox overlay.
// Click the image or press Escape / click the backdrop to close.

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

// ─── Lightbox overlay ───────────────────────────────────────────────────────

function Lightbox({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position:        "fixed",
        inset:           0,
        zIndex:          9999,
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        display:         "flex",
        alignItems:      "center",
        justifyContent:  "center",
        padding:         "40px",
        cursor:          "zoom-out",
        animation:       "lightbox-fade-in 200ms ease both",
      }}
    >
      {/* Close button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        style={{
          position:        "absolute",
          top:             16,
          right:           16,
          width:           36,
          height:          36,
          borderRadius:    "50%",
          border:          "none",
          backgroundColor: "rgba(255, 255, 255, 0.12)",
          color:           "#fff",
          cursor:          "pointer",
          display:         "flex",
          alignItems:      "center",
          justifyContent:  "center",
          transition:      "background-color 150ms ease",
          zIndex:          1,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255, 255, 255, 0.25)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255, 255, 255, 0.12)";
        }}
        title="Close"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth:     "100%",
          maxHeight:    "100%",
          objectFit:    "contain",
          borderRadius: "8px",
          cursor:       "default",
          animation:    "lightbox-scale-in 200ms ease both",
        }}
      />

      {/* Keyframe animations injected once */}
      <style>{`
        @keyframes lightbox-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes lightbox-scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>,
    document.body,
  );
}

// ─── CaseStudyImage ─────────────────────────────────────────────────────────

export function CaseStudyImage({
  src,
  alt,
  style,
}: {
  src: string;
  alt: string;
  style?: React.CSSProperties;
}) {
  const [open, setOpen] = useState(false);

  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        onClick={() => setOpen(true)}
        style={{
          width:        "100%",
          display:      "block",
          borderRadius: "10px",
          border:       "1px solid var(--shouf-border)",
          cursor:       "zoom-in",
          ...style,
        }}
      />
      {open && <Lightbox src={src} alt={alt} onClose={handleClose} />}
    </>
  );
}
