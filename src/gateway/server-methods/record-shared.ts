// gateway/server-methods record shared helpers and runtime behavior.
/** Re-exported API for src/gateway/server-methods, starting with as Optional Record. */
export { asOptionalRecord as asRecord } from "../../shared/record-coerce.js";

/** Reused helper for normalize Trimmed String behavior in src/gateway/server-methods. */
export function normalizeTrimmedString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}
