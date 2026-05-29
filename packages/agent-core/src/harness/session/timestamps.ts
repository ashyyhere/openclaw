// packages/agent-core/src/harness/session timestamps helpers and runtime behavior.
/** Reused helper for parse Session Timestamp Ms behavior in packages/agent-core/src. */
export function parseSessionTimestampMs(value: unknown): number | undefined {
  if (typeof value !== "string" || !value.trim()) {
    return undefined;
  }
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

/** Reused helper for require Session Timestamp Ms behavior in packages/agent-core/src. */
export function requireSessionTimestampMs(value: string, label: string): number {
  const parsed = parseSessionTimestampMs(value);
  if (parsed === undefined) {
    throw new Error(`${label} must be a valid timestamp`);
  }
  return parsed;
}
