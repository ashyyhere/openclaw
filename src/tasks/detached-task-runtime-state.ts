// Process-local registration state for the active detached task lifecycle runtime.
import type {
  DetachedTaskLifecycleRuntime,
  DetachedTaskLifecycleRuntimeRegistration,
} from "./detached-task-runtime-contract.js";

/** Re-export detached task runtime contracts for registry users. */
export type { DetachedTaskLifecycleRuntime, DetachedTaskLifecycleRuntimeRegistration };

let detachedTaskLifecycleRuntimeRegistration: DetachedTaskLifecycleRuntimeRegistration | undefined;

/** Registers the active detached task lifecycle runtime for this process. */
export function registerDetachedTaskLifecycleRuntime(
  pluginId: string,
  runtime: DetachedTaskLifecycleRuntime,
): void {
  detachedTaskLifecycleRuntimeRegistration = {
    pluginId,
    runtime,
  };
}

/** Returns a shallow copy of the active detached task runtime registration. */
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

/** Returns only the active detached task runtime hooks when registered. */
export function getRegisteredDetachedTaskLifecycleRuntime():
  | DetachedTaskLifecycleRuntime
  | undefined {
  return detachedTaskLifecycleRuntimeRegistration?.runtime;
}

/** Restores a previous detached task runtime registration, mainly for tests. */
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

/** Clears the process-local detached task runtime registration. */
export function clearDetachedTaskLifecycleRuntimeRegistration(): void {
  detachedTaskLifecycleRuntimeRegistration = undefined;
}
