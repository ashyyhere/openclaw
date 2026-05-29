// Run parameter assembly for reply agent execution.
import { resolveEffectiveModelFallbacks } from "../../agents/agent-scope.js";
import type { resolveProviderScopedAuthProfile } from "./agent-runner-auth-profile.js";
import type { FollowupRun } from "./queue.js";

/** Shared type for Reasoning Tag Provider Resolver in src/auto-reply/reply. */
export type ReasoningTagProviderResolver = (
  provider: string,
  options: {
    config: FollowupRun["run"]["config"];
    workspaceDir: string;
    modelId: string;
  },
) => boolean;

/** Reused constant for resolve Enforce Final Tag With Resolver behavior in src/auto-reply/reply. */
export const resolveEnforceFinalTagWithResolver = (
  run: FollowupRun["run"],
  provider: string,
  model = run.model,
  isReasoningTagProvider?: ReasoningTagProviderResolver,
) =>
  (run.skipProviderRuntimeHints ? false : undefined) ??
  (run.enforceFinalTag ||
    isReasoningTagProvider?.(provider, {
      config: run.config,
      workspaceDir: run.workspaceDir,
      modelId: model,
    }) ||
    false);

/** Reused helper for resolve Model Fallback Options behavior in src/auto-reply/reply. */
export function resolveModelFallbackOptions(
  run: FollowupRun["run"],
  configOverride: FollowupRun["run"]["config"] = run.config,
) {
  const config = configOverride;
  const fallbacksOverride = resolveEffectiveModelFallbacks({
    cfg: config,
    agentId: run.agentId,
    sessionKey: run.sessionKey,
    hasSessionModelOverride: run.hasSessionModelOverride === true,
    modelOverrideSource: run.modelOverrideSource,
    hasAutoFallbackProvenance: run.hasAutoFallbackProvenance === true,
  });
  return {
    cfg: config,
    provider: run.provider,
    model: run.model,
    agentDir: run.agentDir,
    agentId: run.agentId,
    sessionKey: run.runtimePolicySessionKey ?? run.sessionKey,
    fallbacksOverride,
  };
}

/** Reused helper for build Embedded Run Base Params behavior in src/auto-reply/reply. */
export function buildEmbeddedRunBaseParams(params: {
  run: FollowupRun["run"];
  provider: string;
  model: string;
  runId: string;
  authProfile: ReturnType<typeof resolveProviderScopedAuthProfile>;
  allowTransientCooldownProbe?: boolean;
  isReasoningTagProvider?: ReasoningTagProviderResolver;
}) {
  const config = params.run.config;
  const modelFallbacksOverride = resolveEffectiveModelFallbacks({
    cfg: config,
    agentId: params.run.agentId,
    sessionKey: params.run.sessionKey,
    hasSessionModelOverride: params.run.hasSessionModelOverride === true,
    modelOverrideSource: params.run.modelOverrideSource,
    hasAutoFallbackProvenance: params.run.hasAutoFallbackProvenance === true,
  });
  return {
    sessionFile: params.run.sessionFile,
    workspaceDir: params.run.workspaceDir,
    cwd: params.run.cwd,
    agentDir: params.run.agentDir,
    config,
    skillsSnapshot: params.run.skillsSnapshot,
    ownerNumbers: params.run.ownerNumbers,
    inputProvenance: params.run.inputProvenance,
    senderIsOwner: params.run.senderIsOwner,
    enforceFinalTag: resolveEnforceFinalTagWithResolver(
      params.run,
      params.provider,
      params.model,
      params.isReasoningTagProvider,
    ),
    silentExpected: params.run.silentExpected,
    allowEmptyAssistantReplyAsSilent: params.run.allowEmptyAssistantReplyAsSilent,
    silentReplyPromptMode: params.run.silentReplyPromptMode,
    sourceReplyDeliveryMode: params.run.sourceReplyDeliveryMode,
    provider: params.provider,
    model: params.model,
    modelFallbacksOverride,
    ...params.authProfile,
    thinkLevel: params.run.thinkLevel,
    verboseLevel: params.run.verboseLevel,
    reasoningLevel: params.run.reasoningLevel,
    execOverrides: params.run.execOverrides,
    bashElevated: params.run.bashElevated,
    timeoutMs: params.run.timeoutMs,
    runId: params.runId,
    allowTransientCooldownProbe: params.allowTransientCooldownProbe,
  };
}
