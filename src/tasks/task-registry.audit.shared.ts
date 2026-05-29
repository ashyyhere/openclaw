// tasks task registry audit shared helpers and runtime behavior.
import type { TaskRecord } from "./task-registry.types.js";

/** Shared type for Task Audit Severity in src/tasks. */
export type TaskAuditSeverity = "warn" | "error";
/** Shared type for Task Audit Code in src/tasks. */
export type TaskAuditCode =
  | "stale_queued"
  | "stale_running"
  | "lost"
  | "delivery_failed"
  | "missing_cleanup"
  | "inconsistent_timestamps";

/** Shared type for Task Audit Finding in src/tasks. */
export type TaskAuditFinding = {
  severity: TaskAuditSeverity;
  code: TaskAuditCode;
  task: TaskRecord;
  ageMs?: number;
  detail: string;
};

/** Shared type for Task Audit Summary in src/tasks. */
export type TaskAuditSummary = {
  total: number;
  warnings: number;
  errors: number;
  byCode: Record<TaskAuditCode, number>;
};

type TaskAuditComparableFinding = {
  severity: TaskAuditSeverity;
  ageMs?: number;
  createdAt: number;
};

/** Reused helper for create Empty Task Audit Summary behavior in src/tasks. */
export function createEmptyTaskAuditSummary(): TaskAuditSummary {
  return {
    total: 0,
    warnings: 0,
    errors: 0,
    byCode: {
      stale_queued: 0,
      stale_running: 0,
      lost: 0,
      delivery_failed: 0,
      missing_cleanup: 0,
      inconsistent_timestamps: 0,
    },
  };
}

/** Reused helper for compare Task Audit Finding Sort Keys behavior in src/tasks. */
export function compareTaskAuditFindingSortKeys(
  left: TaskAuditComparableFinding,
  right: TaskAuditComparableFinding,
): number {
  const severityRank = (severity: TaskAuditSeverity) => (severity === "error" ? 0 : 1);
  const severityDiff = severityRank(left.severity) - severityRank(right.severity);
  if (severityDiff !== 0) {
    return severityDiff;
  }
  const leftAge = left.ageMs ?? -1;
  const rightAge = right.ageMs ?? -1;
  if (leftAge !== rightAge) {
    return rightAge - leftAge;
  }
  return left.createdAt - right.createdAt;
}
