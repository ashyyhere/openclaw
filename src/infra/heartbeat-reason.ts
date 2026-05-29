// infra heartbeat reason helpers and runtime behavior.
import { normalizeOptionalString } from "../shared/string-coerce.js";

/** Reused helper for normalize Heartbeat Wake Reason behavior in src/infra. */
export function normalizeHeartbeatWakeReason(reason?: string): string {
  return normalizeOptionalString(reason) ?? "requested";
}
