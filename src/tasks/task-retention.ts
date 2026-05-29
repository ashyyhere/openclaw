// Computes cleanup deadlines for terminal task records.
import type { TaskRecord, TaskStatus } from "./task-registry.types.js";

/** Default retention window for completed task records. */
export const DEFAULT_TASK_RETENTION_MS = 7 * 24 * 60 * 60_000;
/** Shorter retention window for lost tasks, which can be noisy after crashes. */
export const LOST_TASK_RETENTION_MS = 24 * 60 * 60_000;

/** Returns the retention window for a task terminal status. */
export function resolveTaskRetentionMs(status: TaskStatus): number {
  return status === "lost" ? LOST_TASK_RETENTION_MS : DEFAULT_TASK_RETENTION_MS;
}

/** Computes cleanup time from task terminal/event timestamps and status retention. */
export function resolveTaskCleanupAfter(
  task: Pick<TaskRecord, "status" | "endedAt" | "lastEventAt" | "createdAt">,
): number {
  const terminalAt = task.endedAt ?? task.lastEventAt ?? task.createdAt;
  return terminalAt + resolveTaskRetentionMs(task.status);
}

/** Preserves explicit cleanup time except for lost tasks, which cap retention aggressively. */
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
