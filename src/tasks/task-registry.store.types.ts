// Shared types for tasks task registry store types behavior.
import type { TaskDeliveryState, TaskRecord } from "./task-registry.types.js";

/** Shared type for Task Registry Store Snapshot in src/tasks. */
export type TaskRegistryStoreSnapshot = {
  tasks: Map<string, TaskRecord>;
  deliveryStates: Map<string, TaskDeliveryState>;
};
