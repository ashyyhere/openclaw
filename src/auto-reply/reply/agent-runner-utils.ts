// Utility helpers for reply agent setup, routing, and payload preparation.
import { getChannelPlugin } from "../../channels/plugins/index.js";
import type {
  ChannelId,
  ChannelThreadingToolContext,
} from "../../channels/plugins/types.public.js";
import { normalizeAnyChannelId, normalizeChannelId } from "../../channels/registry.js";
import { resolveCommandSecretRefsViaGateway } from "../../cli/command-secret-gateway.js";
import {
  getAgentRuntimeCommandSecretTargetIds,
  getScopedChannelsCommandSecretTargets,
} from "../../cli/command-secret-targets.js";
import { resolveMessageSecretScope } from "../../cli/message-secret-scope.js";
import {
  getRuntimeConfigSnapshot,
  getRuntimeConfigSourceSnapshot,
  selectApplicableRuntimeConfig,
  type OpenClawConfig,
} from "../../config/config.js";
import {
  normalizeOptionalLowercaseString,
  normalizeOptionalString,
} from "../../shared/string-coerce.js";
import { isReasoningTagProvider } from "../../utils/provider-utils.js";
import type { TemplateContext } from "../templating.js";
import {
  resolveProviderScopedAuthProfile,
  resolveRunAuthProfile,
} from "./agent-runner-auth-profile.js";
/** Re-exported API for src/auto-reply/reply, starting with resolve Provider Scoped Auth Profile. */
export { resolveProviderScopedAuthProfile, resolveRunAuthProfile };
import {
  buildEmbeddedRunBaseParams as buildEmbeddedRunBaseParamsCore,
  resolveEnforceFinalTagWithResolver,
} from "./agent-runner-run-params.js";
/** Re-exported API for src/auto-reply/reply, starting with resolve Model Fallback Options. */
export { resolveModelFallbackOptions } from "./agent-runner-run-params.js";
import { resolveOriginMessageProvider, resolveOriginMessageTo } from "./origin-routing.js";
import type { FollowupRun } from "./queue.js";

const BUN_FETCH_SOCKET_ERROR_RE = /socket connection was closed unexpectedly/i;

/** Reused helper for resolve Queued Reply Runtime Config behavior in src/auto-reply/reply. */
export function resolveQueuedReplyRuntimeConfig(config: OpenClawConfig): OpenClawConfig {
  const runtimeConfig =
    typeof getRuntimeConfigSnapshot === "function" ? getRuntimeConfigSnapshot() : null;
  const runtimeSourceConfig =
    typeof getRuntimeConfigSourceSnapshot === "function" ? getRuntimeConfigSourceSnapshot() : null;
  return (
    selectApplicableRuntimeConfig({
      inputConfig: config,
      runtimeConfig,
      runtimeSourceConfig,
    }) ?? config
  );
}

/** Reused helper for resolve Queued Reply Execution Config behavior in src/auto-reply/reply. */
export async function resolveQueuedReplyExecutionConfig(
  config: OpenClawConfig,
  params?: {
    originatingChannel?: string;
    messageProvider?: string;
    originatingAccountId?: string;
    agentAccountId?: string;
  },
): Promise<OpenClawConfig> {
  const runtimeConfig = resolveQueuedReplyRuntimeConfig(config);
  const { resolvedConfig } = await resolveCommandSecretRefsViaGateway({
    config: runtimeConfig,
    commandName: "reply",
    targetIds: getAgentRuntimeCommandSecretTargetIds(),
  });
  const baseResolvedConfig = resolvedConfig ?? runtimeConfig;

  const scope = resolveMessageSecretScope({
    channel: params?.originatingChannel,
    fallbackChannel: params?.messageProvider,
    accountId: params?.originatingAccountId,
    fallbackAccountId: params?.agentAccountId,
  });
  if (!scope.channel) {
    return baseResolvedConfig;
  }

  const scopedTargets = getScopedChannelsCommandSecretTargets({
    config: baseResolvedConfig,
    channel: scope.channel,
    accountId: scope.accountId,
  });
  if (scopedTargets.targetIds.size === 0) {
    return baseResolvedConfig;
  }

  const scopedResolved = await resolveCommandSecretRefsViaGateway({
    config: baseResolvedConfig,
    commandName: "reply",
    targetIds: scopedTargets.targetIds,
    ...(scopedTargets.allowedPaths ? { allowedPaths: scopedTargets.allowedPaths } : {}),
  });
  return scopedResolved.resolvedConfig ?? baseResolvedConfig;
}

