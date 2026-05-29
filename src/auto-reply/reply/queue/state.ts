// Process-local queue state storage.
import { resolveGlobalMap } from "../../../shared/global-singleton.js";
import { normalizeOptionalString } from "../../../shared/string-coerce.js";
import { applyQueueRuntimeSettings } from "../../../utils/queue-helpers.js";
import {
  completeFollowupRunLifecycle,
  type FollowupRun,
  type QueueDropPolicy,
  type QueueMode,
  type QueueSettings,
} from "./types.js";

/** Shared type for Followup Queue State in src/auto-reply/reply. */
export type FollowupQueueState = {
  items: FollowupRun[];
  draining: boolean;
  lastEnqueuedAt: number;
  mode: QueueMode;
  debounceMs: number;
  cap: number;
  dropPolicy: QueueDropPolicy;
  droppedCount: number;
  summaryLines: string[];
  summarySources: FollowupRun[];
  lastRun?: FollowupRun["run"];
};

/** Reused constant for DEFAULT QUEUE DEBOUNCE MS behavior in src/auto-reply/reply. */
export const DEFAULT_QUEUE_DEBOUNCE_MS = 500;
/** Reused constant for DEFAULT QUEUE CAP behavior in src/auto-reply/reply. */
export const DEFAULT_QUEUE_CAP = 20;
/** Reused constant for DEFAULT QUEUE DROP behavior in src/auto-reply/reply. */
export const DEFAULT_QUEUE_DROP: QueueDropPolicy = "summarize";

/**
 * Share followup queues across bundled chunks so busy-session enqueue/drain
 * logic observes one queue registry per process.
 */
const FOLLOWUP_QUEUES_KEY = Symbol.for("openclaw.followupQueues");

/** Reused constant for FOLLOWUP QUEUES behavior in src/auto-reply/reply. */
export const FOLLOWUP_QUEUES = resolveGlobalMap<string, FollowupQueueState>(FOLLOWUP_QUEUES_KEY);

/** Reused helper for get Existing Followup Queue behavior in src/auto-reply/reply. */
export function getExistingFollowupQueue(key: string): FollowupQueueState | undefined {
  const cleaned = key.trim();
  if (!cleaned) {
    return undefined;
  }
  return FOLLOWUP_QUEUES.get(cleaned);
}

/** Reused helper for get Followup Queue behavior in src/auto-reply/reply. */
export function getFollowupQueue(key: string, settings: QueueSettings): FollowupQueueState {
  const existing = FOLLOWUP_QUEUES.get(key);
  if (existing) {
    applyQueueRuntimeSettings({
      target: existing,
      settings,
    });
    return existing;
  }

  const created: FollowupQueueState = {
    items: [],
    draining: false,
    lastEnqueuedAt: 0,
    mode: settings.mode,
    debounceMs:
      typeof settings.debounceMs === "number"
        ? Math.max(0, settings.debounceMs)
        : DEFAULT_QUEUE_DEBOUNCE_MS,
    cap:
      typeof settings.cap === "number" && settings.cap > 0
        ? Math.floor(settings.cap)
        : DEFAULT_QUEUE_CAP,
    dropPolicy: settings.dropPolicy ?? DEFAULT_QUEUE_DROP,
    droppedCount: 0,
    summaryLines: [],
    summarySources: [],
  };
  applyQueueRuntimeSettings({
    target: created,
    settings,
  });
  FOLLOWUP_QUEUES.set(key, created);
  return created;
}

/** Reused helper for clear Followup Queue behavior in src/auto-reply/reply. */
export function clearFollowupQueue(key: string): number {
  const cleaned = key.trim();
  const queue = getExistingFollowupQueue(cleaned);
  if (!queue) {
    return 0;
  }
  const cleared = queue.items.length + queue.droppedCount;
  for (const item of queue.items) {
    completeFollowupRunLifecycle(item);
  }
  for (const item of queue.summarySources) {
    completeFollowupRunLifecycle(item);
  }
  queue.items.length = 0;
  queue.droppedCount = 0;
  queue.summaryLines = [];
  queue.summarySources = [];
  queue.lastRun = undefined;
  queue.lastEnqueuedAt = 0;
  FOLLOWUP_QUEUES.delete(cleaned);
  return cleared;
}

/** Reused helper for refresh Queued Followup Session behavior in src/auto-reply/reply. */
export function refreshQueuedFollowupSession(params: {
  key: string;
  previousSessionId?: string;
  nextSessionId?: string;
  nextSessionFile?: string;
  nextProvider?: string;
  nextModel?: string;
  nextModelOverrideSource?: "auto" | "user";
  nextAuthProfileId?: string;
  nextAuthProfileIdSource?: "auto" | "user";
}): void {
  const cleaned = params.key.trim();
  if (!cleaned) {
    return;
  }
  const queue = getExistingFollowupQueue(cleaned);
  if (!queue) {
    return;
  }
  const shouldRewriteSession =
    Boolean(params.previousSessionId) &&
    Boolean(params.nextSessionId) &&
    params.previousSessionId !== params.nextSessionId;
  const shouldRewriteModelSelection =
    typeof params.nextProvider === "string" ||
    typeof params.nextModel === "string" ||
    Object.hasOwn(params, "nextModelOverrideSource");
  const shouldRewriteSelection =
    shouldRewriteModelSelection ||
    Object.hasOwn(params, "nextAuthProfileId") ||
    Object.hasOwn(params, "nextAuthProfileIdSource");
  if (!shouldRewriteSession && !shouldRewriteSelection) {
    return;
  }

  const rewriteRun = (run?: FollowupRun["run"]) => {
    if (!run) {
      return;
    }
    if (shouldRewriteSession && run.sessionId === params.previousSessionId) {
      run.sessionId = params.nextSessionId!;
      const nextSessionFile = normalizeOptionalString(params.nextSessionFile);
      if (nextSessionFile) {
        run.sessionFile = nextSessionFile;
      }
    }
    if (shouldRewriteSelection) {
      if (typeof params.nextProvider === "string") {
        run.provider = params.nextProvider;
      }
      if (typeof params.nextModel === "string") {
        run.model = params.nextModel;
      }
      if (shouldRewriteModelSelection) {
        delete run.hasAutoFallbackProvenance;
      }
      if (Object.hasOwn(params, "nextModelOverrideSource")) {
        run.hasSessionModelOverride = Boolean(run.provider || run.model);
        run.modelOverrideSource = params.nextModelOverrideSource;
      }
      if (Object.hasOwn(params, "nextAuthProfileId")) {
        run.authProfileId = normalizeOptionalString(params.nextAuthProfileId);
      }
      if (Object.hasOwn(params, "nextAuthProfileIdSource")) {
        run.authProfileIdSource = run.authProfileId ? params.nextAuthProfileIdSource : undefined;
      }
    }
  };

  rewriteRun(queue.lastRun);
  for (const item of queue.items) {
    rewriteRun(item.run);
  }
}
