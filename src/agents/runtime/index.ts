/** Re-exports the agent-core runtime through OpenClaw's plugin-sdk facade. */
import {
  Agent as CoreAgent,
  type AgentOptions as CoreAgentOptions,
} from "../../../packages/agent-core/src/agent.js";
import type { AgentCoreRuntimeDeps } from "../../../packages/agent-core/src/runtime-deps.js";
import type { CompleteSimpleFn, StreamFn } from "../../../packages/llm-core/src/index.js";
import { completeSimple, streamSimple } from "../../plugin-sdk/llm.js";

/** Reused constant for open Claw Agent Core Runtime behavior in src/agents/runtime. */
export const openClawAgentCoreRuntime = {
  completeSimple: completeSimple as unknown as CompleteSimpleFn,
  streamSimple: streamSimple as unknown as StreamFn,
} satisfies AgentCoreRuntimeDeps;

/** Reused class for Agent behavior in src/agents/runtime. */
export class Agent extends CoreAgent {
  constructor(options: CoreAgentOptions = {}) {
    super({ runtime: openClawAgentCoreRuntime, ...options });
  }
}

// OpenClaw-owned reusable agent core
export * from "../../../packages/agent-core/src/index.js";
// Proxy utilities
export * from "./proxy.js";
