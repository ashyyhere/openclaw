/** Tiny event bus abstraction used by AgentSession runtime services. */
import { EventEmitter } from "node:events";

/** Shared type for Event Bus in src/agents/sessions. */
export interface EventBus {
  emit(channel: string, data: unknown): void;
  on(channel: string, handler: (data: unknown) => void): () => void;
}

/** Shared type for Event Bus Controller in src/agents/sessions. */
export interface EventBusController extends EventBus {
  clear(): void;
}

/** Creates an in-process event bus with unsubscribe handles. */
export function createEventBus(): EventBusController {
  const emitter = new EventEmitter();
  return {
    emit: (channel, data) => {
      emitter.emit(channel, data);
    },
    on: (channel, handler) => {
      const safeHandler = (data: unknown) => {
        try {
          handler(data);
        } catch (err) {
          console.error(`Event handler error (${channel}):`, err);
        }
      };
      emitter.on(channel, safeHandler);
      return () => emitter.off(channel, safeHandler);
    },
    clear: () => {
      emitter.removeAllListeners();
    },
  };
}
