// cron run id helpers and runtime behavior.
/** Reused helper for create Cron Execution Id behavior in src/cron. */
export function createCronExecutionId(jobId: string, startedAt: number): string {
  return `cron:${jobId}:${startedAt}`;
}
