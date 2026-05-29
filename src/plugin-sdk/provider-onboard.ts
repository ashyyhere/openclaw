// Keep provider onboarding helpers dependency-light so bundled provider plugins
// do not pull heavyweight runtime graphs at activation time.

import { findNormalizedProviderKey } from "@openclaw/model-catalog-core/provider-id";
import { ensureStaticModelAllowlistEntry } from "../agents/model-allowlist-entry.js";
import { normalizeConfiguredProviderCatalogModelId } from "../agents/model-ref-shared.js";
import {
  normalizeAgentModelMapForConfig,
  normalizeAgentModelRefForConfig,
} from "../config/model-input.js";
import type { AgentModelEntryConfig } from "../config/types.agent-defaults.js";
import type {
  ModelApi,
  ModelDefinitionConfig,
  ModelProviderConfig,
} from "../config/types.models.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { resolvePrimaryStringValue } from "../shared/string-coerce.js";

/** Re-exported API for src/plugin-sdk, starting with Open Claw Config. */
export type { OpenClawConfig, ModelApi, ModelDefinitionConfig, ModelProviderConfig };
/** Re-exported API for src/plugin-sdk. */
export {
  resolveAgentModelFallbackValues,
  resolveAgentModelPrimaryValue,
} from "../config/model-input.js";

/** Shared type for Agent Model Alias Entry in src/plugin-sdk. */
export type AgentModelAliasEntry =
  | string
  | {
      modelRef: string;
      alias?: string;
    };

const LEGACY_OPENCODE_ZEN_DEFAULT_MODELS = new Set([
  "opencode/claude-opus-4-5",
  "opencode-zen/claude-opus-4-5",
]);

/** Reused constant for OPENCODE ZEN DEFAULT MODEL behavior in src/plugin-sdk. */
export const OPENCODE_ZEN_DEFAULT_MODEL = "opencode/claude-opus-4-6";

/** Shared type for Provider Onboard Preset Appliers in src/plugin-sdk. */
export type ProviderOnboardPresetAppliers<TArgs extends unknown[]> = {
  applyProviderConfig: (cfg: OpenClawConfig, ...args: TArgs) => OpenClawConfig;
  applyConfig: (cfg: OpenClawConfig, ...args: TArgs) => OpenClawConfig;
};

function extractAgentDefaultModelFallbacks(model: unknown): string[] | undefined {
  if (!model || typeof model !== "object") {
    return undefined;
  }
  if (!("fallbacks" in model)) {
    return undefined;
  }
  const fallbacks = (model as { fallbacks?: unknown }).fallbacks;
  return Array.isArray(fallbacks) ? fallbacks.map((value) => String(value)) : undefined;
}

function hasAgentDefaultModelPrimary(cfg: OpenClawConfig): boolean {
  return resolvePrimaryStringValue(cfg.agents?.defaults?.model) !== undefined;
}

function normalizeAgentModelAliasEntry(entry: AgentModelAliasEntry): {
  modelRef: string;
  alias?: string;
} {
  if (typeof entry === "string") {
    return { modelRef: entry };
  }
  return entry;
}

type ProviderModelMergeState = {
  providers: Record<string, ModelProviderConfig>;
  existingProvider?: ModelProviderConfig;
  existingModels: ModelDefinitionConfig[];
};

function normalizeProviderModelForConfig(
  providerId: string,
  model: ModelDefinitionConfig,
): ModelDefinitionConfig {
  const id = normalizeConfiguredProviderCatalogModelId(providerId, model.id);
  return id === model.id ? model : { ...model, id };
}

function normalizeProviderModelsForConfig(
  providerId: string,
  models: ModelDefinitionConfig[],
): ModelDefinitionConfig[] {
  let mutated = false;
  const next: ModelDefinitionConfig[] = [];
  const seenById = new Map<string, number>();

  for (const model of models) {
    const normalized = normalizeProviderModelForConfig(providerId, model);
    if (normalized !== model) {
      mutated = true;
    }
    const existingIndex = seenById.get(normalized.id);
    if (existingIndex !== undefined) {
      mutated = true;
      next[existingIndex] = { ...normalized, ...next[existingIndex] };
      continue;
    }
    seenById.set(normalized.id, next.length);
    next.push(normalized);
  }

  return mutated ? next : models;
}

