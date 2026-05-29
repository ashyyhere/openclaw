// cron/service list page types helpers and runtime behavior.
import type { CronJob, CronRunStatus } from "../types.js";

/** Shared type for Cron Jobs Enabled Filter in src/cron/service. */
export type CronJobsEnabledFilter = "all" | "enabled" | "disabled";
/** Shared type for Cron Jobs Schedule Kind Filter in src/cron/service. */
export type CronJobsScheduleKindFilter = "all" | "at" | "every" | "cron";
/** Shared type for Cron Jobs Last Run Status Filter in src/cron/service. */
export type CronJobsLastRunStatusFilter = "all" | CronRunStatus | "unknown";
/** Shared type for Cron Jobs Sort By in src/cron/service. */
export type CronJobsSortBy = "nextRunAtMs" | "updatedAtMs" | "name";
/** Shared type for Cron Sort Dir in src/cron/service. */
export type CronSortDir = "asc" | "desc";

/** Shared type for Cron List Page Options in src/cron/service. */
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

/** Shared type for Cron List Page Result in src/cron/service. */
export type CronListPageResult<TJobs extends readonly CronJob[] = CronJob[]> = {
  jobs: TJobs;
  total: number;
  offset: number;
  limit: number;
  hasMore: boolean;
  nextOffset: number | null;
};
