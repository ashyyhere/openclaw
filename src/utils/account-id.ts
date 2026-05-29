// Compatibility wrapper for canonical account id normalization.
import { normalizeOptionalAccountId } from "../routing/account-id.js";

/** Normalizes optional account ids through the routing account-id helper. */
export function normalizeAccountId(value?: string): string | undefined {
  return normalizeOptionalAccountId(value);
}
