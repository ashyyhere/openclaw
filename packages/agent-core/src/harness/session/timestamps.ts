// Session timestamp parsing helpers shared by JSONL repositories.
/** Parse an ISO-like session timestamp into epoch milliseconds when valid. */
export function parseSessionTimestampMs(value: unknown): number | undefined {
  if (typeof value !== "string" || !value.trim()) {
    return undefined;
  }
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

/** Parse a required session timestamp or throw a labeled validation error. */
export function requireSessionTimestampMs(value: string, label: string): number {
  const parsed = parseSessionTimestampMs(value);
  if (parsed === undefined) {
    throw new Error(`${label} must be a valid timestamp`);
  }
  return parsed;
}
