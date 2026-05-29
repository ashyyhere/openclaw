// extensions/telegram api helpers and runtime behavior.
/** Re-exported telegram plugin public API, starting with telegram Plugin. */
export { telegramPlugin } from "./src/channel.js";
/** Re-exported telegram plugin public API, starting with telegram Setup Plugin. */
export { telegramSetupPlugin } from "./src/channel.setup.js";
/** Re-exported telegram plugin public API. */
export {
  type InspectedTelegramAccount,
  inspectTelegramAccount,
  type TelegramCredentialStatus,
} from "./src/account-inspect.js";
/** Re-exported telegram plugin public API. */
export {
  createTelegramActionGate,
  listEnabledTelegramAccounts,
  listTelegramAccountIds,
  mergeTelegramAccountConfig,
  resetMissingDefaultWarnFlag,
  resolveDefaultTelegramAccountId,
  type ResolvedTelegramAccount,
  resolveTelegramAccount,
  resolveTelegramAccountConfig,
  resolveTelegramMediaRuntimeOptions,
  resolveTelegramPollActionGateState,
  type TelegramMediaRuntimeOptions,
  type TelegramPollActionGateState,
} from "./src/accounts.js";
/** Re-exported telegram plugin public API, starting with resolve Telegram Auto Thread Id. */
export { resolveTelegramAutoThreadId } from "./src/action-threading.js";
/** Re-exported telegram plugin public API. */
export {
  isNumericTelegramSenderUserId,
  isNumericTelegramUserId,
  normalizeTelegramAllowFromEntry,
} from "./src/allow-from.js";
/** Re-exported telegram plugin public API. */
export {
  fetchTelegramChatId,
  lookupTelegramChatId,
  resolveTelegramChatLookupFetch,
} from "./src/api-fetch.js";
/** Re-exported telegram plugin public API. */
export {
  buildGroupLabel,
  buildSenderLabel,
  buildSenderName,
  buildTelegramGroupFrom,
  buildTelegramGroupPeerId,
  buildTelegramParentPeer,
  buildTelegramRoutingTarget,
  buildTelegramThreadParams,
  buildTypingThreadParams,
  describeReplyTarget,
  extractTelegramForumFlag,
  extractTelegramLocation,
  getTelegramTextParts,
  hasBotMention,
  isBinaryContent,
  normalizeForwardedContext,
  resetTelegramForumFlagCacheForTest,
  resolveTelegramDirectPeerId,
  resolveTelegramForumFlag,
  resolveTelegramForumThreadId,
  resolveTelegramGroupAllowFromContext,
  resolveTelegramMediaPlaceholder,
  resolveTelegramReplyId,
  resolveTelegramStreamMode,
  resolveTelegramThreadSpec,
  type TelegramForwardedContext,
  type TelegramReplyTarget,
  type TelegramTextEntity,
  type TelegramThreadSpec,
  withResolvedTelegramForumFlag,
} from "./src/bot/helpers.js";
/** Re-exported telegram plugin public API. */
export {
  normalizeTelegramCommandDescription,
  normalizeTelegramCommandName,
  resolveTelegramCustomCommands,
  TELEGRAM_COMMAND_NAME_PATTERN,
  type TelegramCustomCommandInput,
  type TelegramCustomCommandIssue,
} from "./src/command-config.js";
/** Re-exported telegram plugin public API. */
export {
  buildCommandsPaginationKeyboard,
  buildTelegramModelsProviderChannelData,
} from "./src/command-ui.js";
/** Re-exported telegram plugin public API. */
export {
  listTelegramDirectoryGroupsFromConfig,
  listTelegramDirectoryPeersFromConfig,
} from "./src/directory-config.js";
/** Re-exported telegram plugin public API. */
export {
  buildTelegramExecApprovalPendingPayload,
  shouldSuppressTelegramExecApprovalForwardingFallback,
} from "./src/exec-approval-forwarding.js";
/** Re-exported telegram plugin public API. */
export {
  getTelegramExecApprovalApprovers,
  isTelegramExecApprovalApprover,
  isTelegramExecApprovalAuthorizedSender,
  isTelegramExecApprovalClientEnabled,
  isTelegramExecApprovalHandlerConfigured,
  isTelegramExecApprovalTargetRecipient,
  resolveTelegramExecApprovalConfig,
  resolveTelegramExecApprovalTarget,
  shouldEnableTelegramExecApprovalButtons,
  shouldHandleTelegramExecApprovalRequest,
  shouldInjectTelegramExecApprovalButtons,
  shouldSuppressLocalTelegramExecApprovalPrompt,
} from "./src/exec-approvals.js";
/** Re-exported telegram plugin public API. */
export {
  resolveTelegramGroupRequireMention,
  resolveTelegramGroupToolPolicy,
} from "./src/group-policy.js";
/** Re-exported telegram plugin public API. */
export type {
  TelegramInteractiveHandlerContext,
  TelegramInteractiveHandlerRegistration,
} from "./src/interactive-dispatch.js";
/** Re-exported telegram plugin public API. */
export {
  isTelegramInlineButtonsEnabled,
  resolveTelegramInlineButtonsConfigScope,
  resolveTelegramInlineButtonsScope,
  resolveTelegramInlineButtonsScopeFromCapabilities,
  resolveTelegramTargetChatType,
} from "./src/inline-buttons.js";
/** Re-exported telegram plugin public API. */
export {
  buildBrowseProvidersButton,
  buildModelSelectionCallbackData,
  buildModelsKeyboard,
  buildProviderKeyboard,
  type ButtonRow,
  calculateTotalPages,
  getModelsPageSize,
  type ModelsKeyboardParams,
  type ParsedModelCallback,
  parseModelCallbackData,
  type ProviderInfo,
  resolveModelSelection,
  type ResolveModelSelectionResult,
} from "./src/model-buttons.js";
/** Re-exported telegram plugin public API, starting with looks Like Telegram Target Id. */
export { looksLikeTelegramTargetId, normalizeTelegramMessagingTarget } from "./src/normalize.js";
/** Re-exported telegram plugin public API. */
export {
  sendTelegramPayloadMessages,
  TELEGRAM_TEXT_CHUNK_LIMIT,
  telegramOutbound,
} from "./src/outbound-adapter.js";
/** Re-exported telegram plugin public API. */
export {
  normalizeTelegramReplyToMessageId,
  parseTelegramReplyToMessageId,
  parseTelegramThreadId,
} from "./src/outbound-params.js";
/** Re-exported telegram plugin public API. */
export {
  probeTelegram,
  resetTelegramProbeFetcherCacheForTests,
  type TelegramProbe,
  type TelegramProbeOptions,
} from "./src/probe.js";
/** Re-exported telegram plugin public API. */
export {
  type ResolvedReactionLevel,
  resolveTelegramReactionLevel,
  type TelegramReactionLevel,
} from "./src/reaction-level.js";
/** Re-exported telegram plugin public API, starting with collect Telegram Security Audit Findings. */
export { collectTelegramSecurityAuditFindings } from "./src/security-audit.js";
/** Re-exported telegram plugin public API. */
export {
  type CachedSticker,
  cacheSticker,
  describeStickerImage,
  type DescribeStickerParams,
  getAllCachedStickers,
  getCachedSticker,
  getCacheStats,
  searchStickers,
} from "./src/sticker-cache.js";
/** Re-exported telegram plugin public API, starting with collect Telegram Status Issues. */
export { collectTelegramStatusIssues } from "./src/status-issues.js";
/** Re-exported telegram plugin public API. */
export {
  isNumericTelegramChatId,
  normalizeTelegramChatId,
  normalizeTelegramLookupTarget,
  parseTelegramTarget,
  stripTelegramInternalPrefixes,
  type TelegramTarget,
} from "./src/targets.js";
/** Re-exported telegram plugin public API. */
export {
  type ParsedTelegramTopicConversation,
  parseTelegramTopicConversation,
} from "./src/topic-conversation.js";
/** Re-exported telegram plugin public API. */
export {
  deleteTelegramUpdateOffset,
  readTelegramUpdateOffset,
  writeTelegramUpdateOffset,
} from "./src/update-offset-store.js";
/** Re-exported telegram plugin public API, starting with Telegram Button Style. */
export type { TelegramButtonStyle, TelegramInlineButtons } from "./src/button-types.js";
/** Re-exported telegram plugin public API, starting with Sticker Metadata. */
export type { StickerMetadata } from "./src/bot/types.js";
/** Re-exported telegram plugin public API, starting with Telegram Token Resolution. */
export type { TelegramTokenResolution } from "./src/token.js";
/** Re-exported telegram plugin public API. */
export {
  escapeTelegramHtml,
  markdownToTelegramChunks,
  markdownToTelegramHtml,
  markdownToTelegramHtmlChunks,
  splitTelegramHtmlChunks,
  type TelegramFormattedChunk,
} from "./src/format.js";
