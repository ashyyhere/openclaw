// extensions/matrix api helpers and runtime behavior.
/** Re-exported matrix plugin public API, starting with matrix Plugin. */
export { matrixPlugin } from "./src/channel.js";
/** Re-exported matrix plugin public API, starting with create Matrix Setup Wizard Proxy. */
export { createMatrixSetupWizardProxy, matrixSetupAdapter } from "./src/setup-core.js";
/** Re-exported matrix plugin public API, starting with matrix Onboarding Adapter. */
export { matrixOnboardingAdapter } from "./src/setup-surface.js";
/** Re-exported matrix plugin public API. */
export {
  findMatrixAccountEntry,
  requiresExplicitMatrixDefaultAccount,
  resolveConfiguredMatrixAccountIds,
  resolveMatrixChannelConfig,
  resolveMatrixDefaultOrOnlyAccountId,
} from "./src/account-selection.js";
/** Re-exported matrix plugin public API. */
export {
  getMatrixScopedEnvVarNames,
  listMatrixEnvAccountIds,
  resolveMatrixEnvAccountToken,
} from "./src/env-vars.js";
/** Re-exported matrix plugin public API. */
export {
  hashMatrixAccessToken,
  resolveMatrixAccountStorageRoot,
  resolveMatrixCredentialsDir,
  resolveMatrixCredentialsFilename,
  resolveMatrixCredentialsPath,
  resolveMatrixHomeserverKey,
  resolveMatrixLegacyFlatStoragePaths,
  resolveMatrixLegacyFlatStoreRoot,
  sanitizeMatrixPathSegment,
} from "./src/storage-paths.js";
/** Re-exported matrix plugin public API. */
export {
  createMatrixThreadBindingManager,
  getMatrixThreadBindingManager,
  resetMatrixThreadBindingsForTests,
} from "./src/matrix/thread-bindings.js";
/** Re-exported matrix plugin public API. */
export {
  setMatrixThreadBindingIdleTimeoutBySessionKey,
  setMatrixThreadBindingMaxAgeBySessionKey,
} from "./src/matrix/thread-bindings-shared.js";
/** Re-exported matrix plugin public API, starting with matrix Onboarding Adapter. */
export { matrixOnboardingAdapter as matrixSetupWizard } from "./src/onboarding.js";

/** Public matrix plugin constant for matrix Session Binding Adapter Channels behavior. */
export const matrixSessionBindingAdapterChannels = ["matrix"] as const;
