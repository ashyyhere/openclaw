// secrets channel secret collector runtime helpers and runtime behavior.
/** Re-exported API for src/secrets. */
export {
  collectConditionalChannelFieldAssignments,
  collectNestedChannelFieldAssignments,
  collectSimpleChannelFieldAssignments,
  getChannelRecord,
  getChannelSurface,
  hasConfiguredSecretInputValue,
  isBaseFieldActiveForChannelSurface,
  normalizeSecretStringValue,
  resolveChannelAccountSurface,
} from "./channel-secret-basic-runtime.js";
/** Re-exported API for src/secrets. */
export type {
  ChannelAccountEntry,
  ChannelAccountPredicate,
  ChannelAccountSurface,
} from "./channel-secret-basic-runtime.js";
/** Re-exported API for src/secrets, starting with collect Nested Channel Tts Assignments. */
export { collectNestedChannelTtsAssignments } from "./channel-secret-tts-runtime.js";
