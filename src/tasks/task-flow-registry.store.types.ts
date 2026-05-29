// Shared types for tasks task flow registry store types behavior.
import type { TaskFlowRecord } from "./task-flow-registry.types.js";

/** Shared type for Task Flow Registry Store Snapshot in src/tasks. */
export type TaskFlowRegistryStoreSnapshot = {
  flows: Map<string, TaskFlowRecord>;
};
