// Queue option normalization helpers.
import { normalizeOptionalLowercaseString } from "../../../shared/string-coerce.js";
import type { QueueDropPolicy, QueueMode } from "./types.js";

/** Reused helper for normalize Queue Mode behavior in src/auto-reply/reply. */
export function normalizeQueueMode(raw?: string): QueueMode | undefined {
  const cleaned = normalizeOptionalLowercaseString(raw);
  if (!cleaned) {
    return undefined;
  }
  if (cleaned === "interrupt" || cleaned === "interrupts" || cleaned === "abort") {
    return "interrupt";
  }
  if (cleaned === "steer" || cleaned === "steering") {
    return "steer";
  }
  if (cleaned === "followup" || cleaned === "follow-ups" || cleaned === "followups") {
    return "followup";
  }
  if (cleaned === "collect" || cleaned === "coalesce") {
    return "collect";
  }
  return undefined;
}

/** Reused helper for normalize Persisted Queue Mode behavior in src/auto-reply/reply. */
export function normalizePersistedQueueMode(raw?: string): QueueMode | undefined {
  const normalized = normalizeQueueMode(raw);
  if (normalized) {
    return normalized;
  }
  const cleaned = normalizeOptionalLowercaseString(raw);
  if (cleaned === "queue" || cleaned === "queued") {
    return "steer";
  }
  if (cleaned === "steer+backlog" || cleaned === "steer-backlog" || cleaned === "steer_backlog") {
    return "followup";
  }
  return undefined;
}

/** Reused helper for normalize Queue Drop Policy behavior in src/auto-reply/reply. */
export function normalizeQueueDropPolicy(raw?: string): QueueDropPolicy | undefined {
  const cleaned = normalizeOptionalLowercaseString(raw);
  if (!cleaned) {
    return undefined;
  }
  if (cleaned === "old" || cleaned === "oldest") {
    return "old";
  }
  if (cleaned === "new" || cleaned === "newest") {
    return "new";
  }
  if (cleaned === "summarize" || cleaned === "summary") {
    return "summarize";
  }
  return undefined;
}
