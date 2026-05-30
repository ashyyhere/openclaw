/** Resolves whether subagent session cleanup can run now or must defer. */
import { getDeliveryAttemptCount } from "./subagent-delivery-state.js";
import {
  SUBAGENT_ENDED_REASON_COMPLETE,
  type SubagentLifecycleEndedReason,
} from "./subagent-lifecycle-events.js";
import type { SubagentRunRecord } from "./subagent-registry.types.js";

type DeferredCleanupDecision =
  | {
      kind: "defer-descendants";
      delayMs: number;
    }
  | {
      kind: "give-up";
      reason: "retry-limit" | "expiry";
      retryCount?: number;
    }
  | {
      kind: "retry";
      retryCount: number;
      resumeDelayMs?: number;
    };

/** Resolves the lifecycle reason used when cleanup marks a run complete. */
export function resolveCleanupCompletionReason(
  entry: SubagentRunRecord,
): SubagentLifecycleEndedReason {
  return entry.endedReason ?? SUBAGENT_ENDED_REASON_COMPLETE;
}

function resolveEndedAgoMs(entry: SubagentRunRecord, now: number): number {
  return typeof entry.endedAt === "number" ? now - entry.endedAt : 0;
}

/** Chooses whether deferred cleanup should retry, wait for descendants, or give up. */
export function resolveDeferredCleanupDecision(params: {
  entry: SubagentRunRecord;
  now: number;
  activeDescendantRuns: number;
  announceExpiryMs: number;
  announceCompletionHardExpiryMs: number;
  maxAnnounceRetryCount: number;
  deferDescendantDelayMs: number;
  resolveAnnounceRetryDelayMs: (retryCount: number) => number;
}): DeferredCleanupDecision {
  const endedAgo = resolveEndedAgoMs(params.entry, params.now);
  const isCompletionMessageFlow = params.entry.expectsCompletionMessage === true;
  const completionHardExpiryExceeded =
    isCompletionMessageFlow && endedAgo > params.announceCompletionHardExpiryMs;
  if (isCompletionMessageFlow && params.activeDescendantRuns > 0) {
    if (completionHardExpiryExceeded) {
      return { kind: "give-up", reason: "expiry" };
    }
    return { kind: "defer-descendants", delayMs: params.deferDescendantDelayMs };
  }

  const retryCount = getDeliveryAttemptCount(params.entry) + 1;
  const expiryExceeded = isCompletionMessageFlow
    ? completionHardExpiryExceeded
    : endedAgo > params.announceExpiryMs;
  if (retryCount >= params.maxAnnounceRetryCount || expiryExceeded) {
    return {
      kind: "give-up",
      reason: retryCount >= params.maxAnnounceRetryCount ? "retry-limit" : "expiry",
      retryCount,
    };
  }

  return {
    kind: "retry",
    retryCount,
    resumeDelayMs: params.resolveAnnounceRetryDelayMs(retryCount),
  };
}
