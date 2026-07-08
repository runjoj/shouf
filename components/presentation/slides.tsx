"use client";

// ─── Slide renderers ─────────────────────────────────────────────────────────
// One component per slide type. Presentation chrome (transitions, keyboard
// nav, progress) lives in app/present/page.tsx — these are pure content.

import { RcGlobalNavCanvas } from "@/components/canvas/RcGlobalNavCanvas";
import { ImageSlot } from "./ImageSlot";
import { SlideBody, SlideFrame, SlideHeadline, SlideLabel } from "./primitives";
import { ACCENT, HAIRLINE, INK, INK_FAINT, INK_SOFT, MONO, PAPER, PAPER_DIM, SANS } from "./tokens";
import { ThemeContrastDiagram } from "./diagrams/ThemeContrastDiagram";
import { RolloutTimeline } from "./diagrams/RolloutTimeline";
import type { Slide } from "./types";

export function TitleSlide({ slide }: { slide: Extract<Slide, { type: "title" }> }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center" as const, padding: "80px" }}>
      <div style={{ fontFamily: MONO, fontSize: "16px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: "36px" }}>
        {slide.kicker}
      </div>
      <h1 style={{ fontFamily: SANS, fontSize: "clamp(48px, 6vw, 76px)", fontWeight: 560, color: INK, letterSpacing: "-0.03em", lineHeight: 1.1, margin: 0, marginBottom: "28px", maxWidth: "1040px", textWrap: "balance" as const }}>
        {slide.title}
      </h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontFamily: "var(--font-inter), sans-serif", fontSize: "20px", color: INK_SOFT, maxWidth: "620px", lineHeight: 1.5 }}>
        {(Array.isArray(slide.sub) ? slide.sub : [slide.sub]).map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
    </div>
  );
}

export function DividerSlide({ slide }: { slide: Extract<Slide, { type: "divider" }> }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", padding: "88px 128px", position: "relative" as const }}>
      <div style={{ position: "absolute", top: "50%", right: "108px", transform: "translateY(-50%)", fontFamily: MONO, fontSize: "clamp(160px, 22vw, 260px)", fontWeight: 700, color: PAPER_DIM, lineHeight: 1, letterSpacing: "-0.04em", userSelect: "none" as const, pointerEvents: "none" as const }}>
        {slide.num}
      </div>
      <div style={{ position: "relative" as const, zIndex: 1 }}>
        <div style={{ fontFamily: MONO, fontSize: "16px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: "28px" }}>
          {slide.company} &middot; {slide.role}
        </div>
        <h1 style={{ fontFamily: SANS, fontSize: "clamp(44px, 6vw, 68px)", fontWeight: 560, color: INK, margin: 0, lineHeight: 1.08, letterSpacing: "-0.03em", maxWidth: "980px", textWrap: "balance" as const }}>
          {slide.title}
        </h1>
      </div>
    </div>
  );
}

export function StatementSlide({ slide }: { slide: Extract<Slide, { type: "statement" }> }) {
  return (
    <SlideFrame>
      <SlideLabel>{slide.label}</SlideLabel>
      <SlideHeadline size={slide.size ?? (slide.body ? "md" : "lg")}>{slide.headline}</SlideHeadline>
      {slide.body && <SlideBody>{slide.body}</SlideBody>}
      {slide.body2 && <SlideBody>{slide.body2}</SlideBody>}
      {slide.points && slide.pointsLayout === "grid" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: "72px", rowGap: "38px", marginTop: "44px", maxWidth: "1060px" }}>
          {slide.points.map((p, i) => (
            <div key={i}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "10px" }}>
                {slide.numberedPoints !== false && <span style={{ fontFamily: MONO, fontSize: "15px", fontWeight: 600, color: ACCENT }}>{String(i + 1).padStart(2, "0")}</span>}
                <span style={{ fontFamily: SANS, fontSize: "22px", fontWeight: 600, color: INK, letterSpacing: "-0.01em" }}>{p.label}</span>
              </div>
              <div style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "17px", color: INK_SOFT, lineHeight: 1.6, maxWidth: "440px" }}>
                {p.detail}
              </div>
            </div>
          ))}
        </div>
      )}
      {slide.points && slide.pointsLayout !== "grid" && (
        <div style={{ display: "flex", gap: "clamp(40px, 5vw, 72px)", flexWrap: "wrap" as const, marginTop: "44px" }}>
          {slide.points.map((p, i) => (
            <div key={i} style={{ flex: "1 1 280px", maxWidth: "360px" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "10px" }}>
                <span style={{ fontFamily: MONO, fontSize: "15px", fontWeight: 600, color: ACCENT }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ fontFamily: SANS, fontSize: "22px", fontWeight: 600, color: INK, letterSpacing: "-0.01em" }}>{p.label}</span>
              </div>
              <div style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "17px", color: INK_SOFT, lineHeight: 1.6 }}>
                {p.detail}
              </div>
            </div>
          ))}
        </div>
      )}
      {slide.example && (
        <div style={{ marginTop: "36px", maxWidth: "760px", borderLeft: `2px solid ${ACCENT}`, paddingLeft: "22px" }}>
          <div style={{ fontFamily: MONO, fontSize: "13px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: "10px" }}>
            {slide.example.label ?? "Example"}
          </div>
          <div style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "17px", color: INK_SOFT, lineHeight: 1.6 }}>
            {slide.example.text}
          </div>
        </div>
      )}
    </SlideFrame>
  );
}

