// Channel id type aliases for plugin-facing APIs.
import type { ChatChannelId } from "../ids.js";

/** Shared type for Channel Id in src/channels/plugins. */
export type ChannelId = ChatChannelId | (string & {});
