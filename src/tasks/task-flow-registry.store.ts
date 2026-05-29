// tasks task flow registry store helpers and runtime behavior.
import {
  closeTaskFlowRegistryDatabase,
  deleteTaskFlowRegistryRecordFromSqlite,
  loadTaskFlowRegistryStateFromSqlite,
  saveTaskFlowRegistryStateToSqlite,
  upsertTaskFlowRegistryRecordToSqlite,
} from "./task-flow-registry.store.sqlite.js";
import type { TaskFlowRegistryStoreSnapshot } from "./task-flow-registry.store.types.js";
import type { TaskFlowRecord } from "./task-flow-registry.types.js";

/** Re-exported API for src/tasks, starting with Task Flow Registry Store Snapshot. */
export type { TaskFlowRegistryStoreSnapshot } from "./task-flow-registry.store.types.js";

/** Shared type for Task Flow Registry Store in src/tasks. */
export type TaskFlowRegistryStore = {
  loadSnapshot: () => TaskFlowRegistryStoreSnapshot;
  saveSnapshot: (snapshot: TaskFlowRegistryStoreSnapshot) => void;
  upsertFlow?: (flow: TaskFlowRecord) => void;
  deleteFlow?: (flowId: string) => void;
  close?: () => void;
};

/** Shared type for Task Flow Registry Observer Event in src/tasks. */
export type TaskFlowRegistryObserverEvent =
  | {
      kind: "restored";
      flows: TaskFlowRecord[];
    }
  | {
      kind: "upserted";
      flow: TaskFlowRecord;
      previous?: TaskFlowRecord;
    }
  | {
      kind: "deleted";
      flowId: string;
      previous: TaskFlowRecord;
    };

/** Shared type for Task Flow Registry Observers in src/tasks. */
export type TaskFlowRegistryObservers = {
  // Observers are incremental/best-effort only. Snapshot persistence belongs to TaskFlowRegistryStore.
  onEvent?: (event: TaskFlowRegistryObserverEvent) => void;
};

const defaultFlowRegistryStore: TaskFlowRegistryStore = {
  loadSnapshot: loadTaskFlowRegistryStateFromSqlite,
  saveSnapshot: saveTaskFlowRegistryStateToSqlite,
  upsertFlow: upsertTaskFlowRegistryRecordToSqlite,
  deleteFlow: deleteTaskFlowRegistryRecordFromSqlite,
  close: closeTaskFlowRegistryDatabase,
};

let configuredFlowRegistryStore: TaskFlowRegistryStore = defaultFlowRegistryStore;
let configuredFlowRegistryObservers: TaskFlowRegistryObservers | null = null;

/** Reused helper for get Task Flow Registry Store behavior in src/tasks. */
export function getTaskFlowRegistryStore(): TaskFlowRegistryStore {
  return configuredFlowRegistryStore;
}

/** Reused helper for get Task Flow Registry Observers behavior in src/tasks. */
export function getTaskFlowRegistryObservers(): TaskFlowRegistryObservers | null {
  return configuredFlowRegistryObservers;
}

/** Reused helper for configure Task Flow Registry Runtime behavior in src/tasks. */
export function configureTaskFlowRegistryRuntime(params: {
  store?: TaskFlowRegistryStore;
  observers?: TaskFlowRegistryObservers | null;
}) {
  if (params.store) {
    configuredFlowRegistryStore = params.store;
  }
  if ("observers" in params) {
    configuredFlowRegistryObservers = params.observers ?? null;
  }
}

/** Reused helper for reset Task Flow Registry Runtime For Tests behavior in src/tasks. */
export function resetTaskFlowRegistryRuntimeForTests() {
  configuredFlowRegistryStore.close?.();
  configuredFlowRegistryStore = defaultFlowRegistryStore;
  configuredFlowRegistryObservers = null;
}
