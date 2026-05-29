// Bundled channel id and alias accessors.
import { listChannelCatalogEntries } from "../../plugins/channel-catalog-registry.js";
import type { PluginDiscoveryResult } from "../../plugins/discovery.js";
import { resolveBundledChannelRootScope } from "./bundled-root.js";

/** Reused helper for list Bundled Channel Plugin Ids For Root behavior in src/channels/plugins. */
export function listBundledChannelPluginIdsForRoot(
  _packageRoot: string,
  env: NodeJS.ProcessEnv = process.env,
  discovery?: PluginDiscoveryResult,
): string[] {
  return listChannelCatalogEntries({
    origin: "bundled",
    env,
    discovery,
  })
    .map((entry) => entry.pluginId)
    .toSorted((left, right) => left.localeCompare(right));
}

/** Reused helper for list Bundled Channel Ids For Root behavior in src/channels/plugins. */
export function listBundledChannelIdsForRoot(
  _packageRoot: string,
  env: NodeJS.ProcessEnv = process.env,
  discovery?: PluginDiscoveryResult,
): string[] {
  return listChannelCatalogEntries({
    origin: "bundled",
    env,
    discovery,
  })
    .map((entry) => entry.channel.id)
    .filter((channelId): channelId is string => Boolean(channelId))
    .toSorted((left, right) => left.localeCompare(right));
}

/** Reused helper for list Bundled Channel Plugin Ids behavior in src/channels/plugins. */
export function listBundledChannelPluginIds(
  env: NodeJS.ProcessEnv = process.env,
  discovery?: PluginDiscoveryResult,
): string[] {
  return listBundledChannelPluginIdsForRoot(
    resolveBundledChannelRootScope(env).cacheKey,
    env,
    discovery,
  );
}

/** Reused helper for list Bundled Channel Ids behavior in src/channels/plugins. */
export function listBundledChannelIds(
  env: NodeJS.ProcessEnv = process.env,
  discovery?: PluginDiscoveryResult,
): string[] {
  return listBundledChannelIdsForRoot(resolveBundledChannelRootScope(env).cacheKey, env, discovery);
}
