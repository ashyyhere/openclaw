import { seedPluginStateDatabaseEntriesForTests } from "./plugin-state-store.sqlite.js";

/** Shared type for Plugin State Seed Entry in src/plugin-state. */
export type PluginStateSeedEntry = {
  pluginId: string;
  namespace: string;
  key: string;
  value: unknown;
  createdAt?: number;
  expiresAt?: number | null;
};

/** Reused helper for seed Plugin State Entries For Tests behavior in src/plugin-state. */
export function seedPluginStateEntriesForTests(entries: PluginStateSeedEntry[]): void {
  if (entries.length === 0) {
    return;
  }

  seedPluginStateDatabaseEntriesForTests(
    entries.map((entry) => {
      const valueJson = JSON.stringify(entry.value);
      if (valueJson == null) {
        throw new Error("plugin state seed value must be JSON serializable");
      }
      return {
        pluginId: entry.pluginId,
        namespace: entry.namespace,
        key: entry.key,
        valueJson,
        ...(entry.createdAt != null ? { createdAt: entry.createdAt } : {}),
        ...(entry.expiresAt !== undefined ? { expiresAt: entry.expiresAt } : {}),
      };
    }),
  );
}
