/** Reads channel plugin entries from the active loaded runtime registry. */
import type { ActiveChannelPluginRuntimeShape } from "../../plugins/channel-registry-state.types.js";
import { getActivePluginChannelRegistryFromState } from "../../plugins/runtime-channel-state.js";
import { normalizeOptionalString } from "../../shared/string-coerce.js";
import type { ChannelPlugin } from "./types.plugin.js";
import type { ChannelId } from "./types.public.js";

function coerceLoadedChannelPlugin(
  plugin: ActiveChannelPluginRuntimeShape | null | undefined,
): ChannelPlugin | undefined {
  const id = normalizeOptionalString(plugin?.id) ?? "";
  if (!plugin || !id) {
    return undefined;
  }
  if (!plugin.meta || typeof plugin.meta !== "object") {
    plugin.meta = {};
  }
  return plugin as ChannelPlugin;
}

/** Reused helper for get Loaded Channel Plugin For Read behavior in src/channels/plugins. */
export function getLoadedChannelPluginForRead(id: ChannelId): ChannelPlugin | undefined {
  const resolvedId = normalizeOptionalString(id) ?? "";
  if (!resolvedId) {
    return undefined;
  }
  const registry = getActivePluginChannelRegistryFromState();
  if (!registry || !Array.isArray(registry.channels)) {
    return undefined;
  }
  for (const entry of registry.channels) {
    const plugin = coerceLoadedChannelPlugin(entry?.plugin);
    if (plugin && plugin.id === resolvedId) {
      return plugin;
    }
  }
  return undefined;
}
