// Cleanup helpers for session reset side effects.
import { drainSystemEventEntries } from "../../infra/system-events.js";
import { clearSessionQueues, type ClearSessionQueueResult } from "./queue/cleanup.js";

/** Shared type for Clear Session Reset Runtime State Result in src/auto-reply/reply. */
export type ClearSessionResetRuntimeStateResult = ClearSessionQueueResult & {
  systemEventsCleared: number;
};

/** Reused helper for clear Session Reset Runtime State behavior in src/auto-reply/reply. */
export function clearSessionResetRuntimeState(
  keys: Array<string | undefined>,
): ClearSessionResetRuntimeStateResult {
  const cleared = clearSessionQueues(keys);
  let systemEventsCleared = 0;

  for (const key of cleared.keys) {
    systemEventsCleared += drainSystemEventEntries(key).length;
  }

  return {
    ...cleared,
    systemEventsCleared,
  };
}
