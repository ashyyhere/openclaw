/** Public type barrel for channel plugin authors. */
import type { ChannelMessageActionName as ChannelMessageActionNameFromList } from "./message-action-names.js";

/** Re-exported API for src/channels/plugins, starting with CHANNEL MESSAGE ACTION NAMES. */
export { CHANNEL_MESSAGE_ACTION_NAMES } from "./message-action-names.js";
/** Shared type for this surface in src/channels/plugins. */
export type * from "./types.core.js";
/** Shared type for this surface in src/channels/plugins. */
export type * from "./types.adapters.js";
/** Re-exported API for src/channels/plugins, starting with Channel Message Capability. */
export type { ChannelMessageCapability } from "./message-capabilities.js";
/** Re-exported API for src/channels/plugins, starting with Channel Plugin. */
export type { ChannelPlugin } from "./types.plugin.js";

/** Shared type for Channel Message Action Name in src/channels/plugins. */
export type ChannelMessageActionName = ChannelMessageActionNameFromList;
