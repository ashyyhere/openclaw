// shared subagents format helpers and runtime behavior.
/** Re-exported API for src/shared, starting with format Duration Compact. */
export { formatDurationCompact } from "../infra/format-time/format-duration.ts";

/** Reused helper for format Token Short behavior in src/shared. */
export function formatTokenShort(value?: number) {
  if (!value || !Number.isFinite(value) || value <= 0) {
    return undefined;
  }
  const n = Math.floor(value);
  if (n < 1_000) {
    return `${n}`;
  }
  if (n < 10_000) {
    return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  }
  if (n < 1_000_000) {
    return `${Math.round(n / 1_000)}k`;
  }
  return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}m`;
}

/** Reused helper for truncate Line behavior in src/shared. */
export function truncateLine(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }
  return `${value.slice(0, maxLength).trimEnd()}...`;
}

/** Shared type for Token Usage Like in src/shared. */
export type TokenUsageLike = {
  totalTokens?: unknown;
  inputTokens?: unknown;
  outputTokens?: unknown;
};

/** Reused helper for resolve Total Tokens behavior in src/shared. */
export function resolveTotalTokens(entry?: TokenUsageLike) {
  if (!entry || typeof entry !== "object") {
    return undefined;
  }
  if (typeof entry.totalTokens === "number" && Number.isFinite(entry.totalTokens)) {
    return entry.totalTokens;
  }
  const input = typeof entry.inputTokens === "number" ? entry.inputTokens : 0;
  const output = typeof entry.outputTokens === "number" ? entry.outputTokens : 0;
  const total = input + output;
  return total > 0 ? total : undefined;
}

/** Reused helper for resolve Io Tokens behavior in src/shared. */
export function resolveIoTokens(entry?: TokenUsageLike) {
  if (!entry || typeof entry !== "object") {
    return undefined;
  }
  const input =
    typeof entry.inputTokens === "number" && Number.isFinite(entry.inputTokens)
      ? entry.inputTokens
      : 0;
  const output =
    typeof entry.outputTokens === "number" && Number.isFinite(entry.outputTokens)
      ? entry.outputTokens
      : 0;
  const total = input + output;
  if (total <= 0) {
    return undefined;
  }
  return { input, output, total };
}

/** Reused helper for format Token Usage Display behavior in src/shared. */
export function formatTokenUsageDisplay(entry?: TokenUsageLike) {
  const io = resolveIoTokens(entry);
  const promptCache = resolveTotalTokens(entry);
  const parts: string[] = [];
  if (io) {
    const input = formatTokenShort(io.input) ?? "0";
    const output = formatTokenShort(io.output) ?? "0";
    parts.push(`tokens ${formatTokenShort(io.total)} (in ${input} / out ${output})`);
  } else if (typeof promptCache === "number" && promptCache > 0) {
    parts.push(`tokens ${formatTokenShort(promptCache)} prompt/cache`);
  }
  if (typeof promptCache === "number" && io && promptCache > io.total) {
    parts.push(`prompt/cache ${formatTokenShort(promptCache)}`);
  }
  return parts.join(", ");
}
