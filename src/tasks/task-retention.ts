// tasks task retention helpers and runtime behavior.
import type { TaskRecord, TaskStatus } from "./task-registry.types.js";

/** Reused constant for DEFAULT TASK RETENTION MS behavior in src/tasks. */
export const DEFAULT_TASK_RETENTION_MS = 7 * 24 * 60 * 60_000;
/** Reused constant for LOST TASK RETENTION MS behavior in src/tasks. */
export const LOST_TASK_RETENTION_MS = 24 * 60 * 60_000;

/** Reused helper for resolve Task Retention Ms behavior in src/tasks. */
export function resolveTaskRetentionMs(status: TaskStatus): number {
  return status === "lost" ? LOST_TASK_RETENTION_MS : DEFAULT_TASK_RETENTION_MS;
}

/** Reused helper for resolve Task Cleanup After behavior in src/tasks. */
export function resolveTaskCleanupAfter(
  task: Pick<TaskRecord, "status" | "endedAt" | "lastEventAt" | "createdAt">,
): number {
  const terminalAt = task.endedAt ?? task.lastEventAt ?? task.createdAt;
  return terminalAt + resolveTaskRetentionMs(task.status);
}

/** Reused helper for resolve Effective Task Cleanup After behavior in src/tasks. */
export function resolveEffectiveTaskCleanupAfter(
  task: Pick<TaskRecord, "status" | "endedAt" | "lastEventAt" | "createdAt" | "cleanupAfter">,
): number {
  const statusCleanupAfter = resolveTaskCleanupAfter(task);
  if (typeof task.cleanupAfter !== "number") {
    return statusCleanupAfter;
  }
  return task.status === "lost"
    ? Math.min(task.cleanupAfter, statusCleanupAfter)
    : task.cleanupAfter;
}
