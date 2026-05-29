// llm/providers/stream-wrappers stream payload utils helpers and runtime behavior.
import type { StreamFn } from "../../../agents/runtime/index.js";

/** Reused helper for stream With Payload Patch behavior in src/llm/providers. */
export function streamWithPayloadPatch(
  underlying: StreamFn,
  model: Parameters<StreamFn>[0],
  context: Parameters<StreamFn>[1],
  options: Parameters<StreamFn>[2],
  patchPayload: (payload: Record<string, unknown>) => void,
): ReturnType<StreamFn> {
  const originalOnPayload = options?.onPayload;
  return underlying(model, context, {
    ...options,
    onPayload: (payload) => {
      if (payload && typeof payload === "object") {
        patchPayload(payload as Record<string, unknown>);
      }
      return originalOnPayload?.(payload, model);
    },
  });
}
