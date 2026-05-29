/** Wraps mutable assistant stream object events with observer callbacks. */
import type { MutableAssistantMessageEventStream } from "../../stream-compat.js";
import { createStreamIteratorWrapper } from "../../stream-iterator-wrapper.js";

/** Calls an observer for each object event yielded by an assistant stream. */
export function wrapStreamObjectEvents(
  stream: MutableAssistantMessageEventStream,
  onEvent: (event: Record<string, unknown>) => void | Promise<void>,
): MutableAssistantMessageEventStream {
  const originalAsyncIterator = stream[Symbol.asyncIterator].bind(stream);
  (stream as { [Symbol.asyncIterator]: typeof originalAsyncIterator })[Symbol.asyncIterator] =
    function () {
      const iterator = originalAsyncIterator();
      return createStreamIteratorWrapper({
        iterator,
        next: async (streamIterator) => {
          const result = await streamIterator.next();
          if (!result.done && result.value && typeof result.value === "object") {
            await onEvent(result.value as Record<string, unknown>);
          }
          return result;
        },
      });
    };
  return stream;
}
