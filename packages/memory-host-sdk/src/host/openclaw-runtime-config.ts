// Config facade for memory host consumers that need canonical OpenClaw parsing.
/** Config loading, secret normalization, duration, byte-size, and state-dir helpers. */
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
/** Public config shape types used by memory host resolution. */
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
