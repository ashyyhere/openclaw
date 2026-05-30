export const AGENT_RUN_ABORTED_STOP_REASON = "aborted" as const;
/** Canonical error text used when an agent run is cancelled by the runtime. */
export const AGENT_RUN_ABORTED_ERROR = "agent run aborted" as const;

/** Return whether a stop reason represents an aborted agent run. */
export function isAbortedAgentStopReason(
  value: unknown,
): value is typeof AGENT_RUN_ABORTED_STOP_REASON {
  return value === AGENT_RUN_ABORTED_STOP_REASON;
}
