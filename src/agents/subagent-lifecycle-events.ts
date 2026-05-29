/** Constants and payload helpers for subagent lifecycle events. */
export const SUBAGENT_TARGET_KIND_SUBAGENT = "subagent" as const;

/** Reused constant for SUBAGENT ENDED REASON COMPLETE behavior in src/agents. */
export const SUBAGENT_ENDED_REASON_COMPLETE = "subagent-complete" as const;
/** Reused constant for SUBAGENT ENDED REASON ERROR behavior in src/agents. */
export const SUBAGENT_ENDED_REASON_ERROR = "subagent-error" as const;
/** Reused constant for SUBAGENT ENDED REASON KILLED behavior in src/agents. */
export const SUBAGENT_ENDED_REASON_KILLED = "subagent-killed" as const;

/** Shared type for Subagent Lifecycle Ended Reason in src/agents. */
export type SubagentLifecycleEndedReason =
  | typeof SUBAGENT_ENDED_REASON_COMPLETE
  | typeof SUBAGENT_ENDED_REASON_ERROR
  | typeof SUBAGENT_ENDED_REASON_KILLED;

/** Reused constant for SUBAGENT ENDED OUTCOME OK behavior in src/agents. */
export const SUBAGENT_ENDED_OUTCOME_OK = "ok" as const;
/** Reused constant for SUBAGENT ENDED OUTCOME ERROR behavior in src/agents. */
export const SUBAGENT_ENDED_OUTCOME_ERROR = "error" as const;
/** Reused constant for SUBAGENT ENDED OUTCOME TIMEOUT behavior in src/agents. */
export const SUBAGENT_ENDED_OUTCOME_TIMEOUT = "timeout" as const;
/** Reused constant for SUBAGENT ENDED OUTCOME KILLED behavior in src/agents. */
export const SUBAGENT_ENDED_OUTCOME_KILLED = "killed" as const;

/** Shared type for Subagent Lifecycle Ended Outcome in src/agents. */
export type SubagentLifecycleEndedOutcome =
  | typeof SUBAGENT_ENDED_OUTCOME_OK
  | typeof SUBAGENT_ENDED_OUTCOME_ERROR
  | typeof SUBAGENT_ENDED_OUTCOME_TIMEOUT
  | typeof SUBAGENT_ENDED_OUTCOME_KILLED;
