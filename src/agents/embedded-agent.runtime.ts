/** Runtime-safe embedded-agent exports for lazy harness boundaries. */
export {
  abortAndDrainEmbeddedAgentRun,
  abortEmbeddedAgentRun,
  isEmbeddedAgentRunActive,
  isEmbeddedAgentRunStreaming,
  resolveActiveEmbeddedRunSessionId,
  resolveActiveEmbeddedRunSessionIdBySessionFile,
  runEmbeddedAgent,
  resolveEmbeddedSessionLane,
  waitForEmbeddedAgentRunEnd,
} from "./embedded-agent.js";
