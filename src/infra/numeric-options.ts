// infra numeric options helpers and runtime behavior.
import {
  resolveIntegerOption as resolveSharedIntegerOption,
  resolveNonNegativeIntegerOption as resolveSharedNonNegativeIntegerOption,
} from "../shared/number-coercion.js";

/** Reused helper for resolve Non Negative Integer Option behavior in src/infra. */
export function resolveNonNegativeIntegerOption(value: number, fallback: number): number {
  return resolveSharedNonNegativeIntegerOption(value, fallback);
}

/** Reused helper for resolve Integer Option behavior in src/infra. */
export function resolveIntegerOption(
  value: number,
  fallback: number,
  params: { min: number },
): number {
  return resolveSharedIntegerOption(value, fallback, params);
}
