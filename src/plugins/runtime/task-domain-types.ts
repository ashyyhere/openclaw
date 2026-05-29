// plugins/runtime task domain types helpers and runtime behavior.
import type { JsonValue } from "../../tasks/task-flow-registry.types.js";
import type {
  TaskDeliveryStatus,
  TaskNotifyPolicy,
  TaskRuntime,
  TaskScopeKind,
  TaskRuntimeCounts,
  TaskStatus,
  TaskStatusCounts,
  TaskTerminalOutcome,
} from "../../tasks/task-registry.types.js";
import type { DeliveryContext } from "../../utils/delivery-context.types.js";

/** Shared type for Task Run Aggregate Summary in src/plugins/runtime. */
export type TaskRunAggregateSummary = {
  total: number;
  active: number;
  terminal: number;
  failures: number;
  byStatus: TaskStatusCounts;
  byRuntime: TaskRuntimeCounts;
};

/** Shared type for Task Run View in src/plugins/runtime. */
export type TaskRunView = {
  id: string;
  runtime: TaskRuntime;
  sourceId?: string;
  sessionKey: string;
  ownerKey: string;
  scope: TaskScopeKind;
  childSessionKey?: string;
  flowId?: string;
  parentTaskId?: string;
  agentId?: string;
  runId?: string;
  label?: string;
  title: string;
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

/** Shared type for Task Run Detail in src/plugins/runtime. */
export type TaskRunDetail = TaskRunView;

/** Shared type for Task Run Cancel Result in src/plugins/runtime. */
export type TaskRunCancelResult = {
  found: boolean;
  cancelled: boolean;
  reason?: string;
  task?: TaskRunDetail;
};

/** Shared type for Task Flow View in src/plugins/runtime. */
export type TaskFlowView = {
  id: string;
  ownerKey: string;
  requesterOrigin?: DeliveryContext;
  status: import("../../tasks/task-flow-registry.types.js").TaskFlowStatus;
  notifyPolicy: TaskNotifyPolicy;
  goal: string;
  currentStep?: string;
  cancelRequestedAt?: number;
  createdAt: number;
  updatedAt: number;
  endedAt?: number;
};

/** Shared type for Task Flow Detail in src/plugins/runtime. */
export type TaskFlowDetail = TaskFlowView & {
  state?: JsonValue;
  wait?: JsonValue;
  blocked?: {
    taskId?: string;
    summary?: string;
  };
  tasks: TaskRunView[];
  taskSummary: TaskRunAggregateSummary;
};
