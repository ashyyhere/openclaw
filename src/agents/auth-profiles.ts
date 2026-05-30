/** Public auth-profile barrel for agent credential stores and ordering. */
export { CLAUDE_CLI_PROFILE_ID, CODEX_CLI_PROFILE_ID } from "./auth-profiles/constants.js";
/** Auth credential state and token expiry reason codes. */
export type {
  AuthCredentialReasonCode,
  TokenExpiryState,
} from "./auth-profiles/credential-state.js";
/** Reason code explaining auth profile ordering eligibility. */
export type { AuthProfileEligibilityReasonCode } from "./auth-profiles/order.js";
/** Resolves user-facing labels for auth profiles. */
export { resolveAuthProfileDisplayLabel } from "./auth-profiles/display.js";
/** Formats doctor hints for auth profile repair/setup guidance. */
export { formatAuthDoctorHint } from "./auth-profiles/doctor.js";
/** External CLI auth discovery modes used by provider auth setup. */
export {
  externalCliDiscoveryExisting,
  externalCliDiscoveryForConfigStatus,
  externalCliDiscoveryForProviderAuth,
  externalCliDiscoveryForProviders,
  externalCliDiscoveryNone,
  externalCliDiscoveryScoped,
  type ExternalCliAuthDiscovery,
} from "./auth-profiles/external-cli-discovery.js";
/** OAuth refresh and API-key resolution helpers for runtime auth. */
export {
  refreshOAuthCredentialForRuntime,
  resolveApiKeyForProfile,
} from "./auth-profiles/oauth.js";
/** Auth profile eligibility and provider ordering helpers. */
export {
  isConfiguredAwsSdkAuthProfileForProvider,
  resolveAuthProfileEligibility,
  resolveAuthProfileOrder,
} from "./auth-profiles/order.js";
/** Display-safe auth profile path resolvers. */
export {
  resolveAuthStatePathForDisplay,
  resolveAuthStorePathForDisplay,
} from "./auth-profiles/paths.js";
/** Auth profile list, mutation, ordering, and removal helpers. */
export {
  dedupeProfileIds,
  listProfilesForProvider,
  markAuthProfileSuccess,
  removeProviderAuthProfilesWithLock,
  setAuthProfileOrder,
  upsertAuthProfile,
  upsertAuthProfileWithLock,
} from "./auth-profiles/profiles.js";
/** Auth profile id repair helpers for legacy OAuth defaults. */
export {
  repairOAuthProfileIdMismatch,
  suggestOAuthProfileIdForLegacyDefault,
} from "./auth-profiles/repair.js";
/** Auth profile portability helpers for copying agent credentials. */
export {
  buildPortableAuthProfileSecretsStoreForAgentCopy,
  isAuthProfileCredentialPortableForAgentCopy,
  resolveAuthProfilePortability,
  type AuthProfilePortability,
  type AuthProfilePortabilityReason,
} from "./auth-profiles/portability.js";
/** Auth profile store loading, saving, snapshot, and persisted credential helpers. */
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
/** Core auth profile credential, state, store, and failure types. */
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
/** Auth profile cooldown, failure, block, and usability helpers. */
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
