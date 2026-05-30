/** Resolves command lanes for embedded-agent runs and sessions. */
import { CommandLane } from "../../process/lanes.js";

/** Converts a session key into the command lane name for serialized session work. */
export function resolveSessionLane(key: string) {
  const cleaned = key.trim() || CommandLane.Main;
  return cleaned.startsWith("session:") ? cleaned : `session:${cleaned}`;
}

/** Resolves the outer run lane, using a nested lane for cron-owned work. */
export function resolveGlobalLane(lane?: string) {
  const cleaned = lane?.trim();
  // Cron jobs hold the cron lane slot; inner operations need a dedicated lane
  // to avoid deadlock without widening shared nested flows.
  if (cleaned === CommandLane.Cron) {
    return CommandLane.CronNested;
  }
  return cleaned ? cleaned : CommandLane.Main;
}

/** Compatibility wrapper for callers that name the lane as embedded-session scoped. */
export function resolveEmbeddedSessionLane(key: string) {
  return resolveSessionLane(key);
}
