// Shared types for tasks task registry types behavior.
import type { DeliveryContext } from "../utils/delivery-context.types.js";

/** Shared type for Task Runtime in src/tasks. */
export type TaskRuntime = "subagent" | "acp" | "cli" | "cron";

/** Shared type for Task Status in src/tasks. */
export type TaskStatus =
  | "queued"
  | "running"
  | "succeeded"
  | "failed"
  | "timed_out"
  | "cancelled"
  | "lost";

/** Shared type for Task Delivery Status in src/tasks. */
export type TaskDeliveryStatus =
  | "pending"
  | "delivered"
  | "session_queued"
  | "failed"
  | "parent_missing"
  | "not_applicable";

/** Shared type for Task Notify Policy in src/tasks. */
export type TaskNotifyPolicy = "done_only" | "state_changes" | "silent";

/** Shared type for Task Terminal Outcome in src/tasks. */
export type TaskTerminalOutcome = "succeeded" | "blocked";
/** Shared type for Task Scope Kind in src/tasks. */
export type TaskScopeKind = "session" | "system";

/** Shared type for Task Status Counts in src/tasks. */
export type TaskStatusCounts = Record<TaskStatus, number>;
/** Shared type for Task Runtime Counts in src/tasks. */
export type TaskRuntimeCounts = Record<TaskRuntime, number>;

const TASK_RUNTIMES = new Set<TaskRuntime>(["subagent", "acp", "cli", "cron"]);
const TASK_STATUSES = new Set<TaskStatus>([
  "queued",
  "running",
  "succeeded",
  "failed",
  "timed_out",
  "cancelled",
  "lost",
]);
const TASK_DELIVERY_STATUSES = new Set<TaskDeliveryStatus>([
  "pending",
  "delivered",
  "session_queued",
  "failed",
  "parent_missing",
  "not_applicable",
]);
const TASK_NOTIFY_POLICIES = new Set<TaskNotifyPolicy>(["done_only", "state_changes", "silent"]);
const TASK_TERMINAL_OUTCOMES = new Set<TaskTerminalOutcome>(["succeeded", "blocked"]);
const TASK_SCOPE_KINDS = new Set<TaskScopeKind>(["session", "system"]);

function parsePersistedTaskValue<T extends string>(
  value: unknown,
  values: ReadonlySet<T>,
  label: string,
): T {
  if (typeof value === "string" && values.has(value as T)) {
    return value as T;
  }
  throw new Error(`Invalid persisted task ${label}: ${JSON.stringify(value)}`);
}

export function parseTaskRuntime(value: unknown): TaskRuntime {
  return parsePersistedTaskValue(value, TASK_RUNTIMES, "runtime");
}

export function parseTaskStatus(value: unknown): TaskStatus {
  return parsePersistedTaskValue(value, TASK_STATUSES, "status");
}

export function parseTaskDeliveryStatus(value: unknown): TaskDeliveryStatus {
  return parsePersistedTaskValue(value, TASK_DELIVERY_STATUSES, "delivery status");
}

export function parseTaskNotifyPolicy(value: unknown): TaskNotifyPolicy {
  return parsePersistedTaskValue(value, TASK_NOTIFY_POLICIES, "notify policy");
}

export function parseTaskScopeKind(value: unknown): TaskScopeKind {
  return parsePersistedTaskValue(value, TASK_SCOPE_KINDS, "scope kind");
}

export function parseOptionalTaskTerminalOutcome(value: unknown): TaskTerminalOutcome | undefined {
  if (value == null || value === "") {
    return undefined;
  }
  return parsePersistedTaskValue(value, TASK_TERMINAL_OUTCOMES, "terminal outcome");
}

export type TaskRegistrySummary = {
  total: number;
  active: number;
  terminal: number;
  failures: number;
  byStatus: TaskStatusCounts;
  byRuntime: TaskRuntimeCounts;
};

/** Shared type for Task Event Kind in src/tasks. */
export type TaskEventKind = TaskStatus | "progress";

/** Shared type for Task Event Record in src/tasks. */
export type TaskEventRecord = {
  at: number;
  kind: TaskEventKind;
  summary?: string;
};

/** Shared type for Task Delivery State in src/tasks. */
export type TaskDeliveryState = {
  taskId: string;
  requesterOrigin?: DeliveryContext;
  lastNotifiedEventAt?: number;
};

/** Shared type for Task Record in src/tasks. */
export type TaskRecord = {
  taskId: string;
  runtime: TaskRuntime;
  taskKind?: string;
  sourceId?: string;
  requesterSessionKey: string;
  ownerKey: string;
  scopeKind: TaskScopeKind;
  childSessionKey?: string;
  parentFlowId?: string;
  parentTaskId?: string;
  agentId?: string;
  runId?: string;
  label?: string;
  task: string;
  status: TaskStatus;
  deliveryStatus: TaskDeliveryStatus;
  notifyPolicy: TaskNotifyPolicy;
  createdAt: number;
  startedAt?: number;
  endedAt?: number;
  lastEventAt?: number;
  cleanupAfter?: number;
  error?: string;
  progressSummary?: string;
  terminalSummary?: string;
  terminalOutcome?: TaskTerminalOutcome;
};

/** Shared type for Task Registry Snapshot in src/tasks. */
export type TaskRegistrySnapshot = {
  tasks: TaskRecord[];
  deliveryStates: TaskDeliveryState[];
};
