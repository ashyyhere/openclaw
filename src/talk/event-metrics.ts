// talk event metrics helpers and runtime behavior.
/** Re-exported API for src/talk, starting with as Optional Record. */
export { asOptionalRecord as talkEventPayloadRecord } from "../shared/record-coerce.js";

/** Reused helper for first Finite Talk Event Number behavior in src/talk. */
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
