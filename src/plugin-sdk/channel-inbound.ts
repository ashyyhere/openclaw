// Shared inbound parsing helpers for channel plugins.
import {
  buildChannelInboundEventContext,
  finalizeChannelInboundContext,
  filterChannelInboundQuoteContext,
  filterChannelInboundSupplementalContext,
  resolveChannelInboundSupplementalContext,
  type BuildChannelInboundEventContextAsyncParams,
  type BuildChannelInboundEventContextParams,
  type BuiltChannelInboundEventContext,
  type ChannelInboundSupplementalResolutionOptions,
  type FinalizeChannelInboundContextAsyncParams,
  type FinalizeChannelInboundContextParams,
  type FinalizeChannelInboundContextResult,
} from "../channels/inbound-event/context.js";
import type { InboundEventKind } from "../channels/inbound-event/kind.js";

/** Re-exported API for src/plugin-sdk. */
export {
  createInboundDebouncer,
  resolveInboundDebounceMs,
} from "../auto-reply/inbound-debounce.js";
/** Re-exported API for src/plugin-sdk. */
export {
  createDirectDmPreCryptoGuardPolicy,
  createPreCryptoDirectDmAuthorizer,
  dispatchInboundDirectDmWithRuntime,
  resolveInboundDirectDmAccessWithRuntime,
  type AccessGroupMembershipResolver,
  type DirectDmCommandAuthorizationRuntime,
  type DirectDmPreCryptoGuardPolicy,
  type DirectDmPreCryptoGuardPolicyOverrides,
  type ResolvedInboundDirectDmAccess,
} from "../channels/direct-dm.js";
/** Re-exported API for src/plugin-sdk. */
export {
  formatInboundEnvelope,
  formatInboundFromLabel,
  resolveEnvelopeFormatOptions,
} from "../auto-reply/envelope.js";
/** Re-exported API for src/plugin-sdk, starting with Envelope Format Options. */
export type { EnvelopeFormatOptions } from "../auto-reply/envelope.js";
/** Re-exported API for src/plugin-sdk. */
export {
  buildMentionRegexes,
  matchesMentionPatterns,
  matchesMentionWithExplicit,
  normalizeMentionText,
} from "../auto-reply/reply/mentions.js";
/** Re-exported API for src/plugin-sdk. */
export {
  createChannelInboundDebouncer,
  shouldDebounceTextInbound,
} from "../channels/inbound-debounce-policy.js";
/** Re-exported API for src/plugin-sdk. */
export type {
  InboundMentionFacts,
  InboundMentionPolicy,
  InboundImplicitMentionKind,
  InboundMentionDecision,
  MentionGateParams,
  MentionGateResult,
  MentionGateWithBypassParams,
  MentionGateWithBypassResult,
  ResolveInboundMentionDecisionFlatParams,
  ResolveInboundMentionDecisionNestedParams,
  ResolveInboundMentionDecisionParams,
} from "../channels/mention-gating.js";
/** Re-exported API for src/plugin-sdk. */
export {
  implicitMentionKindWhen,
  resolveInboundMentionDecision,
  // @deprecated Prefer `resolveInboundMentionDecision({ facts, policy })`.
  resolveMentionGating,
  // @deprecated Prefer `resolveInboundMentionDecision({ facts, policy })`.
  resolveMentionGatingWithBypass,
} from "../channels/mention-gating.js";
/** Re-exported API for src/plugin-sdk, starting with Location Source. */
export type { LocationSource, NormalizedLocation } from "../channels/location.js";
/** Re-exported API for src/plugin-sdk, starting with format Location Text. */
export { formatLocationText, toLocationContext } from "../channels/location.js";
/** Re-exported API for src/plugin-sdk, starting with Log Fn. */
export type { LogFn } from "../channels/logging.js";
/** Re-exported API for src/plugin-sdk, starting with log Inbound Drop. */
export { logInboundDrop } from "../channels/logging.js";
/** Re-exported API for src/plugin-sdk, starting with resolve Inbound Session Envelope Context. */
export { resolveInboundSessionEnvelopeContext } from "../channels/session-envelope.js";
/** Re-exported API for src/plugin-sdk. */
export {
  classifyChannelInboundEvent,
  resolveUnmentionedGroupInboundPolicy,
} from "../channels/inbound-event/classification.js";
/** Re-exported API for src/plugin-sdk, starting with Classify Channel Inbound Event Params. */
export type { ClassifyChannelInboundEventParams } from "../channels/inbound-event/classification.js";
/** Re-exported API for src/plugin-sdk. */
export {
  buildChannelInboundEventContext,
  // @deprecated Prefer `buildChannelInboundEventContext`.
  finalizeChannelInboundContext,
  filterChannelInboundQuoteContext,
  filterChannelInboundSupplementalContext,
  // @deprecated Prefer `buildChannelInboundEventContext({ resolveSupplementalMedia: true })`.
  resolveChannelInboundSupplementalContext,
};
/** Re-exported API for src/plugin-sdk. */
export type {
  BuildChannelInboundEventContextAsyncParams,
  BuildChannelInboundEventContextParams,
  BuiltChannelInboundEventContext,
  ChannelInboundSupplementalResolutionOptions,
  FinalizeChannelInboundContextAsyncParams,
  FinalizeChannelInboundContextParams,
  FinalizeChannelInboundContextResult,
};
/** @deprecated Use `BuildChannelInboundEventContextParams`. */
export type BuildChannelTurnContextParams = Omit<
  BuildChannelInboundEventContextParams,
  "message"
