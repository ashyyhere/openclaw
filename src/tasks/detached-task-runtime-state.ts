// tasks detached task runtime state helpers and runtime behavior.
import type {
  DetachedTaskLifecycleRuntime,
  DetachedTaskLifecycleRuntimeRegistration,
} from "./detached-task-runtime-contract.js";

/** Re-exported API for src/tasks, starting with Detached Task Lifecycle Runtime. */
export type { DetachedTaskLifecycleRuntime, DetachedTaskLifecycleRuntimeRegistration };

let detachedTaskLifecycleRuntimeRegistration: DetachedTaskLifecycleRuntimeRegistration | undefined;

/** Reused helper for register Detached Task Lifecycle Runtime behavior in src/tasks. */
export function registerDetachedTaskLifecycleRuntime(
  pluginId: string,
  runtime: DetachedTaskLifecycleRuntime,
): void {
  detachedTaskLifecycleRuntimeRegistration = {
    pluginId,
    runtime,
  };
}

/** Reused helper for get Detached Task Lifecycle Runtime Registration behavior in src/tasks. */
export function getDetachedTaskLifecycleRuntimeRegistration():
  | DetachedTaskLifecycleRuntimeRegistration
  | undefined {
  if (!detachedTaskLifecycleRuntimeRegistration) {
    return undefined;
  }
  return {
    pluginId: detachedTaskLifecycleRuntimeRegistration.pluginId,
    runtime: detachedTaskLifecycleRuntimeRegistration.runtime,
  };
}

/** Reused helper for get Registered Detached Task Lifecycle Runtime behavior in src/tasks. */
export function getRegisteredDetachedTaskLifecycleRuntime():
  | DetachedTaskLifecycleRuntime
  | undefined {
  return detachedTaskLifecycleRuntimeRegistration?.runtime;
}

/** Reused helper for restore Detached Task Lifecycle Runtime Registration behavior in src/tasks. */
export function restoreDetachedTaskLifecycleRuntimeRegistration(
  registration: DetachedTaskLifecycleRuntimeRegistration | undefined,
): void {
  detachedTaskLifecycleRuntimeRegistration = registration
    ? {
        pluginId: registration.pluginId,
        runtime: registration.runtime,
      }
    : undefined;
}

/** Reused helper for clear Detached Task Lifecycle Runtime Registration behavior in src/tasks. */
export function clearDetachedTaskLifecycleRuntimeRegistration(): void {
  detachedTaskLifecycleRuntimeRegistration = undefined;
}
