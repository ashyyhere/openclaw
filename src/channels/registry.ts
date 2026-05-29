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
/** Bundled chat-channel metadata lookup re-exported for core callers. */
export { getChatChannelMeta } from "./chat-meta.js";
/** Stable bundled channel ordering re-exported for display surfaces. */
export { CHAT_CHANNEL_ORDER } from "./ids.js";
/** Bundled chat-channel id union re-exported for channel-aware code. */
export type { ChatChannelId } from "./ids.js";
/** Bundled channel id normalizer re-exported as part of the registry facade. */
export { normalizeChatChannelId };

// Channel docking: prefer this helper in shared code. Importing from
// `src/channels/plugins/*` can eagerly load channel implementations.
/** Normalize known bundled channel ids without loading channel implementations. */
export function normalizeChannelId(raw?: string | null): ChatChannelId | null {
  return normalizeChatChannelId(raw);
}

// Normalizes registered channel plugins (bundled or external).
//
// Keep this light: we do not import channel plugins here (those are "heavy" and can pull in
// monitors, web login, etc). The plugin registry must be initialized first.
/** Normalize bundled or registered plugin channel ids through the lightweight registry. */
export function normalizeAnyChannelId(raw?: string | null): ChannelId | null {
  const key = normalizeOptionalLowercaseString(raw);
  if (!key) {
    return null;
  }
  return findRegisteredChannelPluginEntry(key)?.plugin.id ?? null;
}

/** List registered channel plugin ids without importing their runtime modules. */
export function listRegisteredChannelPluginIds(): ChannelId[] {
  return listRegisteredChannelPluginEntries().flatMap((entry) => {
    const id = normalizeOptionalString(entry.plugin.id);
    return id ? [id as ChannelId] : [];
  });
}

/** Read display metadata for a registered channel plugin by id. */
export function getRegisteredChannelPluginMeta(
  id: string,
): Pick<ChannelMeta, "aliases" | "markdownCapable"> | null {
  return findRegisteredChannelPluginEntryById(id)?.plugin.meta ?? null;
}

/** Format a one-line channel primer for setup and help output. */
export function formatChannelPrimerLine(meta: ChannelMeta): string {
  return `${meta.label}: ${meta.blurb}`;
}

/** Format a channel selection/help line with docs and optional extra text. */
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
