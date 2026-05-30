// TaskFlow registry store snapshot types.
import type { TaskFlowRecord } from "./task-flow-registry.types.js";

/** In-memory TaskFlow store snapshot keyed by flow id. */
export type TaskFlowRegistryStoreSnapshot = {
  flows: Map<string, TaskFlowRecord>;
};
