// UI-facing aliases for shared usage and cost time-series payloads.
import type {
  SessionUsageTimePoint as SharedSessionUsageTimePoint,
  SessionUsageTimeSeries as SharedSessionUsageTimeSeries,
} from "../../../src/shared/session-usage-timeseries-types.js";
import type { SessionsUsageResult as SharedSessionsUsageResult } from "../../../src/shared/usage-types.js";

/** One session row from the shared usage result. */
export type SessionsUsageEntry = SharedSessionsUsageResult["sessions"][number];
/** Aggregate usage totals from the shared usage result. */
export type SessionsUsageTotals = SharedSessionsUsageResult["totals"];
/** Shared usage result as consumed by Control UI. */
export type SessionsUsageResult = SharedSessionsUsageResult;

/** Daily cost/usage aggregate rendered in charts. */
export type CostUsageDailyEntry = SessionsUsageTotals & { date: string };

/** Cost summary payload for the usage dashboard. */
export type CostUsageSummary = {
  updatedAt: number;
  days: number;
  daily: CostUsageDailyEntry[];
  totals: SessionsUsageTotals;
  cacheStatus?: SharedSessionsUsageResult["cacheStatus"];
};

/** Shared time-series point for per-session usage. */
export type SessionUsageTimePoint = SharedSessionUsageTimePoint;

/** Shared time-series payload for per-session usage charts. */
export type SessionUsageTimeSeries = SharedSessionUsageTimeSeries;
