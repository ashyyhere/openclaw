// Parses TCP port values into valid positive port numbers.
import { parseStrictPositiveInteger } from "./parse-finite-number.js";

/** Highest valid TCP/UDP port number. */
export const MAX_TCP_PORT = 65_535;

/** Parses unknown input as a TCP port or returns null when invalid/out of range. */
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