export function ImageSlide({ slide }: { slide: Extract<Slide, { type: "image" }> }) {
  const left = slide.align === "left";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: left ? "flex-start" : "center", justifyContent: "center", height: "100%", padding: "56px 96px", gap: slide.headline ? "22px" : "14px", boxSizing: "border-box" as const }}>
      {/* With no headline, cancel SlideLabel's 28px bottom margin so the eyebrow
          sits close to the image and the label+image group centers as one. */}
      <div style={{ width: "100%", maxWidth: "1200px", marginBottom: slide.headline ? 0 : "-28px" }}>
        <SlideLabel>{slide.label}</SlideLabel>
        {slide.headline && <div style={{ marginTop: "-16px" }}><SlideHeadline size="sm">{slide.headline}</SlideHeadline></div>}
      </div>
      <ImageSlot src={slide.src} alt={slide.alt} placeholderNote={slide.placeholderNote} framed={slide.framed ?? true} {...(slide.maxHeight ? { maxHeight: slide.maxHeight } : {})} />
      {slide.caption && (
        <div style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "16px", color: INK_SOFT, textAlign: left ? "left" : "center", maxWidth: "760px", lineHeight: 1.6, width: "100%", alignSelf: left ? "stretch" : "auto" }}>
          {slide.caption}
        </div>
      )}
    </div>
  );
}

