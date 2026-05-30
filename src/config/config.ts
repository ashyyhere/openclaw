// Public config barrel for IO, mutation, validation, paths, and runtime snapshots.
/** Config IO, runtime snapshot, recovery, cache, and write notification helpers. */
export {
  clearConfigCache,
  ConfigRuntimeRefreshError,
  clearRuntimeConfigSnapshot,
  registerConfigWriteListener,
  createConfigIO,
  getRuntimeConfig,
  getRuntimeConfigSnapshotMetadata,
  getRuntimeConfigSnapshot,
  getRuntimeConfigSourceSnapshot,
  projectConfigOntoRuntimeSourceSnapshot,
  loadConfig,
  readBestEffortConfig,
  readSourceConfigBestEffort,
  parseConfigJson5,
  promoteConfigSnapshotToLastKnownGood,
  readConfigFileSnapshot,
  readConfigFileSnapshotWithPluginMetadata,
  readConfigFileSnapshotForWrite,
  readSourceConfigSnapshot,
  readSourceConfigSnapshotForWrite,
  recoverConfigFromLastKnownGood,
  recoverConfigFromJsonRootSuffix,
  resetConfigRuntimeState,
  resolveConfigSnapshotHash,
  resolveRuntimeConfigCacheKey,
  selectApplicableRuntimeConfig,
  setRuntimeConfigSnapshotRefreshHandler,
  setRuntimeConfigSnapshot,
  writeConfigFile,
} from "./io.js";
/** Runtime config hashing and post-write follow-up resolution. */
export {
  hashRuntimeConfigValue,
  resolveConfigWriteAfterWrite,
  resolveConfigWriteFollowUp,
} from "./runtime-snapshot.js";
/** Runtime config post-write follow-up types. */
export type {
  ConfigWriteAfterWrite,
  ConfigWriteFollowUp,
  RuntimeConfigSnapshotMetadata,
} from "./runtime-snapshot.js";
/** Config snapshot and write-result types from the IO layer. */
export type {
  ConfigSnapshotReadOptions,
  ConfigWriteNotification,
  ConfigWriteResult,
  ReadConfigFileSnapshotWithPluginMetadataResult,
} from "./io.js";
/** Atomic config mutation helpers and conflict error class. */
export {
  ConfigMutationConflictError,
  mutateConfigFile,
  mutateConfigFileWithRetry,
  replaceConfigFile,
  transformConfigFile,
  transformConfigFileWithRetry,
} from "./mutate.js";
/** Config mutation context, commit, replace, and transform result types. */
export type {
  ConfigMutationCommit,
  ConfigMutationCommitParams,
  ConfigMutationCommitResult,
  ConfigMutationContext,
  ConfigMutationIO,
  ConfigReplaceResult,
  ConfigMutationResult,
  ConfigTransformResult,
  TransformConfigFileParams,
  TransformConfigFileWithRetryParams,
} from "./mutate.js";
/** Nix-mode write guard for config mutation entrypoints. */
export {
  assertConfigWriteAllowedInCurrentMode,
  NixModeConfigMutationError,
} from "./nix-mode-write-guard.js";
export * from "./paths.js";
export * from "./recovery-policy.js";
export * from "./runtime-overrides.js";
export * from "./types.js";
/** Config validation helpers for raw and plugin-augmented schemas. */
export {
  validateConfigObject,
  validateConfigObjectRaw,
  validateConfigObjectRawWithPlugins,
  validateConfigObjectWithPlugins,
} from "./validation.js";
