// Narrow shared secret-contract exports for non-TTS channel/plugin secret surfaces.

/** Re-exported API for src/plugin-sdk. */
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
} from "../secrets/channel-secret-basic-runtime.js";
/** Re-exported API for src/plugin-sdk. */
export type {
  ChannelAccountEntry,
  ChannelAccountPredicate,
  ChannelAccountSurface,
} from "../secrets/channel-secret-basic-runtime.js";
/** Re-exported API for src/plugin-sdk. */
export {
  collectSecretInputAssignment,
  hasOwnProperty,
  isEnabledFlag,
  pushAssignment,
  pushInactiveSurfaceWarning,
  pushWarning,
} from "../secrets/runtime-shared.js";
/** Re-exported API for src/plugin-sdk, starting with Resolver Context. */
export type { ResolverContext, SecretDefaults } from "../secrets/runtime-shared.js";
/** Re-exported API for src/plugin-sdk, starting with is Record. */
export { isRecord } from "../secrets/shared.js";
/** Re-exported API for src/plugin-sdk, starting with Secret Target Registry Entry. */
export type { SecretTargetRegistryEntry } from "../secrets/target-registry-types.js";
