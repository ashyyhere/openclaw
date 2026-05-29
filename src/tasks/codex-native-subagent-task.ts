// Identifies Codex native subagent tasks that do not have a child session record.
import type { TaskRecord } from "./task-registry.types.js";

/** Runtime id used by Codex native subagent tasks. */
export const CODEX_NATIVE_SUBAGENT_RUNTIME = "subagent";
/** Task kind marker for Codex native subagent runs. */
export const CODEX_NATIVE_SUBAGENT_TASK_KIND = "codex-native";
/** Run/source id prefix emitted by Codex native subagent threads. */
export const CODEX_NATIVE_SUBAGENT_RUN_ID_PREFIX = "codex-thread:";
/** Error text used when a Codex native subagent stops reporting progress. */
export const CODEX_NATIVE_SUBAGENT_STALE_ERROR = "Codex native subagent stopped reporting progress";

/** Detects Codex native subagent tasks tracked only by run/source id, not child session key. */
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
