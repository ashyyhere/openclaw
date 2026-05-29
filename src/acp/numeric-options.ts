/** ACP-local numeric option coercion wrapper. */
import { resolveIntegerOption as resolveSharedIntegerOption } from "../shared/number-coercion.js";

/** Resolve an integer option with ACP call-site naming. */
export function resolveIntegerOption(
  value: number | undefined,
  fallback: number,
  params: { min: number },
): number {
  return resolveSharedIntegerOption(value, fallback, params);
}
