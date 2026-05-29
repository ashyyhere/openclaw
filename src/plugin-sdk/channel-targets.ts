/** Public SDK barrel for channel target parsing and formatting helpers. */
export {
  applyChannelMatchMeta,
  buildChannelKeyCandidates,
  normalizeChannelSlug,
  resolveChannelEntryMatch,
  resolveChannelEntryMatchWithFallback,
  resolveChannelMatchConfig,
  resolveNestedAllowlistDecision,
  type ChannelEntryMatch,
  type ChannelMatchSource,
} from "../channels/channel-config.js";
/** Re-exported API for src/plugin-sdk. */
export {
  buildMessagingTarget,
  ensureTargetId,
  normalizeTargetId,
  parseAtUserTarget,
  parseMentionPrefixOrAtUserTarget,
  parseTargetMention,
  parseTargetPrefix,
  parseTargetPrefixes,
  requireTargetKind,
  type MessagingTarget,
  type MessagingTargetKind,
  type MessagingTargetParseOptions,
} from "../channels/targets.js";
/** Re-exported API for src/plugin-sdk. */
export {
  createAllowedChatSenderMatcher,
  parseChatAllowTargetPrefixes,
  parseChatTargetPrefixesOrThrow,
  resolveServicePrefixedAllowTarget,
  resolveServicePrefixedChatTarget,
  resolveServicePrefixedOrChatAllowTarget,
  resolveServicePrefixedTarget,
  type ChatSenderAllowParams,
  type ChatTargetPrefixesParams,
  type ParsedChatAllowTarget,
  type ParsedChatTarget,
  type ServicePrefix,
} from "../channels/plugins/chat-target-prefixes.js";
/** Re-exported API for src/plugin-sdk, starting with Channel Id. */
export type { ChannelId } from "../channels/plugins/types.public.js";
/** Re-exported API for src/plugin-sdk, starting with normalize Channel Id. */
export { normalizeChannelId } from "../channels/plugins/registry.js";
/** Re-exported API for src/plugin-sdk, starting with resolve Channel Tts Voice Delivery. */
export { resolveChannelTtsVoiceDelivery } from "../channels/plugins/tts-capabilities.js";
/** Re-exported API for src/plugin-sdk. */
export {
  buildUnresolvedTargetResults,
  resolveTargetsWithOptionalToken,
} from "../channels/plugins/target-resolvers.js";
