// ui/src/ui usage types helpers and runtime behavior.
import type {
  SessionUsageTimePoint as SharedSessionUsageTimePoint,
  SessionUsageTimeSeries as SharedSessionUsageTimeSeries,
} from "../../../src/shared/session-usage-timeseries-types.js";
import type { SessionsUsageResult as SharedSessionsUsageResult } from "../../../src/shared/usage-types.js";

/** Shared type for Sessions Usage Entry in ui/src/ui. */
export type SessionsUsageEntry = SharedSessionsUsageResult["sessions"][number];
/** Shared type for Sessions Usage Totals in ui/src/ui. */
export type SessionsUsageTotals = SharedSessionsUsageResult["totals"];
/** Shared type for Sessions Usage Result in ui/src/ui. */
export type SessionsUsageResult = SharedSessionsUsageResult;

/** Shared type for Cost Usage Daily Entry in ui/src/ui. */
export type CostUsageDailyEntry = SessionsUsageTotals & { date: string };

/** Shared type for Cost Usage Summary in ui/src/ui. */
export type CostUsageSummary = {
  updatedAt: number;
  days: number;
  daily: CostUsageDailyEntry[];
  totals: SessionsUsageTotals;
  cacheStatus?: SharedSessionsUsageResult["cacheStatus"];
};

/** Shared type for Session Usage Time Point in ui/src/ui. */
export type SessionUsageTimePoint = SharedSessionUsageTimePoint;

/** Shared type for Session Usage Time Series in ui/src/ui. */
export type SessionUsageTimeSeries = SharedSessionUsageTimeSeries;
