// ui/src/ui usage cache status helpers and runtime behavior.
import { t } from "../i18n/index.ts";
import type { SessionsUsageResult } from "./usage-types.ts";

/** Shared type for Usage Cache Status in ui/src/ui. */
export type UsageCacheStatus = SessionsUsageResult["cacheStatus"];

/** Reused helper for get Usage Cache Refresh Title behavior in ui/src/ui. */
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
