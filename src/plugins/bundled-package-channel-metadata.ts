// plugins bundled package channel metadata helpers and runtime behavior.
import { listChannelCatalogEntries } from "./channel-catalog-registry.js";
import type { PluginPackageChannel } from "./manifest.js";

/** Reused helper for list Bundled Package Channel Metadata behavior in src/plugins. */
export function listBundledPackageChannelMetadata(): readonly PluginPackageChannel[] {
  return listChannelCatalogEntries({ origin: "bundled" }).map((entry) => entry.channel);
}

/** Reused helper for find Bundled Package Channel Metadata behavior in src/plugins. */
export function findBundledPackageChannelMetadata(
  channelId: string,
): PluginPackageChannel | undefined {
  return listBundledPackageChannelMetadata().find(
    (channel) => channel.id === channelId || channel.aliases?.includes(channelId),
  );
}
