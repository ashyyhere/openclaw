// ui/src/ui format helpers and runtime behavior.
import { formatDurationHuman } from "../../../src/infra/format-time/format-duration.ts";
import { formatRelativeTimestamp } from "../../../src/infra/format-time/format-relative.ts";
import { asDateTimestampMs } from "../../../src/shared/number-coercion.js";
import { t } from "../i18n/index.ts";

/** Re-exported API for ui/src/ui, starting with format Relative Timestamp. */
export { formatRelativeTimestamp, formatDurationHuman };
/** Re-exported API for ui/src/ui, starting with strip Thinking Tags. */
export { stripThinkingTags } from "./strip-thinking-tags.ts";

/** Reused helper for format Unknown Text behavior in ui/src/ui. */
export function formatUnknownText(
  value: unknown,
  opts: { fallback?: string; pretty?: boolean } = {},
): string {
  const fallback = opts.fallback ?? "";
  if (value == null) {
    return fallback;
  }
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
    return String(value);
  }
  if (typeof value === "symbol") {
    return value.description ? `Symbol(${value.description})` : "Symbol()";
  }
  try {
    const serialized = JSON.stringify(value, null, opts.pretty ? 2 : undefined);
    if (serialized !== undefined) {
      return serialized;
    }
  } catch {
    // Fall back when value is not JSON-serializable.
  }
  if (value instanceof Error) {
    return value.message || value.name;
  }
  return Object.prototype.toString.call(value);
}

/** Reused helper for format Ms behavior in ui/src/ui. */
export function formatMs(ms?: number | null): string {
  const timestampMs = asDateTimestampMs(ms);
  if (timestampMs === undefined) {
    return t("common.na");
  }
  return new Date(timestampMs).toLocaleString();
}

export function formatDateMs(
  ms?: number | null,
  options?: Intl.DateTimeFormatOptions,
  fallback = t("common.na"),
): string {
  const timestampMs = asDateTimestampMs(ms);
  return timestampMs === undefined
    ? fallback
    : new Date(timestampMs).toLocaleDateString([], options);
}

export function formatTimeMs(
  ms?: number | null,
  options?: Intl.DateTimeFormatOptions,
  fallback = t("common.na"),
): string {
  const timestampMs = asDateTimestampMs(ms);
  return timestampMs === undefined
    ? fallback
    : new Date(timestampMs).toLocaleTimeString([], options);
}

export function formatDateTimeMs(
  ms?: number | null,
  options?: Intl.DateTimeFormatOptions,
  fallback = t("common.na"),
): string {
  const timestampMs = asDateTimestampMs(ms);
  return timestampMs === undefined ? fallback : new Date(timestampMs).toLocaleString([], options);
}

/** Reused helper for format List behavior in ui/src/ui. */
export function formatList(values?: Array<string | null | undefined>): string {
  if (!values || values.length === 0) {
    return "none";
  }
  return values.filter((v): v is string => Boolean(v && v.trim())).join(", ");
}

/** Reused helper for clamp Text behavior in ui/src/ui. */
export function clampText(value: string, max = 120): string {
  if (value.length <= max) {
    return value;
  }
  return `${value.slice(0, Math.max(0, max - 1))}…`;
}

/** Reused helper for truncate Text behavior in ui/src/ui. */
export function truncateText(
  value: string,
  max: number,
): {
  text: string;
  truncated: boolean;
  total: number;
} {
  if (value.length <= max) {
    return { text: value, truncated: false, total: value.length };
  }
  return {
    text: value.slice(0, Math.max(0, max)),
    truncated: true,
    total: value.length,
  };
}

/** Reused helper for to Number behavior in ui/src/ui. */
export function toNumber(value: string, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

/** Reused helper for format Cost behavior in ui/src/ui. */
export function formatCost(cost: number | null | undefined, fallback = "$0.00"): string {
  if (cost == null || !Number.isFinite(cost)) {
    return fallback;
  }
  if (cost === 0) {
    return "$0.00";
  }
  if (cost < 0.01) {
    return `$${cost.toFixed(4)}`;
  }
  if (cost < 1) {
    return `$${cost.toFixed(3)}`;
  }
  return `$${cost.toFixed(2)}`;
}

/** Reused helper for format Tokens behavior in ui/src/ui. */
export function formatTokens(tokens: number | null | undefined, fallback = "0"): string {
  if (tokens == null || !Number.isFinite(tokens)) {
    return fallback;
  }
  if (tokens < 1000) {
    return String(Math.round(tokens));
  }
  if (tokens < 1_000_000) {
    const k = tokens / 1000;
    return k < 10 ? `${k.toFixed(1)}k` : `${Math.round(k)}k`;
  }
  const m = tokens / 1_000_000;
  return m < 10 ? `${m.toFixed(1)}M` : `${Math.round(m)}M`;
}

/** Reused helper for parse Session Key Parts behavior in ui/src/ui. */
export function parseSessionKeyParts(
  key: string,
): { agentId: string; channel: string; accountId: string } | null {
  if (!key.startsWith("agent:")) {
    return null;
  }
  const rest = key.slice("agent:".length);
  const firstColon = rest.indexOf(":");
  if (firstColon < 1) {
    return null;
  }
  const agentId = rest.slice(0, firstColon);
  const afterAgent = rest.slice(firstColon + 1);
  const secondColon = afterAgent.indexOf(":");
  if (secondColon < 1) {
    return null;
  }
  const channel = afterAgent.slice(0, secondColon);
  const accountId = afterAgent.slice(secondColon + 1);
  if (!accountId) {
    return null;
  }
  return { agentId, channel, accountId };
}
