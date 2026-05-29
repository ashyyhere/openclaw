// plugins plugin metadata lifecycle helpers and runtime behavior.
import { clearCurrentPluginMetadataSnapshotState } from "./current-plugin-metadata-state.js";

const pluginMetadataProcessMemoClears = new Set<() => void>();

/** Reused helper for register Plugin Metadata Process Memo Lifecycle Clear behavior in src/plugins. */
export function registerPluginMetadataProcessMemoLifecycleClear(
  clearProcessMemo: () => void,
): void {
  pluginMetadataProcessMemoClears.add(clearProcessMemo);
}

/** Reused helper for clear Plugin Metadata Lifecycle Caches behavior in src/plugins. */
export function clearPluginMetadataLifecycleCaches(): void {
  clearCurrentPluginMetadataSnapshotState();
  for (const clearProcessMemo of pluginMetadataProcessMemoClears) {
    clearProcessMemo();
  }
}
