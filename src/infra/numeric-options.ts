/** Infra-facing wrappers for shared numeric option coercion helpers. */
import {
  resolveIntegerOption as resolveSharedIntegerOption,
  resolveNonNegativeIntegerOption as resolveSharedNonNegativeIntegerOption,
} from "../shared/number-coercion.js";

/** Resolve a non-negative integer option or fall back. */
export function resolveNonNegativeIntegerOption(value: number, fallback: number): number {
  return resolveSharedNonNegativeIntegerOption(value, fallback);
}

/** Resolve an integer option with a minimum bound or fall back. */
export function resolveIntegerOption(
  value: number,
  fallback: number,
  params: { min: number },
): number {
  return resolveSharedIntegerOption(value, fallback, params);
}
