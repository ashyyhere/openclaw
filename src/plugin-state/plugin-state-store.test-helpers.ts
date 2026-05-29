import { seedPluginStateDatabaseEntriesForTests } from "./plugin-state-store.sqlite.js";

/** Raw entry shape accepted by plugin-state seed helpers. */
export type PluginStateSeedEntry = {
  pluginId: string;
  namespace: string;
  key: string;
  value: unknown;
  createdAt?: number;
  expiresAt?: number | null;
};

/** Seeds JSON-serializable plugin-state entries directly into SQLite for tests. */
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
