// Agent runtime facade for memory host code that cannot import core barrels directly.
/** Agent path, parameter, cron, and memory-search config helpers. */
export {
  DEFAULT_AGENT_COMPACTION_RESERVE_TOKENS_FLOOR,
  asToolParamsRecord,
  jsonResult,
  parseAgentSessionKey,
  readNumberParam,
  readStringParam,
  resolveAgentContextLimits,
  resolveAgentDir,
  resolveAgentWorkspaceDir,
  resolveCronStyleNow,
  resolveDefaultAgentId,
  resolveMemorySearchConfig,
  resolveMemorySearchSyncConfig,
  resolveSessionAgentId,
} from "./openclaw-runtime.js";
/** Agent runtime types needed by memory host adapters. */
export type {
  AnyAgentTool,
  ResolvedMemorySearchConfig,
  ResolvedMemorySearchSyncConfig,
} from "./openclaw-runtime.js";
