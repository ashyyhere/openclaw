import type { AgentMessage } from "../runtime/index.js";

/** Mutable flags tracking lifecycle progress for one agent attempt. */
export type AgentAttemptLifecycleState = {
  currentTurnUserMessagePersisted: boolean;
  lifecycleFinishing: boolean;
  lifecycleEnded: boolean;
};

/** Lifecycle event shape emitted during command execution. */
export type AgentAttemptLifecycleEvent = {
  stream: string;
  data?: Record<string, unknown>;
  sessionKey?: string;
};

/** Creates callbacks that update lifecycle state from persisted messages/events. */
export function createAgentAttemptLifecycleCallbacks(state: AgentAttemptLifecycleState): {
  onUserMessagePersisted: (message: Extract<AgentMessage, { role: "user" }>) => void;
  onAgentEvent: (evt: AgentAttemptLifecycleEvent) => void;
} {
  return {
    onUserMessagePersisted: () => {
      state.currentTurnUserMessagePersisted = true;
    },
    onAgentEvent: (evt) => {
      if (evt.stream !== "lifecycle" || typeof evt.data?.phase !== "string") {
        return;
      }
      if (evt.data.phase === "finishing") {
        state.lifecycleFinishing = true;
        return;
      }
      if (evt.data.phase === "end" || evt.data.phase === "error") {
        state.lifecycleEnded = true;
      }
    },
  };
}
