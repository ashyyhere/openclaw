// shared assistant identity values helpers and runtime behavior.
import { normalizeOptionalString } from "./string-coerce.js";

/** Reused helper for coerce Identity Value behavior in src/shared. */
export function coerceIdentityValue(
  value: string | undefined,
  maxLength: number,
): string | undefined {
  const trimmed = normalizeOptionalString(value);
  if (!trimmed) {
    return undefined;
  }
  if (trimmed.length <= maxLength) {
    return trimmed;
  }
  return trimmed.slice(0, maxLength);
}
