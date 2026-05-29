// Canonical shared prelude for channel-oriented plugin SDK surfaces.
// Keep `core` and channel-specific SDK entrypoints derived from this module
// so bundled channel entrypoints do not drift across overlapping exports.
/** Re-exported API for src/plugin-sdk, starting with Channel Plugin. */
export type { ChannelPlugin } from "../channels/plugins/types.plugin.js";
/** Re-exported API for src/plugin-sdk, starting with Channel Message Action Context. */
export type { ChannelMessageActionContext } from "../channels/plugins/types.public.js";
/** Re-exported API for src/plugin-sdk, starting with Plugin Runtime. */
export type { PluginRuntime } from "../plugins/runtime/types.js";
/** Re-exported API for src/plugin-sdk, starting with Open Claw Plugin Api. */
export type { OpenClawPluginApi } from "../plugins/types.js";

/** Re-exported API for src/plugin-sdk, starting with empty Plugin Config Schema. */
export { emptyPluginConfigSchema } from "../plugins/config-schema.js";

/** Re-exported API for src/plugin-sdk, starting with DEFAULT ACCOUNT ID. */
export { DEFAULT_ACCOUNT_ID, normalizeAccountId } from "../routing/session-key.js";

/** Re-exported API for src/plugin-sdk. */
export {
  applyAccountNameToChannelSection,
  migrateBaseNameToDefaultAccount,
} from "../channels/plugins/setup-helpers.js";
/** Re-exported API for src/plugin-sdk, starting with build Channel Config Schema. */
export { buildChannelConfigSchema } from "../channels/plugins/config-schema.js";
/** Re-exported API for src/plugin-sdk. */
export {
  clearAccountEntryFields,
  deleteAccountFromConfigSection,
  setAccountEnabledInConfigSection,
} from "../channels/plugins/config-helpers.js";
/** Re-exported API for src/plugin-sdk, starting with format Pairing Approve Hint. */
export { formatPairingApproveHint } from "../channels/plugins/helpers.js";
/** Re-exported API for src/plugin-sdk, starting with PAIRING APPROVED MESSAGE. */
export { PAIRING_APPROVED_MESSAGE } from "../channels/plugins/pairing-message.js";

/** Re-exported API for src/plugin-sdk, starting with get Chat Channel Meta. */
export { getChatChannelMeta } from "../channels/chat-meta.js";
