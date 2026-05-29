// Snapshot contracts for persisted task registry state.
import type { TaskDeliveryState, TaskRecord } from "./task-registry.types.js";

/** In-memory snapshot loaded from the task registry backing store. */
export type TaskRegistryStoreSnapshot = {
  tasks: Map<string, TaskRecord>;
  deliveryStates: Map<string, TaskDeliveryState>;
};
