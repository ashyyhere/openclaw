// Cached public accessors for bundled chat channel metadata.
import { buildChatChannelMetaById, type ChatChannelMeta } from "./chat-meta-shared.js";
import { CHAT_CHANNEL_ORDER, type ChatChannelId } from "./ids.js";

let chatChannelMetaCache: Record<ChatChannelId, ChatChannelMeta> | null = null;

function getChatChannelMetaById(): Record<ChatChannelId, ChatChannelMeta> {
  chatChannelMetaCache ??= buildChatChannelMetaById();
  return chatChannelMetaCache;
}

/** Re-exported API for src/channels, starting with Chat Channel Meta. */
export type { ChatChannelMeta };

/** List metadata for configured bundled chat channels in display order. */
export function listChatChannels(): ChatChannelMeta[] {
  const metaById = getChatChannelMetaById();
  return CHAT_CHANNEL_ORDER.map((id) => metaById[id]).filter((meta): meta is ChatChannelMeta =>
    Boolean(meta),
  );
}

/** Return metadata for one canonical chat channel id. */
export function getChatChannelMeta(id: ChatChannelId): ChatChannelMeta {
  return getChatChannelMetaById()[id];
}
