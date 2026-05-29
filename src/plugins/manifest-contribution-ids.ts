// plugins manifest contribution ids helpers and runtime behavior.
import {
  listPluginContributionIds,
  loadPluginRegistrySnapshot,
  type LoadPluginRegistryParams,
  type PluginRegistryContributionKey,
  type PluginRegistrySnapshot,
} from "./plugin-registry.js";

/** Shared type for List Manifest Contribution Ids Params in src/plugins. */
export type ListManifestContributionIdsParams = LoadPluginRegistryParams & {
  contribution: PluginRegistryContributionKey;
  index?: PluginRegistrySnapshot;
  includeDisabled?: boolean;
};

/** Reused helper for list Manifest Contribution Ids behavior in src/plugins. */
export function listManifestContributionIds(
  params: ListManifestContributionIdsParams,
): readonly string[] {
  const env = params.env ?? process.env;
  const index =
    params.index ??
    loadPluginRegistrySnapshot({
      config: params.config,
      workspaceDir: params.workspaceDir,
      env,
      candidates: params.candidates,
      preferPersisted: params.preferPersisted,
    });
  return listPluginContributionIds({
    index,
    contribution: params.contribution,
    config: params.config,
    workspaceDir: params.workspaceDir,
    env,
    includeDisabled: params.includeDisabled,
  });
}

/** Reused helper for list Manifest Channel Contribution Ids behavior in src/plugins. */
export function listManifestChannelContributionIds(
  params: Omit<ListManifestContributionIdsParams, "contribution"> = {},
): readonly string[] {
  return listManifestContributionIds({
    ...params,
    contribution: "channels",
  });
}

/** Reused helper for list Manifest Provider Contribution Ids behavior in src/plugins. */
export function listManifestProviderContributionIds(
  params: Omit<ListManifestContributionIdsParams, "contribution"> = {},
): readonly string[] {
  return listManifestContributionIds({
    ...params,
    contribution: "providers",
  });
}
