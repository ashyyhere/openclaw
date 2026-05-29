// hooks internal hook types helpers and runtime behavior.
/** Shared type for Internal Hook Event Type in src/hooks. */
export type InternalHookEventType = "command" | "session" | "agent" | "gateway" | "message";

/** Shared type for Internal Hook Event in src/hooks. */
export interface InternalHookEvent {
  /** The type of event (command, session, agent, gateway, etc.) */
  type: InternalHookEventType;
  /** The specific action within the type (e.g., 'new', 'reset', 'stop') */
  action: string;
  /** The session key this event relates to */
  sessionKey: string;
  /** Additional context specific to the event */
  context: Record<string, unknown>;
  /** Timestamp when the event occurred */
  timestamp: Date;
  /** Messages to send back to the user (hooks can push to this array) */
  messages: string[];
}

/** Shared type for Internal Hook Handler in src/hooks. */
export type InternalHookHandler = (event: InternalHookEvent) => Promise<void> | void;
