import { resolveTimerTimeoutMs } from "../shared/number-coercion.js";
import { parseFiniteNumber as parseFiniteNumberish } from "./parse-finite-number.js";
import { PROVIDER_LABELS } from "./provider-usage.shared.js";
import type { ProviderUsageSnapshot, UsageProviderId } from "./provider-usage.types.js";

/** Reused helper for fetch Json behavior in src/infra. */
export async function fetchJson(
  url: string,
  init: RequestInit,
  timeoutMs: number,
  fetchFn: typeof fetch,
): Promise<Response> {
  const safeTimeoutMs = resolveTimerTimeoutMs(timeoutMs, 1);
  const controller = new AbortController();
  const timer = setTimeout(controller.abort.bind(controller), safeTimeoutMs);
  try {
    return await fetchFn(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/** Reused helper for parse Finite Number behavior in src/infra. */
export function parseFiniteNumber(value: unknown): number | undefined {
  return parseFiniteNumberish(value);
}

type BuildUsageHttpErrorSnapshotOptions = {
  provider: UsageProviderId;
  status: number;
  message?: string;
  tokenExpiredStatuses?: readonly number[];
};

/** Reused helper for build Usage Error Snapshot behavior in src/infra. */
export function buildUsageErrorSnapshot(
  provider: UsageProviderId,
  error: string,
): ProviderUsageSnapshot {
  return {
    provider,
    displayName: PROVIDER_LABELS[provider],
    windows: [],
    error,
  };
}

/** Reused helper for build Usage Http Error Snapshot behavior in src/infra. */
export function buildUsageHttpErrorSnapshot(
  options: BuildUsageHttpErrorSnapshotOptions,
): ProviderUsageSnapshot {
  const tokenExpiredStatuses = options.tokenExpiredStatuses ?? [];
  if (tokenExpiredStatuses.includes(options.status)) {
    return buildUsageErrorSnapshot(options.provider, "Token expired");
  }
  const suffix = options.message?.trim() ? `: ${options.message.trim()}` : "";
  return buildUsageErrorSnapshot(options.provider, `HTTP ${options.status}${suffix}`);
}

/** Reused helper for read Usage Json behavior in src/infra. */
export async function readUsageJson(
  provider: UsageProviderId,
  response: Response,
): Promise<{ ok: true; data: unknown } | { ok: false; snapshot: ProviderUsageSnapshot }> {
  try {
    return { ok: true, data: await response.json() };
  } catch {
    return {
      ok: false,
      snapshot: buildUsageErrorSnapshot(provider, "Malformed usage response"),
    };
  }
}
