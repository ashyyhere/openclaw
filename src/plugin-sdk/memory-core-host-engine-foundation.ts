/** Memory host SDK barrel for engine foundation helpers. */
export * from "../../packages/memory-host-sdk/src/engine-foundation.js";
/** Agent scope and directory helpers needed by memory host engines. */
export {
  resolveAgentContextLimits,
  resolveAgentDir,
  resolveAgentWorkspaceDir,
  resolveDefaultAgentId,
  resolveSessionAgentId,
} from "../agents/agent-scope.js";
/** Memory search configuration resolvers shared with host engines. */
export {
  resolveMemorySearchConfig,
  resolveMemorySearchSyncConfig,
  type ResolvedMemorySearchConfig,
  type ResolvedMemorySearchSyncConfig,
} from "../agents/memory-search.js";
/** Duration parser used by memory engine config and CLI options. */
export { parseDurationMs } from "../cli/parse-duration.js";
/** Loads OpenClaw config for memory host engine startup. */
export { loadConfig } from "../config/config.js";
/** OpenClaw config shape exposed to memory host engines. */
export type { OpenClawConfig } from "../config/config.js";
/** Resolves the process state directory for memory engine storage. */
export { resolveStateDir } from "../config/paths.js";
/** Resolves per-agent transcript directories for memory indexing. */
export { resolveSessionTranscriptsDirForAgent } from "../config/sessions/paths.js";
/** Secret-input helpers used by memory provider config resolution. */
export {
  hasConfiguredSecretInput,
  normalizeResolvedSecretInputString,
  type SecretInput,
} from "../config/types.secrets.js";
/** Session send policy config type consumed by memory host integrations. */
export type { SessionSendPolicyConfig } from "../config/types.base.js";
/** Memory backend and QMD config contracts exposed to host engines. */
export type {
  MemoryBackend,
  MemoryCitationsMode,
  MemoryQmdConfig,
  MemoryQmdIndexPath,
  MemoryQmdMcporterConfig,
  MemoryQmdSearchMode,
} from "../config/types.memory.js";
/** Memory search tool config used by host engine setup. */
export type { MemorySearchConfig } from "../config/types.tools.js";
/** Root-bound filesystem helper for safe memory-engine file access. */
export { root } from "../infra/fs-safe.js";
/** Subsystem logger factory for memory host engine diagnostics. */
export { createSubsystemLogger } from "../logging/subsystem.js";
/** MIME detector for memory indexing inputs. */
export { detectMime } from "../media/mime.js";
/** Transcript update subscription used by memory indexers. */
export { onSessionTranscriptUpdate } from "../sessions/transcript-events.js";
/** Process-global singleton helper for host engine registries. */
export { resolveGlobalSingleton } from "../shared/global-singleton.js";
/** Bounded concurrency runner for memory indexing jobs. */
export { runTasksWithConcurrency } from "../utils/run-with-concurrency.js";
/** Shell argument splitter for memory backend command options. */
export { splitShellArgs } from "../utils/shell-argv.js";
/** Path/display string helpers reused by memory host engines. */
export {
  resolveUserPath,
  shortenHomeInString,
  shortenHomePath,
  truncateUtf16Safe,
} from "../utils.js";
