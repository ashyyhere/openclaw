/** Agent command-lane constants and nested-lane resolution helpers. */
import { CommandLane } from "../process/lanes.js";

/** Default lane for nested agent work. */
export const AGENT_LANE_NESTED = CommandLane.Nested;
/** Lane for nested work spawned from cron jobs. */
export const AGENT_LANE_CRON_NESTED = CommandLane.CronNested;
/** Lane for subagent work. */
export const AGENT_LANE_SUBAGENT = CommandLane.Subagent;
const AGENT_LANE_CRON: string = CommandLane.Cron;
const NESTED_LANE = "nested";
const NESTED_LANE_PREFIX = `${NESTED_LANE}:`;

/** Resolve a nested-agent lane with default fallback. */
export function resolveNestedAgentLane(lane?: string): string {
  const trimmed = lane?.trim();
  if (!trimmed) {
    return AGENT_LANE_NESTED;
  }
  return trimmed;
}

/** Resolve the lane to use for agent work spawned from cron. */
export function resolveCronAgentLane(lane?: string): string {
  const trimmed = lane?.trim();
  // Cron jobs already occupy the outer cron lane, so inner agent work needs
  // its own lane to avoid self-deadlock without widening shared nested flows.
  if (!trimmed || trimmed === AGENT_LANE_CRON) {
    return AGENT_LANE_CRON_NESTED;
  }
  return trimmed;
}

/** Resolve a per-session nested-agent lane. */
export function resolveNestedAgentLaneForSession(sessionKey: string | undefined): string {
  const trimmed = sessionKey?.trim();
  if (!trimmed) {
    return AGENT_LANE_NESTED;
  }
  return `${NESTED_LANE_PREFIX}${trimmed}`;
}

/** Return whether a lane belongs to nested-agent execution. */
export function isNestedAgentLane(lane: string | undefined): boolean {
  if (!lane) {
    return false;
  }
  return lane === NESTED_LANE || lane.startsWith(NESTED_LANE_PREFIX);
}
