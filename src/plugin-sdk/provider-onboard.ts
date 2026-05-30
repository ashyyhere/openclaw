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

/** Config/model types needed by provider onboarding helpers. */
export type { OpenClawConfig, ModelApi, ModelDefinitionConfig, ModelProviderConfig };
/** Model-ref readers shared with provider onboarding callers. */
export {
  resolveAgentModelFallbackValues,
  resolveAgentModelPrimaryValue,
} from "../config/model-input.js";

/** Alias entry accepted when seeding agent model defaults for a provider. */
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

/** Current OpenCode Zen default model ref used during onboarding migration. */
export const OPENCODE_ZEN_DEFAULT_MODEL = "opencode/claude-opus-4-6";

/** Pair of helpers for applying provider config with or without primary default. */
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

/** Merges provider alias entries into normalized agent model defaults. */
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

/** Applies merged provider config and agent model defaults during onboarding. */
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

/** Sets the primary agent model while preserving normalized fallbacks/models. */
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

/** Migrates legacy OpenCode Zen defaults to the current primary model ref. */
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

/** Merges a provider config with one or more default catalog models. */
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

/** Convenience wrapper for merging a provider config with one default model. */
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

/** Applies a one-model provider preset and optionally claims the primary model. */
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

/** Builds preset appliers for providers that expose one default model. */
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

/** Applies a multi-model provider preset and optionally claims the primary model. */
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

/** Builds preset appliers for providers that expose multiple default models. */
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

/** Merges a provider config with a full model catalog without dropping existing models. */
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

/** Applies a model-catalog provider preset and optionally claims primary default. */
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

/** Builds preset appliers for providers that expose a model catalog. */
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

/** Ensures a static model allowlist entry exists for a model ref. */
export function ensureModelAllowlistEntry(params: {
  cfg: OpenClawConfig;
  modelRef: string;
  defaultProvider?: string;
}): OpenClawConfig {
  return ensureStaticModelAllowlistEntry(params);
}
