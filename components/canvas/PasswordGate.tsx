"use client";

// ─── PasswordGate ────────────────────────────────────────────────────────────
// Wraps protected content behind a password prompt.
// Unlock state is stored in sessionStorage so re-entry is only needed once
// per browser session per page.

import { useState, useEffect, useRef } from "react";
import { MONO } from "./CaseStudyShared";

const CORRECT = "mushu";

export function PasswordGate({
  pageId,
  children,
}: {
  pageId: string;
  children: React.ReactNode;
}) {
  const storageKey = `unlocked:${pageId}`;
  const [unlocked, setUnlocked] = useState(false);
  const [value,    setValue]    = useState("");
  const [error,    setError]    = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check sessionStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem(storageKey) === "1") {
      setUnlocked(true);
    }
  }, [storageKey]);

  // Focus the input when the gate is shown
  useEffect(() => {
    if (!unlocked) inputRef.current?.focus();
  }, [unlocked]);

  const attempt = () => {
    if (value === CORRECT) {
      sessionStorage.setItem(storageKey, "1");
      setUnlocked(true);
    } else {
      setError(true);
      setValue("");
      setTimeout(() => setError(false), 1200);
    }
  };

  if (unlocked) return <>{children}</>;

  return (
    <div
      style={{
        flex:           1,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        flexDirection:  "column",
        gap:            "24px",
        height:         "100%",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily:    MONO,
            fontSize:      "11px",
            fontWeight:    700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color:         "var(--shouf-text-faint)",
            marginBottom:  "10px",
          }}
        >
          Protected
        </div>
        <p
          style={{
            fontSize:   "15px",
            color:      "var(--shouf-text-muted)",
            lineHeight: 1.6,
          }}
        >
          Enter the password to view this page.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
        <input
          ref={inputRef}
          type="password"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(false); }}
          onKeyDown={(e) => { if (e.key === "Enter") attempt(); }}
          placeholder="Password"
          style={{
            fontFamily:    MONO,
            fontSize:      "14px",
            width:         "220px",
            padding:       "10px 14px",
            borderRadius:  "8px",
            border:        `1.5px solid ${error ? "var(--shouf-accent-rose)" : "var(--shouf-border)"}`,
            background:    "var(--shouf-panel)",
            color:         "var(--shouf-text)",
            outline:       "none",
            transition:    "border-color 150ms ease",
            letterSpacing: "0.08em",
          }}
          onFocus={(e) => {
            if (!error) (e.currentTarget as HTMLElement).style.borderColor = "var(--shouf-accent)";
          }}
          onBlur={(e) => {
            if (!error) (e.currentTarget as HTMLElement).style.borderColor = "var(--shouf-border)";
          }}
        />
        {error && (
          <span
            style={{
              fontFamily: MONO,
              fontSize:   "11px",
              color:      "var(--shouf-accent-rose)",
              letterSpacing: "0.04em",
            }}
          >
            Incorrect password
          </span>
        )}
        <button
          onClick={attempt}
          style={{
            fontFamily:    MONO,
            fontSize:      "12px",
            fontWeight:    600,
            letterSpacing: "0.06em",
            padding:       "9px 24px",
            borderRadius:  "8px",
            border:        "none",
            background:    "var(--shouf-accent)",
            color:         "var(--shouf-accent-text)",
            cursor:        "pointer",
            transition:    "opacity 150ms ease",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.85"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
        >
          Unlock
        </button>
      </div>
    </div>
  );
}
