// Aggregates task registry records into status/runtime counters.
import type {
  TaskRecord,
  TaskRegistrySummary,
  TaskRuntimeCounts,
  TaskStatusCounts,
} from "./task-registry.types.js";

function createEmptyTaskStatusCounts(): TaskStatusCounts {
  return {
    queued: 0,
    running: 0,
    succeeded: 0,
    failed: 0,
    timed_out: 0,
    cancelled: 0,
    lost: 0,
  };
}

function createEmptyTaskRuntimeCounts(): TaskRuntimeCounts {
  return {
    subagent: 0,
    acp: 0,
    cli: 0,
    cron: 0,
  };
}

/** Creates a zeroed task registry summary with every known status/runtime key present. */
export function createEmptyTaskRegistrySummary(): TaskRegistrySummary {
  return {
    total: 0,
    active: 0,
    terminal: 0,
    failures: 0,
    byStatus: createEmptyTaskStatusCounts(),
    byRuntime: createEmptyTaskRuntimeCounts(),
  };
}

/** Counts total, active, terminal, failure, status, and runtime buckets for task records. */
export function summarizeTaskRecords(records: Iterable<TaskRecord>): TaskRegistrySummary {
  const summary = createEmptyTaskRegistrySummary();
  for (const task of records) {
    summary.total += 1;
    summary.byStatus[task.status] += 1;
    summary.byRuntime[task.runtime] += 1;
    if (task.status === "queued" || task.status === "running") {
      summary.active += 1;
    } else {
      summary.terminal += 1;
    }
    if (task.status === "failed" || task.status === "timed_out" || task.status === "lost") {
      summary.failures += 1;
    }
  }
  return summary;
}
