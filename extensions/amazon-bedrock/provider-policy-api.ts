// extensions/amazon-bedrock provider policy api helpers and runtime behavior.
import { normalizeProviderId } from "openclaw/plugin-sdk/provider-model-shared";
import { resolveBedrockClaudeThinkingProfile } from "./thinking-policy.js";

export function resolveThinkingProfile(params: { provider: string; modelId: string }) {
  if (normalizeProviderId(params.provider) !== "amazon-bedrock") {
    return null;
  }
  return resolveBedrockClaudeThinkingProfile(params.modelId);
}
