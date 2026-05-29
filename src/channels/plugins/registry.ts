/** Public channel plugin registry lookups with loaded-plugin and bundled fallback order. */
import { normalizeOptionalString } from "../../shared/string-coerce.js";
import { normalizeAnyChannelId } from "../registry.js";
import { getBundledChannelPlugin } from "./bundled.js";
import {
  getLoadedChannelPluginById,
  getLoadedChannelPluginEntryById,
  listLoadedChannelPlugins,
} from "./registry-loaded.js";
import type { ChannelPlugin } from "./types.plugin.js";
import type { ChannelId } from "./types.public.js";

/** Reused helper for list Channel Plugins behavior in src/channels/plugins. */
export function listChannelPlugins(): ChannelPlugin[] {
  return listLoadedChannelPlugins() as ChannelPlugin[];
}

/** Reused helper for get Loaded Channel Plugin behavior in src/channels/plugins. */
export function getLoadedChannelPlugin(id: ChannelId): ChannelPlugin | undefined {
  const resolvedId = normalizeOptionalString(id) ?? "";
  if (!resolvedId) {
    return undefined;
  }
  return getLoadedChannelPluginById(resolvedId) as ChannelPlugin | undefined;
}

/** Reused helper for get Loaded Channel Plugin Origin behavior in src/channels/plugins. */
export function getLoadedChannelPluginOrigin(id: ChannelId): string | undefined {
  const resolvedId = normalizeOptionalString(id) ?? "";
  if (!resolvedId) {
    return undefined;
  }
  return normalizeOptionalString(getLoadedChannelPluginEntryById(resolvedId)?.origin) ?? undefined;
}

/** Reused helper for get Channel Plugin behavior in src/channels/plugins. */
export function getChannelPlugin(id: ChannelId): ChannelPlugin | undefined {
  const resolvedId = normalizeOptionalString(id) ?? "";
  if (!resolvedId) {
    return undefined;
  }
  return getLoadedChannelPlugin(resolvedId) ?? getBundledChannelPlugin(resolvedId);
}

/** Reused helper for normalize Channel Id behavior in src/channels/plugins. */
export function normalizeChannelId(raw?: string | null): ChannelId | null {
  return normalizeAnyChannelId(raw);
}
