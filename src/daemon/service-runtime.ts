// daemon service runtime helpers and runtime behavior.
import { normalizeLowercaseStringOrEmpty } from "../shared/string-coerce.js";

/** Shared type for Gateway Service Systemd Runtime in src/daemon. */
export type GatewayServiceSystemdRuntime = {
  unit?: string;
  killMode?: string;
  tasksCurrent?: number;
  memoryCurrent?: number;
};

/** Shared type for Gateway Service Runtime in src/daemon. */
export type GatewayServiceRuntime = {
  status?: string;
  state?: string;
  subState?: string;
  pid?: number;
  lastExitStatus?: number;
  lastExitReason?: string;
  lastRunResult?: string;
  lastRunTime?: string;
  detail?: string;
  cachedLabel?: boolean;
  missingUnit?: boolean;
  missingSupervision?: boolean;
  systemd?: GatewayServiceSystemdRuntime;
};

/** Reused constant for SYSTEMD TASKS CURRENT WARNING THRESHOLD behavior in src/daemon. */
export const SYSTEMD_TASKS_CURRENT_WARNING_THRESHOLD = 200;
/** Reused constant for SYSTEMD MEMORY CURRENT WARNING BYTES behavior in src/daemon. */
export const SYSTEMD_MEMORY_CURRENT_WARNING_BYTES = 2 * 1024 * 1024 * 1024;

/** Reused helper for is Risky Systemd Kill Mode behavior in src/daemon. */
export function isRiskySystemdKillMode(value: string | undefined): boolean {
  const normalized = normalizeLowercaseStringOrEmpty(value);
  return normalized === "process" || normalized === "none";
}

function formatBytesAsGiB(value: number): string {
  const gib = value / 1024 / 1024 / 1024;
  const formatted = gib >= 1 ? gib.toFixed(1).replace(/\.0$/, "") : `${value}B`;
  return gib >= 1 ? `${formatted}GiB` : formatted;
}

function describeSystemdCgroupLoadWarnings(runtime?: GatewayServiceSystemdRuntime): string[] {
  if (!runtime) {
    return [];
  }
  const killMode = runtime?.killMode;
  if (!isRiskySystemdKillMode(killMode)) {
    return [];
  }
  const details: string[] = [];
  if (
    runtime.tasksCurrent !== undefined &&
    Number.isSafeInteger(runtime.tasksCurrent) &&
    runtime.tasksCurrent >= SYSTEMD_TASKS_CURRENT_WARNING_THRESHOLD
  ) {
    details.push(`tasks=${runtime.tasksCurrent}`);
  }
  if (
    runtime.memoryCurrent !== undefined &&
    Number.isSafeInteger(runtime.memoryCurrent) &&
    runtime.memoryCurrent >= SYSTEMD_MEMORY_CURRENT_WARNING_BYTES
  ) {
    details.push(`memory=${formatBytesAsGiB(runtime.memoryCurrent)}`);
  }
  return details;
}

/** Reused helper for get Systemd Cgroup Hygiene Summary behavior in src/daemon. */
export function getSystemdCgroupHygieneSummary(
  runtime?: GatewayServiceSystemdRuntime,
): string | null {
  if (!runtime || !runtime.killMode) {
    return null;
  }
  const details = describeSystemdCgroupLoadWarnings(runtime);
  if (details.length === 0) {
    return null;
  }
  return `cgroup hygiene: KillMode=${runtime.killMode}, ${details.join(", ")}`;
}

/** Reused helper for is Systemd Cgroup Hygiene Risk behavior in src/daemon. */
export function isSystemdCgroupHygieneRisk(runtime?: GatewayServiceSystemdRuntime): boolean {
  return getSystemdCgroupHygieneSummary(runtime) !== null;
}
