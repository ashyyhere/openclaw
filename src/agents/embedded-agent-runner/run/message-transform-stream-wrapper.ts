/** Wraps streams with message transforms before provider submission. */
import type { StreamFn } from "openclaw/plugin-sdk/agent-core";
import type { AgentMessage } from "../../runtime/index.js";

/** Function that can replace provider-bound messages before stream dispatch. */
export type MessageTransform = (messages: AgentMessage[], model: unknown) => AgentMessage[];

/** Applies a message transform to each stream invocation while preserving options. */
export function wrapStreamFnWithMessageTransform(
  streamFn: StreamFn,
  transform: MessageTransform,
): StreamFn {
  return (model, context, options) => {
    const messages = (context as unknown as { messages?: unknown })?.messages;
    if (!Array.isArray(messages)) {
      return streamFn(model, context, options);
    }

    const nextMessages = transform(messages as AgentMessage[], model);
    if (nextMessages === messages) {
      return streamFn(model, context, options);
    }

    return streamFn(
      model,
      {
        ...(context as unknown as Record<string, unknown>),
        messages: nextMessages,
      } as typeof context,
      options,
    );
  };
}
