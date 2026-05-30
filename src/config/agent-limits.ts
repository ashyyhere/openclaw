// Defaults and resolvers for agent and subagent concurrency limits.
import type { OpenClawConfig } from "./types.js";

/** Default maximum concurrently active top-level agents. */
export const DEFAULT_AGENT_MAX_CONCURRENT = 4;
/** Default maximum concurrently active subagents across the runtime. */
export const DEFAULT_SUBAGENT_MAX_CONCURRENT = 8;
/** Default number of child subagents one parent agent may spawn. */
export const DEFAULT_SUBAGENT_MAX_CHILDREN_PER_AGENT = 5;
/** Default idle age before subagent sessions become archive candidates. */
export const DEFAULT_SUBAGENT_ARCHIVE_AFTER_MINUTES = 60;
// Keep depth-1 subagents as leaves unless config explicitly opts into nesting.
/** Default maximum nested subagent spawn depth. */
export const DEFAULT_SUBAGENT_MAX_SPAWN_DEPTH = 1;

/** Resolve top-level agent concurrency, clamping invalid config to the default. */
export function resolveAgentMaxConcurrent(cfg?: OpenClawConfig): number {
  const raw = cfg?.agents?.defaults?.maxConcurrent;
  if (typeof raw === "number" && Number.isFinite(raw)) {
    return Math.max(1, Math.floor(raw));
  }
  return DEFAULT_AGENT_MAX_CONCURRENT;
}

/** Resolve subagent concurrency, clamping invalid config to the default. */
export function resolveSubagentMaxConcurrent(cfg?: OpenClawConfig): number {
  const raw = cfg?.agents?.defaults?.subagents?.maxConcurrent;
  if (typeof raw === "number" && Number.isFinite(raw)) {
    return Math.max(1, Math.floor(raw));
  }
  return DEFAULT_SUBAGENT_MAX_CONCURRENT;
}
