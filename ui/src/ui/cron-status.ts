// ui/src/ui cron status helpers and runtime behavior.
import type { CronJob, CronRunStatus } from "./types.ts";

/** Shared type for Cron Job Last Run Status in ui/src/ui. */
export type CronJobLastRunStatus = CronRunStatus | "unknown";

/** Reused helper for resolve Cron Job Last Run Status behavior in ui/src/ui. */
export function resolveCronJobLastRunStatus(job: CronJob): CronJobLastRunStatus {
  return job.state?.lastRunStatus ?? job.state?.lastStatus ?? "unknown";
}