> & {
  message: BuildChannelInboundEventContextParams["message"] & {
    inboundTurnKind?: InboundEventKind;
  };
};
/** @deprecated Use `BuiltChannelInboundEventContext`. */
export type BuiltChannelTurnContext = BuiltChannelInboundEventContext & {
  InboundTurnKind: InboundEventKind;
};

/** @deprecated Use `buildChannelInboundEventContext`. */
export function buildChannelTurnContext(
  params: BuildChannelTurnContextParams,
): BuiltChannelTurnContext {
  const inboundEventKind = params.message.inboundEventKind ?? params.message.inboundTurnKind;
  const ctx = buildChannelInboundEventContext({
    ...params,
    message: {
      ...params.message,
      ...(inboundEventKind ? { inboundEventKind } : {}),
    },
  });
  return {
    ...ctx,
    InboundTurnKind: ctx.InboundEventKind,
  };
}

/** @deprecated Use `filterChannelInboundSupplementalContext`. */
export const filterChannelTurnSupplementalContext = filterChannelInboundSupplementalContext;
/** Re-exported API for src/plugin-sdk. */
export {
  runChannelInboundEvent,
  runPreparedInboundReply,
  dispatchChannelInboundReply,
  recordDroppedChannelInboundHistory,
  dispatchReplyFromConfigWithSettledDispatcher,
  hasFinalInboundReplyDispatch,
  hasVisibleInboundReplyDispatch,
  recordChannelBotPairLoopAndCheckSuppression,
  resolveInboundReplyDispatchCounts,
} from "../channels/message/inbound-reply-dispatch.js";
/** Re-exported API for src/plugin-sdk. */
export type {
  AssembledInboundReply,
  ChannelBotLoopProtectionFacts,
  ChannelInboundEventRunnerParams,
  ChannelInboundDroppedHistoryOptions,
  PreparedInboundReply,
  InboundReplyDispatchResult,
  InboundReplyRecordOptions,
} from "../channels/message/inbound-reply-dispatch.js";

/** Re-exported API for src/plugin-sdk. */
export {
  toHistoryMediaEntries,
  toInboundMediaFacts,
  buildChannelInboundMediaPayload,
  // @deprecated Prefer `buildChannelInboundMediaPayload`.
  buildChannelInboundMediaPayload as buildChannelTurnMediaPayload,
} from "../channels/inbound-event/media.js";
/** Re-exported API for src/plugin-sdk. */
export type {
  ChannelInboundMediaInput,
  ChannelInboundMediaInput as ChannelTurnMediaInput,
  ChannelInboundMediaPayload,
  ChannelInboundMediaPayload as ChannelTurnMediaPayload,
} from "../channels/inbound-event/media.js";
/** Re-exported API for src/plugin-sdk. */
export type {
  CommandFacts,
  InboundMediaFacts,
  SupplementalContextFacts,
} from "../channels/turn/types.js";
/** Re-exported API for src/plugin-sdk, starting with Inbound Event Kind. */
export type { InboundEventKind } from "../channels/inbound-event/kind.js";
/** Re-exported API for src/plugin-sdk, starting with Inbound Event Kind. */
export type { InboundEventKind as InboundTurnKind } from "../channels/inbound-event/kind.js";
/** Re-exported API for src/plugin-sdk. */
export {
  createCommandTurnContext,
  isAuthorizedTextSlashCommandTurn,
  isExplicitCommandTurn,
  isNativeCommandTurn,
  isTextSlashCommandTurn,
} from "../auto-reply/command-turn-context.js";
/** Re-exported API for src/plugin-sdk, starting with Command Turn Context. */
export type { CommandTurnContext } from "../auto-reply/command-turn-context.js";
/** Re-exported API for src/plugin-sdk, starting with merge Inbound Path Roots. */
export { mergeInboundPathRoots } from "../media/inbound-path-policy.js";
