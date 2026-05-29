// config types queue helpers and runtime behavior.
/** Shared type for Queue Mode in src/config. */
export type QueueMode = "steer" | "followup" | "collect" | "interrupt";
/** Shared type for Queue Drop Policy in src/config. */
export type QueueDropPolicy = "old" | "new" | "summarize";

/** Shared type for Queue Mode By Provider in src/config. */
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
