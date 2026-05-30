// Canonical shared prelude for channel-oriented plugin SDK surfaces.
// Keep `core` and channel-specific SDK entrypoints derived from this module
// so bundled channel entrypoints do not drift across overlapping exports.
/** Channel plugin registration contract. */
export type { ChannelPlugin } from "../channels/plugins/types.plugin.js";
/** Runtime context passed to channel message actions. */
export type { ChannelMessageActionContext } from "../channels/plugins/types.public.js";
/** Trusted plugin runtime surface available to channel plugins. */
export type { PluginRuntime } from "../plugins/runtime/types.js";
/** Top-level OpenClaw plugin API contract. */
export type { OpenClawPluginApi } from "../plugins/types.js";

/** Empty schema helper for plugins without custom config fields. */
export { emptyPluginConfigSchema } from "../plugins/config-schema.js";

/** Account id helpers shared by channel config and setup code. */
export { DEFAULT_ACCOUNT_ID, normalizeAccountId } from "../routing/session-key.js";

/** Account setup migration and display-name helpers. */
export {
  applyAccountNameToChannelSection,
  migrateBaseNameToDefaultAccount,
} from "../channels/plugins/setup-helpers.js";
/** Builds the standard config schema for account-based channel plugins. */
export { buildChannelConfigSchema } from "../channels/plugins/config-schema.js";
/** Helpers for mutating account entries in channel config sections. */
export {
  clearAccountEntryFields,
  deleteAccountFromConfigSection,
  setAccountEnabledInConfigSection,
} from "../channels/plugins/config-helpers.js";
/** Formats pairing approval hints for channel setup/status responses. */
export { formatPairingApproveHint } from "../channels/plugins/helpers.js";
/** Standard pairing approval confirmation text. */
export { PAIRING_APPROVED_MESSAGE } from "../channels/plugins/pairing-message.js";

/** Reads chat channel display metadata by channel id. */
export { getChatChannelMeta } from "../channels/chat-meta.js";
