// Thin fs.watch helpers with retry-friendly error handling.
import { type FSWatcher, type WatchListener, watch } from "node:fs";

/** Delay used by callers before retrying a failed filesystem watch. */
export const FS_WATCH_RETRY_DELAY_MS = 5000;

/** Close a watcher while suppressing platform-specific close races. */
export function closeWatcher(watcher: FSWatcher | null | undefined): void {
  if (!watcher) {
    return;
  }

  try {
    watcher.close();
  } catch {
    // Ignore watcher close errors
  }
}

/** Start an fs watcher and report both setup and runtime watch failures. */
export function watchWithErrorHandler(
  path: string,
  listener: WatchListener<string>,
  onError: () => void,
): FSWatcher | null {
  try {
    const watcher = watch(path, listener);
    watcher.on("error", onError);
    return watcher;
  } catch {
    onError();
    return null;
  }
}
