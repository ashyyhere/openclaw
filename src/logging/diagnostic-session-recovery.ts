// logging diagnostic session recovery helpers and runtime behavior.
import type {
  DiagnosticSessionActiveWorkKind,
  DiagnosticSessionState,
} from "../infra/diagnostic-events.js";

/** Shared type for Diagnostic Session Recovery Status in src/logging. */
export type DiagnosticSessionRecoveryStatus =
  | "aborted"
  | "released"
  | "skipped"
  | "noop"
  | "failed";

/** Shared type for Diagnostic Session Recovery Skip Reason in src/logging. */
export type DiagnosticSessionRecoverySkipReason =
  | "active_embedded_run"
  | "active_reply_work"
  | "active_lane_task"
  | "already_in_flight"
  | "missing_session_ref"
  | "stale_session_state";

/** Shared type for Diagnostic Session Recovery Noop Reason in src/logging. */
export type DiagnosticSessionRecoveryNoopReason = "no_active_work";

/** Shared type for Stuck Session Recovery Request in src/logging. */
export type StuckSessionRecoveryRequest = {
  sessionId?: string;
  sessionKey?: string;
  sessionFile?: string;
  ageMs: number;
  queueDepth?: number;
  allowActiveAbort?: boolean;
  expectedState?: DiagnosticSessionState;
  stateGeneration?: number;
  /**
   * Resolved no-forward-progress age (from `diagnostics.stuckSessionAbortMs`) after
   * which an "active" run with queued work is treated as a leaked/dead handle and
   * reclaimed. Honors an operator-raised threshold; falls back to a safe floor.
   */
  staleActiveProgressAbortMs?: number;
};

type DiagnosticSessionRecoveryBaseOutcome = {
  sessionId?: string;
  sessionKey?: string;
  activeSessionId?: string;
  lane?: string;
  activeWorkKind?: DiagnosticSessionActiveWorkKind;
};

/** Shared type for Stuck Session Recovery Outcome in src/logging. */
export type StuckSessionRecoveryOutcome =
  | (DiagnosticSessionRecoveryBaseOutcome & {
      status: "aborted";
      action: "abort_embedded_run";
      aborted: boolean;
      drained: boolean;
      forceCleared: boolean;
      released: number;
      queuedCount?: number;
    })
  | (DiagnosticSessionRecoveryBaseOutcome & {
      status: "released";
      action: "release_lane";
      released: number;
    })
  | (DiagnosticSessionRecoveryBaseOutcome & {
      status: "skipped";
      action: "observe_only" | "keep_lane";
      reason: DiagnosticSessionRecoverySkipReason;
      activeCount?: number;
      queuedCount?: number;
    })
  | (DiagnosticSessionRecoveryBaseOutcome & {
      status: "noop";
      action: "none";
      reason: DiagnosticSessionRecoveryNoopReason;
    })
  | (DiagnosticSessionRecoveryBaseOutcome & {
      status: "failed";
      action: "none";
      reason: "exception";
      error: string;
    });

/** Reused helper for recovery Outcome Mutates Session State behavior in src/logging. */
export function recoveryOutcomeMutatesSessionState(
  outcome: StuckSessionRecoveryOutcome | undefined,
): boolean {
  if (!outcome) {
    return false;
  }
  return (
    outcome.status === "aborted" ||
    outcome.status === "released" ||
    (outcome.status === "noop" && outcome.reason === "no_active_work")
  );
}

/** Reused helper for recovery Outcome Clears Queued Session State behavior in src/logging. */
export function recoveryOutcomeClearsQueuedSessionState(
  outcome: StuckSessionRecoveryOutcome,
): boolean {
  return (
    outcome.status === "released" ||
    (outcome.status === "aborted" && outcome.released > 0 && (outcome.queuedCount ?? 0) === 0) ||
    (outcome.status === "noop" && outcome.reason === "no_active_work")
  );
}

/** Reused helper for recovery Outcome Released Count behavior in src/logging. */
export function recoveryOutcomeReleasedCount(outcome: StuckSessionRecoveryOutcome): number {
  return "released" in outcome ? outcome.released : 0;
}

/** Reused helper for format Recovery Outcome behavior in src/logging. */
export function formatRecoveryOutcome(outcome: StuckSessionRecoveryOutcome): string {
  const fields = [
    `status=${outcome.status}`,
    `action=${outcome.action}`,
    `sessionId=${outcome.sessionId ?? outcome.activeSessionId ?? "unknown"}`,
    `sessionKey=${outcome.sessionKey ?? "unknown"}`,
  ];
  if (outcome.activeSessionId) {
    fields.push(`activeSessionId=${outcome.activeSessionId}`);
  }
  if (outcome.activeWorkKind) {
    fields.push(`activeWorkKind=${outcome.activeWorkKind}`);
  }
  if (outcome.lane) {
    fields.push(`lane=${outcome.lane}`);
  }
  if ("reason" in outcome) {
    fields.push(`reason=${outcome.reason}`);
  }
  if ("aborted" in outcome) {
    fields.push(
      `aborted=${outcome.aborted}`,
      `drained=${outcome.drained}`,
      `forceCleared=${outcome.forceCleared}`,
    );
  }
  if ("released" in outcome) {
    fields.push(`released=${outcome.released}`);
  }
  if (outcome.status === "aborted" && outcome.queuedCount !== undefined) {
    fields.push(`queuedCount=${outcome.queuedCount}`);
  }
  if ("activeCount" in outcome && outcome.activeCount !== undefined) {
    fields.push(`laneActive=${outcome.activeCount}`);
  }
  if (outcome.status === "skipped" && outcome.queuedCount !== undefined) {
    fields.push(`laneQueued=${outcome.queuedCount}`);
  }
  if ("error" in outcome) {
    fields.push(`error=${outcome.error}`);
  }
  return fields.join(" ");
}
