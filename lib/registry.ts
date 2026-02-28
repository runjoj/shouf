"use client";

import type { ComponentControlValues, ComponentRegistration } from "./types";
import type { ReactNode } from "react";
import { PDS_BUTTON_REGISTRATION } from "@/components/portfolio-design-system/PdsButton/definition";
import { PdsButtonRenderer } from "@/components/portfolio-design-system/PdsButton/PdsButton";

// ─── Registry maps ─────────────────────────────────────────────────────────────
// Add each new component here. The renderer is kept separate from the
// ComponentRegistration type so that type definitions stay React-free.

export const COMPONENT_REGISTRY: Record<string, ComponentRegistration> = {
  "pds-button": PDS_BUTTON_REGISTRATION,
};

export const COMPONENT_RENDERERS: Record<
  string,
  (values: ComponentControlValues) => ReactNode
> = {
  "pds-button": PdsButtonRenderer,
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

export function isRegistered(id: string): boolean {
  return id in COMPONENT_REGISTRY;
}

export function getRegistration(id: string): ComponentRegistration | undefined {
  return COMPONENT_REGISTRY[id];
}