export function TwoImageSlide({ slide }: { slide: Extract<Slide, { type: "two-image" }> }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", padding: "72px 96px", gap: "28px", boxSizing: "border-box" as const }}>
      <div>
        <SlideLabel>{slide.label}</SlideLabel>
        {slide.headline && <div style={{ marginTop: "-16px" }}><SlideHeadline size="sm">{slide.headline}</SlideHeadline></div>}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
        {slide.images.map((img, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <ImageSlot src={img.src} alt={img.alt} maxHeight="420px" />
            <div style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "15px", color: INK_SOFT, lineHeight: 1.55 }}>
              {img.caption}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatsSlide({ slide }: { slide: Extract<Slide, { type: "stats" }> }) {
  return (
    <SlideFrame>
      <SlideLabel>{slide.label}</SlideLabel>
      {slide.headline && <SlideHeadline size="md">{slide.headline}</SlideHeadline>}
      <div style={{ display: "flex", gap: "64px", flexWrap: "wrap" as const, marginBottom: slide.note ? "44px" : 0 }}>
        {slide.stats.map((stat, i) => (
          <div key={i}>
            <div style={{ fontFamily: SANS, fontSize: "clamp(44px, 5.5vw, 64px)", fontWeight: 560, color: INK, lineHeight: 1, letterSpacing: "-0.03em", marginBottom: "14px" }}>
              {stat.value}
            </div>
            <div style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "16px", color: INK_SOFT, lineHeight: 1.5, maxWidth: "220px" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
      {slide.note && (
        <div style={{ fontFamily: MONO, fontSize: "16px", color: INK, borderLeft: `2px solid ${ACCENT}`, paddingLeft: "20px", lineHeight: 1.55, maxWidth: "680px" }}>
          {slide.note}
        </div>
      )}
    </SlideFrame>
  );
}

export function DiagramSlide({ slide }: { slide: Extract<Slide, { type: "diagram" }> }) {
  return (
    <SlideFrame>
      <SlideLabel>{slide.label}</SlideLabel>
      <SlideHeadline size="sm">{slide.headline}</SlideHeadline>
      {slide.body && <SlideBody>{slide.body}</SlideBody>}
      {/* Input (the picker) reads above the mechanism (the ramps): pick a
          color → roles resolve to fixed steps. Everything left-aligned; the
          picker renders bare. */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "28px", marginTop: "24px" }}>
        {slide.image && (
          <ImageSlot src={slide.image.src} alt={slide.image.alt} placeholderNote={slide.image.placeholderNote} maxHeight="170px" framed={false} />
        )}
        {slide.diagram === "theme-contrast" && <ThemeContrastDiagram />}
      </div>
    </SlideFrame>
  );
}

export function ResponsivePairSlide({ slide }: { slide: Extract<Slide, { type: "responsive-pair" }> }) {
  const showLabels = slide.showDeviceLabels ?? true;
  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", padding: "44px 88px", gap: slide.headline ? "24px" : "14px", boxSizing: "border-box" as const }}>
      {/* When there's no headline, cancel SlideLabel's built-in 28px bottom
          margin so the eyebrow sits snug above the images. */}
      <div style={{ marginBottom: slide.headline ? 0 : "-28px" }}>
        <SlideLabel>{slide.label}</SlideLabel>
        {slide.headline && <div style={{ marginTop: "-16px" }}><SlideHeadline size="sm">{slide.headline}</SlideHeadline></div>}
      </div>
      {/* Device-scaled pairing: desktop wide, mobile narrow, aligned at the top.
          With a columnRatio the columns are fr-sized (desktop can be pushed
          larger); without one, columns hug their images so the space between
          desktop and mobile is exactly columnGap — no dead fr whitespace. */}
      {(() => {
        const columns = ([["Desktop", slide.desktop], ["Mobile", slide.mobile]] as const).map(([label, imgs]) => (
          <div key={label} style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: slide.columnRatio && label === "Desktop" ? "stretch" : "center" }}>
            {showLabels && (
              <div style={{ width: "100%", textAlign: "center" as const, fontFamily: MONO, fontSize: "13px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: INK_FAINT }}>
                {label}
              </div>
            )}
            {imgs.map((img, i) => (
              <ImageSlot key={i} src={img.src} alt={img.alt} placeholderNote={img.placeholderNote} maxHeight={slide.imageMaxHeight ?? "230px"} framed={img.framed ?? false} />
            ))}
          </div>
        ));
        return slide.columnRatio ? (
          <div style={{ display: "grid", gridTemplateColumns: slide.columnRatio, gap: slide.columnGap ?? "48px", alignItems: "start" }}>
            {columns}
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "center", gap: slide.columnGap ?? "48px", alignItems: "flex-start" }}>
            {columns}
          </div>
        );
      })()}
      {slide.caption && (
        <div style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "16px", color: INK_SOFT, maxWidth: "820px", lineHeight: 1.6 }}>
          {slide.caption}
        </div>
      )}
    </div>
  );
}

export function ListSlide({ slide }: { slide: Extract<Slide, { type: "list" }> }) {
  return (
    <SlideFrame>
      <SlideLabel>{slide.label}</SlideLabel>
      {slide.headline && <SlideHeadline size="md">{slide.headline}</SlideHeadline>}
      {/* Numbered editorial list — accent index, hairline rules between rows.
          Reads as a considered enumeration, not a bulleted dump. */}
      <div style={{ marginTop: "12px", maxWidth: "820px", borderTop: `1px solid ${HAIRLINE}` }}>
        {slide.items.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "baseline", gap: "28px", padding: "18px 0", borderBottom: `1px solid ${HAIRLINE}` }}>
            <span style={{ fontFamily: MONO, fontSize: "15px", fontWeight: 600, color: ACCENT, letterSpacing: "0.06em", minWidth: "32px" }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span style={{ fontFamily: SANS, fontSize: "24px", fontWeight: 500, color: INK, letterSpacing: "-0.01em" }}>
              {item}
            </span>
          </div>
        ))}
      </div>
      {slide.note && (
        <div style={{ fontFamily: MONO, fontSize: "15px", color: INK_SOFT, marginTop: "24px", lineHeight: 1.55, maxWidth: "680px" }}>
          {slide.note}
        </div>
      )}
    </SlideFrame>
  );
}

