// ui/src/ui cron payload helpers and runtime behavior.
import type { CronJob, CronPayload } from "./types.ts";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object");
}

/** Reused helper for is Cron Payload behavior in ui/src/ui. */
export function isCronPayload(value: unknown): value is CronPayload {
  if (!isRecord(value)) {
    return false;
  }
  if (value.kind === "systemEvent") {
    return typeof value.text === "string";
  }
  if (value.kind === "agentTurn") {
    return typeof value.message === "string";
  }
  return false;
}

/** Reused helper for get Cron Job Payload behavior in ui/src/ui. */
export function getCronJobPayload(job: CronJob): CronPayload | null {
  const payload = (job as { payload?: unknown }).payload;
  return isCronPayload(payload) ? payload : null;
}

/** Reused helper for has Cron Job Payload behavior in ui/src/ui. */
export function hasCronJobPayload(job: CronJob): boolean {
  return getCronJobPayload(job) !== null;
}
