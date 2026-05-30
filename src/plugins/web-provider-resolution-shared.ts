// Shared web-search/web-fetch provider discovery and sorting helpers.
import { resolveBundledPluginCompatibleLoadValues } from "./activation-context.js";
import type { PluginLoadOptions } from "./loader.js";
import { loadManifestMetadataSnapshot } from "./manifest-contract-eligibility.js";
import type { PluginManifestRecord } from "./manifest-registry.js";
import { createPluginIdScopeSet, normalizePluginIdScope } from "./plugin-scope.js";

/** Manifest contract key used for web provider lookup. */
export type WebProviderContract = "webSearchProviders" | "webFetchProviders";
/** Config key whose schema/UI hints can imply web provider support. */
export type WebProviderConfigKey = "webSearch" | "webFetch";

/** Candidate plugin ids plus manifest records reused by provider resolution. */
export type WebProviderCandidateResolution = {
  pluginIds: string[] | undefined;
  manifestRecords?: readonly PluginManifestRecord[];
};

type WebProviderSortEntry = {
  id: string;
  pluginId: string;
  autoDetectOrder?: number;
};

function comparePluginProvidersAlphabetically(
  left: Pick<WebProviderSortEntry, "id" | "pluginId">,
  right: Pick<WebProviderSortEntry, "id" | "pluginId">,
): number {
  return left.id.localeCompare(right.id) || left.pluginId.localeCompare(right.pluginId);
}

/** Sorts plugin providers deterministically by provider id then plugin id. */
export function sortPluginProviders<T extends Pick<WebProviderSortEntry, "id" | "pluginId">>(
  providers: T[],
): T[] {
  return providers.toSorted(comparePluginProvidersAlphabetically);
}

/** Sorts auto-detected providers by explicit priority before stable ids. */
export function sortPluginProvidersForAutoDetect<T extends WebProviderSortEntry>(
  providers: T[],
): T[] {
  return providers.toSorted((left, right) => {
    const leftOrder = left.autoDetectOrder ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = right.autoDetectOrder ?? Number.MAX_SAFE_INTEGER;
    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }
    return comparePluginProvidersAlphabetically(left, right);
  });
}

function pluginManifestDeclaresProviderConfig(
  record: PluginManifestRecord,
  configKey: WebProviderConfigKey,
  contract: WebProviderContract,
): boolean {
  if ((record.contracts?.[contract]?.length ?? 0) > 0) {
    return true;
  }
  const configUiHintKeys = Object.keys(record.configUiHints ?? {});
  if (configUiHintKeys.some((key) => key === configKey || key.startsWith(`${configKey}.`))) {
    return true;
  }
  const properties = record.configSchema?.properties;
  return typeof properties === "object" && properties !== null && configKey in properties;
}

function loadInstalledWebProviderManifestRecords(params: {
  config?: PluginLoadOptions["config"];
  workspaceDir?: string;
  env?: PluginLoadOptions["env"];
  pluginIds?: readonly string[];
}): readonly PluginManifestRecord[] {
  const records = loadManifestMetadataSnapshot({
    config: params.config ?? {},
    workspaceDir: params.workspaceDir,
    env: params.env ?? process.env,
  }).plugins;
  const pluginIdSet = createPluginIdScopeSet(params.pluginIds);
  return pluginIdSet ? records.filter((plugin) => pluginIdSet.has(plugin.id)) : records;
}

/** Resolves candidate plugin ids from manifests that declare web provider support. */
export function resolveManifestDeclaredWebProviderCandidatePluginIds(params: {
  contract: WebProviderContract;
  configKey: WebProviderConfigKey;
  config?: PluginLoadOptions["config"];
  workspaceDir?: string;
  env?: PluginLoadOptions["env"];
  onlyPluginIds?: readonly string[];
  origin?: PluginManifestRecord["origin"];
}): string[] | undefined {
  return resolveManifestDeclaredWebProviderCandidates(params).pluginIds;
}

