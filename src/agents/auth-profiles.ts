/** Public auth-profile barrel for agent credential stores and ordering. */
export { CLAUDE_CLI_PROFILE_ID, CODEX_CLI_PROFILE_ID } from "./auth-profiles/constants.js";
/** Re-exported API for src/agents. */
export type {
  AuthCredentialReasonCode,
  TokenExpiryState,
} from "./auth-profiles/credential-state.js";
/** Re-exported API for src/agents, starting with Auth Profile Eligibility Reason Code. */
export type { AuthProfileEligibilityReasonCode } from "./auth-profiles/order.js";
/** Re-exported API for src/agents, starting with resolve Auth Profile Display Label. */
export { resolveAuthProfileDisplayLabel } from "./auth-profiles/display.js";
/** Re-exported API for src/agents, starting with format Auth Doctor Hint. */
export { formatAuthDoctorHint } from "./auth-profiles/doctor.js";
/** Re-exported API for src/agents. */
export {
  externalCliDiscoveryExisting,
  externalCliDiscoveryForConfigStatus,
  externalCliDiscoveryForProviderAuth,
  externalCliDiscoveryForProviders,
  externalCliDiscoveryNone,
  externalCliDiscoveryScoped,
  type ExternalCliAuthDiscovery,
} from "./auth-profiles/external-cli-discovery.js";
/** Re-exported API for src/agents. */
export {
  refreshOAuthCredentialForRuntime,
  resolveApiKeyForProfile,
} from "./auth-profiles/oauth.js";
/** Re-exported API for src/agents. */
export {
  isConfiguredAwsSdkAuthProfileForProvider,
  resolveAuthProfileEligibility,
  resolveAuthProfileOrder,
} from "./auth-profiles/order.js";
/** Re-exported API for src/agents. */
export {
  resolveAuthStatePathForDisplay,
  resolveAuthStorePathForDisplay,
} from "./auth-profiles/paths.js";
/** Re-exported API for src/agents. */
export {
  dedupeProfileIds,
  listProfilesForProvider,
  markAuthProfileSuccess,
  removeProviderAuthProfilesWithLock,
  setAuthProfileOrder,
  upsertAuthProfile,
  upsertAuthProfileWithLock,
} from "./auth-profiles/profiles.js";
/** Re-exported API for src/agents. */
export {
  repairOAuthProfileIdMismatch,
  suggestOAuthProfileIdForLegacyDefault,
} from "./auth-profiles/repair.js";
/** Re-exported API for src/agents. */
export {
  buildPortableAuthProfileSecretsStoreForAgentCopy,
  isAuthProfileCredentialPortableForAgentCopy,
  resolveAuthProfilePortability,
  type AuthProfilePortability,
  type AuthProfilePortabilityReason,
} from "./auth-profiles/portability.js";
/** Re-exported API for src/agents. */
export {
  clearRuntimeAuthProfileStoreSnapshots,
  ensureAuthProfileStore,
  ensureAuthProfileStoreWithoutExternalProfiles,
  getRuntimeAuthProfileStoreSnapshot,
  hasAnyAuthProfileStoreSource,
  loadAuthProfileStoreForSecretsRuntime,
  loadAuthProfileStoreWithoutExternalProfiles,
  loadAuthProfileStoreForRuntime,
  replaceRuntimeAuthProfileStoreSnapshots,
  loadAuthProfileStore,
  saveAuthProfileStore,
  findPersistedAuthProfileCredential,
  resolvePersistedAuthProfileOwnerAgentDir,
} from "./auth-profiles/store.js";
/** Re-exported API for src/agents. */
export type {
  ApiKeyCredential,
  AuthProfileBlockedReason,
  AuthProfileBlockedSource,
  AuthProfileCredential,
  AuthProfileFailureReason,
  AuthProfileIdRepairResult,
  AuthProfileState,
  AuthProfileStore,
  OAuthCredential,
  ProfileUsageStats,
  TokenCredential,
} from "./auth-profiles/types.js";
/** Re-exported API for src/agents. */
export {
  calculateAuthProfileCooldownMs,
  clearAuthProfileCooldown,
  clearExpiredCooldowns,
  getSoonestCooldownExpiry,
  isProfileInCooldown,
  markAuthProfileCooldown,
  markAuthProfileBlockedUntil,
  markAuthProfileFailure,
  resolveProfilesUnavailableReason,
  resolveProfileUnusableUntilForDisplay,
  setAuthProfileFailureHook,
} from "./auth-profiles/usage.js";
