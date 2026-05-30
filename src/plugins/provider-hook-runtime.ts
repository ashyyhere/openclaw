import { normalizeProviderId } from "@openclaw/model-catalog-core/provider-id";
import { resolveModelCatalogScope } from "../agents/model-catalog-scope.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import {
  normalizeLowercaseStringOrEmpty,
  normalizeOptionalString,
} from "../shared/string-coerce.js";
import { getLoadedRuntimePluginRegistry } from "./active-runtime-registry.js";
import {
  PluginLruCache,
  resolveConfigScopedRuntimeCacheValue,
  type ConfigScopedRuntimeCache,
} from "./plugin-cache-primitives.js";
import { resolvePluginControlPlaneFingerprint } from "./plugin-control-plane-context.js";
import { resolveProviderConfigApiOwnerHint } from "./provider-config-owner.js";
import { isPluginProvidersLoadInFlight, resolvePluginProviders } from "./providers.runtime.js";
import type { PluginRegistry } from "./registry-types.js";
import {
  getActivePluginRegistryWorkspaceDirFromState,
  getPluginRegistryState,
} from "./runtime-state.js";
import type {
  ProviderPlugin,
  ProviderExtraParamsForTransportContext,
  ProviderPrepareExtraParamsContext,
  ProviderResolveAuthProfileIdContext,
  ProviderFollowupFallbackRouteContext,
  ProviderFollowupFallbackRouteResult,
  ProviderWrapStreamFnContext,
} from "./types.js";

let providerRuntimePluginCache: ConfigScopedRuntimeCache<ProviderPlugin | null> = new WeakMap();
const defaultProviderRuntimePluginCache = new PluginLruCache<ProviderPlugin | null>(128);
const PREPARED_PROVIDER_RUNTIME_SURFACES = ["channel"] as const;

/** Inputs used to locate the runtime plugin that owns a provider/model hook. */
export type ProviderRuntimePluginLookupParams = {
  provider: string;
  modelId?: string | null;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  applyAutoEnable?: boolean;
  bundledProviderVitestCompat?: boolean;
};

/** Reusable provider runtime lookup result carried across hook calls. */
export type ProviderRuntimePluginHandle = ProviderRuntimePluginLookupParams & {
  plugin?: ProviderPlugin;
};

/** Lookup params that may already include a reusable runtime plugin handle. */
export type ProviderRuntimePluginHandleParams = ProviderRuntimePluginLookupParams & {
  runtimeHandle?: ProviderRuntimePluginHandle;
};

/** Clears provider runtime plugin caches for isolated tests. */
export function clearProviderRuntimePluginCacheForTest(): void {
  providerRuntimePluginCache = new WeakMap();
  defaultProviderRuntimePluginCache.clear();
}

function matchesProviderId(provider: ProviderPlugin, providerId: string): boolean {
  const normalized = normalizeProviderId(providerId);
  if (!normalized) {
    return false;
  }
  if (normalizeProviderId(provider.id) === normalized) {
    return true;
  }
  return [...(provider.aliases ?? []), ...(provider.hookAliases ?? [])].some(
    (alias) => normalizeProviderId(alias) === normalized,
  );
}

function resolveProviderRuntimePluginCacheKey(
  params: ProviderRuntimePluginLookupParams,
  registryState = getPluginRegistryState(),
): string {
  return JSON.stringify({
    provider: normalizeLowercaseStringOrEmpty(params.provider),
    modelId: resolveProviderRuntimeLookupModelId(params) ?? null,
    pluginControlPlane: resolvePluginControlPlaneFingerprint({
      config: params.config,
      env: params.env,
      workspaceDir: params.workspaceDir,
    }),
    plugins: params.config?.plugins,
    models: params.config?.models?.providers,
    workspaceDir: params.workspaceDir ?? "",
    applyAutoEnable: params.applyAutoEnable ?? null,
    bundledProviderVitestCompat: params.bundledProviderVitestCompat ?? null,
    pluginRegistryKey: registryState?.key ?? null,
    pluginRegistryVersion: registryState?.activeVersion ?? null,
  });
}

function matchesProviderLiteralId(provider: ProviderPlugin, providerId: string): boolean {
  const normalized = normalizeLowercaseStringOrEmpty(providerId);
  return !!normalized && normalizeLowercaseStringOrEmpty(provider.id) === normalized;
}

function resolveProviderRuntimeLookupModelId(
  params: ProviderRuntimePluginLookupParams & { context?: { modelId?: unknown } },
): string | undefined {
  return normalizeOptionalString(
    params.modelId ??
      (typeof params.context?.modelId === "string" ? params.context.modelId : undefined),
  );
}

function resolveProviderRuntimeLookupScope(
  params: ProviderRuntimePluginLookupParams,
  apiOwnerHint?: string,
): {
  providerRefs: string[];
  modelRefs?: string[];
} {
  const providerRefs = apiOwnerHint ? [params.provider, apiOwnerHint] : [params.provider];
  const modelId = resolveProviderRuntimeLookupModelId(params);
  if (!modelId) {
    return { providerRefs };
  }
  return {
    providerRefs,
    modelRefs: resolveModelCatalogScope({
      cfg: params.config,
      provider: params.provider,
      model: modelId,
    }).modelRefs,
  };
}

