// llm/providers/stream-wrappers moonshot helpers and runtime behavior.
import type { StreamFn } from "../../../agents/runtime/index.js";
import type { ThinkLevel } from "../../../auto-reply/thinking.js";
import { streamSimple } from "../../stream.js";
import { streamWithPayloadPatch } from "./stream-payload-utils.js";

/** Re-exported API for src/llm/providers. */
export {
  createMoonshotThinkingWrapper,
  resolveMoonshotThinkingKeep,
  resolveMoonshotThinkingType,
} from "./moonshot-thinking.js";

/** Reused helper for should Apply Silicon Flow Thinking Off Compat behavior in src/llm/providers. */
export function shouldApplySiliconFlowThinkingOffCompat(params: {
  provider: string;
  modelId: string;
  thinkingLevel?: ThinkLevel;
}): boolean {
  return (
    params.provider === "siliconflow" &&
    params.thinkingLevel === "off" &&
    params.modelId.startsWith("Pro/")
  );
}

/** Reused helper for create Silicon Flow Thinking Wrapper behavior in src/llm/providers. */
export function createSiliconFlowThinkingWrapper(baseStreamFn: StreamFn | undefined): StreamFn {
  const underlying = baseStreamFn ?? streamSimple;
  return (model, context, options) =>
    streamWithPayloadPatch(underlying, model, context, options, (payloadObj) => {
      if (payloadObj.thinking === "off") {
        payloadObj.thinking = null;
      }
    });
}
