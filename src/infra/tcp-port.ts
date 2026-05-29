// infra tcp port helpers and runtime behavior.
import { parseStrictPositiveInteger } from "./parse-finite-number.js";

/** Reused constant for MAX TCP PORT behavior in src/infra. */
export const MAX_TCP_PORT = 65_535;

/** Reused helper for parse Tcp Port behavior in src/infra. */
export function parseTcpPort(raw: unknown): number | null {
  if (raw === undefined || raw === null) {
    return null;
  }
  const parsed = parseStrictPositiveInteger(raw);
  if (parsed === undefined || parsed > MAX_TCP_PORT) {
    return null;
  }
  return parsed;
}
