// Narrow session-key helpers for channel hot paths that should not import the
// broader routing SDK barrel.
/** Re-exported API for src/plugin-sdk. */
export {
  resolveAgentIdFromSessionKey,
  type ParsedAgentSessionKey,
} from "../routing/session-key.js";
