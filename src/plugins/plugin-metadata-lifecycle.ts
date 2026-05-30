// Lifecycle hooks for clearing process-local plugin metadata caches.
import { clearCurrentPluginMetadataSnapshotState } from "./current-plugin-metadata-state.js";

const pluginMetadataProcessMemoClears = new Set<() => void>();

/** Register a process memo clear callback for plugin metadata lifecycle resets. */
export function registerPluginMetadataProcessMemoLifecycleClear(
  clearProcessMemo: () => void,
): void {
  pluginMetadataProcessMemoClears.add(clearProcessMemo);
}

/** Clear current plugin metadata snapshots and registered process-local memos. */
export function clearPluginMetadataLifecycleCaches(): void {
  clearCurrentPluginMetadataSnapshotState();
  for (const clearProcessMemo of pluginMetadataProcessMemoClears) {
    clearProcessMemo();
  }
}
