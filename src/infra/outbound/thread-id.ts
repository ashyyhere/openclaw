// Normalizes outbound thread ids from string or numeric channel values.
import { normalizeOptionalStringifiedId } from "../../shared/string-coerce.js";

/** Converts a non-empty thread id value into its string form. */
export function normalizeOutboundThreadId(value?: string | number | null): string | undefined {
  return normalizeOptionalStringifiedId(value);
}
