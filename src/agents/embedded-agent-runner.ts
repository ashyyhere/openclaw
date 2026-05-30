/** Public barrel for embedded-agent runner lifecycle APIs. */
export { compactEmbeddedAgentSession } from "./embedded-agent-runner/compact.queued.js";
/** Applies provider/runtime extra params to embedded agent construction. */
export { applyExtraParamsToAgent } from "./embedded-agent-runner/extra-params.js";

/** Resolves the embedded session lane used for an agent run. */
export { resolveEmbeddedSessionLane } from "./embedded-agent-runner/lanes.js";
/** Runs an embedded agent request. */
export { runEmbeddedAgent } from "./embedded-agent-runner/run.js";
/** Embedded agent run lifecycle helpers for streaming, aborting, and queueing messages. */
export {
  abortAndDrainEmbeddedAgentRun,
  abortEmbeddedAgentRun,
  isEmbeddedAgentRunActive,
  isEmbeddedAgentRunStreaming,
  queueEmbeddedAgentMessage,
  queueEmbeddedAgentMessageWithOutcome,
  resolveActiveEmbeddedRunSessionId,
  resolveActiveEmbeddedRunSessionId as resolveActiveEmbeddedAgentRunSessionId,
  resolveActiveEmbeddedRunSessionIdBySessionFile,
  waitForEmbeddedAgentRunEnd,
} from "./embedded-agent-runner/runs.js";
/** Builds sandbox metadata for embedded agent status surfaces. */
export { buildEmbeddedSandboxInfo } from "./embedded-agent-runner/sandbox-info.js";
/** Splits SDK tool definitions into supported embedded runtime groups. */
export { splitSdkTools } from "./embedded-agent-runner/tool-split.js";
/** Embedded agent metadata and result types. */
export type {
  EmbeddedAgentMeta,
  EmbeddedAgentCompactResult,
  EmbeddedAgentRunMeta,
  EmbeddedAgentRunResult,
} from "./embedded-agent-runner/types.js";
