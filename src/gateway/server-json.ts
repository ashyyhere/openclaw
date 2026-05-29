// gateway server json helpers and runtime behavior.
import { normalizeOptionalString } from "../shared/string-coerce.js";

/** Reused helper for safe Parse Json behavior in src/gateway. */
export function safeParseJson(value: string | null | undefined): unknown {
  const trimmed = normalizeOptionalString(value);
  if (!trimmed) {
    return undefined;
  }
  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    return { payloadJSON: value };
  }
}
