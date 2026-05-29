/** Normalizes legacy subagent completion/delivery fields into current nested state. */
import type {
  PendingFinalDeliveryPayload,
  SubagentCompletionDeliveryState,
  SubagentCompletionState,
  SubagentExecutionState,
  SubagentRunRecord,
} from "./subagent-registry.types.js";

/** Legacy flat delivery fields read from older persisted subagent run records. */
export type LegacySubagentRunRecord = SubagentRunRecord & {
  announceRetryCount?: number;
  lastAnnounceRetryAt?: number;
  lastAnnounceDeliveryError?: string;
  frozenResultText?: string | null;
  frozenResultCapturedAt?: number;
  fallbackFrozenResultText?: string | null;
  fallbackFrozenResultCapturedAt?: number;
  pendingFinalDelivery?: boolean;
  pendingFinalDeliveryCreatedAt?: number;
  pendingFinalDeliveryLastAttemptAt?: number;
  pendingFinalDeliveryAttemptCount?: number;
  pendingFinalDeliveryLastError?: string | null;
  pendingFinalDeliveryPayload?: PendingFinalDeliveryPayload;
  deliverySuspendedAt?: number;
  deliverySuspendedReason?: "retry-limit" | "expiry";
  deliveryDiscardedAt?: number;
  deliveryDiscardReason?: "expired" | "pressure-pruned";
  deliveryDiscardedPayloadSummary?: SubagentCompletionDeliveryState["discardedPayloadSummary"];
  completionEnqueuedAt?: number;
  completionDeliveredAt?: number;
  completionAnnouncedAt?: number;
  lastAnnounceDropReason?: SubagentCompletionDeliveryState["lastDropReason"];
};

/** Migrates one subagent run record in place to the current execution/completion/delivery shape. */
export function normalizeSubagentRunState(entry: SubagentRunRecord): SubagentRunRecord {
  const legacy = entry as LegacySubagentRunRecord;
  entry.execution = mergeExecutionState(entry.execution, buildExecutionState(entry));
  entry.completion = mergeCompletionState(entry.completion, buildCompletionState(entry, legacy));
  entry.delivery = mergeDeliveryState(entry, entry.delivery, buildDeliveryState(entry, legacy));
  // cleanupHandled is an in-process lock; after restart, unfinished cleanup must retry.
  if (
    entry.cleanupHandled === true &&
    typeof entry.cleanupCompletedAt !== "number" &&
    entry.delivery?.status !== "discarded"
  ) {
    entry.cleanupHandled = false;
  }
  delete legacy.announceRetryCount;
  delete legacy.lastAnnounceRetryAt;
  delete legacy.lastAnnounceDeliveryError;
  delete legacy.frozenResultText;
  delete legacy.frozenResultCapturedAt;
  delete legacy.fallbackFrozenResultText;
  delete legacy.fallbackFrozenResultCapturedAt;
  delete legacy.pendingFinalDelivery;
  delete legacy.pendingFinalDeliveryCreatedAt;
  delete legacy.pendingFinalDeliveryLastAttemptAt;
  delete legacy.pendingFinalDeliveryAttemptCount;
  delete legacy.pendingFinalDeliveryLastError;
  delete legacy.pendingFinalDeliveryPayload;
  delete legacy.deliverySuspendedAt;
  delete legacy.deliverySuspendedReason;
  delete legacy.deliveryDiscardedAt;
  delete legacy.deliveryDiscardReason;
  delete legacy.deliveryDiscardedPayloadSummary;
  delete legacy.completionEnqueuedAt;
  delete legacy.completionDeliveredAt;
  delete legacy.completionAnnouncedAt;
  delete legacy.lastAnnounceDropReason;
  return entry;
}

function mergeExecutionState(
  current: SubagentExecutionState | undefined,
  restored: SubagentExecutionState,
): SubagentExecutionState {
  return current ? { ...restored, ...current } : restored;
}

