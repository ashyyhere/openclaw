// Narrow session-store helpers for channel hot paths.

import { loadSessionStore as loadSessionStoreImpl } from "../config/sessions/store-load.js";

/**
 * @deprecated Use getSessionEntry/listSessionEntries for reads and
 * patchSessionEntry/upsertSessionEntry for writes. loadSessionStore keeps the
 * legacy mutable whole-store shape and will remain a compatibility escape hatch.
 */
export const loadSessionStore = loadSessionStoreImpl;

/** Re-exported API for src/plugin-sdk, starting with resolve Session Store Entry. */
export { resolveSessionStoreEntry } from "../config/sessions/store-entry.js";
/** Re-exported API for src/plugin-sdk. */
export {
  resolveSessionFilePath,
  resolveSessionTranscriptPathInDir,
  resolveStorePath,
} from "../config/sessions/paths.js";
/** Re-exported API for src/plugin-sdk, starting with resolve And Persist Session File. */
export { resolveAndPersistSessionFile } from "../config/sessions/session-file.js";
/** Re-exported API for src/plugin-sdk, starting with read Latest Assistant Text From Session Transcript. */
export { readLatestAssistantTextFromSessionTranscript } from "../config/sessions/transcript.js";
/** Re-exported API for src/plugin-sdk, starting with resolve Session Key. */
export { resolveSessionKey } from "../config/sessions/session-key.js";
/** Re-exported API for src/plugin-sdk, starting with resolve Group Session Key. */
export { resolveGroupSessionKey } from "../config/sessions/group.js";
/** Re-exported API for src/plugin-sdk, starting with canonicalize Main Session Alias. */
export { canonicalizeMainSessionAlias } from "../config/sessions/main-session.js";
/** Re-exported API for src/plugin-sdk. */
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
/** Re-exported API for src/plugin-sdk. */
export {
  evaluateSessionFreshness,
  resolveChannelResetConfig,
  resolveSessionResetPolicy,
  resolveSessionResetType,
  resolveThreadFlag,
} from "../config/sessions/reset.js";
/** Re-exported API for src/plugin-sdk, starting with Session Entry. */
export type { SessionEntry, SessionScope } from "../config/sessions/types.js";
