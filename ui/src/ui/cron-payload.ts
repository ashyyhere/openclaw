// Runtime guards for cron job payloads displayed in Control UI.
import type { CronJob, CronPayload } from "./types.ts";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object");
}

/** Validate an unknown value as a supported cron payload. */
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

/** Extract a typed cron payload from a job row when present. */
export function getCronJobPayload(job: CronJob): CronPayload | null {
  const payload = (job as { payload?: unknown }).payload;
  return isCronPayload(payload) ? payload : null;
}

/** Return true when a cron job row carries a supported payload. */
export function hasCronJobPayload(job: CronJob): boolean {
  return getCronJobPayload(job) !== null;
}
