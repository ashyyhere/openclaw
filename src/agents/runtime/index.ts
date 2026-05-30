import {
  Agent as CoreAgent,
  type AgentOptions as CoreAgentOptions,
} from "../../../packages/agent-core/src/agent.js";
import type { AgentCoreRuntimeDeps } from "../../../packages/agent-core/src/runtime-deps.js";
import type { CompleteSimpleFn, StreamFn } from "../../../packages/llm-core/src/index.js";
import { completeSimple, streamSimple } from "../../plugin-sdk/llm.js";

/** Runtime dependency bridge from agent-core to OpenClaw's LLM plugin SDK facade. */
export const openClawAgentCoreRuntime = {
  completeSimple: completeSimple as unknown as CompleteSimpleFn,
  streamSimple: streamSimple as unknown as StreamFn,
} satisfies AgentCoreRuntimeDeps;

/** Agent-core wrapper that injects OpenClaw runtime dependencies by default. */
export class Agent extends CoreAgent {
  constructor(options: CoreAgentOptions = {}) {
    super({ runtime: openClawAgentCoreRuntime, ...options });
  }
}

/** OpenClaw-owned reusable agent-core public API. */
export * from "../../../packages/agent-core/src/index.js";
/** Proxy utilities for server-routed LLM streaming. */
export * from "./proxy.js";