/** Resolves web provider candidates from contracts, config schema, and UI hints. */
export function resolveManifestDeclaredWebProviderCandidates(params: {
  contract: WebProviderContract;
  configKey: WebProviderConfigKey;
  config?: PluginLoadOptions["config"];
  workspaceDir?: string;
  env?: PluginLoadOptions["env"];
  onlyPluginIds?: readonly string[];
  origin?: PluginManifestRecord["origin"];
  manifestRecords?: readonly PluginManifestRecord[];
}): WebProviderCandidateResolution {
  const scopedPluginIds = normalizePluginIdScope(params.onlyPluginIds);
  if (scopedPluginIds?.length === 0) {
    return { pluginIds: [] };
  }
  const onlyPluginIdSet = createPluginIdScopeSet(scopedPluginIds);
  const manifestRecords =
    params.manifestRecords ??
    loadInstalledWebProviderManifestRecords({
      config: params.config,
      workspaceDir: params.workspaceDir,
      env: params.env,
      pluginIds: scopedPluginIds,
    });
  const ids = manifestRecords
    .filter(
      (plugin) =>
        (!params.origin || plugin.origin === params.origin) &&
        (!onlyPluginIdSet || onlyPluginIdSet.has(plugin.id)) &&
        pluginManifestDeclaresProviderConfig(plugin, params.configKey, params.contract),
    )
    .map((plugin) => plugin.id)
    .toSorted((left, right) => left.localeCompare(right));
  if (ids.length > 0) {
    return { pluginIds: ids, manifestRecords };
  }
  if (params.origin || scopedPluginIds !== undefined) {
    return { pluginIds: [], manifestRecords };
  }
  return { pluginIds: undefined, manifestRecords };
}

function resolveBundledWebProviderCompatPluginIds(params: {
  contract: WebProviderContract;
  config?: PluginLoadOptions["config"];
  workspaceDir?: string;
  env?: PluginLoadOptions["env"];
}): string[] {
  return loadInstalledWebProviderManifestRecords(params)
    .filter(
      (plugin) =>
        plugin.origin === "bundled" && (plugin.contracts?.[params.contract]?.length ?? 0) > 0,
    )
    .map((plugin) => plugin.id)
    .toSorted((left, right) => left.localeCompare(right));
}

/** Applies bundled-plugin compat activation for web provider resolution. */
export function resolveBundledWebProviderResolutionConfig(params: {
  contract: WebProviderContract;
  config?: PluginLoadOptions["config"];
  workspaceDir?: string;
  env?: PluginLoadOptions["env"];
}): {
  config: PluginLoadOptions["config"];
  activationSourceConfig?: PluginLoadOptions["config"];
  autoEnabledReasons: Record<string, string[]>;
} {
  const activation = resolveBundledPluginCompatibleLoadValues({
    rawConfig: params.config,
    env: params.env,
    workspaceDir: params.workspaceDir,
    applyAutoEnable: true,
    compatMode: {
      enablement: "always",
      vitest: params.config !== undefined,
    },
    resolveCompatPluginIds: (compatParams) =>
      resolveBundledWebProviderCompatPluginIds({
        contract: params.contract,
        ...compatParams,
      }),
  });

  return {
    config: activation.config,
    activationSourceConfig: activation.activationSourceConfig,
    autoEnabledReasons: activation.autoEnabledReasons,
  };
}

/** Projects registry provider entries through plugin-id filtering and sorting. */
export function mapRegistryProviders<TProvider extends { id: string }>(params: {
  entries: readonly { pluginId: string; provider: TProvider }[];
  onlyPluginIds?: readonly string[];
  sortProviders: (
    providers: Array<TProvider & { pluginId: string }>,
  ) => Array<TProvider & { pluginId: string }>;
}): Array<TProvider & { pluginId: string }> {
  const onlyPluginIdSet = createPluginIdScopeSet(normalizePluginIdScope(params.onlyPluginIds));
  return params.sortProviders(
    params.entries
      .filter((entry) => !onlyPluginIdSet || onlyPluginIdSet.has(entry.pluginId))
      .map((entry) => Object.assign({}, entry.provider, { pluginId: entry.pluginId })),
  );
}
