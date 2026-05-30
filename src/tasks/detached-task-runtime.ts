// Delegates detached task lifecycle operations to the registered runtime, with
// the core task executor as the default implementation and plugin/test override hooks.
import { createSubsystemLogger } from "../logging/subsystem.js";
import type {
  DetachedTaskRecoveryAttemptParams,
  DetachedTaskRecoveryAttemptResult,
  DetachedTaskFinalizeParams,
  DetachedTaskLifecycleRuntime,
  DetachedTaskLifecycleRuntimeRegistration,
} from "./detached-task-runtime-contract.js";
import {
  clearDetachedTaskLifecycleRuntimeRegistration,
  getDetachedTaskLifecycleRuntimeRegistration as getDetachedTaskLifecycleRuntimeRegistrationState,
  getRegisteredDetachedTaskLifecycleRuntime,
  registerDetachedTaskLifecycleRuntime,
} from "./detached-task-runtime-state.js";
import { cancelTaskById as cancelDetachedTaskRunByIdInCore } from "./runtime-internal.js";
import {
  completeTaskRunByRunId as completeTaskRunByRunIdFromExecutor,
  createQueuedTaskRun as createQueuedTaskRunFromExecutor,
  createRunningTaskRun as createRunningTaskRunFromExecutor,
  failTaskRunByRunId as failTaskRunByRunIdFromExecutor,
  finalizeTaskRunByRunId as finalizeTaskRunByRunIdFromExecutor,
  recordTaskRunProgressByRunId as recordTaskRunProgressByRunIdFromExecutor,
  setDetachedTaskDeliveryStatusByRunId as setDetachedTaskDeliveryStatusByRunIdFromExecutor,
  startTaskRunByRunId as startTaskRunByRunIdFromExecutor,
} from "./task-executor.js";
import type { TaskRecord } from "./task-registry.types.js";

const log = createSubsystemLogger("tasks/detached-runtime");
const DETACHED_TASK_RECOVERY_WARN_MS = 5_000;

/** Runtime contract plugins can register to own detached task lifecycle updates. */
export type { DetachedTaskLifecycleRuntime, DetachedTaskLifecycleRuntimeRegistration };

const DEFAULT_DETACHED_TASK_LIFECYCLE_RUNTIME: DetachedTaskLifecycleRuntime = {
  createQueuedTaskRun: createQueuedTaskRunFromExecutor,
  createRunningTaskRun: createRunningTaskRunFromExecutor,
  startTaskRunByRunId: startTaskRunByRunIdFromExecutor,
  recordTaskRunProgressByRunId: recordTaskRunProgressByRunIdFromExecutor,
  finalizeTaskRunByRunId: finalizeTaskRunByRunIdFromExecutor,
  completeTaskRunByRunId: completeTaskRunByRunIdFromExecutor,
  failTaskRunByRunId: failTaskRunByRunIdFromExecutor,
  setDetachedTaskDeliveryStatusByRunId: setDetachedTaskDeliveryStatusByRunIdFromExecutor,
  cancelDetachedTaskRunById: cancelDetachedTaskRunByIdInCore,
};

/** Returns the registered detached task runtime or the core executor-backed default. */
export function getDetachedTaskLifecycleRuntime(): DetachedTaskLifecycleRuntime {
  return getRegisteredDetachedTaskLifecycleRuntime() ?? DEFAULT_DETACHED_TASK_LIFECYCLE_RUNTIME;
}

/** Returns the current detached task runtime registration metadata when one exists. */
export function getDetachedTaskLifecycleRuntimeRegistration():
  | DetachedTaskLifecycleRuntimeRegistration
  | undefined {
  return getDetachedTaskLifecycleRuntimeRegistrationState();
}

/** Registers a plugin-owned detached task runtime implementation. */
export function registerDetachedTaskRuntime(
  pluginId: string,
  runtime: DetachedTaskLifecycleRuntime,
): void {
  registerDetachedTaskLifecycleRuntime(pluginId, runtime);
}

/** Installs a detached task runtime directly for tests. */
export function setDetachedTaskLifecycleRuntime(runtime: DetachedTaskLifecycleRuntime): void {
  registerDetachedTaskRuntime("__test__", runtime);
}

/** Clears the registered detached task runtime so tests return to the default executor. */
export function resetDetachedTaskLifecycleRuntimeForTests(): void {
  clearDetachedTaskLifecycleRuntimeRegistration();
}

/** Creates a queued detached task run through the active lifecycle runtime. */
export function createQueuedTaskRun(
  ...args: Parameters<DetachedTaskLifecycleRuntime["createQueuedTaskRun"]>
): ReturnType<DetachedTaskLifecycleRuntime["createQueuedTaskRun"]> {
  return getDetachedTaskLifecycleRuntime().createQueuedTaskRun(...args);
}