function normalizeModelProvidersForConfig(
  providers: Record<string, ModelProviderConfig> | undefined,
): Record<string, ModelProviderConfig> | undefined {
  if (!providers) {
    return providers;
  }

  let mutated = false;
  const nextProviders: Record<string, ModelProviderConfig> = {};
  for (const [providerId, providerConfig] of Object.entries(providers)) {
    const models = Array.isArray(providerConfig.models)
      ? normalizeProviderModelsForConfig(providerId, providerConfig.models)
      : providerConfig.models;
    if (models !== providerConfig.models) {
      mutated = true;
      nextProviders[providerId] = { ...providerConfig, models };
      continue;
    }
    nextProviders[providerId] = providerConfig;
  }

  return mutated ? nextProviders : providers;
}

function resolveProviderModelMergeState(
  cfg: OpenClawConfig,
  providerId: string,
): ProviderModelMergeState {
  const providers = { ...cfg.models?.providers } as Record<string, ModelProviderConfig>;
  const existingProviderKey = findNormalizedProviderKey(providers, providerId);
  const existingProvider =
    existingProviderKey !== undefined
      ? (providers[existingProviderKey] as ModelProviderConfig | undefined)
      : undefined;
  const existingModels: ModelDefinitionConfig[] = Array.isArray(existingProvider?.models)
    ? normalizeProviderModelsForConfig(providerId, existingProvider.models)
    : [];
  if (existingProviderKey && existingProviderKey !== providerId) {
    delete providers[existingProviderKey];
  }
  return {
    providers,
    existingProvider: existingProvider
      ? { ...existingProvider, models: existingModels }
      : existingProvider,
    existingModels,
  };
}

function buildProviderConfig(params: {
  existingProvider: ModelProviderConfig | undefined;
  api: ModelApi;
  baseUrl: string;
  mergedModels: ModelDefinitionConfig[];
  fallbackModels: ModelDefinitionConfig[];
}): ModelProviderConfig {
  const { apiKey: existingApiKey, ...existingProviderRest } = (params.existingProvider ?? {}) as {
    apiKey?: string;
  };
  const normalizedApiKey = typeof existingApiKey === "string" ? existingApiKey.trim() : undefined;

  return {
    ...existingProviderRest,
    baseUrl: params.baseUrl,
    api: params.api,
    ...(normalizedApiKey ? { apiKey: normalizedApiKey } : {}),
    models: params.mergedModels.length > 0 ? params.mergedModels : params.fallbackModels,
  };
}

function applyProviderConfigWithMergedModels(
  cfg: OpenClawConfig,
  params: {
    agentModels: Record<string, AgentModelEntryConfig>;
    providerId: string;
    providerState: ProviderModelMergeState;
    api: ModelApi;
    baseUrl: string;
    mergedModels: ModelDefinitionConfig[];
    fallbackModels: ModelDefinitionConfig[];
  },
): OpenClawConfig {
  const mergedModels = normalizeProviderModelsForConfig(params.providerId, params.mergedModels);
  const fallbackModels = normalizeProviderModelsForConfig(params.providerId, params.fallbackModels);
  params.providerState.providers[params.providerId] = buildProviderConfig({
    existingProvider: params.providerState.existingProvider,
    api: params.api,
    baseUrl: params.baseUrl,
    mergedModels,
    fallbackModels,
  });
  return applyOnboardAuthAgentModelsAndProviders(cfg, {
    agentModels: params.agentModels,
    providers: params.providerState.providers,
  });
}

function createProviderPresetAppliers<
  TArgs extends unknown[],
  TParams extends {
    primaryModelRef?: string;
  },
>(params: {
  resolveParams: (
    cfg: OpenClawConfig,
    ...args: TArgs
  ) => Omit<TParams, "primaryModelRef"> | null | undefined;
  applyPreset: (cfg: OpenClawConfig, preset: TParams) => OpenClawConfig;
  primaryModelRef: string;
}): ProviderOnboardPresetAppliers<TArgs> {
  return {
    applyProviderConfig(cfg, ...args) {
      const resolved = params.resolveParams(cfg, ...args);
      return resolved ? params.applyPreset(cfg, resolved as TParams) : cfg;
    },
    applyConfig(cfg, ...args) {
      const resolved = params.resolveParams(cfg, ...args);
      if (!resolved) {
        return cfg;
      }
      return params.applyPreset(cfg, {
        ...(resolved as TParams),
        primaryModelRef: params.primaryModelRef,
      });
    },
  };
}

