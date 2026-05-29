// cron active jobs helpers and runtime behavior.
import { resolveGlobalSingleton } from "../shared/global-singleton.js";

type CronActiveJobState = {
  activeJobIds: Set<string>;
};

const CRON_ACTIVE_JOB_STATE_KEY = Symbol.for("openclaw.cron.activeJobs");

function getCronActiveJobState(): CronActiveJobState {
  return resolveGlobalSingleton<CronActiveJobState>(CRON_ACTIVE_JOB_STATE_KEY, () => ({
    activeJobIds: new Set<string>(),
  }));
}

/** Reused helper for mark Cron Job Active behavior in src/cron. */
export function markCronJobActive(jobId: string) {
  if (!jobId) {
    return;
  }
  getCronActiveJobState().activeJobIds.add(jobId);
}

/** Reused helper for clear Cron Job Active behavior in src/cron. */
export function clearCronJobActive(jobId: string) {
  if (!jobId) {
    return;
  }
  getCronActiveJobState().activeJobIds.delete(jobId);
}

/** Reused helper for is Cron Job Active behavior in src/cron. */
export function isCronJobActive(jobId: string) {
  if (!jobId) {
    return false;
  }
  return getCronActiveJobState().activeJobIds.has(jobId);
}

/** Reused helper for has Active Cron Jobs behavior in src/cron. */
export function hasActiveCronJobs() {
  return getCronActiveJobState().activeJobIds.size > 0;
}

/** Reused helper for reset Cron Active Jobs For Tests behavior in src/cron. */
export function resetCronActiveJobsForTests() {
  getCronActiveJobState().activeJobIds.clear();
}
