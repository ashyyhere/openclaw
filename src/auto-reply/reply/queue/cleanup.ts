// Queue cleanup helpers for stale queued replies.
import { resolveEmbeddedSessionLane } from "../../../agents/embedded-agent-runner/lanes.js";
import { clearCommandLane } from "../../../process/command-queue.js";
import { normalizeOptionalString } from "../../../shared/string-coerce.js";
import { clearFollowupDrainCallback } from "./drain.js";
import { clearFollowupQueue } from "./state.js";

/** Shared type for Clear Session Queue Result in src/auto-reply/reply. */
export type ClearSessionQueueResult = {
  followupCleared: number;
  laneCleared: number;
  keys: string[];
};

const defaultQueueCleanupDeps = {
  resolveEmbeddedSessionLane,
  clearCommandLane,
};

const queueCleanupDeps = {
  ...defaultQueueCleanupDeps,
};

function resolveQueueCleanupLaneResolver() {
  return typeof queueCleanupDeps.resolveEmbeddedSessionLane === "function"
    ? queueCleanupDeps.resolveEmbeddedSessionLane
    : defaultQueueCleanupDeps.resolveEmbeddedSessionLane;
}

function resolveQueueCleanupLaneClearer() {
  return typeof queueCleanupDeps.clearCommandLane === "function"
    ? queueCleanupDeps.clearCommandLane
    : defaultQueueCleanupDeps.clearCommandLane;
}

/** Reused constant for testing behavior in src/auto-reply/reply. */
export const testing = {
  setDepsForTests(deps: Partial<typeof defaultQueueCleanupDeps> | undefined): void {
    queueCleanupDeps.resolveEmbeddedSessionLane =
      typeof deps?.resolveEmbeddedSessionLane === "function"
        ? deps.resolveEmbeddedSessionLane
        : defaultQueueCleanupDeps.resolveEmbeddedSessionLane;
    queueCleanupDeps.clearCommandLane =
      typeof deps?.clearCommandLane === "function"
        ? deps.clearCommandLane
        : defaultQueueCleanupDeps.clearCommandLane;
  },
  resetDepsForTests(): void {
    queueCleanupDeps.resolveEmbeddedSessionLane =
      defaultQueueCleanupDeps.resolveEmbeddedSessionLane;
    queueCleanupDeps.clearCommandLane = defaultQueueCleanupDeps.clearCommandLane;
  },
};

/** Reused helper for clear Session Queues behavior in src/auto-reply/reply. */
export function clearSessionQueues(keys: Array<string | undefined>): ClearSessionQueueResult {
  const seen = new Set<string>();
  let followupCleared = 0;
  let laneCleared = 0;
  const clearedKeys: string[] = [];
  const resolveLane = resolveQueueCleanupLaneResolver();
  const clearLane = resolveQueueCleanupLaneClearer();

  for (const key of keys) {
    const cleaned = normalizeOptionalString(key);
    if (!cleaned || seen.has(cleaned)) {
      continue;
    }
    seen.add(cleaned);
    clearedKeys.push(cleaned);
    followupCleared += clearFollowupQueue(cleaned);
    clearFollowupDrainCallback(cleaned);
    laneCleared += clearLane(resolveLane(cleaned));
  }

  return { followupCleared, laneCleared, keys: clearedKeys };
}
/** Re-exported API for src/auto-reply/reply, starting with testing. */
export { testing as __testing };
