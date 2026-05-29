// tasks codex native subagent task helpers and runtime behavior.
import type { TaskRecord } from "./task-registry.types.js";

/** Reused constant for CODEX NATIVE SUBAGENT RUNTIME behavior in src/tasks. */
export const CODEX_NATIVE_SUBAGENT_RUNTIME = "subagent";
/** Reused constant for CODEX NATIVE SUBAGENT TASK KIND behavior in src/tasks. */
export const CODEX_NATIVE_SUBAGENT_TASK_KIND = "codex-native";
/** Reused constant for CODEX NATIVE SUBAGENT RUN ID PREFIX behavior in src/tasks. */
export const CODEX_NATIVE_SUBAGENT_RUN_ID_PREFIX = "codex-thread:";
/** Reused constant for CODEX NATIVE SUBAGENT STALE ERROR behavior in src/tasks. */
export const CODEX_NATIVE_SUBAGENT_STALE_ERROR = "Codex native subagent stopped reporting progress";

/** Reused helper for is Childless Codex Native Subagent Task behavior in src/tasks. */
export function isChildlessCodexNativeSubagentTask(task: TaskRecord): boolean {
  if (
    task.runtime !== CODEX_NATIVE_SUBAGENT_RUNTIME ||
    task.taskKind !== CODEX_NATIVE_SUBAGENT_TASK_KIND
  ) {
    return false;
  }
  if (task.childSessionKey?.trim()) {
    return false;
  }
  return [task.sourceId, task.runId].some((candidate) =>
    candidate?.trim().startsWith(CODEX_NATIVE_SUBAGENT_RUN_ID_PREFIX),
  );
}
