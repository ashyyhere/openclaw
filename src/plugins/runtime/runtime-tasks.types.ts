// Shared types for plugins/runtime runtime tasks types behavior.
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { TaskDeliveryState } from "../../tasks/task-registry.types.js";
import type { OpenClawPluginToolContext } from "../tool-types.js";
import type { PluginRuntimeTaskFlow } from "./runtime-taskflow.types.js";
import type {
  TaskFlowDetail,
  TaskFlowView,
  TaskRunAggregateSummary,
  TaskRunCancelResult,
  TaskRunDetail,
  TaskRunView,
} from "./task-domain-types.js";
/** Task and flow DTOs exposed by plugin runtime task APIs. */
export type {
  TaskFlowDetail,
  TaskFlowView,
  TaskRunAggregateSummary,
  TaskRunCancelResult,
  TaskRunDetail,
  TaskRunView,
} from "./task-domain-types.js";
/** Detached task lifecycle runtime contract re-exported for plugin runtime callers. */
export type { DetachedTaskLifecycleRuntime } from "../../tasks/detached-task-runtime-contract.js";

/** Task-run runtime bound to one session and requester origin. */
export type BoundTaskRunsRuntime = {
  readonly sessionKey: string;
  readonly requesterOrigin?: TaskDeliveryState["requesterOrigin"];
  get: (taskId: string) => TaskRunDetail | undefined;
  list: () => TaskRunView[];
  findLatest: () => TaskRunDetail | undefined;
  resolve: (token: string) => TaskRunDetail | undefined;
  cancel: (params: { taskId: string; cfg: OpenClawConfig }) => Promise<TaskRunCancelResult>;
};

/** Plugin task-run accessors for binding task APIs to sessions or tool calls. */
export type PluginRuntimeTaskRuns = {
  bindSession: (params: {
    sessionKey: string;
    requesterOrigin?: TaskDeliveryState["requesterOrigin"];
  }) => BoundTaskRunsRuntime;
  fromToolContext: (
    ctx: Pick<OpenClawPluginToolContext, "sessionKey" | "deliveryContext">,
  ) => BoundTaskRunsRuntime;
};

/** Task-flow runtime bound to one session and requester origin. */
export type BoundTaskFlowsRuntime = {
  readonly sessionKey: string;
  readonly requesterOrigin?: TaskDeliveryState["requesterOrigin"];
  get: (flowId: string) => TaskFlowDetail | undefined;
  list: () => TaskFlowView[];
  findLatest: () => TaskFlowDetail | undefined;
  resolve: (token: string) => TaskFlowDetail | undefined;
  getTaskSummary: (flowId: string) => TaskRunAggregateSummary | undefined;
};

/** Plugin task-flow accessors for binding flow APIs to sessions or tool calls. */
export type PluginRuntimeTaskFlows = {
  bindSession: (params: {
    sessionKey: string;
    requesterOrigin?: TaskDeliveryState["requesterOrigin"];
  }) => BoundTaskFlowsRuntime;
  fromToolContext: (
    ctx: Pick<OpenClawPluginToolContext, "sessionKey" | "deliveryContext">,
  ) => BoundTaskFlowsRuntime;
};

/** Combined plugin runtime task namespace exposed to plugins. */
export type PluginRuntimeTasks = {
  runs: PluginRuntimeTaskRuns;
  flows: PluginRuntimeTaskFlows;
  managedFlows: PluginRuntimeTaskFlow;
  /** @deprecated Use runtime.tasks.flows for DTO-based TaskFlow access. */
  flow: PluginRuntimeTaskFlow;
};
