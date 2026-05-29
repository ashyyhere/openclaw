// extensions/github-copilot replay policy helpers and runtime behavior.
import { normalizeLowercaseStringOrEmpty } from "openclaw/plugin-sdk/string-coerce-runtime";

export function buildGithubCopilotReplayPolicy(modelId?: string) {
  return normalizeLowercaseStringOrEmpty(modelId).includes("claude")
    ? {
        dropThinkingBlocks: true,
      }
    : {};
}
