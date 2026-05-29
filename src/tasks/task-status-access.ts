// tasks task status access helpers and runtime behavior.
import { getTaskById, listTasksForAgentId, listTasksForSessionKey } from "./task-registry.js";
import type { TaskRecord } from "./task-registry.types.js";

/** Reused helper for get Task Session Lookup By Id For Status behavior in src/tasks. */
export function getTaskSessionLookupByIdForStatus(
  taskId: string,
): Pick<TaskRecord, "requesterSessionKey" | "runId" | "agentId"> | undefined {
  const task = getTaskById(taskId);
  return task
    ? {
        requesterSessionKey: task.requesterSessionKey,
        ...(task.runId ? { runId: task.runId } : {}),
        ...(task.agentId ? { agentId: task.agentId } : {}),
      }
    : undefined;
}

/** Reused helper for list Tasks For Session Key For Status behavior in src/tasks. */
export function listTasksForSessionKeyForStatus(sessionKey: string): TaskRecord[] {
  return listTasksForSessionKey(sessionKey);
}

/** Reused helper for list Tasks For Agent Id For Status behavior in src/tasks. */
export function listTasksForAgentIdForStatus(agentId: string): TaskRecord[] {
  return listTasksForAgentId(agentId);
}
