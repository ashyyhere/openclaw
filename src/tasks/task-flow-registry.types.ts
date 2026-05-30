// Persisted task-flow registry contracts shared by store and runtime logic.
import type { DeliveryContext } from "../utils/delivery-context.types.js";
import type { TaskNotifyPolicy } from "./task-registry.types.js";

/** JSON value accepted for persisted flow state/wait payloads. */
export type JsonValue =
  | null
  | boolean
  | number
  | string
  | JsonValue[]
  | { [key: string]: JsonValue };

/** How a task flow synchronizes with task-registry records. */
export type TaskFlowSyncMode = "task_mirrored" | "managed";

/** Lifecycle status persisted for a task flow. */
export type TaskFlowStatus =
  | "queued"
  | "running"
  | "waiting"
  | "blocked"
  | "succeeded"
  | "failed"
  | "cancelled"
  | "lost";

const TASK_FLOW_SYNC_MODES = new Set<TaskFlowSyncMode>(["task_mirrored", "managed"]);
const TASK_FLOW_STATUSES = new Set<TaskFlowStatus>([
  "queued",
  "running",
  "waiting",
  "blocked",
  "succeeded",
  "failed",
  "cancelled",
  "lost",
]);

function parsePersistedFlowValue<T extends string>(
  value: unknown,
  values: ReadonlySet<T>,
  label: string,
): T {
  if (typeof value === "string" && values.has(value as T)) {
    return value as T;
  }
  throw new Error(`Invalid persisted task flow ${label}: ${JSON.stringify(value)}`);
}

export function parseOptionalTaskFlowSyncMode(value: unknown): TaskFlowSyncMode | undefined {
  if (value == null || value === "") {
    return undefined;
  }
  return parsePersistedFlowValue(value, TASK_FLOW_SYNC_MODES, "sync mode");
}

export function parseTaskFlowStatus(value: unknown): TaskFlowStatus {
  return parsePersistedFlowValue(value, TASK_FLOW_STATUSES, "status");
}

export type TaskFlowRecord = {
  flowId: string;
  syncMode: TaskFlowSyncMode;
  ownerKey: string;
  requesterOrigin?: DeliveryContext;
  controllerId?: string;
  revision: number;
  status: TaskFlowStatus;
  notifyPolicy: TaskNotifyPolicy;
  goal: string;
  currentStep?: string;
  blockedTaskId?: string;
  blockedSummary?: string;
  stateJson?: JsonValue;
  waitJson?: JsonValue;
  cancelRequestedAt?: number;
  createdAt: number;
  updatedAt: number;
  endedAt?: number;
};