function findProviderRuntimePluginInLoadedRegistries(params: {
  lookup: ProviderRuntimePluginLookupParams;
  apiOwnerHint?: string;
}): ProviderPlugin | undefined {
  const activeRegistry = getLoadedRuntimePluginRegistry({
    env: params.lookup.env,
    workspaceDir: params.lookup.workspaceDir,
  });
  const activePlugin = activeRegistry
    ? findProviderRuntimePluginInRegistry({
        registry: activeRegistry,
        provider: params.lookup.provider,
        apiOwnerHint: params.apiOwnerHint,
      })
    : undefined;
  if (activePlugin) {
    return activePlugin;
  }
  for (const surface of PREPARED_PROVIDER_RUNTIME_SURFACES) {
    const registry = getLoadedRuntimePluginRegistry({
      env: params.lookup.env,
      workspaceDir: params.lookup.workspaceDir,
      surface,
    });
    const plugin = registry
      ? findProviderRuntimePluginInRegistry({
          registry,
          provider: params.lookup.provider,
          apiOwnerHint: params.apiOwnerHint,
        })
      : undefined;
    if (plugin) {
      return plugin;
    }
  }
  return undefined;
}

function findProviderRuntimePluginInRegistry(params: {
  registry: PluginRegistry;
  provider: string;
  apiOwnerHint?: string;
}): ProviderPlugin | undefined {
  return params.registry.providers
    .map((entry) => Object.assign({}, entry.provider, { pluginId: entry.pluginId }))
    .find((plugin) => {
      if (params.apiOwnerHint) {
        return (
          matchesProviderLiteralId(plugin, params.provider) ||
          matchesProviderId(plugin, params.apiOwnerHint)
        );
      }
      return matchesProviderId(plugin, params.provider);
    });
}

/** Resolves provider plugins for hook lookup without activating plugin runtimes. */
export function resolveProviderPluginsForHooks(params: {
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  onlyPluginIds?: string[];
  providerRefs?: readonly string[];
  modelRefs?: readonly string[];
  applyAutoEnable?: boolean;
  bundledProviderVitestCompat?: boolean;
}): ProviderPlugin[] {
  const env = params.env ?? process.env;
  const workspaceDir = params.workspaceDir ?? getActivePluginRegistryWorkspaceDirFromState();
  if (
    isPluginProvidersLoadInFlight({
      ...params,
      workspaceDir,
      env,
      activate: false,
      applyAutoEnable: params.applyAutoEnable,
      bundledProviderVitestCompat: params.bundledProviderVitestCompat ?? true,
    })
  ) {
    return [];
  }
  const resolved = resolvePluginProviders({
    ...params,
    workspaceDir,
    env,
    activate: false,
    applyAutoEnable: params.applyAutoEnable,
    bundledProviderVitestCompat: params.bundledProviderVitestCompat ?? true,
  });
  return resolved;
}

/** Finds and caches the provider runtime plugin for a provider/model lookup. */
export function resolveProviderRuntimePlugin(
  params: ProviderRuntimePluginLookupParams,
): ProviderPlugin | undefined {
  const workspaceDir = params.workspaceDir ?? getActivePluginRegistryWorkspaceDirFromState();
  const env = params.env ?? process.env;
  const lookup = { ...params, workspaceDir, env };
  const apiOwnerHint = resolveProviderConfigApiOwnerHint({
    provider: params.provider,
    config: params.config,
  });
  const providerRefs = apiOwnerHint ? [params.provider, apiOwnerHint] : [params.provider];
  const loadedPlugin = findProviderRuntimePluginInLoadedRegistries({
    lookup,
    apiOwnerHint,
  });
  if (loadedPlugin) {
    return loadedPlugin;
  }
  if (
    isPluginProvidersLoadInFlight({
      ...params,
      workspaceDir,
      env,
      providerRefs,
      activate: false,
      applyAutoEnable: params.applyAutoEnable,
      bundledProviderVitestCompat: params.bundledProviderVitestCompat ?? true,
    })
  ) {
    return undefined;
  }
  const cacheConfig = params.env && params.env !== process.env ? undefined : params.config;
  const registryState = getPluginRegistryState();
  const cacheKey = resolveProviderRuntimePluginCacheKey(lookup, registryState);
  const load = () => {
    const lookupScope = resolveProviderRuntimeLookupScope(params, apiOwnerHint);
    return (
      resolveProviderPluginsForHooks({
        config: params.config,
        workspaceDir,
        env,
        providerRefs: lookupScope.providerRefs,
        modelRefs: lookupScope.modelRefs,
        applyAutoEnable: params.applyAutoEnable,
        bundledProviderVitestCompat: params.bundledProviderVitestCompat,
      }).find((plugin) => {
        if (apiOwnerHint) {
          return (
            matchesProviderLiteralId(plugin, params.provider) ||
            matchesProviderId(plugin, apiOwnerHint)
          );
        }
        return matchesProviderId(plugin, params.provider);
      }) ?? null
    );
  };
  const plugin = cacheConfig
    ? resolveConfigScopedRuntimeCacheValue({
        cache: providerRuntimePluginCache,
        config: cacheConfig,
        key: cacheKey,
        load,
      })
    : !registryState?.key
      ? load()
      : (() => {
          const cached = defaultProviderRuntimePluginCache.getResult(cacheKey);
          if (cached.hit) {
            return cached.value;
          }
          const loaded = load();
          defaultProviderRuntimePluginCache.set(cacheKey, loaded);
          return loaded;
        })();
  return plugin ?? undefined;
}