/** Reused helper for with Agent Model Aliases behavior in src/plugin-sdk. */
export function withAgentModelAliases(
  existing: Record<string, AgentModelEntryConfig> | undefined,
  aliases: readonly AgentModelAliasEntry[],
): Record<string, AgentModelEntryConfig> {
  const next = normalizeAgentModelMapForConfig({ ...existing });
  for (const entry of aliases) {
    const normalized = normalizeAgentModelAliasEntry(entry);
    const modelRef = normalizeAgentModelRefForConfig(normalized.modelRef);
    next[modelRef] = {
      ...next[modelRef],
      ...(normalized.alias ? { alias: next[modelRef]?.alias ?? normalized.alias } : {}),
    };
  }
  return next;
}

/** Reused helper for apply Onboard Auth Agent Models And Providers behavior in src/plugin-sdk. */
export function applyOnboardAuthAgentModelsAndProviders(
  cfg: OpenClawConfig,
  params: {
    agentModels: Record<string, AgentModelEntryConfig>;
    providers: Record<string, ModelProviderConfig>;
  },
): OpenClawConfig {
  const mergedAgentModels = normalizeAgentModelMapForConfig({
    ...cfg.agents?.defaults?.models,
    ...params.agentModels,
  });
  return {
    ...cfg,
    agents: {
      ...cfg.agents,
      defaults: {
        ...cfg.agents?.defaults,
        models: mergedAgentModels,
      },
    },
    models: {
      mode: cfg.models?.mode ?? "merge",
      providers: params.providers,
    },
  };
}

/** Reused helper for apply Agent Default Model Primary behavior in src/plugin-sdk. */
export function applyAgentDefaultModelPrimary(
  cfg: OpenClawConfig,
  primary: string,
): OpenClawConfig {
  const defaults = cfg.agents?.defaults;
  const existingFallbacks = extractAgentDefaultModelFallbacks(cfg.agents?.defaults?.model);
  const normalizedFallbacks = existingFallbacks?.map((fallback) =>
    normalizeAgentModelRefForConfig(fallback),
  );
  const normalizedModels =
    defaults?.models === undefined ? undefined : normalizeAgentModelMapForConfig(defaults.models);
  const normalizedProviders = normalizeModelProvidersForConfig(cfg.models?.providers);
  return {
    ...cfg,
    agents: {
      ...cfg.agents,
      defaults: {
        ...defaults,
        model: {
          ...(normalizedFallbacks ? { fallbacks: normalizedFallbacks } : undefined),
          primary: normalizeAgentModelRefForConfig(primary),
        },
        ...(normalizedModels !== undefined ? { models: normalizedModels } : undefined),
      },
    },
    ...(normalizedProviders !== undefined
      ? {
          models: {
            ...cfg.models,
            providers: normalizedProviders,
          },
        }
      : undefined),
  };
}

/** Reused helper for apply Opencode Zen Model Default behavior in src/plugin-sdk. */
export function applyOpencodeZenModelDefault(cfg: OpenClawConfig): {
  next: OpenClawConfig;
  changed: boolean;
} {
  const current = resolvePrimaryStringValue(cfg.agents?.defaults?.model);
  const normalizedCurrent =
    current && LEGACY_OPENCODE_ZEN_DEFAULT_MODELS.has(current)
      ? OPENCODE_ZEN_DEFAULT_MODEL
      : current;
  if (normalizedCurrent === OPENCODE_ZEN_DEFAULT_MODEL) {
    return { next: cfg, changed: false };
  }
  return {
    next: applyAgentDefaultModelPrimary(cfg, OPENCODE_ZEN_DEFAULT_MODEL),
    changed: true,
  };
}

