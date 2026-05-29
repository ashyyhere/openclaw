// Public queue directive facade.
/** Re-exported API for src/auto-reply/reply, starting with extract Queue Directive. */
export { extractQueueDirective } from "./queue/directive.js";
/** Re-exported API for src/auto-reply/reply, starting with clear Session Queues. */
export { clearSessionQueues } from "./queue/cleanup.js";
/** Re-exported API for src/auto-reply/reply, starting with Clear Session Queue Result. */
export type { ClearSessionQueueResult } from "./queue/cleanup.js";
/** Re-exported API for src/auto-reply/reply, starting with schedule Followup Drain. */
export { scheduleFollowupDrain } from "./queue/drain.js";
/** Re-exported API for src/auto-reply/reply. */
export {
  enqueueFollowupRun,
  getFollowupQueueDepth,
  resetRecentQueuedMessageIdDedupe,
} from "./queue/enqueue.js";
/** Re-exported API for src/auto-reply/reply, starting with resolve Queue Settings. */
export { resolveQueueSettings } from "./queue/settings-runtime.js";
/** Re-exported API for src/auto-reply/reply, starting with clear Followup Queue. */
export { clearFollowupQueue, refreshQueuedFollowupSession } from "./queue/state.js";
/** Re-exported API for src/auto-reply/reply. */
export type {
  FollowupRun,
  QueueDedupeMode,
  QueueDropPolicy,
  QueueMode,
  QueueSettings,
} from "./queue/types.js";
/** Re-exported API for src/auto-reply/reply, starting with is Followup Run Aborted. */
export { isFollowupRunAborted } from "./queue/types.js";
/** Re-exported API for src/auto-reply/reply, starting with complete Followup Run Lifecycle. */
export { completeFollowupRunLifecycle } from "./queue/types.js";
/** Re-exported API for src/auto-reply/reply, starting with Followup Run Deferred Error. */
export { FollowupRunDeferredError, isFollowupRunDeferredError } from "./queue/types.js";
