/** Normalizes channel ids against the active registry and bundled aliases. */
import { normalizeOptionalLowercaseString } from "../shared/string-coerce.js";
import type { ChannelId } from "./plugins/channel-id.types.js";
import { findRegisteredChannelPluginEntry } from "./registry-lookup.js";

/** Reused helper for normalize Any Channel Id behavior in src/channels. */
export function normalizeAnyChannelId(raw?: string | null): ChannelId | null {
  const key = normalizeOptionalLowercaseString(raw);
  if (!key) {
    return null;
  }
  return findRegisteredChannelPluginEntry(key)?.plugin.id ?? null;
}
