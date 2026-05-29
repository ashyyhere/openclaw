// plugins web fetch providers shared helpers and runtime behavior.
import type { PluginLoadOptions } from "./loader.js";
import type { PluginWebFetchProviderEntry } from "./types.js";
import {
  resolveBundledWebProviderResolutionConfig,
  sortPluginProviders,
  sortPluginProvidersForAutoDetect,
} from "./web-provider-resolution-shared.js";

/** Reused helper for sort Web Fetch Providers behavior in src/plugins. */
export function sortWebFetchProviders(
  providers: PluginWebFetchProviderEntry[],
): PluginWebFetchProviderEntry[] {
  return sortPluginProviders(providers);
}

/** Reused helper for sort Web Fetch Providers For Auto Detect behavior in src/plugins. */
export function sortWebFetchProvidersForAutoDetect(
  providers: PluginWebFetchProviderEntry[],
): PluginWebFetchProviderEntry[] {
  return sortPluginProvidersForAutoDetect(providers);
}

/** Reused helper for resolve Bundled Web Fetch Resolution Config behavior in src/plugins. */
export function resolveBundledWebFetchResolutionConfig(params: {
  config?: PluginLoadOptions["config"];
  workspaceDir?: string;
  env?: PluginLoadOptions["env"];
}): {
  config: PluginLoadOptions["config"];
  activationSourceConfig?: PluginLoadOptions["config"];
  autoEnabledReasons: Record<string, string[]>;
} {
  return resolveBundledWebProviderResolutionConfig({
    contract: "webFetchProviders",
    config: params.config,
    workspaceDir: params.workspaceDir,
    env: params.env,
  });
}