/** Creates an already-running detached task run through the active lifecycle runtime. */
export function createRunningTaskRun(
  ...args: Parameters<DetachedTaskLifecycleRuntime["createRunningTaskRun"]>
): ReturnType<DetachedTaskLifecycleRuntime["createRunningTaskRun"]> {
  return getDetachedTaskLifecycleRuntime().createRunningTaskRun(...args);
}

/** Marks a detached task run as started through the active lifecycle runtime. */
export function startTaskRunByRunId(
  ...args: Parameters<DetachedTaskLifecycleRuntime["startTaskRunByRunId"]>
): ReturnType<DetachedTaskLifecycleRuntime["startTaskRunByRunId"]> {
  return getDetachedTaskLifecycleRuntime().startTaskRunByRunId(...args);
}

/** Records detached task progress through the active lifecycle runtime. */
export function recordTaskRunProgressByRunId(
  ...args: Parameters<DetachedTaskLifecycleRuntime["recordTaskRunProgressByRunId"]>
): ReturnType<DetachedTaskLifecycleRuntime["recordTaskRunProgressByRunId"]> {
  return getDetachedTaskLifecycleRuntime().recordTaskRunProgressByRunId(...args);
}

/** Finalizes a task run, falling back to complete/fail hooks for older runtimes. */
export function finalizeTaskRunByRunId(params: DetachedTaskFinalizeParams): TaskRecord[] {
  const runtime = getDetachedTaskLifecycleRuntime();
  if (runtime.finalizeTaskRunByRunId) {
    return runtime.finalizeTaskRunByRunId(params);
  }
  if (params.status === "succeeded") {
    return runtime.completeTaskRunByRunId(params);
  }
  return runtime.failTaskRunByRunId({
    ...params,
    status: params.status,
  });
}

/** Marks a detached task run as completed through the active lifecycle runtime. */
export function completeTaskRunByRunId(
  ...args: Parameters<DetachedTaskLifecycleRuntime["completeTaskRunByRunId"]>
): ReturnType<DetachedTaskLifecycleRuntime["completeTaskRunByRunId"]> {
  return getDetachedTaskLifecycleRuntime().completeTaskRunByRunId(...args);
}

/** Marks a detached task run as failed through the active lifecycle runtime. */
export function failTaskRunByRunId(
  ...args: Parameters<DetachedTaskLifecycleRuntime["failTaskRunByRunId"]>
): ReturnType<DetachedTaskLifecycleRuntime["failTaskRunByRunId"]> {
  return getDetachedTaskLifecycleRuntime().failTaskRunByRunId(...args);
}

/** Updates delivery status for a detached task run through the active lifecycle runtime. */
export function setDetachedTaskDeliveryStatusByRunId(
  ...args: Parameters<DetachedTaskLifecycleRuntime["setDetachedTaskDeliveryStatusByRunId"]>
): ReturnType<DetachedTaskLifecycleRuntime["setDetachedTaskDeliveryStatusByRunId"]> {
  return getDetachedTaskLifecycleRuntime().setDetachedTaskDeliveryStatusByRunId(...args);
}

/** Cancels a detached task run through the active lifecycle runtime. */
export function cancelDetachedTaskRunById(
  ...args: Parameters<DetachedTaskLifecycleRuntime["cancelDetachedTaskRunById"]>
): ReturnType<DetachedTaskLifecycleRuntime["cancelDetachedTaskRunById"]> {
  return getDetachedTaskLifecycleRuntime().cancelDetachedTaskRunById(...args);
}

/** Gives the active runtime one bounded recovery attempt before the task is marked lost. */
export async function tryRecoverTaskBeforeMarkLost(
  params: DetachedTaskRecoveryAttemptParams,
): Promise<DetachedTaskRecoveryAttemptResult> {
  const hook = getDetachedTaskLifecycleRuntime().tryRecoverTaskBeforeMarkLost;
  if (!hook) {
    return { recovered: false };
  }
  const startedAt = Date.now();
  try {
    const result = await hook(params);
    const elapsedMs = Date.now() - startedAt;
    if (elapsedMs >= DETACHED_TASK_RECOVERY_WARN_MS) {
      log.warn("Detached task recovery hook was slow", {
        taskId: params.taskId,
        runtime: params.runtime,
        elapsedMs,
      });
    }
    if (result && typeof result.recovered === "boolean") {
      return result;
    }
    log.warn("Detached task recovery hook returned invalid result, proceeding with markTaskLost", {
      taskId: params.taskId,
      runtime: params.runtime,
      result,
    });
    return { recovered: false };
  } catch (err) {
    log.warn("Detached task recovery hook threw, proceeding with markTaskLost", {
      taskId: params.taskId,
      runtime: params.runtime,
      elapsedMs: Date.now() - startedAt,
      error: err,
    });
    return { recovered: false };
  }
}
