// Runtime-configurable persistence and observer seams for the task registry.
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

/** Re-export the persisted task registry snapshot shape. */
export type { TaskRegistryStoreSnapshot } from "./task-registry.store.types.js";

/** Storage contract used by the task registry to load/save tasks and delivery state. */
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

/** Incremental task registry mutation event emitted to observers. */
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

/** Optional best-effort observer hooks for task registry mutations. */
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

/** Returns the currently configured task registry store. */
export function getTaskRegistryStore(): TaskRegistryStore {
  return configuredTaskRegistryStore;
}

/** Returns optional task registry observers for incremental mutation notifications. */
export function getTaskRegistryObservers(): TaskRegistryObservers | null {
  return configuredTaskRegistryObservers;
}

/** Overrides task registry store/observer runtime seams, primarily for tests and alternate runtimes. */
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

/** Restores the default SQLite-backed registry store and clears observers for tests. */
export function resetTaskRegistryRuntimeForTests() {
  configuredTaskRegistryStore.close?.();
  configuredTaskRegistryStore = defaultTaskRegistryStore;
  configuredTaskRegistryObservers = null;
}
