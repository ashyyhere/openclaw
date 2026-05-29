// packages/memory-host-sdk/src/host openclaw runtime config helpers and runtime behavior.
/** Re-exported public API for packages/memory-host-sdk. */
export {
  getRuntimeConfig,
  hasConfiguredSecretInput,
  loadConfig,
  normalizeResolvedSecretInputString,
  parseDurationMs,
  parseNonNegativeByteSize,
  resolveSessionTranscriptsDirForAgent,
  resolveStateDir,
} from "./openclaw-runtime.js";
/** Re-exported public API for packages/memory-host-sdk. */
export type {
  MemoryBackend,
  MemoryCitationsMode,
  MemoryQmdConfig,
  MemoryQmdIndexPath,
  MemoryQmdMcporterConfig,
  MemoryQmdSearchMode,
  MemorySearchConfig,
  OpenClawConfig,
  SecretInput,
  SessionSendPolicyConfig,
} from "./openclaw-runtime.js";
