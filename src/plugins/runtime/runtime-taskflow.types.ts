// Plugin-facing task-flow runtime contracts for managed background work.
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { JsonValue, TaskFlowRecord } from "../../tasks/task-flow-registry.types.js";
import type {
  TaskDeliveryState,
  TaskDeliveryStatus,
  TaskNotifyPolicy,
  TaskRecord,
  TaskRegistrySummary,
  TaskRuntime,
} from "../../tasks/task-registry.types.js";
import type { OpenClawPluginToolContext } from "../tool-types.js";

/** Task-flow record owned by a plugin/controller and mutated through revision checks. */
export type ManagedTaskFlowRecord = TaskFlowRecord & {
  syncMode: "managed";
  controllerId: string;
};

/** Stable failure codes returned when a managed flow mutation cannot apply. */
export type ManagedTaskFlowMutationErrorCode = "not_found" | "not_managed" | "revision_conflict";

/** Result shape for optimistic managed-flow updates. */
export type ManagedTaskFlowMutationResult =
  | {
      applied: true;
      flow: ManagedTaskFlowRecord;
    }
  | {
      applied: false;
      code: ManagedTaskFlowMutationErrorCode;
      current?: TaskFlowRecord;
    };

/** Result of creating a child task from a session-bound flow. */
export type BoundTaskFlowTaskRunResult =
  | {
      created: true;
      flow: ManagedTaskFlowRecord;
      task: TaskRecord;
    }
  | {
      created: false;
      reason: string;
      found: boolean;
      flow?: TaskFlowRecord;
    };

/** Cancellation summary for a flow and its associated tasks. */
export type BoundTaskFlowCancelResult = {
  found: boolean;
  cancelled: boolean;
  reason?: string;
  flow?: TaskFlowRecord;
  tasks?: TaskRecord[];
};

/** Session-bound operations exposed to plugin code for one task-flow namespace. */
export type BoundTaskFlowRuntime = {
  readonly sessionKey: string;
  readonly requesterOrigin?: TaskDeliveryState["requesterOrigin"];
  createManaged: (params: {
    controllerId: string;
    goal: string;
    status?: ManagedTaskFlowRecord["status"];
    notifyPolicy?: TaskNotifyPolicy;
    currentStep?: string | null;
    stateJson?: JsonValue | null;
    waitJson?: JsonValue | null;
    cancelRequestedAt?: number | null;
    createdAt?: number;
    updatedAt?: number;
    endedAt?: number | null;
  }) => ManagedTaskFlowRecord;
  get: (flowId: string) => TaskFlowRecord | undefined;
  list: () => TaskFlowRecord[];
  findLatest: () => TaskFlowRecord | undefined;
  resolve: (token: string) => TaskFlowRecord | undefined;
  getTaskSummary: (flowId: string) => TaskRegistrySummary | undefined;
  setWaiting: (params: {
    flowId: string;
    expectedRevision: number;
    currentStep?: string | null;
    stateJson?: JsonValue | null;
    waitJson?: JsonValue | null;
    blockedTaskId?: string | null;
    blockedSummary?: string | null;
    updatedAt?: number;
  }) => ManagedTaskFlowMutationResult;
  resume: (params: {
    flowId: string;
    expectedRevision: number;
    status?: Extract<ManagedTaskFlowRecord["status"], "queued" | "running">;
    currentStep?: string | null;
    stateJson?: JsonValue | null;
    updatedAt?: number;
  }) => ManagedTaskFlowMutationResult;
  finish: (params: {
    flowId: string;
    expectedRevision: number;
    stateJson?: JsonValue | null;
    updatedAt?: number;
    endedAt?: number;
  }) => ManagedTaskFlowMutationResult;
  fail: (params: {
    flowId: string;
    expectedRevision: number;
    stateJson?: JsonValue | null;
    blockedTaskId?: string | null;
    blockedSummary?: string | null;
    updatedAt?: number;
    endedAt?: number;
  }) => ManagedTaskFlowMutationResult;
  requestCancel: (params: {
    flowId: string;
    expectedRevision: number;
    cancelRequestedAt?: number;
  }) => ManagedTaskFlowMutationResult;
  cancel: (params: { flowId: string; cfg: OpenClawConfig }) => Promise<BoundTaskFlowCancelResult>;
  runTask: (params: {
    flowId: string;
    runtime: TaskRuntime;
    sourceId?: string;
    childSessionKey?: string;
    parentTaskId?: string;
    agentId?: string;
    runId?: string;
    label?: string;
    task: string;
    preferMetadata?: boolean;
    notifyPolicy?: TaskNotifyPolicy;
    deliveryStatus?: TaskDeliveryStatus;
    status?: "queued" | "running";
    startedAt?: number;
    lastEventAt?: number;
    progressSummary?: string | null;
  }) => BoundTaskFlowTaskRunResult;
};

/** Entry point for binding task-flow helpers to a session or plugin tool context. */
export type PluginRuntimeTaskFlow = {
  bindSession: (params: {
    sessionKey: string;
    requesterOrigin?: TaskDeliveryState["requesterOrigin"];
  }) => BoundTaskFlowRuntime;
  fromToolContext: (
    ctx: Pick<OpenClawPluginToolContext, "sessionKey" | "deliveryContext">,
  ) => BoundTaskFlowRuntime;
};
