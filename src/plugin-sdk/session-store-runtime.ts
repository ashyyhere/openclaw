// Narrow session-store helpers for channel hot paths.

import { loadSessionStore as loadSessionStoreImpl } from "../config/sessions/store-load.js";

/**
 * @deprecated Use getSessionEntry/listSessionEntries for reads and
 * patchSessionEntry/upsertSessionEntry for writes. loadSessionStore keeps the
 * legacy mutable whole-store shape and will remain a compatibility escape hatch.
 */
export const loadSessionStore = loadSessionStoreImpl;

/** Resolves a session-store entry by key or alias. */
export { resolveSessionStoreEntry } from "../config/sessions/store-entry.js";
/** Session store and transcript path helpers for plugin callers. */
export {
  resolveSessionFilePath,
  resolveSessionTranscriptPathInDir,
  resolveStorePath,
} from "../config/sessions/paths.js";
/** Resolves and persists the transcript file path for a session entry. */
export { resolveAndPersistSessionFile } from "../config/sessions/session-file.js";
/** Reads the latest assistant text from a session transcript. */
export { readLatestAssistantTextFromSessionTranscript } from "../config/sessions/transcript.js";
/** Resolves direct session keys from channel/session context. */
export { resolveSessionKey } from "../config/sessions/session-key.js";
/** Resolves group/channel session keys. */
export { resolveGroupSessionKey } from "../config/sessions/group.js";
/** Canonicalizes main-session aliases before store lookup. */
export { canonicalizeMainSessionAlias } from "../config/sessions/main-session.js";
/** Session store read/write/cache helpers exposed to plugin runtimes. */
export {
  clearSessionStoreCacheForTest,
  getSessionEntry,
  listSessionEntries,
  patchSessionEntry,
  readSessionUpdatedAt,
  recordSessionMetaFromInbound,
  saveSessionStore,
  updateLastRoute,
  updateSessionStore,
  updateSessionStoreEntry,
  upsertSessionEntry,
} from "../config/sessions/store.js";
/** Session freshness and reset policy helpers exposed to plugin runtimes. */
export {
  evaluateSessionFreshness,
  resolveChannelResetConfig,
  resolveSessionResetPolicy,
  resolveSessionResetType,
  resolveThreadFlag,
} from "../config/sessions/reset.js";
/** Public session entry and scope types for plugin store helpers. */
export type { SessionEntry, SessionScope } from "../config/sessions/types.js";
