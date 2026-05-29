// config config helpers and runtime behavior.
/** Re-exported API for src/config. */
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
/** Re-exported API for src/config. */
export {
  hashRuntimeConfigValue,
  resolveConfigWriteAfterWrite,
  resolveConfigWriteFollowUp,
} from "./runtime-snapshot.js";
/** Re-exported API for src/config. */
export type {
  ConfigWriteAfterWrite,
  ConfigWriteFollowUp,
  RuntimeConfigSnapshotMetadata,
} from "./runtime-snapshot.js";
/** Re-exported API for src/config. */
export type {
  ConfigSnapshotReadOptions,
  ConfigWriteNotification,
  ConfigWriteResult,
  ReadConfigFileSnapshotWithPluginMetadataResult,
} from "./io.js";
/** Re-exported API for src/config. */
export {
  ConfigMutationConflictError,
  mutateConfigFile,
  mutateConfigFileWithRetry,
  replaceConfigFile,
  transformConfigFile,
  transformConfigFileWithRetry,
} from "./mutate.js";
/** Re-exported API for src/config. */
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
/** Re-exported API for src/config. */
export {
  assertConfigWriteAllowedInCurrentMode,
  NixModeConfigMutationError,
} from "./nix-mode-write-guard.js";
export * from "./paths.js";
export * from "./recovery-policy.js";
export * from "./runtime-overrides.js";
export * from "./types.js";
/** Re-exported API for src/config. */
export {
  validateConfigObject,
  validateConfigObjectRaw,
  validateConfigObjectRawWithPlugins,
  validateConfigObjectWithPlugins,
} from "./validation.js";
