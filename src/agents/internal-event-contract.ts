/** Shared constants and enums for internal agent events. */
/** Internal event type for child task completion. */
export const AGENT_INTERNAL_EVENT_TYPE_TASK_COMPLETION = "task_completion" as const;

/** Sources that can emit internal task-completion events. */
export const AGENT_INTERNAL_EVENT_SOURCES = [
  "subagent",
  "cron",
  "image_generation",
  "video_generation",
  "music_generation",
] as const;

/** Status values for internal task-completion events. */
export const AGENT_INTERNAL_EVENT_STATUSES = ["ok", "timeout", "error", "unknown"] as const;

/** Source enum for internal agent events. */
export type AgentInternalEventSource = (typeof AGENT_INTERNAL_EVENT_SOURCES)[number];
/** Status enum for internal agent events. */
export type AgentInternalEventStatus = (typeof AGENT_INTERNAL_EVENT_STATUSES)[number];
