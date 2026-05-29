// Cron status helpers for reconciling old and current last-run fields.
import type { CronJob, CronRunStatus } from "./types.ts";

/** Last run status shown for a cron job, with unknown as UI fallback. */
export type CronJobLastRunStatus = CronRunStatus | "unknown";

/** Resolve a cron job's most recent run status across current and legacy fields. */
export function resolveCronJobLastRunStatus(job: CronJob): CronJobLastRunStatus {
  return job.state?.lastRunStatus ?? job.state?.lastStatus ?? "unknown";
}