/**
 * Build provider-specific threading context for tool auto-injection.
 */
export function buildThreadingToolContext(params: {
  sessionCtx: TemplateContext;
  config: OpenClawConfig | undefined;
  hasRepliedRef: { value: boolean } | undefined;
}): ChannelThreadingToolContext {
  const { sessionCtx, config, hasRepliedRef } = params;
  const isRestartSentinelContinuation =
    sessionCtx.InputProvenance?.kind === "internal_system" &&
    sessionCtx.InputProvenance.sourceTool === "restart-sentinel";
  const currentMessageId = isRestartSentinelContinuation
    ? sessionCtx.ReplyToId
    : (sessionCtx.MessageSidFull ?? sessionCtx.MessageSid);
  const originProvider = resolveOriginMessageProvider({
    originatingChannel: sessionCtx.OriginatingChannel,
    provider: sessionCtx.Provider,
  });
  const originTo = resolveOriginMessageTo({
    originatingTo: sessionCtx.OriginatingTo,
    to: sessionCtx.To,
  });
  if (!config) {
    return {
      currentMessageId,
    };
  }
  const rawProvider = normalizeOptionalLowercaseString(originProvider);
  if (!rawProvider) {
    return {
      currentMessageId,
    };
  }
  const provider = normalizeChannelId(rawProvider) ?? normalizeAnyChannelId(rawProvider);
  // Fallback for unrecognized/plugin channels (e.g., iMessage before plugin registry init)
  const threading = provider ? getChannelPlugin(provider)?.threading : undefined;
  if (!threading?.buildToolContext) {
    return {
      currentChannelId: normalizeOptionalString(originTo),
      currentChannelProvider: provider ?? (rawProvider as ChannelId),
      currentMessageId,
      hasRepliedRef,
    };
  }
  const context =
    threading.buildToolContext({
      cfg: config,
      accountId: sessionCtx.AccountId,
      context: {
        Channel: originProvider,
        From: sessionCtx.From,
        To: originTo,
        ChatType: sessionCtx.ChatType,
        CurrentMessageId: currentMessageId,
        ReplyToId: sessionCtx.ReplyToId,
        ThreadLabel: sessionCtx.ThreadLabel,
        MessageThreadId: sessionCtx.MessageThreadId,
        TransportThreadId: sessionCtx.TransportThreadId,
        NativeChannelId: sessionCtx.NativeChannelId,
      },
      hasRepliedRef,
    }) ?? {};
  return {
    ...context,
    currentChannelProvider: provider!, // guaranteed non-null since threading exists
    currentMessageId: context.currentMessageId ?? currentMessageId,
  };
}

/** Reused constant for is Bun Fetch Socket Error behavior in src/auto-reply/reply. */
export const isBunFetchSocketError = (message?: string) =>
  message ? BUN_FETCH_SOCKET_ERROR_RE.test(message) : false;

/** Reused constant for format Bun Fetch Socket Error behavior in src/auto-reply/reply. */
export const formatBunFetchSocketError = (message: string) => {
  const trimmed = message.trim();
  return [
    "⚠️ LLM connection failed. This could be due to server issues, network problems, or context length exceeded (e.g., with local LLMs like LM Studio). Original error:",
    "```",
    trimmed || "Unknown error",
    "```",
  ].join("\n");
};

