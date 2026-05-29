// shared node presence helpers and runtime behavior.
import { normalizeOptionalString } from "./string-coerce.js";

/** Reused constant for NODE PRESENCE ALIVE EVENT behavior in src/shared. */
export const NODE_PRESENCE_ALIVE_EVENT = "node.presence.alive";

const NODE_PRESENCE_ALIVE_REASONS = [
  "background",
  "silent_push",
  "bg_app_refresh",
  "significant_location",
  "manual",
  "connect",
] as const;

/** Shared type for Node Presence Alive Reason in src/shared. */
export type NodePresenceAliveReason = (typeof NODE_PRESENCE_ALIVE_REASONS)[number];

const NODE_PRESENCE_ALIVE_REASON_SET = new Set<string>(NODE_PRESENCE_ALIVE_REASONS);

/** Reused helper for normalize Node Presence Alive Reason behavior in src/shared. */
export function normalizeNodePresenceAliveReason(value: unknown): NodePresenceAliveReason {
  const normalized = normalizeOptionalString(value)?.toLowerCase();
  if (normalized && NODE_PRESENCE_ALIVE_REASON_SET.has(normalized)) {
    return normalized as NodePresenceAliveReason;
  }
  return "background";
}