/** Returns a provider plugin only from already loaded runtime registries. */
export function resolveLoadedProviderRuntimePlugin(
  params: ProviderRuntimePluginLookupParams,
): ProviderPlugin | undefined {
  const apiOwnerHint = resolveProviderConfigApiOwnerHint({
    provider: params.provider,
    config: params.config,
  });
  return findProviderRuntimePluginInLoadedRegistries({
    lookup: params,
    apiOwnerHint,
  });
}

/** Resolves the provider hook plugin, falling back to hook-scoped provider lookup. */
export function resolveProviderHookPlugin(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
}): ProviderPlugin | undefined {
  return (
    resolveProviderRuntimePlugin(params) ??
    resolveProviderPluginsForHooks({
      config: params.config,
      workspaceDir: params.workspaceDir,
      env: params.env,
    }).find((candidate) => matchesProviderId(candidate, params.provider))
  );
}

/** Builds a reusable runtime plugin handle for repeated provider hook calls. */
export function resolveProviderRuntimePluginHandle(
  params: ProviderRuntimePluginLookupParams,
): ProviderRuntimePluginHandle {
  const workspaceDir = params.workspaceDir ?? getActivePluginRegistryWorkspaceDirFromState();
  const env = params.env;
  const runtimePlugin = resolveProviderRuntimePlugin({
    ...params,
    workspaceDir,
    env,
  });

  return {
    ...params,
    workspaceDir,
    env,
    plugin: runtimePlugin,
  };
}

/** Reuses a compatible runtime handle or resolves a fresh one for the requested model. */
export function ensureProviderRuntimePluginHandle(
  params: ProviderRuntimePluginHandleParams,
): ProviderRuntimePluginHandle {
  const modelId = resolveProviderRuntimeLookupModelId(params);
  if (
    !params.runtimeHandle ||
    (modelId && !params.runtimeHandle.plugin && params.runtimeHandle.modelId !== modelId)
  ) {
    return resolveProviderRuntimePluginHandle({
      provider: params.provider,
      modelId,
      config: params.config ?? params.runtimeHandle?.config,
      workspaceDir: params.workspaceDir ?? params.runtimeHandle?.workspaceDir,
      env: params.env ?? params.runtimeHandle?.env,
      applyAutoEnable: params.runtimeHandle?.applyAutoEnable,
      bundledProviderVitestCompat: params.runtimeHandle?.bundledProviderVitestCompat,
    });
  }
  return params.runtimeHandle;
}

/** Delegates provider preflight extra-param preparation to the owning plugin. */
export function prepareProviderExtraParams(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  runtimeHandle?: ProviderRuntimePluginHandle;
  context: ProviderPrepareExtraParamsContext;
}) {
  return (
    ensureProviderRuntimePluginHandle(params).plugin?.prepareExtraParams?.(params.context) ??
    undefined
  );
}

/** Delegates transport-specific extra-param resolution to the owning plugin. */
export function resolveProviderExtraParamsForTransport(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  runtimeHandle?: ProviderRuntimePluginHandle;
  context: ProviderExtraParamsForTransportContext;
}) {
  return (
    ensureProviderRuntimePluginHandle(params).plugin?.extraParamsForTransport?.(params.context) ??
    undefined
  );
}

/** Resolves a provider-specific auth profile id through the owning plugin. */
export function resolveProviderAuthProfileId(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  runtimeHandle?: ProviderRuntimePluginHandle;
  context: ProviderResolveAuthProfileIdContext;
}): string | undefined {
  const resolved = ensureProviderRuntimePluginHandle(params).plugin?.resolveAuthProfileId?.(
    params.context,
  );
  return typeof resolved === "string" && resolved.trim() ? resolved.trim() : undefined;
}

/** Resolves provider-specific followup fallback routing through plugin hooks. */
export function resolveProviderFollowupFallbackRoute(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  runtimeHandle?: ProviderRuntimePluginHandle;
  context: ProviderFollowupFallbackRouteContext;
}): ProviderFollowupFallbackRouteResult | undefined {
  return (
    ensureProviderRuntimePluginHandle(params).plugin?.followupFallbackRoute?.(params.context) ??
    undefined
  );
}

/** Applies a provider stream wrapper supplied by the owning plugin. */
export function wrapProviderStreamFn(params: {
  provider: string;
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  runtimeHandle?: ProviderRuntimePluginHandle;
  context: ProviderWrapStreamFnContext;
}) {
  return (
    ensureProviderRuntimePluginHandle(params).plugin?.wrapStreamFn?.(params.context) ?? undefined
  );
}