/** Reused helper for apply Provider Config With Default Models behavior in src/plugin-sdk. */
export function applyProviderConfigWithDefaultModels(
  cfg: OpenClawConfig,
  params: {
    agentModels: Record<string, AgentModelEntryConfig>;
    providerId: string;
    api: ModelApi;
    baseUrl: string;
    defaultModels: ModelDefinitionConfig[];
    defaultModelId?: string;
  },
): OpenClawConfig {
  const providerState = resolveProviderModelMergeState(cfg, params.providerId);
  const defaultModels = params.defaultModels;
  const defaultModelId = params.defaultModelId ?? defaultModels[0]?.id;
  const hasDefaultModel = defaultModelId
    ? providerState.existingModels.some((model) => model.id === defaultModelId)
    : true;
  const mergedModels =
    providerState.existingModels.length > 0
      ? hasDefaultModel || defaultModels.length === 0
        ? providerState.existingModels
        : [...providerState.existingModels, ...defaultModels]
      : defaultModels;
  return applyProviderConfigWithMergedModels(cfg, {
    agentModels: params.agentModels,
    providerId: params.providerId,
    providerState,
    api: params.api,
    baseUrl: params.baseUrl,
    mergedModels,
    fallbackModels: defaultModels,
  });
}

/** Reused helper for apply Provider Config With Default Model behavior in src/plugin-sdk. */
export function applyProviderConfigWithDefaultModel(
  cfg: OpenClawConfig,
  params: {
    agentModels: Record<string, AgentModelEntryConfig>;
    providerId: string;
    api: ModelApi;
    baseUrl: string;
    defaultModel: ModelDefinitionConfig;
    defaultModelId?: string;
  },
): OpenClawConfig {
  return applyProviderConfigWithDefaultModels(cfg, {
    agentModels: params.agentModels,
    providerId: params.providerId,
    api: params.api,
    baseUrl: params.baseUrl,
    defaultModels: [params.defaultModel],
    defaultModelId: params.defaultModelId ?? params.defaultModel.id,
  });
}

/** Reused helper for apply Provider Config With Default Model Preset behavior in src/plugin-sdk. */
export function applyProviderConfigWithDefaultModelPreset(
  cfg: OpenClawConfig,
  params: {
    providerId: string;
    api: ModelApi;
    baseUrl: string;
    defaultModel: ModelDefinitionConfig;
    defaultModelId?: string;
    aliases?: readonly AgentModelAliasEntry[];
    primaryModelRef?: string;
  },
): OpenClawConfig {
  const next = applyProviderConfigWithDefaultModel(cfg, {
    agentModels: withAgentModelAliases(cfg.agents?.defaults?.models, params.aliases ?? []),
    providerId: params.providerId,
    api: params.api,
    baseUrl: params.baseUrl,
    defaultModel: params.defaultModel,
    defaultModelId: params.defaultModelId,
  });
  return params.primaryModelRef
    ? hasAgentDefaultModelPrimary(cfg)
      ? next
      : applyAgentDefaultModelPrimary(next, params.primaryModelRef)
    : next;
}

/** Reused helper for create Default Model Preset Appliers behavior in src/plugin-sdk. */
export function createDefaultModelPresetAppliers<TArgs extends unknown[]>(params: {
  resolveParams: (
    cfg: OpenClawConfig,
    ...args: TArgs
  ) =>
    | Omit<Parameters<typeof applyProviderConfigWithDefaultModelPreset>[1], "primaryModelRef">
    | null
    | undefined;
  primaryModelRef: string;
}): ProviderOnboardPresetAppliers<TArgs> {
  return createProviderPresetAppliers({
    resolveParams: params.resolveParams,
    applyPreset: applyProviderConfigWithDefaultModelPreset,
    primaryModelRef: params.primaryModelRef,
  });
}

/** Reused helper for apply Provider Config With Default Models Preset behavior in src/plugin-sdk. */
export function applyProviderConfigWithDefaultModelsPreset(
  cfg: OpenClawConfig,
  params: {
    providerId: string;
    api: ModelApi;
    baseUrl: string;
    defaultModels: ModelDefinitionConfig[];
    defaultModelId?: string;
    aliases?: readonly AgentModelAliasEntry[];
    primaryModelRef?: string;
  },
): OpenClawConfig {
  const next = applyProviderConfigWithDefaultModels(cfg, {
    agentModels: withAgentModelAliases(cfg.agents?.defaults?.models, params.aliases ?? []),
    providerId: params.providerId,
    api: params.api,
    baseUrl: params.baseUrl,
    defaultModels: params.defaultModels,
    defaultModelId: params.defaultModelId,
  });
  return params.primaryModelRef
    ? hasAgentDefaultModelPrimary(cfg)
      ? next
      : applyAgentDefaultModelPrimary(next, params.primaryModelRef)
    : next;
}

