/** Resolves system prompt config flags and additive sections. */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { buildTtsSystemPromptHint } from "../tts/tts.js";
import { resolveAgentConfig } from "./agent-scope.js";
import { buildModelAliasLines } from "./model-alias-lines.js";
import { resolveOwnerDisplaySetting } from "./owner-display.js";
import { buildAgentSystemPrompt } from "./system-prompt.js";
import { resolveEffectiveToolFsWorkspaceOnly } from "./tool-fs-policy.js";

type AgentSystemPromptRenderParams = Parameters<typeof buildAgentSystemPrompt>[0];

/** Effective config-derived fields passed into system prompt rendering. */
export type ResolvedAgentSystemPromptConfig = Pick<
  AgentSystemPromptRenderParams,
  | "ownerDisplay"
  | "ownerDisplaySecret"
  | "subagentDelegationMode"
  | "ttsHint"
  | "modelAliasLines"
  | "memoryCitationsMode"
  | "fsWorkspaceOnly"
>;

/** System prompt render params plus the agent config scope used to derive defaults. */
export type ConfiguredAgentSystemPromptParams = AgentSystemPromptRenderParams & {
  config?: OpenClawConfig;
  agentId?: string;
};

/** Resolve owner display, delegation, TTS, memory, and filesystem prompt flags. */
export function resolveAgentSystemPromptConfig(params: {
  config?: OpenClawConfig;
  agentId?: string;
}): ResolvedAgentSystemPromptConfig {
  const { config, agentId } = params;
  const ownerDisplay = resolveOwnerDisplaySetting(config);
  const agentSubagents =
    config && agentId ? resolveAgentConfig(config, agentId)?.subagents : undefined;
  return {
    ownerDisplay: ownerDisplay.ownerDisplay,
    ownerDisplaySecret: ownerDisplay.ownerDisplaySecret,
    subagentDelegationMode:
      agentSubagents?.delegationMode ??
      config?.agents?.defaults?.subagents?.delegationMode ??
      "suggest",
    ttsHint: config ? buildTtsSystemPromptHint(config, agentId) : undefined,
    modelAliasLines: buildModelAliasLines(config),
    memoryCitationsMode: config?.memory?.citations,
    fsWorkspaceOnly: resolveEffectiveToolFsWorkspaceOnly({ cfg: config, agentId }),
  };
}

/** Build the agent system prompt after applying config-derived render fields. */
export function buildConfiguredAgentSystemPrompt(params: ConfiguredAgentSystemPromptParams) {
  const { config, agentId, ...renderParams } = params;
  const configParams = config ? resolveAgentSystemPromptConfig({ config, agentId }) : {};
  return buildAgentSystemPrompt({
    ...renderParams,
    ...configParams,
  });
}