/** Reused constant for resolve Enforce Final Tag behavior in src/auto-reply/reply. */
export const resolveEnforceFinalTag = (
  run: FollowupRun["run"],
  provider: string,
  model = run.model,
) => resolveEnforceFinalTagWithResolver(run, provider, model, isReasoningTagProvider);

/** Reused helper for build Embedded Run Base Params behavior in src/auto-reply/reply. */
export function buildEmbeddedRunBaseParams(
  params: Parameters<typeof buildEmbeddedRunBaseParamsCore>[0],
) {
  return buildEmbeddedRunBaseParamsCore({
    ...params,
    isReasoningTagProvider,
  });
}

function buildEmbeddedContextFromTemplate(params: {
  run: FollowupRun["run"];
  sessionCtx: TemplateContext;
  hasRepliedRef: { value: boolean } | undefined;
}) {
  const config = params.run.config;
  return {
    sessionId: params.run.sessionId,
    sessionKey: params.run.sessionKey,
    sandboxSessionKey: params.run.runtimePolicySessionKey,
    agentId: params.run.agentId,
    messageProvider: resolveOriginMessageProvider({
      originatingChannel: params.sessionCtx.OriginatingChannel,
      provider: params.sessionCtx.Provider,
    }),
    agentAccountId: params.sessionCtx.AccountId,
    messageTo: resolveOriginMessageTo({
      originatingTo: params.sessionCtx.OriginatingTo,
      to: params.sessionCtx.To,
    }),
    messageThreadId: params.sessionCtx.MessageThreadId ?? undefined,
    memberRoleIds: normalizeMemberRoleIds(params.sessionCtx.MemberRoleIds),
    // Provider threading context for tool auto-injection
    ...buildThreadingToolContext({
      sessionCtx: params.sessionCtx,
      config,
      hasRepliedRef: params.hasRepliedRef,
    }),
  };
}

function normalizeMemberRoleIds(value: TemplateContext["MemberRoleIds"]): string[] | undefined {
  const roles = Array.isArray(value)
    ? value
        .map((roleId) => normalizeOptionalString(roleId))
        .filter((roleId): roleId is string => Boolean(roleId))
    : [];
  return roles.length > 0 ? roles : undefined;
}

function buildTemplateSenderContext(sessionCtx: TemplateContext) {
  return {
    senderId: normalizeOptionalString(sessionCtx.SenderId),
    senderName: normalizeOptionalString(sessionCtx.SenderName),
    senderUsername: normalizeOptionalString(sessionCtx.SenderUsername),
    senderE164: normalizeOptionalString(sessionCtx.SenderE164),
  };
}

/** Reused helper for build Embedded Run Contexts behavior in src/auto-reply/reply. */
export function buildEmbeddedRunContexts(params: {
  run: FollowupRun["run"];
  sessionCtx: TemplateContext;
  hasRepliedRef: { value: boolean } | undefined;
  provider: string;
}) {
  return {
    authProfile: resolveRunAuthProfile(params.run, params.provider),
    embeddedContext: buildEmbeddedContextFromTemplate({
      run: params.run,
      sessionCtx: params.sessionCtx,
      hasRepliedRef: params.hasRepliedRef,
    }),
    senderContext: buildTemplateSenderContext(params.sessionCtx),
  };
}

/** Reused helper for build Embedded Run Execution Params behavior in src/auto-reply/reply. */
export function buildEmbeddedRunExecutionParams(params: {
  run: FollowupRun["run"];
  sessionCtx: TemplateContext;
  hasRepliedRef: { value: boolean } | undefined;
  provider: string;
  model: string;
  runId: string;
  allowTransientCooldownProbe?: boolean;
}) {
  const { authProfile, embeddedContext, senderContext } = buildEmbeddedRunContexts(params);
  const runBaseParams = buildEmbeddedRunBaseParams({
    run: params.run,
    provider: params.provider,
    model: params.model,
    runId: params.runId,
    authProfile,
    allowTransientCooldownProbe: params.allowTransientCooldownProbe,
  });
  return {
    embeddedContext,
    senderContext,
    runBaseParams,
  };
}