/** Reused helper for create Default Models Preset Appliers behavior in src/plugin-sdk. */
export function createDefaultModelsPresetAppliers<TArgs extends unknown[]>(params: {
  resolveParams: (
    cfg: OpenClawConfig,
    ...args: TArgs
  ) =>
    | Omit<Parameters<typeof applyProviderConfigWithDefaultModelsPreset>[1], "primaryModelRef">
    | null
    | undefined;
  primaryModelRef: string;
}): ProviderOnboardPresetAppliers<TArgs> {
  return createProviderPresetAppliers({
    resolveParams: params.resolveParams,
    applyPreset: applyProviderConfigWithDefaultModelsPreset,
    primaryModelRef: params.primaryModelRef,
  });
}

/** Reused helper for apply Provider Config With Model Catalog behavior in src/plugin-sdk. */
export function applyProviderConfigWithModelCatalog(
  cfg: OpenClawConfig,
  params: {
    agentModels: Record<string, AgentModelEntryConfig>;
    providerId: string;
    api: ModelApi;
    baseUrl: string;
    catalogModels: ModelDefinitionConfig[];
  },
): OpenClawConfig {
  const providerState = resolveProviderModelMergeState(cfg, params.providerId);
  const catalogModels = params.catalogModels;
  const mergedModels =
    providerState.existingModels.length > 0
      ? [
          ...providerState.existingModels,
          ...catalogModels.filter(
            (model) => !providerState.existingModels.some((existing) => existing.id === model.id),
          ),
        ]
      : catalogModels;
  return applyProviderConfigWithMergedModels(cfg, {
    agentModels: params.agentModels,
    providerId: params.providerId,
    providerState,
    api: params.api,
    baseUrl: params.baseUrl,
    mergedModels,
    fallbackModels: catalogModels,
  });
}

/** Reused helper for apply Provider Config With Model Catalog Preset behavior in src/plugin-sdk. */
export function applyProviderConfigWithModelCatalogPreset(
  cfg: OpenClawConfig,
  params: {
    providerId: string;
    api: ModelApi;
    baseUrl: string;
    catalogModels: ModelDefinitionConfig[];
    aliases?: readonly AgentModelAliasEntry[];
    primaryModelRef?: string;
  },
): OpenClawConfig {
  const next = applyProviderConfigWithModelCatalog(cfg, {
    agentModels: withAgentModelAliases(cfg.agents?.defaults?.models, params.aliases ?? []),
    providerId: params.providerId,
    api: params.api,
    baseUrl: params.baseUrl,
    catalogModels: params.catalogModels,
  });
  return params.primaryModelRef
    ? hasAgentDefaultModelPrimary(cfg)
      ? next
      : applyAgentDefaultModelPrimary(next, params.primaryModelRef)
    : next;
}

/** Reused helper for create Model Catalog Preset Appliers behavior in src/plugin-sdk. */
export function createModelCatalogPresetAppliers<TArgs extends unknown[]>(params: {
  resolveParams: (
    cfg: OpenClawConfig,
    ...args: TArgs
  ) =>
    | Omit<Parameters<typeof applyProviderConfigWithModelCatalogPreset>[1], "primaryModelRef">
    | null
    | undefined;
  primaryModelRef: string;
}): ProviderOnboardPresetAppliers<TArgs> {
  return createProviderPresetAppliers({
    resolveParams: params.resolveParams,
    applyPreset: applyProviderConfigWithModelCatalogPreset,
    primaryModelRef: params.primaryModelRef,
  });
}

/** Reused helper for ensure Model Allowlist Entry behavior in src/plugin-sdk. */
export function ensureModelAllowlistEntry(params: {
  cfg: OpenClawConfig;
  modelRef: string;
  defaultProvider?: string;
}): OpenClawConfig {
  return ensureStaticModelAllowlistEntry(params);
}
