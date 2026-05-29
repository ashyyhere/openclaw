// Inbound message queue mode config shared across channel providers.
/** Inbound queue behavior for concurrent messages from the same source. */
export type QueueMode = "steer" | "followup" | "collect" | "interrupt";
/** Which queued messages to drop when queue capacity is exceeded. */
export type QueueDropPolicy = "old" | "new" | "summarize";

/** Per-channel queue mode overrides. */
export type QueueModeByProvider = {
  whatsapp?: QueueMode;
  telegram?: QueueMode;
  discord?: QueueMode;
  irc?: QueueMode;
  googlechat?: QueueMode;
  slack?: QueueMode;
  mattermost?: QueueMode;
  signal?: QueueMode;
  imessage?: QueueMode;
  msteams?: QueueMode;
  webchat?: QueueMode;
  matrix?: QueueMode;
};
