// Error helpers for model-list availability fallbacks and diagnostics.
/** Reused constant for MODEL AVAILABILITY UNAVAILABLE CODE behavior in src/commands/models. */
export const MODEL_AVAILABILITY_UNAVAILABLE_CODE = "MODEL_AVAILABILITY_UNAVAILABLE";

/** Reused helper for format Error With Stack behavior in src/commands/models. */
export function formatErrorWithStack(err: unknown): string {
  if (err instanceof Error) {
    return err.stack ?? `${err.name}: ${err.message}`;
  }
  return String(err);
}

/** Reused helper for should Fallback To Auth Heuristics behavior in src/commands/models. */
export function shouldFallbackToAuthHeuristics(err: unknown): boolean {
  if (!(err instanceof Error)) {
    return false;
  }
  const code = (err as { code?: unknown }).code;
  return code === MODEL_AVAILABILITY_UNAVAILABLE_CODE;
}
