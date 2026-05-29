// Usage-cache status copy helpers for the usage tab refresh indicator.
import { t } from "../i18n/index.ts";
import type { SessionsUsageResult } from "./usage-types.ts";

/** Cache freshness status returned with session usage data. */
export type UsageCacheStatus = SessionsUsageResult["cacheStatus"];

/** Build tooltip text for stale, partial, or actively refreshing usage caches. */
export function getUsageCacheRefreshTitle(cacheStatus: UsageCacheStatus): string | null {
  if (
    !cacheStatus ||
    (cacheStatus.status !== "refreshing" &&
      cacheStatus.status !== "stale" &&
      cacheStatus.status !== "partial")
  ) {
    return null;
  }
  return t("usage.cacheStatus.title", {
    status: t(`usage.cacheStatus.status.${cacheStatus.status}`),
    pending: String(cacheStatus.pendingFiles),
    stale: String(cacheStatus.staleFiles),
    cached: String(cacheStatus.cachedFiles),
  });
}
