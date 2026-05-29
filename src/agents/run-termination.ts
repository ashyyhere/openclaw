/** Shared aborted-run stop reason constants and guards. */
export const AGENT_RUN_ABORTED_STOP_REASON = "aborted" as const;
/** Reused constant for AGENT RUN ABORTED ERROR behavior in src/agents. */
export const AGENT_RUN_ABORTED_ERROR = "agent run aborted" as const;

/** Return whether a stop reason represents an aborted agent run. */
export function isAbortedAgentStopReason(
  value: unknown,
): value is typeof AGENT_RUN_ABORTED_STOP_REASON {
  return value === AGENT_RUN_ABORTED_STOP_REASON;
}
