// cron schedule number helpers and runtime behavior.
import { parseStrictFiniteNumber } from "../shared/number-coercion.js";

/** Reused helper for coerce Finite Schedule Number behavior in src/cron. */
export function coerceFiniteScheduleNumber(value: unknown): number | undefined {
  return parseStrictFiniteNumber(value);
}
