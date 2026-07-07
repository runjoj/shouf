"use client";

// ─── ImageSlot ───────────────────────────────────────────────────────────────
// A named image slot that degrades gracefully. If the file at `src` hasn't
// been dropped into /public yet, it renders a labeled placeholder frame
// instead of a broken-image icon. Once a real file lands at that exact path,
// this component picks it up automatically — no markup changes required.

import { useState } from "react";
import { HAIRLINE, INK_FAINT, MONO, PAPER_DIM } from "./tokens";

export function ImageSlot({
  src,
  alt,
  placeholderNote,
  maxHeight = "calc(100vh - 340px)",
  framed = true,
}: {
  src: string;
  alt: string;
  placeholderNote?: string;
  maxHeight?: string;
  // Images with their own chrome (e.g. dark component cards) look better bare —
  // the paper frame border + tint fights their built-in corners and background.
  framed?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        style={{
          width:        "100%",
          maxWidth:     "980px",
          height:       maxHeight,
          border:       `1.5px dashed ${HAIRLINE}`,
          borderRadius: "6px",
          background:   PAPER_DIM,
          display:      "flex",
          flexDirection:"column",
          alignItems:   "center",
          justifyContent:"center",
          gap:          "10px",
          boxSizing:    "border-box" as const,
        }}
      >
        <div
          style={{
            fontFamily:    MONO,
            fontSize:      "12px",
            fontWeight:    600,
            letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
            color:         INK_FAINT,
          }}
        >
          Image pending
        </div>
        {placeholderNote && (
          <div style={{ fontFamily: MONO, fontSize: "14px", color: INK_FAINT, textAlign: "center" as const, maxWidth: "440px" }}>
            {placeholderNote}
          </div>
        )}
        <div
          style={{
            fontFamily:   MONO,
            fontSize:     "12px",
            color:        INK_FAINT,
            padding:      "4px 10px",
            border:       `1px solid ${HAIRLINE}`,
            borderRadius: "4px",
            marginTop:    "4px",
          }}
        >
          {src}
        </div>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      style={{
        maxWidth:     "100%",
        maxHeight,
        objectFit:    "contain" as const,
        borderRadius: framed ? "6px" : 0,
        border:       framed ? `1px solid ${HAIRLINE}` : "none",
        background:   framed ? PAPER_DIM : "transparent",
        display:      "block",
      }}
    />
  );
}
