// Private runtime barrel for the bundled Signal extension.
// Prefer narrower SDK subpaths plus local extension seams over the legacy signal barrel.

/** Re-exported signal plugin public API, starting with Channel Message Action Adapter. */
export type { ChannelMessageActionAdapter } from "openclaw/plugin-sdk/channel-contract";
/** Re-exported signal plugin public API, starting with build Channel Config Schema. */
export { buildChannelConfigSchema, SignalConfigSchema } from "../config-api.js";
/** Re-exported signal plugin public API, starting with PAIRING APPROVED MESSAGE. */
export { PAIRING_APPROVED_MESSAGE } from "openclaw/plugin-sdk/channel-status";
import type { OpenClawConfig as RuntimeOpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
/** Re-exported signal plugin public API, starting with Runtime Open Claw Config. */
export type { RuntimeOpenClawConfig as OpenClawConfig };
/** Re-exported signal plugin public API, starting with Open Claw Plugin Api. */
export type { OpenClawPluginApi, PluginRuntime } from "openclaw/plugin-sdk/core";
/** Re-exported signal plugin public API, starting with Channel Plugin. */
export type { ChannelPlugin } from "openclaw/plugin-sdk/core";
/** Re-exported signal plugin public API. */
export {
  DEFAULT_ACCOUNT_ID,
  applyAccountNameToChannelSection,
  deleteAccountFromConfigSection,
  emptyPluginConfigSchema,
  formatPairingApproveHint,
  getChatChannelMeta,
  migrateBaseNameToDefaultAccount,
  normalizeAccountId,
  setAccountEnabledInConfigSection,
} from "openclaw/plugin-sdk/core";
/** Re-exported signal plugin public API, starting with resolve Channel Media Max Bytes. */
export { resolveChannelMediaMaxBytes } from "openclaw/plugin-sdk/media-runtime";
/** Re-exported signal plugin public API, starting with format Cli Command. */
export { formatCliCommand, formatDocsLink } from "openclaw/plugin-sdk/setup-tools";
/** Re-exported signal plugin public API, starting with chunk Text. */
export { chunkText } from "openclaw/plugin-sdk/reply-runtime";
/** Re-exported signal plugin public API, starting with detect Binary. */
export { detectBinary } from "openclaw/plugin-sdk/setup-tools";
/** Re-exported signal plugin public API. */
export {
  resolveAllowlistProviderRuntimeGroupPolicy,
  resolveDefaultGroupPolicy,
} from "openclaw/plugin-sdk/runtime-group-policy";
/** Re-exported signal plugin public API. */
export {
  buildBaseAccountStatusSnapshot,
  buildBaseChannelStatusSummary,
  collectStatusIssuesFromLastError,
  createDefaultChannelRuntimeState,
} from "openclaw/plugin-sdk/status-helpers";
/** Re-exported signal plugin public API, starting with normalize E164. */
export { normalizeE164 } from "openclaw/plugin-sdk/text-utility-runtime";
/** Re-exported signal plugin public API, starting with looks Like Signal Target Id. */
export { looksLikeSignalTargetId, normalizeSignalMessagingTarget } from "./normalize.js";
/** Re-exported signal plugin public API. */
export {
  listEnabledSignalAccounts,
  listSignalAccountIds,
  resolveDefaultSignalAccountId,
  resolveSignalAccount,
} from "./accounts.js";
/** Re-exported signal plugin public API, starting with monitor Signal Provider. */
export { monitorSignalProvider } from "./monitor.js";
/** Re-exported signal plugin public API, starting with install Signal Cli. */
export { installSignalCli } from "./install-signal-cli.js";
/** Re-exported signal plugin public API, starting with probe Signal. */
export { probeSignal } from "./probe.js";
/** Re-exported signal plugin public API, starting with resolve Signal Reaction Level. */
export { resolveSignalReactionLevel } from "./reaction-level.js";
/** Re-exported signal plugin public API, starting with remove Reaction Signal. */
export { removeReactionSignal, sendReactionSignal } from "./send-reactions.js";
/** Re-exported signal plugin public API, starting with send Message Signal. */
export { sendMessageSignal } from "./send.js";
/** Re-exported signal plugin public API, starting with signal Message Actions. */
export { signalMessageActions } from "./message-actions.js";
/** Re-exported signal plugin public API, starting with Resolved Signal Account. */
export type { ResolvedSignalAccount } from "./accounts.js";
/** Re-exported signal plugin public API, starting with Signal Account Config. */
export type { SignalAccountConfig } from "./account-types.js";
