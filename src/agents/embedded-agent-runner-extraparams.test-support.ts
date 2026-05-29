/** Shared test harness for embedded-agent runner extra-params tests. */
import type { Context, Model } from "../llm/types.js";
import { applyExtraParamsToAgent } from "./embedded-agent-runner/extra-params.js";
import type { StreamFn } from "./runtime/index.js";

/** Reused helper for run Extra Params Payload Case behavior in src/agents. */
export function runExtraParamsPayloadCase(params: {
  provider: string;
  modelId: string;
  thinkingLevel?: "off" | "low" | "medium" | "high";
  payload?: Record<string, unknown>;
  cfg?: Record<string, unknown>;
}) {
  const payloads: Record<string, unknown>[] = [];
  const baseStreamFn: StreamFn = (model, _context, options) => {
    const payload = { ...params.payload };
    options?.onPayload?.(payload, model);
    payloads.push(payload);
    return {} as ReturnType<StreamFn>;
  };
  const agent = { streamFn: baseStreamFn };

  applyExtraParamsToAgent(
    agent,
    params.cfg as Parameters<typeof applyExtraParamsToAgent>[1],
    params.provider,
    params.modelId,
    undefined,
    params.thinkingLevel,
  );

  const model = {
    api: "openai-completions",
    provider: params.provider,
    id: params.modelId,
  } as Model<"openai-completions">;
  const context: Context = { messages: [] };
  void agent.streamFn?.(model, context, {});

  return payloads[0] ?? {};
}
