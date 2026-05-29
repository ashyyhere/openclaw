/** Public barrel for embedded-agent runner lifecycle APIs. */
export { compactEmbeddedAgentSession } from "./embedded-agent-runner/compact.queued.js";
/** Re-exported API for src/agents, starting with apply Extra Params To Agent. */
export { applyExtraParamsToAgent } from "./embedded-agent-runner/extra-params.js";

/** Re-exported API for src/agents, starting with resolve Embedded Session Lane. */
export { resolveEmbeddedSessionLane } from "./embedded-agent-runner/lanes.js";
/** Re-exported API for src/agents, starting with run Embedded Agent. */
export { runEmbeddedAgent } from "./embedded-agent-runner/run.js";
/** Re-exported API for src/agents. */
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
/** Re-exported API for src/agents, starting with build Embedded Sandbox Info. */
export { buildEmbeddedSandboxInfo } from "./embedded-agent-runner/sandbox-info.js";
/** Re-exported API for src/agents, starting with split Sdk Tools. */
export { splitSdkTools } from "./embedded-agent-runner/tool-split.js";
/** Re-exported API for src/agents. */
export type {
  EmbeddedAgentMeta,
  EmbeddedAgentCompactResult,
  EmbeddedAgentRunMeta,
  EmbeddedAgentRunResult,
} from "./embedded-agent-runner/types.js";
