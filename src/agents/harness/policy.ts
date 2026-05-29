/** Resolves which agent harness should run for a provider/model request. */
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { AUTO_AGENT_RUNTIME_ID, type EmbeddedAgentRuntime } from "../agent-runtime-id.js";
import { normalizeOptionalAgentRuntimeId } from "../agent-runtime-id.js";
import { resolveModelRuntimePolicy } from "../model-runtime-policy.js";
import { openAIProviderUsesCodexRuntimeByDefault } from "../openai-codex-routing.js";

/** Shared type for Agent Harness Policy in src/agents/harness. */
export type AgentHarnessPolicy = {
  runtime: EmbeddedAgentRuntime;
  runtimeSource?: "model" | "provider" | "implicit";
};

/** Computes requested/effective runtime policy and external-harness allowance. */
export function resolveAgentHarnessPolicy(params: {
  provider?: string;
  modelId?: string;
  config?: OpenClawConfig;
  agentId?: string;
  sessionKey?: string;
  env?: NodeJS.ProcessEnv;
}): AgentHarnessPolicy {
  const configured = resolveModelRuntimePolicy({
    config: params.config,
    provider: params.provider,
    modelId: params.modelId,
    agentId: params.agentId,
    sessionKey: params.sessionKey,
  });
  const configuredRuntime = normalizeOptionalAgentRuntimeId(configured.policy?.id);
  const runtimeSource = configured.source ?? "implicit";
  const runtime =
    configuredRuntime && configuredRuntime !== "default"
      ? configuredRuntime
      : AUTO_AGENT_RUNTIME_ID;
  if (
    openAIProviderUsesCodexRuntimeByDefault({ provider: params.provider, config: params.config })
  ) {
    if (runtime === "auto") {
      return { runtime: "codex", runtimeSource };
    }
    return { runtime, runtimeSource };
  }
  return {
    runtime,
    runtimeSource,
  };
}
