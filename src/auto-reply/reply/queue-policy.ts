// Reply queue policy helpers.
import type { QueueSettings } from "./queue.js";

/** Shared type for Active Run Queue Action in src/auto-reply/reply. */
export type ActiveRunQueueAction = "run-now" | "enqueue-followup" | "drop";

/** Reused helper for resolve Active Run Queue Action behavior in src/auto-reply/reply. */
export function resolveActiveRunQueueAction(params: {
  isActive: boolean;
  isHeartbeat: boolean;
  shouldFollowup: boolean;
  queueMode: QueueSettings["mode"];
  resetTriggered?: boolean;
}): ActiveRunQueueAction {
  if (!params.isActive) {
    return "run-now";
  }
  if (params.isHeartbeat) {
    return "drop";
  }
  if (params.resetTriggered) {
    return "run-now";
  }
  if (params.shouldFollowup) {
    return "enqueue-followup";
  }
  return "run-now";
}