function mergeCompletionState(
  current: SubagentCompletionState | undefined,
  restored: SubagentCompletionState,
): SubagentCompletionState {
  if (!current) {
    return restored;
  }
  return {
    ...restored,
    ...current,
    required: current.required ?? restored.required,
  };
}

function mergeDeliveryState(
  entry: SubagentRunRecord,
  current: SubagentCompletionDeliveryState | undefined,
  restored: SubagentCompletionDeliveryState,
): SubagentCompletionDeliveryState {
  if (!current) {
    return restored;
  }
  const status =
    current.status === "not_required" &&
    entry.expectsCompletionMessage !== false &&
    restored.status !== "not_required"
      ? restored.status
      : current.status;
  return {
    ...restored,
    ...current,
    status,
    payload: current.payload ?? restored.payload,
    createdAt: current.createdAt ?? restored.createdAt,
    enqueuedAt: current.enqueuedAt ?? restored.enqueuedAt,
    deliveredAt: current.deliveredAt ?? restored.deliveredAt,
    announcedAt: current.announcedAt ?? restored.announcedAt,
    lastAttemptAt: current.lastAttemptAt ?? restored.lastAttemptAt,
    attemptCount: current.attemptCount ?? restored.attemptCount,
    lastError: current.lastError ?? restored.lastError,
    suspendedAt: current.suspendedAt ?? restored.suspendedAt,
    suspendedReason: current.suspendedReason ?? restored.suspendedReason,
    discardedAt: current.discardedAt ?? restored.discardedAt,
    discardReason: current.discardReason ?? restored.discardReason,
    discardedPayloadSummary: current.discardedPayloadSummary ?? restored.discardedPayloadSummary,
    lastDropReason: current.lastDropReason ?? restored.lastDropReason,
  };
}

function buildExecutionState(entry: SubagentRunRecord): SubagentExecutionState {
  if (typeof entry.endedAt === "number") {
    return {
      status: "terminal",
      startedAt: entry.startedAt,
      endedAt: entry.endedAt,
      outcome: entry.outcome,
    };
  }
  return {
    status: "running",
    startedAt: entry.startedAt,
  };
}

function buildCompletionState(
  entry: SubagentRunRecord,
  legacy: LegacySubagentRunRecord,
): SubagentCompletionState {
  return {
    required: entry.expectsCompletionMessage === true,
    ...(legacy.frozenResultText !== undefined ? { resultText: legacy.frozenResultText } : {}),
    ...(typeof legacy.frozenResultCapturedAt === "number"
      ? { capturedAt: legacy.frozenResultCapturedAt }
      : {}),
    ...(legacy.fallbackFrozenResultText !== undefined
      ? { fallbackResultText: legacy.fallbackFrozenResultText }
      : {}),
    ...(typeof legacy.fallbackFrozenResultCapturedAt === "number"
      ? { fallbackCapturedAt: legacy.fallbackFrozenResultCapturedAt }
      : {}),
  };
}

