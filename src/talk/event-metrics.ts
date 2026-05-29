// Shared Talk event payload helpers used by logging and diagnostics.
/** Narrows arbitrary Talk event payloads to record-shaped metric input. */
export { asOptionalRecord as talkEventPayloadRecord } from "../shared/record-coerce.js";

/** Returns the first non-negative finite numeric metric from a payload. */
export function firstFiniteTalkEventNumber(
  record: Record<string, unknown> | undefined,
  keys: readonly string[],
): number | undefined {
  if (!record) {
    return undefined;
  }
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
      return value;
    }
  }
  return undefined;
}
