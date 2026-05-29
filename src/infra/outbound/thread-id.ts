// infra/outbound thread id helpers and runtime behavior.
import { normalizeOptionalStringifiedId } from "../../shared/string-coerce.js";

/** Reused helper for normalize Outbound Thread Id behavior in src/infra/outbound. */
export function normalizeOutboundThreadId(value?: string | number | null): string | undefined {
  return normalizeOptionalStringifiedId(value);
}
