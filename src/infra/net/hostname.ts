// infra/net hostname helpers and runtime behavior.
import { normalizeLowercaseStringOrEmpty } from "../../shared/string-coerce.js";

/** Reused helper for normalize Hostname behavior in src/infra/net. */
export function normalizeHostname(hostname: string): string {
  const normalized = normalizeLowercaseStringOrEmpty(hostname).replace(/\.+$/, "");
  if (normalized.startsWith("[") && normalized.endsWith("]")) {
    return normalized.slice(1, -1);
  }
  return normalized;
}
