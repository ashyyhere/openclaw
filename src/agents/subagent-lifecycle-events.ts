/** Constants and payload helpers for subagent lifecycle events. */
export const SUBAGENT_TARGET_KIND_SUBAGENT = "subagent" as const;

/** Terminal lifecycle reason for a subagent that finished normally. */
export const SUBAGENT_ENDED_REASON_COMPLETE = "subagent-complete" as const;
/** Terminal lifecycle reason for a subagent that failed with an error. */
export const SUBAGENT_ENDED_REASON_ERROR = "subagent-error" as const;
/** Terminal lifecycle reason for a subagent killed by the parent session. */
export const SUBAGENT_ENDED_REASON_KILLED = "subagent-killed" as const;

/** Closed set of lifecycle event reason strings emitted for ended subagents. */
export type SubagentLifecycleEndedReason =
  | typeof SUBAGENT_ENDED_REASON_COMPLETE
  | typeof SUBAGENT_ENDED_REASON_ERROR
  | typeof SUBAGENT_ENDED_REASON_KILLED;

/** User-facing outcome for a completed subagent. */
export const SUBAGENT_ENDED_OUTCOME_OK = "ok" as const;
/** User-facing outcome for a subagent failure. */
export const SUBAGENT_ENDED_OUTCOME_ERROR = "error" as const;
/** User-facing outcome for a subagent timeout. */
export const SUBAGENT_ENDED_OUTCOME_TIMEOUT = "timeout" as const;
/** User-facing outcome for a subagent killed before completion. */
export const SUBAGENT_ENDED_OUTCOME_KILLED = "killed" as const;

/** Closed set of normalized outcomes for ended subagent lifecycle payloads. */
export type SubagentLifecycleEndedOutcome =
  | typeof SUBAGENT_ENDED_OUTCOME_OK
  | typeof SUBAGENT_ENDED_OUTCOME_ERROR
  | typeof SUBAGENT_ENDED_OUTCOME_TIMEOUT
  | typeof SUBAGENT_ENDED_OUTCOME_KILLED;
