/** Normalizes optional task names used as stable subagent handles. */
import { normalizeOptionalString } from "../shared/string-coerce.js";

const SUBAGENT_TASK_NAME_RE = /^[a-z][a-z0-9_-]{0,63}$/;
const RESERVED_SUBAGENT_TASK_NAMES = new Set(["all", "last"]);

type NormalizeSubagentTaskNameResult =
  | { taskName?: string; error?: undefined }
  | { taskName?: undefined; error: string };

/** Reused helper for normalize Subagent Task Name behavior in src/agents. */
export function normalizeSubagentTaskName(value: unknown): NormalizeSubagentTaskNameResult {
  const taskName = normalizeOptionalString(value);
  if (!taskName) {
    return {};
  }
  if (!SUBAGENT_TASK_NAME_RE.test(taskName)) {
    return {
      error: `Invalid taskName "${taskName}". Use 1-64 chars matching [a-z][a-z0-9_-]*.`,
    };
  }
  if (RESERVED_SUBAGENT_TASK_NAMES.has(taskName)) {
    return {
      error: `Invalid taskName "${taskName}". Reserved subagent targets cannot be used as taskName values.`,
    };
  }
  return { taskName };
}