export function TimelineSlide({ slide }: { slide: Extract<Slide, { type: "timeline" }> }) {
  return (
    <SlideFrame>
      <SlideLabel>{slide.label}</SlideLabel>
      <SlideHeadline size="md">{slide.headline}</SlideHeadline>
      {slide.body && <SlideBody>{slide.body}</SlideBody>}
      <div style={{ marginTop: "32px" }}>
        <RolloutTimeline />
      </div>
    </SlideFrame>
  );
}

export function LiveNavSlide({ slide }: { slide: Extract<Slide, { type: "live-nav" }> }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: "28px 72px 36px", gap: "14px", boxSizing: "border-box" as const }}>
      <div style={{ width: "100%", maxWidth: "1280px", flexShrink: 0 }}>
        <SlideLabel>{slide.label}</SlideLabel>
        {slide.headline && <div style={{ marginTop: "-16px" }}><SlideHeadline size="sm">{slide.headline}</SlideHeadline></div>}
      </div>
      {/*
        Live, interactive prototype — not a screenshot. Same component used on
        the portfolio case study. Its instructional caption is suppressed and
        the surround matches the deck's paper ground (no gray box); the white
        browser frame separates via its own border and shadow.
      */}
      <div style={{ width: "100%", maxWidth: "1280px", flex: 1, minHeight: 0, borderRadius: "8px", overflow: "hidden", background: PAPER }}>
        <RcGlobalNavCanvas hideCaption surface={PAPER} />
      </div>
      {slide.caption && (
        <div style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "15px", color: INK_SOFT, textAlign: "center" as const, maxWidth: "760px", lineHeight: 1.55, flexShrink: 0 }}>
          {slide.caption}
        </div>
      )}
    </div>
  );
}

export function QuoteSlide({ slide }: { slide: Extract<Slide, { type: "quote" }> }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: "80px 160px", textAlign: "center" as const }}>
      <p style={{ fontFamily: SANS, fontSize: "clamp(28px, 3.2vw, 42px)", fontWeight: 500, color: INK, lineHeight: 1.4, letterSpacing: "-0.015em", maxWidth: "840px", margin: 0 }}>
        {slide.quote}
      </p>
      {slide.attribution && (
        <div style={{ fontFamily: MONO, fontSize: "15px", color: INK_FAINT, marginTop: "28px", letterSpacing: "0.04em" }}>
          {slide.attribution}
        </div>
      )}
    </div>
  );
}

export function QuestionsSlide({ slide }: { slide: Extract<Slide, { type: "questions" }> }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center" as const }}>
      {slide.label && (
        <div style={{ fontFamily: MONO, fontSize: "16px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: "32px" }}>
          {slide.label}
        </div>
      )}
      <h2 style={{ fontFamily: SANS, fontSize: "clamp(48px, 7vw, 76px)", fontWeight: 560, color: INK, margin: 0, letterSpacing: "-0.03em", lineHeight: 1 }}>
        Questions?
      </h2>
    </div>
  );
}

export function CloseSlide({ slide }: { slide: Extract<Slide, { type: "close" }> }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center" as const }}>
      <div style={{ fontFamily: MONO, fontSize: "16px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: "32px" }}>
        {slide.name}
      </div>
      <h2 style={{ fontFamily: SANS, fontSize: "clamp(48px, 7vw, 76px)", fontWeight: 560, color: INK, margin: 0, letterSpacing: "-0.03em", lineHeight: 1 }}>
        Thank you.
      </h2>
    </div>
  );
}

export function renderSlide(s: Slide) {
  switch (s.type) {
    case "title":     return <TitleSlide     slide={s} />;
    case "divider":   return <DividerSlide   slide={s} />;
    case "statement": return <StatementSlide slide={s} />;
    case "image":     return <ImageSlide     slide={s} />;
    case "two-image": return <TwoImageSlide  slide={s} />;
    case "stats":     return <StatsSlide     slide={s} />;
    case "diagram":   return <DiagramSlide   slide={s} />;
    case "responsive-pair": return <ResponsivePairSlide slide={s} />;
    case "list":      return <ListSlide      slide={s} />;
    case "timeline":  return <TimelineSlide  slide={s} />;
    case "live-nav":  return <LiveNavSlide   slide={s} />;
    case "quote":     return <QuoteSlide     slide={s} />;
    case "questions": return <QuestionsSlide slide={s} />;
    case "close":     return <CloseSlide     slide={s} />;
  }
}
