// tasks task registry store helpers and runtime behavior.
import {
  closeTaskRegistryDatabase,
  deleteTaskAndDeliveryStateFromSqlite,
  deleteTaskDeliveryStateFromSqlite,
  deleteTaskRegistryRecordFromSqlite,
  loadTaskRegistryStateFromSqlite,
  listTaskRegistryRecordsByOwnerKeyFromSqlite,
  saveTaskRegistryStateToSqlite,
  upsertTaskWithDeliveryStateToSqlite,
  upsertTaskDeliveryStateToSqlite,
  upsertTaskRegistryRecordToSqlite,
} from "./task-registry.store.sqlite.js";
import type { TaskRegistryStoreSnapshot } from "./task-registry.store.types.js";
import type { TaskDeliveryState, TaskRecord } from "./task-registry.types.js";

/** Re-exported API for src/tasks, starting with Task Registry Store Snapshot. */
export type { TaskRegistryStoreSnapshot } from "./task-registry.store.types.js";

/** Shared type for Task Registry Store in src/tasks. */
export type TaskRegistryStore = {
  loadSnapshot: () => TaskRegistryStoreSnapshot;
  saveSnapshot: (snapshot: TaskRegistryStoreSnapshot) => void;
  listTasksForOwnerKey?: (ownerKey: string) => TaskRecord[];
  upsertTaskWithDeliveryState?: (params: {
    task: TaskRecord;
    deliveryState?: TaskDeliveryState;
  }) => void;
  upsertTask?: (task: TaskRecord) => void;
  deleteTaskWithDeliveryState?: (taskId: string) => void;
  deleteTask?: (taskId: string) => void;
  upsertDeliveryState?: (state: TaskDeliveryState) => void;
  deleteDeliveryState?: (taskId: string) => void;
  close?: () => void;
};

/** Shared type for Task Registry Observer Event in src/tasks. */
export type TaskRegistryObserverEvent =
  | {
      kind: "restored";
      tasks: TaskRecord[];
    }
  | {
      kind: "upserted";
      task: TaskRecord;
      previous?: TaskRecord;
    }
  | {
      kind: "deleted";
      taskId: string;
      previous: TaskRecord;
    };

/** Shared type for Task Registry Observers in src/tasks. */
export type TaskRegistryObservers = {
  // Observers are incremental/best-effort only. Snapshot persistence belongs to TaskRegistryStore.
  onEvent?: (event: TaskRegistryObserverEvent) => void;
};

const defaultTaskRegistryStore: TaskRegistryStore = {
  loadSnapshot: loadTaskRegistryStateFromSqlite,
  saveSnapshot: saveTaskRegistryStateToSqlite,
  listTasksForOwnerKey: listTaskRegistryRecordsByOwnerKeyFromSqlite,
  upsertTaskWithDeliveryState: upsertTaskWithDeliveryStateToSqlite,
  upsertTask: upsertTaskRegistryRecordToSqlite,
  deleteTaskWithDeliveryState: deleteTaskAndDeliveryStateFromSqlite,
  deleteTask: deleteTaskRegistryRecordFromSqlite,
  upsertDeliveryState: upsertTaskDeliveryStateToSqlite,
  deleteDeliveryState: deleteTaskDeliveryStateFromSqlite,
  close: closeTaskRegistryDatabase,
};

let configuredTaskRegistryStore: TaskRegistryStore = defaultTaskRegistryStore;
let configuredTaskRegistryObservers: TaskRegistryObservers | null = null;

/** Reused helper for get Task Registry Store behavior in src/tasks. */
export function getTaskRegistryStore(): TaskRegistryStore {
  return configuredTaskRegistryStore;
}

/** Reused helper for get Task Registry Observers behavior in src/tasks. */
export function getTaskRegistryObservers(): TaskRegistryObservers | null {
  return configuredTaskRegistryObservers;
}

/** Reused helper for configure Task Registry Runtime behavior in src/tasks. */
export function configureTaskRegistryRuntime(params: {
  store?: TaskRegistryStore;
  observers?: TaskRegistryObservers | null;
}) {
  if (params.store) {
    configuredTaskRegistryStore = params.store;
  }
  if ("observers" in params) {
    configuredTaskRegistryObservers = params.observers ?? null;
  }
}

/** Reused helper for reset Task Registry Runtime For Tests behavior in src/tasks. */
export function resetTaskRegistryRuntimeForTests() {
  configuredTaskRegistryStore.close?.();
  configuredTaskRegistryStore = defaultTaskRegistryStore;
  configuredTaskRegistryObservers = null;
}
