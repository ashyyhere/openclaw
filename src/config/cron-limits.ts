// config cron limits helpers and runtime behavior.
import type { CronConfig } from "./types.cron.js";

/** Reused constant for DEFAULT CRON MAX CONCURRENT RUNS behavior in src/config. */
export const DEFAULT_CRON_MAX_CONCURRENT_RUNS = 8;

/** Reused helper for resolve Cron Max Concurrent Runs behavior in src/config. */
export function resolveCronMaxConcurrentRuns(
  cronConfig?: Pick<CronConfig, "maxConcurrentRuns">,
): number {
  const raw = cronConfig?.maxConcurrentRuns;
  if (typeof raw === "number" && Number.isFinite(raw)) {
    return Math.max(1, Math.floor(raw));
  }
  return DEFAULT_CRON_MAX_CONCURRENT_RUNS;
}
