// Contract between core task registry code and detachable task runtimes.
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type {
  TaskDeliveryState,
  TaskDeliveryStatus,
  TaskNotifyPolicy,
  TaskRecord,
  TaskRuntime,
  TaskScopeKind,
  TaskStatus,
  TaskTerminalOutcome,
} from "./task-registry.types.js";

/** Input for creating a queued detached task record. */
export type DetachedTaskCreateParams = {
  runtime: TaskRuntime;
  taskKind?: string;
  sourceId?: string;
  requesterSessionKey?: string;
  ownerKey?: string;
  scopeKind?: TaskScopeKind;
  requesterOrigin?: TaskDeliveryState["requesterOrigin"];
  parentFlowId?: string;
  childSessionKey?: string;
  parentTaskId?: string;
  agentId?: string;
  runId?: string;
  label?: string;
  task: string;
  preferMetadata?: boolean;
  notifyPolicy?: TaskNotifyPolicy;
  deliveryStatus?: TaskDeliveryStatus;
};

/** Input for creating a detached task that is already running. */
export type DetachedRunningTaskCreateParams = DetachedTaskCreateParams & {
  startedAt?: number;
  lastEventAt?: number;
  progressSummary?: string | null;
};

/** Input for transitioning detached tasks with a run id to running. */
export type DetachedTaskStartParams = {
  runId: string;
  runtime?: TaskRuntime;
  sessionKey?: string;
  startedAt?: number;
  lastEventAt?: number;
  progressSummary?: string | null;
  eventSummary?: string | null;
};

/** Input for recording progress on detached tasks by run id. */
export type DetachedTaskProgressParams = {
  runId: string;
  runtime?: TaskRuntime;
  sessionKey?: string;
  lastEventAt?: number;
  progressSummary?: string | null;
  eventSummary?: string | null;
};

/** Input for marking detached tasks by run id as successful. */
export type DetachedTaskCompleteParams = {
  runId: string;
  runtime?: TaskRuntime;
  sessionKey?: string;
  endedAt: number;
  lastEventAt?: number;
  progressSummary?: string | null;
  terminalSummary?: string | null;
  terminalOutcome?: TaskTerminalOutcome | null;
};

/** Input for marking detached tasks by run id as failed, timed out, or cancelled. */
export type DetachedTaskFailParams = {
  runId: string;
  runtime?: TaskRuntime;
  sessionKey?: string;
  status?: Extract<TaskStatus, "failed" | "timed_out" | "cancelled">;
  endedAt: number;
  lastEventAt?: number;
  error?: string;
  progressSummary?: string | null;
  terminalSummary?: string | null;
};

/** Unified terminal-state input for runtimes that support a single finalize hook. */
export type DetachedTaskFinalizeParams = {
  runId: string;
  runtime?: TaskRuntime;
  sessionKey?: string;
  status: Extract<TaskStatus, "succeeded" | "failed" | "timed_out" | "cancelled">;
  endedAt: number;
  lastEventAt?: number;
  error?: string;
  progressSummary?: string | null;
  terminalSummary?: string | null;
  terminalOutcome?: TaskTerminalOutcome | null;
};

/** Input for updating requester delivery status for detached task completions. */
export type DetachedTaskDeliveryStatusParams = {
  runId: string;
  runtime?: TaskRuntime;
  sessionKey?: string;
  deliveryStatus: TaskDeliveryStatus;
  error?: string;
};

/** Input for cancelling a detached task through its owning runtime. */
export type DetachedTaskCancelParams = {
  cfg: OpenClawConfig;
  taskId: string;
  reason?: string;
};

/** Cancellation result, including ownership and whether cancellation was applied. */
export type DetachedTaskCancelResult = {
  found: boolean;
  cancelled: boolean;
  reason?: string;
  task?: TaskRecord;
};

/** Input for giving a runtime a chance to recover a task before maintenance marks it lost. */
export type DetachedTaskRecoveryAttemptParams = {
  taskId: string;
  runtime: TaskRuntime;
  task: TaskRecord;
  now: number;
};

/** Recovery outcome returned by a detached task runtime. */
export type DetachedTaskRecoveryAttemptResult = {
  recovered: boolean;
};

/** Runtime hooks core uses to create, mutate, cancel, and recover detached tasks. */
export type DetachedTaskLifecycleRuntime = {
  createQueuedTaskRun: (params: DetachedTaskCreateParams) => TaskRecord;
  createRunningTaskRun: (params: DetachedRunningTaskCreateParams) => TaskRecord;
  startTaskRunByRunId: (params: DetachedTaskStartParams) => TaskRecord[];
  recordTaskRunProgressByRunId: (params: DetachedTaskProgressParams) => TaskRecord[];
  finalizeTaskRunByRunId?: (params: DetachedTaskFinalizeParams) => TaskRecord[];
  completeTaskRunByRunId: (params: DetachedTaskCompleteParams) => TaskRecord[];
  failTaskRunByRunId: (params: DetachedTaskFailParams) => TaskRecord[];
  setDetachedTaskDeliveryStatusByRunId: (params: DetachedTaskDeliveryStatusParams) => TaskRecord[];
  /**
   * Return `found: false` when this runtime does not own the task so core can
   * fall back to the legacy detached-task cancel path.
   */
  cancelDetachedTaskRunById: (
    params: DetachedTaskCancelParams,
  ) => Promise<DetachedTaskCancelResult>;
  /**
   * Give a registered detached runtime one last chance to recover a stale task
   * before core marks it lost during maintenance.
   */
  tryRecoverTaskBeforeMarkLost?: (
    params: DetachedTaskRecoveryAttemptParams,
  ) => DetachedTaskRecoveryAttemptResult | Promise<DetachedTaskRecoveryAttemptResult>;
};

/** Process-local detached task runtime registration. */
export type DetachedTaskLifecycleRuntimeRegistration = {
  pluginId: string;
  runtime: DetachedTaskLifecycleRuntime;
};
