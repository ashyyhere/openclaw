/** Compatibility type for mutable assistant event streams with a final result promise. */
import type { AssistantMessage, AssistantMessageEvent } from "../llm/types.js";

/** Async event stream contract used by older provider adapters. */
export interface MutableAssistantMessageEventStream extends AsyncIterable<AssistantMessageEvent> {
  result: () => Promise<AssistantMessage>;
}
