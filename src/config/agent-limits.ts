// config agent limits helpers and runtime behavior.
import type { OpenClawConfig } from "./types.js";

/** Reused constant for DEFAULT AGENT MAX CONCURRENT behavior in src/config. */
export const DEFAULT_AGENT_MAX_CONCURRENT = 4;
/** Reused constant for DEFAULT SUBAGENT MAX CONCURRENT behavior in src/config. */
export const DEFAULT_SUBAGENT_MAX_CONCURRENT = 8;
/** Reused constant for DEFAULT SUBAGENT MAX CHILDREN PER AGENT behavior in src/config. */
export const DEFAULT_SUBAGENT_MAX_CHILDREN_PER_AGENT = 5;
/** Reused constant for DEFAULT SUBAGENT ARCHIVE AFTER MINUTES behavior in src/config. */
export const DEFAULT_SUBAGENT_ARCHIVE_AFTER_MINUTES = 60;
// Keep depth-1 subagents as leaves unless config explicitly opts into nesting.
/** Reused constant for DEFAULT SUBAGENT MAX SPAWN DEPTH behavior in src/config. */
export const DEFAULT_SUBAGENT_MAX_SPAWN_DEPTH = 1;

/** Reused helper for resolve Agent Max Concurrent behavior in src/config. */
export function resolveAgentMaxConcurrent(cfg?: OpenClawConfig): number {
  const raw = cfg?.agents?.defaults?.maxConcurrent;
  if (typeof raw === "number" && Number.isFinite(raw)) {
    return Math.max(1, Math.floor(raw));
  }
  return DEFAULT_AGENT_MAX_CONCURRENT;
}

/** Reused helper for resolve Subagent Max Concurrent behavior in src/config. */
export function resolveSubagentMaxConcurrent(cfg?: OpenClawConfig): number {
  const raw = cfg?.agents?.defaults?.subagents?.maxConcurrent;
  if (typeof raw === "number" && Number.isFinite(raw)) {
    return Math.max(1, Math.floor(raw));
  }
  return DEFAULT_SUBAGENT_MAX_CONCURRENT;
}
