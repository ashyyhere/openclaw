// extensions/imessage api helpers and runtime behavior.
/** Re-exported imessage plugin public API, starting with imessage Plugin. */
export { imessagePlugin } from "./src/channel.js";
/** Re-exported imessage plugin public API, starting with imessage Setup Plugin. */
export { imessageSetupPlugin } from "./src/channel.setup.js";
/** Re-exported imessage plugin public API. */
export {
  listEnabledIMessageAccounts,
  listIMessageAccountIds,
  resolveDefaultIMessageAccountId,
  type ResolvedIMessageAccount,
  resolveIMessageAccount,
} from "./src/accounts.js";
/** Re-exported imessage plugin public API. */
export {
  testing,
  testing as __testing,
  createIMessageConversationBindingManager,
} from "./src/conversation-bindings.js";
/** Re-exported imessage plugin public API. */
export {
  matchIMessageAcpConversation,
  normalizeIMessageAcpConversationId,
  resolveIMessageConversationIdFromTarget,
  resolveIMessageInboundConversationId,
} from "./src/conversation-id.js";
/** Re-exported imessage plugin public API. */
export {
  resolveIMessageGroupRequireMention,
  resolveIMessageGroupToolPolicy,
} from "./src/group-policy.js";
/** Re-exported imessage plugin public API, starting with looks Like IMessage Target Id. */
export { looksLikeIMessageTargetId, normalizeIMessageMessagingTarget } from "./src/normalize.js";
/** Re-exported imessage plugin public API, starting with IMESSAGE LEGACY OUTBOUND SEND DEP KEYS. */
export { IMESSAGE_LEGACY_OUTBOUND_SEND_DEP_KEYS } from "./src/outbound-send-deps.js";
/** Re-exported imessage plugin public API. */
export {
  DEFAULT_IMESSAGE_PROBE_TIMEOUT_MS,
  type IMessageProbe,
  type IMessageProbeOptions,
  probeIMessage,
} from "./src/probe.js";
/** Re-exported imessage plugin public API. */
export {
  type ChatSenderAllowParams,
  type ChatTargetPrefixesParams,
  createAllowedChatSenderMatcher,
  parseChatAllowTargetPrefixes,
  parseChatTargetPrefixesOrThrow,
  type ParsedChatAllowTarget,
  type ParsedChatTarget,
  resolveServicePrefixedAllowTarget,
  resolveServicePrefixedChatTarget,
  resolveServicePrefixedOrChatAllowTarget,
  resolveServicePrefixedTarget,
  type ServicePrefix,
} from "./src/target-parsing-helpers.js";
/** Re-exported imessage plugin public API. */
export {
  formatIMessageChatTarget,
  type IMessageAllowTarget,
  type IMessageService,
  type IMessageTarget,
  inferIMessageTargetChatType,
  isAllowedIMessageSender,
  looksLikeIMessageExplicitTargetId,
  normalizeIMessageHandle,
  parseIMessageAllowTarget,
  parseIMessageTarget,
} from "./src/targets.js";
/** Re-exported imessage plugin public API, starting with IMESSAGE ACTION NAMES. */
export { IMESSAGE_ACTION_NAMES, IMESSAGE_ACTIONS } from "./src/actions-contract.js";
