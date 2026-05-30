// Normalizes hostnames for network policy comparisons before SSRF/proxy checks.
import { normalizeLowercaseStringOrEmpty } from "../../shared/string-coerce.js";

/** Lowercases a hostname, strips trailing dots, and unwraps bracketed IPv6 literals. */
export function normalizeHostname(hostname: string): string {
  const normalized = normalizeLowercaseStringOrEmpty(hostname).replace(/\.+$/, "");
  if (normalized.startsWith("[") && normalized.endsWith("]")) {
    return normalized.slice(1, -1);
  }
  return normalized;
}
