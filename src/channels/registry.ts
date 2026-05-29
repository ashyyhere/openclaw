/** Channel id normalization and registry lookup facade used by core callers. */
import {
  normalizeOptionalLowercaseString,
  normalizeOptionalString,
} from "../shared/string-coerce.js";
import { normalizeChatChannelId, type ChatChannelId } from "./ids.js";
import type { ChannelId } from "./plugins/channel-id.types.js";
import type { ChannelMeta } from "./plugins/types.core.js";
import {
  findRegisteredChannelPluginEntry,
  findRegisteredChannelPluginEntryById,
  listRegisteredChannelPluginEntries,
} from "./registry-lookup.js";
/** Re-exported API for src/channels, starting with get Chat Channel Meta. */
export { getChatChannelMeta } from "./chat-meta.js";
/** Re-exported API for src/channels, starting with CHAT CHANNEL ORDER. */
export { CHAT_CHANNEL_ORDER } from "./ids.js";
/** Re-exported API for src/channels, starting with Chat Channel Id. */
export type { ChatChannelId } from "./ids.js";
/** Re-exported API for src/channels, starting with normalize Chat Channel Id. */
export { normalizeChatChannelId };

// Channel docking: prefer this helper in shared code. Importing from
// `src/channels/plugins/*` can eagerly load channel implementations.
/** Reused helper for normalize Channel Id behavior in src/channels. */
export function normalizeChannelId(raw?: string | null): ChatChannelId | null {
  return normalizeChatChannelId(raw);
}

// Normalizes registered channel plugins (bundled or external).
//
// Keep this light: we do not import channel plugins here (those are "heavy" and can pull in
// monitors, web login, etc). The plugin registry must be initialized first.
/** Reused helper for normalize Any Channel Id behavior in src/channels. */
export function normalizeAnyChannelId(raw?: string | null): ChannelId | null {
  const key = normalizeOptionalLowercaseString(raw);
  if (!key) {
    return null;
  }
  return findRegisteredChannelPluginEntry(key)?.plugin.id ?? null;
}

/** Reused helper for list Registered Channel Plugin Ids behavior in src/channels. */
export function listRegisteredChannelPluginIds(): ChannelId[] {
  return listRegisteredChannelPluginEntries().flatMap((entry) => {
    const id = normalizeOptionalString(entry.plugin.id);
    return id ? [id as ChannelId] : [];
  });
}

/** Reused helper for get Registered Channel Plugin Meta behavior in src/channels. */
export function getRegisteredChannelPluginMeta(
  id: string,
): Pick<ChannelMeta, "aliases" | "markdownCapable"> | null {
  return findRegisteredChannelPluginEntryById(id)?.plugin.meta ?? null;
}

/** Reused helper for format Channel Primer Line behavior in src/channels. */
export function formatChannelPrimerLine(meta: ChannelMeta): string {
  return `${meta.label}: ${meta.blurb}`;
}

/** Reused helper for format Channel Selection Line behavior in src/channels. */
export function formatChannelSelectionLine(
  meta: ChannelMeta,
  docsLink: (path: string, label?: string) => string,
): string {
  const docsPrefix = meta.selectionDocsPrefix ?? "Docs:";
  const docsLabel = meta.docsLabel ?? meta.id;
  const docs = meta.selectionDocsOmitLabel
    ? docsLink(meta.docsPath)
    : docsLink(meta.docsPath, docsLabel);
  const extras = (meta.selectionExtras ?? []).filter(Boolean).join(" ");
  return `${meta.label} — ${meta.blurb} ${docsPrefix ? `${docsPrefix} ` : ""}${docs}${extras ? ` ${extras}` : ""}`;
}
