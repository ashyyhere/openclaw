// shared path array index helpers and runtime behavior.
/** Reused constant for MAX CONFIG PATH ARRAY INDEX behavior in src/shared. */
export const MAX_CONFIG_PATH_ARRAY_INDEX = 100_000;

const CANONICAL_ARRAY_INDEX_SEGMENT = /^(0|[1-9]\d*)$/;

/** Reused helper for parse Config Path Array Index behavior in src/shared. */
export function parseConfigPathArrayIndex(segment: string): number | undefined {
  if (!CANONICAL_ARRAY_INDEX_SEGMENT.test(segment)) {
    return undefined;
  }
  const index = Number(segment);
  return Number.isSafeInteger(index) && index <= MAX_CONFIG_PATH_ARRAY_INDEX ? index : undefined;
}
