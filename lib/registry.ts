"use client";

import type { ComponentControlValues, ComponentRegistration } from "./types";
import type { ReactNode } from "react";
import { PDS_BUTTON_REGISTRATION } from "@/components/portfolio-design-system/PdsButton/definition";
import { PdsButtonRenderer } from "@/components/portfolio-design-system/PdsButton/PdsButton";
import { EU_STATUSES_REGISTRATION } from "@/components/eucalyptus/EuStatuses/definition";
import { EuStatusesRenderer } from "@/components/eucalyptus/EuStatuses/EuStatuses";
import { EU_FOLDER_CONTAINER_REGISTRATION } from "@/components/eucalyptus/EuFolderContainer/definition";
import { EuFolderContainerRenderer } from "@/components/eucalyptus/EuFolderContainer/EuFolderContainer";
import { EU_RADIO_REGISTRATION } from "@/components/eucalyptus/EuRadio/definition";
import { EuRadioRenderer } from "@/components/eucalyptus/EuRadio/EuRadio";
import { EU_FILTERS_REGISTRATION } from "@/components/eucalyptus/EuFilters/definition";
import { EuFiltersRenderer } from "@/components/eucalyptus/EuFilters/EuFilters";
import { PDS_TYPOGRAPHY_REGISTRATION }    from "@/components/portfolio-design-system/PdsTypography/definition";
import { PDS_SPACING_REGISTRATION }       from "@/components/portfolio-design-system/PdsSpacing/definition";
import { PDS_COLOR_TOKENS_REGISTRATION }  from "@/components/portfolio-design-system/PdsColorTokens/definition";
import { PDS_INPUT_REGISTRATION }         from "@/components/portfolio-design-system/PdsInput/definition";
import { PdsInputRenderer }               from "@/components/portfolio-design-system/PdsInput/PdsInput";
import { WELCOME_REGISTRATION }           from "@/components/canvas/WelcomeDefinition";
import { RC_GLOBAL_NAV_REGISTRATION }    from "@/components/canvas/RcGlobalNavDefinition";

// ─── Registry maps ─────────────────────────────────────────────────────────────
// Add each new component here. The renderer is kept separate from the
// ComponentRegistration type so that type definitions stay React-free.

export const COMPONENT_REGISTRY: Record<string, ComponentRegistration> = {
  "welcome":              WELCOME_REGISTRATION,
  "pds-button":           PDS_BUTTON_REGISTRATION,
  "pds-input":            PDS_INPUT_REGISTRATION,
  "pds-color-tokens":     PDS_COLOR_TOKENS_REGISTRATION,
  "pds-typography":       PDS_TYPOGRAPHY_REGISTRATION,
  "pds-spacing":          PDS_SPACING_REGISTRATION,
  "eu-statuses":          EU_STATUSES_REGISTRATION,
  "eu-folder-container":  EU_FOLDER_CONTAINER_REGISTRATION,
  "eu-radio":             EU_RADIO_REGISTRATION,
  "eu-filters":           EU_FILTERS_REGISTRATION,
  "rc-global-nav":        RC_GLOBAL_NAV_REGISTRATION,
};

export const COMPONENT_RENDERERS: Record<
  string,
  (values: ComponentControlValues) => ReactNode
> = {
  "pds-button":           PdsButtonRenderer,
  "pds-input":            PdsInputRenderer,
  "eu-statuses":          EuStatusesRenderer,
  "eu-folder-container":  EuFolderContainerRenderer,
  "eu-radio":             EuRadioRenderer,
  "eu-filters":           EuFiltersRenderer,
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

export function isRegistered(id: string): boolean {
  return id in COMPONENT_REGISTRY;
}

export function getRegistration(id: string): ComponentRegistration | undefined {
  return COMPONENT_REGISTRY[id];
}

// True only for components that have an interactive renderer (controls + inspect).
// Used to decide whether the right panel and controls bar should be visible.
export function hasRenderer(id: string): boolean {
  return id in COMPONENT_RENDERERS;
}
