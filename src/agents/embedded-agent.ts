/** Public embedded-agent entrypoint and lifecycle barrel. */
export type {
  EmbeddedAgentCompactResult,
  EmbeddedAgentMeta,
  EmbeddedAgentRunMeta,
  EmbeddedAgentRunResult,
} from "./embedded-agent-runner.js";
/** Re-exported API for src/agents. */
export {
  abortAndDrainEmbeddedAgentRun,
  abortEmbeddedAgentRun,
  compactEmbeddedAgentSession,
  isEmbeddedAgentRunActive,
  isEmbeddedAgentRunStreaming,
  queueEmbeddedAgentMessage,
  queueEmbeddedAgentMessageWithOutcome,
  resolveActiveEmbeddedAgentRunSessionId,
  resolveActiveEmbeddedRunSessionId,
  resolveActiveEmbeddedRunSessionIdBySessionFile,
  resolveEmbeddedSessionLane,
  runEmbeddedAgent,
  waitForEmbeddedAgentRunEnd,
} from "./embedded-agent-runner.js";
