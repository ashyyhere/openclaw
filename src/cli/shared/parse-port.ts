/** CLI wrapper around shared TCP port parsing helpers. */
import { parseTcpPort } from "../../infra/tcp-port.js";

/** Re-exported API for src/cli/shared, starting with MAX TCP PORT. */
export { MAX_TCP_PORT, parseTcpPort } from "../../infra/tcp-port.js";

/** Reused helper for parse Port behavior in src/cli/shared. */
export function parsePort(raw: unknown): number | null {
  return parseTcpPort(raw);
}
