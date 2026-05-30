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

/** Inbound text debounce helpers shared by channel plugin listeners. */
export {
  createInboundDebouncer,
  resolveInboundDebounceMs,
} from "../auto-reply/inbound-debounce.js";
/** Direct-DM access guards and dispatch helpers for pre-crypto admission paths. */
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
/** Envelope formatting helpers for channel-delivered inbound messages. */
export {
  formatInboundEnvelope,
  formatInboundFromLabel,
  resolveEnvelopeFormatOptions,
} from "../auto-reply/envelope.js";
/** Options controlling how inbound channel envelopes are rendered. */
export type { EnvelopeFormatOptions } from "../auto-reply/envelope.js";
/** Mention normalization and matching helpers for channel plugins. */
export {
  buildMentionRegexes,
  matchesMentionPatterns,
  matchesMentionWithExplicit,
  normalizeMentionText,
} from "../auto-reply/reply/mentions.js";
/** Channel-level inbound debounce policy helpers. */
export {
  createChannelInboundDebouncer,
  shouldDebounceTextInbound,
} from "../channels/inbound-debounce-policy.js";
/** Mention-gating facts, policies, and result contracts for inbound events. */
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
/** Mention-gating decision helpers plus deprecated compatibility wrappers. */
export {
  implicitMentionKindWhen,
  resolveInboundMentionDecision,
  // @deprecated Prefer `resolveInboundMentionDecision({ facts, policy })`.
  resolveMentionGating,
  // @deprecated Prefer `resolveInboundMentionDecision({ facts, policy })`.
  resolveMentionGatingWithBypass,
} from "../channels/mention-gating.js";
/** Normalized location contracts used by inbound message context. */
export type { LocationSource, NormalizedLocation } from "../channels/location.js";
/** Location formatting helpers for inbound supplemental context. */
export { formatLocationText, toLocationContext } from "../channels/location.js";
/** Logger callback contract used by channel helper APIs. */
export type { LogFn } from "../channels/logging.js";
/** Structured logging helper for dropped inbound events. */
export { logInboundDrop } from "../channels/logging.js";
/** Resolves session envelope facts used when routing inbound replies. */
export { resolveInboundSessionEnvelopeContext } from "../channels/session-envelope.js";
/** Inbound event classification helpers for group and direct-message routing. */
export {
  classifyChannelInboundEvent,
  resolveUnmentionedGroupInboundPolicy,
} from "../channels/inbound-event/classification.js";
/** Parameter contract for inbound event classification. */
export type { ClassifyChannelInboundEventParams } from "../channels/inbound-event/classification.js";
/** Context assembly helpers for inbound channel event execution. */
export {
  buildChannelInboundEventContext,
  // @deprecated Prefer `buildChannelInboundEventContext`.
  finalizeChannelInboundContext,
  filterChannelInboundQuoteContext,
  filterChannelInboundSupplementalContext,
  // @deprecated Prefer `buildChannelInboundEventContext({ resolveSupplementalMedia: true })`.
  resolveChannelInboundSupplementalContext,
};
/** Context assembly parameter/result contracts for inbound channel events. */
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
/** Reply execution, dispatch, history, and loop-protection helpers for inbound events. */
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
/** Inbound reply dispatch and bot-loop contracts for channel plugins. */
export type {
  AssembledInboundReply,
  ChannelBotLoopProtectionFacts,
  ChannelInboundEventRunnerParams,
  ChannelInboundDroppedHistoryOptions,
  PreparedInboundReply,
  InboundReplyDispatchResult,
  InboundReplyRecordOptions,
} from "../channels/message/inbound-reply-dispatch.js";

/** Media normalization helpers for inbound channel event payloads. */
export {
  toHistoryMediaEntries,
  toInboundMediaFacts,
  buildChannelInboundMediaPayload,
  // @deprecated Prefer `buildChannelInboundMediaPayload`.
  buildChannelInboundMediaPayload as buildChannelTurnMediaPayload,
} from "../channels/inbound-event/media.js";
/** Media input and payload contracts for inbound channel events. */
export type {
  ChannelInboundMediaInput,
  ChannelInboundMediaInput as ChannelTurnMediaInput,
  ChannelInboundMediaPayload,
  ChannelInboundMediaPayload as ChannelTurnMediaPayload,
} from "../channels/inbound-event/media.js";
/** Shared inbound command, media, and supplemental context fact contracts. */
export type {
  CommandFacts,
  InboundMediaFacts,
  SupplementalContextFacts,
} from "../channels/turn/types.js";
/** Canonical inbound event kind used by channel turn classification. */
export type { InboundEventKind } from "../channels/inbound-event/kind.js";
/** Deprecated alias retained for older channel turn helpers. */
export type { InboundEventKind as InboundTurnKind } from "../channels/inbound-event/kind.js";
/** Text/native command turn detection helpers for inbound channel messages. */
export {
  createCommandTurnContext,
  isAuthorizedTextSlashCommandTurn,
  isExplicitCommandTurn,
  isNativeCommandTurn,
  isTextSlashCommandTurn,
} from "../auto-reply/command-turn-context.js";
/** Command turn context shape passed to command authorization helpers. */
export type { CommandTurnContext } from "../auto-reply/command-turn-context.js";
/** Merges trusted filesystem roots for inbound media path policy. */
export { mergeInboundPathRoots } from "../media/inbound-path-policy.js";
