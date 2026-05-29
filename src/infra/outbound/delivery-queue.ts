// infra/outbound delivery queue helpers and runtime behavior.
/** Re-exported API for src/infra/outbound. */
export {
  ackDelivery,
  enqueueDelivery,
  ensureQueueDir,
  failDelivery,
  loadPendingDelivery,
  loadPendingDeliveries,
  markDeliveryPlatformOutcomeUnknown,
  markDeliveryPlatformSendAttemptStarted,
  moveToFailed,
} from "./delivery-queue-storage.js";
/** Re-exported API for src/infra/outbound. */
export type {
  QueuedDelivery,
  QueuedDeliveryPayload,
  QueuedReplyPayloadSendingHook,
  QueuedRenderedMessageBatchPlan,
} from "./delivery-queue-storage.js";
/** Re-exported API for src/infra/outbound. */
export {
  computeBackoffMs,
  drainPendingDeliveries,
  isEntryEligibleForRecoveryRetry,
  isPermanentDeliveryError,
  MAX_RETRIES,
  recoverPendingDeliveries,
  withActiveDeliveryClaim,
} from "./delivery-queue-recovery.js";
/** Re-exported API for src/infra/outbound. */
export type {
  ActiveDeliveryClaimResult,
  DeliverFn,
  PendingDeliveryDrainDecision,
  RecoveryLogger,
  RecoverySummary,
} from "./delivery-queue-recovery.js";
