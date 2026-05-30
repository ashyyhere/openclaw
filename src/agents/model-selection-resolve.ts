import { resolveAgentModelFallbackValues } from "../config/model-input.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { ModelCatalogEntry } from "./model-catalog.types.js";
import type { ModelManifestNormalizationContext, ModelRef } from "./model-selection-normalize.js";
import {
  buildModelAliasIndex,
  getModelRefStatusWithFallbackModels,
  resolveAllowedModelRefFromAliasIndex,
  type ModelRefStatus,
} from "./model-selection-shared.js";

/** Model selection normalization helpers shared with config and UI callers. */
export {
  buildConfiguredAllowlistKeys,
  buildModelAliasIndex,
  normalizeModelSelection,
  resolveConfiguredModelRef,
  resolveHooksGmailModel,
  resolveModelRefFromString,
} from "./model-selection-shared.js";
/** Model ref status result returned by catalog/allowlist resolution. */
export type { ModelRefStatus } from "./model-selection-shared.js";

function resolveDefaultFallbackModels(cfg: OpenClawConfig): string[] {
  return resolveAgentModelFallbackValues(cfg.agents?.defaults?.model);
}

/** Return status of a normalized model ref against catalog/allowlist. */
export function getModelRefStatus(
  params: {
    cfg: OpenClawConfig;
    catalog: ModelCatalogEntry[];
    ref: ModelRef;
    defaultProvider: string;
    defaultModel?: string;
  } & ModelManifestNormalizationContext,
): ModelRefStatus {
  const { cfg, catalog, ref, defaultProvider, defaultModel, manifestPlugins } = params;
  return getModelRefStatusWithFallbackModels({
    cfg,
    catalog,
    ref,
    defaultProvider,
    defaultModel,
    fallbackModels: resolveDefaultFallbackModels(cfg),
    manifestPlugins,
  });
}

/** Resolve a raw model ref to an allowed provider/model or error. */
export function resolveAllowedModelRef(
  params: {
    cfg: OpenClawConfig;
    catalog: ModelCatalogEntry[];
    raw: string;
    defaultProvider: string;
    defaultModel?: string;
  } & ModelManifestNormalizationContext,
):
  | { ref: ModelRef; key: string }
  | {
      error: string;
    } {
  const aliasIndex = buildModelAliasIndex({
    cfg: params.cfg,
    defaultProvider: params.defaultProvider,
    manifestPlugins: params.manifestPlugins,
  });
  return resolveAllowedModelRefFromAliasIndex({
    cfg: params.cfg,
    raw: params.raw,
    defaultProvider: params.defaultProvider,
    aliasIndex,
    manifestPlugins: params.manifestPlugins,
    getStatus: (ref) =>
      getModelRefStatus({
        cfg: params.cfg,
        catalog: params.catalog,
        ref,
        defaultProvider: params.defaultProvider,
        defaultModel: params.defaultModel,
        manifestPlugins: params.manifestPlugins,
      }),
  });
}
