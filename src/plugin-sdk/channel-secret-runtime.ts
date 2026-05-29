/**
 * @deprecated Public SDK subpath has no bundled extension production imports.
 * Prefer focused channel secret subpaths such as channel-secret-basic-runtime
 * and channel-secret-tts-runtime.
 */

export {
  collectConditionalChannelFieldAssignments,
  collectNestedChannelFieldAssignments,
  collectNestedChannelTtsAssignments,
  collectSimpleChannelFieldAssignments,
  getChannelRecord,
  getChannelSurface,
  hasConfiguredSecretInputValue,
  isBaseFieldActiveForChannelSurface,
  normalizeSecretStringValue,
  resolveChannelAccountSurface,
} from "../secrets/channel-secret-collector-runtime.js";
/** Re-exported API for src/plugin-sdk. */
export type {
  ChannelAccountEntry,
  ChannelAccountPredicate,
  ChannelAccountSurface,
} from "../secrets/channel-secret-collector-runtime.js";
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