function buildDeliveryState(
  entry: SubagentRunRecord,
  legacy: LegacySubagentRunRecord,
): SubagentCompletionDeliveryState {
  if (entry.expectsCompletionMessage === false) {
    return { status: "not_required" };
  }
  if (typeof legacy.deliveryDiscardedAt === "number") {
    return {
      status: "discarded",
      discardedAt: legacy.deliveryDiscardedAt,
      discardReason: legacy.deliveryDiscardReason,
      discardedPayloadSummary: legacy.deliveryDiscardedPayloadSummary,
    };
  }
  if (typeof legacy.deliverySuspendedAt === "number") {
    return {
      status: "suspended",
      payload: legacy.pendingFinalDeliveryPayload,
      createdAt: legacy.pendingFinalDeliveryCreatedAt,
      lastAttemptAt: legacy.pendingFinalDeliveryLastAttemptAt ?? legacy.lastAnnounceRetryAt,
      attemptCount: legacy.pendingFinalDeliveryAttemptCount ?? legacy.announceRetryCount,
      lastError: legacy.pendingFinalDeliveryLastError ?? legacy.lastAnnounceDeliveryError ?? null,
      suspendedAt: legacy.deliverySuspendedAt,
      suspendedReason: legacy.deliverySuspendedReason,
      lastDropReason: legacy.lastAnnounceDropReason,
    };
  }
  if (typeof legacy.completionAnnouncedAt === "number") {
    return {
      status: "delivered",
      enqueuedAt: legacy.completionEnqueuedAt,
      deliveredAt: legacy.completionDeliveredAt ?? legacy.completionAnnouncedAt,
      announcedAt: legacy.completionAnnouncedAt,
      lastDropReason: legacy.lastAnnounceDropReason,
    };
  }
  if (legacy.pendingFinalDelivery === true || legacy.pendingFinalDeliveryPayload) {
    return {
      status: "pending",
      payload: legacy.pendingFinalDeliveryPayload,
      createdAt: legacy.pendingFinalDeliveryCreatedAt,
      lastAttemptAt: legacy.pendingFinalDeliveryLastAttemptAt ?? legacy.lastAnnounceRetryAt,
      attemptCount: legacy.pendingFinalDeliveryAttemptCount ?? legacy.announceRetryCount,
      lastError: legacy.pendingFinalDeliveryLastError ?? legacy.lastAnnounceDeliveryError ?? null,
      enqueuedAt: legacy.completionEnqueuedAt,
      deliveredAt: legacy.completionDeliveredAt,
      lastDropReason: legacy.lastAnnounceDropReason,
    };
  }
  return {
    status: typeof entry.endedAt === "number" ? "pending" : "not_required",
    enqueuedAt: legacy.completionEnqueuedAt,
    deliveredAt: legacy.completionDeliveredAt,
    lastAttemptAt: legacy.lastAnnounceRetryAt,
    attemptCount: legacy.announceRetryCount,
    lastError: legacy.lastAnnounceDeliveryError ?? null,
    lastDropReason: legacy.lastAnnounceDropReason,
  };
}

/** Ensures the completion state object exists on a mutable run record. */
export function ensureCompletionState(entry: SubagentRunRecord): SubagentCompletionState {
  entry.completion ??= {
    required: entry.expectsCompletionMessage === true,
  };
  return entry.completion;
}

/** Ensures the delivery state object exists on a mutable run record. */
export function ensureDeliveryState(entry: SubagentRunRecord): SubagentCompletionDeliveryState {
  entry.delivery ??= {
    status: entry.expectsCompletionMessage === false ? "not_required" : "pending",
  };
  return entry.delivery;
}

/** Resets delivery state while preserving whether completion delivery is required. */
export function clearDeliveryState(entry: SubagentRunRecord): void {
  entry.delivery = {
    status: entry.expectsCompletionMessage === false ? "not_required" : "pending",
  };
}

/** Returns true when delivery has been explicitly suspended with a timestamp. */
export function isDeliverySuspended(entry: SubagentRunRecord): boolean {
  return entry.delivery?.status === "suspended" && typeof entry.delivery.suspendedAt === "number";
}

/** Reads the delivery attempt count with a stable zero default. */
export function getDeliveryAttemptCount(entry: SubagentRunRecord): number {
  return entry.delivery?.attemptCount ?? 0;
}

/** Reads the last delivery attempt timestamp. */
export function getDeliveryLastAttemptAt(entry: SubagentRunRecord): number | undefined {
  return entry.delivery?.lastAttemptAt;
}

/** Reads a non-empty last delivery error if one is recorded. */
export function getDeliveryLastError(entry: SubagentRunRecord): string | undefined {
  const error = entry.delivery?.lastError;
  return typeof error === "string" && error.trim() ? error : undefined;
}
