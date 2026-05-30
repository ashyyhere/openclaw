// Thin runtime facade for isolated cron agents; keeps the cron runner on stable
// agent/config helpers without importing broad command modules.
/** Resolves agent ids, directories, and config records for isolated cron runs. */
export {
  resolveAgentConfig,
  resolveAgentDir,
  resolveAgentWorkspaceDir,
  resolveDefaultAgentId,
  type ResolvedAgentConfig,
} from "../../agents/agent-scope-config.js";
/** Formats the current timestamp using cron-friendly semantics for prompts/logs. */
export { resolveCronStyleNow } from "../../agents/current-time.js";
/** Default context budget used when a cron task omits an explicit token limit. */
export { DEFAULT_CONTEXT_TOKENS } from "../../agents/defaults.js";
/** Identifies providers that execute through an external CLI session. */
export { isCliProvider } from "../../agents/model-selection-cli.js";
/** Chooses the model thinking level when cron config leaves it unset. */
export { resolveThinkingDefault } from "../../agents/model-thinking-default.js";
/** Resolves the per-agent execution timeout for isolated cron invocations. */
export { resolveAgentTimeoutMs } from "../../agents/timeout.js";
/** Computes usage totals from session accounting fields for cron closeout. */
export { deriveSessionTotalTokens, hasNonzeroUsage } from "../../agents/usage.js";
/** Creates the workspace and default identity path expected by cron agents. */
export { DEFAULT_IDENTITY_FILENAME, ensureAgentWorkspace } from "../../agents/workspace.js";
/** Normalizes and validates model thinking levels before a cron run starts. */
export {
  isThinkingLevelSupported,
  normalizeThinkLevel,
  resolveSupportedThinkingLevel,
} from "../../auto-reply/thinking.js";
/** Locates the transcript file for an isolated cron agent session. */
export { resolveSessionTranscriptPath } from "../../config/sessions/paths.js";
/** Persists the runtime model chosen for the cron-created session. */
export { setSessionRuntimeModel } from "../../config/sessions/types.js";
/** Warning logger used by cron runtime code without pulling CLI logging state. */
export { logWarn } from "../../logger.js";
/** Canonicalizes agent ids before directory and session-key lookups. */
export { normalizeAgentId } from "../../routing/session-key.js";
/** Marks hook-originated sessions so external content provenance is preserved. */
export {
  isExternalHookSession,
  mapHookExternalContentSource,
  resolveHookExternalContentSource,
} from "../../security/external-content-source.js";
