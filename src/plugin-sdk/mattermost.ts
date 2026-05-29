/**
 * @deprecated Compatibility facade for older third-party channel packages that
 * imported the previous Mattermost-shaped helper bundle. New plugins should
 * import the generic SDK subpaths directly.
 */
export { resolveControlCommandGate } from "./command-auth.js";
/** Re-exported API for src/plugin-sdk, starting with format Pairing Approve Hint. */
export { formatPairingApproveHint } from "./channel-plugin-common.js";
/** Re-exported API for src/plugin-sdk, starting with History Entry. */
export type { HistoryEntry } from "./reply-history.js";
/** Re-exported API for src/plugin-sdk. */
export {
  createChannelHistoryWindow,
  buildPendingHistoryContextFromMap,
  clearHistoryEntriesIfEnabled,
  recordPendingHistoryEntryIfEnabled,
} from "./reply-history.js";
