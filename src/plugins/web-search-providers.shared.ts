// plugins web search providers shared helpers and runtime behavior.
import type { PluginLoadOptions } from "./loader.js";
import type { PluginWebSearchProviderEntry } from "./types.js";
import {
  resolveBundledWebProviderResolutionConfig,
  sortPluginProviders,
  sortPluginProvidersForAutoDetect,
} from "./web-provider-resolution-shared.js";

/** Reused helper for sort Web Search Providers behavior in src/plugins. */
export function sortWebSearchProviders(
  providers: PluginWebSearchProviderEntry[],
): PluginWebSearchProviderEntry[] {
  return sortPluginProviders(providers);
}

/** Reused helper for sort Web Search Providers For Auto Detect behavior in src/plugins. */
export function sortWebSearchProvidersForAutoDetect(
  providers: PluginWebSearchProviderEntry[],
): PluginWebSearchProviderEntry[] {
  return sortPluginProvidersForAutoDetect(providers);
}

/** Reused helper for resolve Bundled Web Search Resolution Config behavior in src/plugins. */
export function resolveBundledWebSearchResolutionConfig(params: {
  config?: PluginLoadOptions["config"];
  workspaceDir?: string;
  env?: PluginLoadOptions["env"];
}): {
  config: PluginLoadOptions["config"];
  activationSourceConfig?: PluginLoadOptions["config"];
  autoEnabledReasons: Record<string, string[]>;
} {
  return resolveBundledWebProviderResolutionConfig({
    contract: "webSearchProviders",
    config: params.config,
    workspaceDir: params.workspaceDir,
    env: params.env,
  });
}
