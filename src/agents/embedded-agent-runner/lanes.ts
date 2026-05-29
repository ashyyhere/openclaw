/** Resolves command lanes for embedded-agent runs and sessions. */
import { CommandLane } from "../../process/lanes.js";

/** Reused helper for resolve Session Lane behavior in src/agents/embedded-agent-runner. */
export function resolveSessionLane(key: string) {
  const cleaned = key.trim() || CommandLane.Main;
  return cleaned.startsWith("session:") ? cleaned : `session:${cleaned}`;
}

/** Reused helper for resolve Global Lane behavior in src/agents/embedded-agent-runner. */
export function resolveGlobalLane(lane?: string) {
  const cleaned = lane?.trim();
  // Cron jobs hold the cron lane slot; inner operations need a dedicated lane
  // to avoid deadlock without widening shared nested flows.
  if (cleaned === CommandLane.Cron) {
    return CommandLane.CronNested;
  }
  return cleaned ? cleaned : CommandLane.Main;
}

/** Reused helper for resolve Embedded Session Lane behavior in src/agents/embedded-agent-runner. */
export function resolveEmbeddedSessionLane(key: string) {
  return resolveSessionLane(key);
}
