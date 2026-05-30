// Public list-page filter and result shapes for cron job service queries.
import type { CronJob, CronRunStatus } from "../types.js";

/** Enabled-state selector accepted by cron job list pages. */
export type CronJobsEnabledFilter = "all" | "enabled" | "disabled";
/** Schedule-kind selector accepted by cron job list pages. */
export type CronJobsScheduleKindFilter = "all" | "at" | "every" | "cron";
/** Last-run status selector, including unknown jobs with no completed run. */
export type CronJobsLastRunStatusFilter = "all" | CronRunStatus | "unknown";
/** Stable sort keys exposed by cron list APIs. */
export type CronJobsSortBy = "nextRunAtMs" | "updatedAtMs" | "name";
/** Sort direction used by cron list APIs. */
export type CronSortDir = "asc" | "desc";

/** Query, filter, sort, and pagination options for cron job list pages. */
export type CronListPageOptions = {
  includeDisabled?: boolean;
  limit?: number;
  offset?: number;
  query?: string;
  enabled?: CronJobsEnabledFilter;
  scheduleKind?: CronJobsScheduleKindFilter;
  lastRunStatus?: CronJobsLastRunStatusFilter;
  sortBy?: CronJobsSortBy;
  sortDir?: CronSortDir;
  agentId?: string;
};

/** Page payload returned by cron job list operations. */
export type CronListPageResult<TJobs extends readonly CronJob[] = CronJob[]> = {
  jobs: TJobs;
  total: number;
  offset: number;
  limit: number;
  hasMore: boolean;
  nextOffset: number | null;
};
