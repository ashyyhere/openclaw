// gateway/server close reason helpers and runtime behavior.
import { Buffer } from "node:buffer";

const CLOSE_REASON_MAX_BYTES = 120;

/** Reused helper for truncate Close Reason behavior in src/gateway/server. */
export function truncateCloseReason(reason: string, maxBytes = CLOSE_REASON_MAX_BYTES): string {
  if (!reason) {
    return "invalid handshake";
  }
  const buf = Buffer.from(reason);
  if (buf.length <= maxBytes) {
    return reason;
  }
  return buf.subarray(0, maxBytes).toString();
}
