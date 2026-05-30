// Normalizes heartbeat wake reasons for events and logs.
import { normalizeOptionalString } from "../shared/string-coerce.js";

/** Returns a trimmed heartbeat wake reason, defaulting to requested. */
export function normalizeHeartbeatWakeReason(reason?: string): string {
  return normalizeOptionalString(reason) ?? "requested";
}
