/** Public barrel for embedded-agent sanitization, bootstrap, and error helpers. */
export {
  buildBootstrapContextFiles,
  DEFAULT_BOOTSTRAP_MAX_CHARS,
  DEFAULT_BOOTSTRAP_PROMPT_TRUNCATION_WARNING_MODE,
  DEFAULT_BOOTSTRAP_TOTAL_MAX_CHARS,
  ensureSessionHeader,
  resolveBootstrapMaxChars,
  resolveBootstrapPromptTruncationWarningMode,
  resolveBootstrapTotalMaxChars,
  stripThoughtSignatures,
} from "./embedded-agent-helpers/bootstrap.js";
/** Re-exported API for src/agents. */
export {
  BILLING_ERROR_USER_MESSAGE,
  classifyProviderRuntimeFailureKind,
  formatBillingErrorMessage,
  formatRateLimitOrOverloadedErrorCopy,
  classifyFailoverReason,
  classifyFailoverReasonFromHttpStatus,
  formatRawAssistantErrorForUi,
  formatAssistantErrorText,
  getApiErrorPayloadFingerprint,
  isAuthAssistantError,
  isAuthErrorMessage,
  isAuthPermanentErrorMessage,
  isModelNotFoundErrorMessage,
  isBillingAssistantError,
  extractObservedOverflowTokenCount,
  parseApiErrorInfo,
  isBillingErrorMessage,
  isCloudflareOrHtmlErrorPage,
  isCloudCodeAssistFormatError,
  isCompactionFailureError,
  isContextOverflowError,
  isLikelyContextOverflowError,
  isFailoverAssistantError,
  isFailoverErrorMessage,
  isImageDimensionErrorMessage,
  isImageSizeError,
  isOverloadedErrorMessage,
  isRawApiErrorPayload,
  isRateLimitAssistantError,
  isRateLimitErrorMessage,
  isTransientHttpError,
  isTimeoutErrorMessage,
  parseImageDimensionError,
  parseImageSizeError,
} from "./embedded-agent-helpers/errors.js";
/** Re-exported API for src/agents, starting with Provider Runtime Failure Kind. */
export type { ProviderRuntimeFailureKind } from "./embedded-agent-helpers/errors.js";
/** Re-exported API for src/agents, starting with sanitize User Facing Text. */
export { sanitizeUserFacingText } from "./embedded-agent-helpers/sanitize-user-facing-text.js";
/** Re-exported API for src/agents, starting with is Google Model Api. */
export { isGoogleModelApi, sanitizeGoogleTurnOrdering } from "./embedded-agent-helpers/google.js";

/** Re-exported API for src/agents. */
export {
  downgradeOpenAIFunctionCallReasoningPairs,
  downgradeOpenAIReasoningBlocks,
  normalizeOpenAIResponsesToolCallIds,
} from "./embedded-agent-helpers/openai.js";
/** Re-exported API for src/agents. */
export {
  isEmptyAssistantMessageContent,
  sanitizeSessionMessagesImages,
} from "./embedded-agent-helpers/images.js";
/** Re-exported API for src/agents. */
export {
  isMessagingToolDuplicate,
  isMessagingToolDuplicateNormalized,
  normalizeTextForComparison,
} from "./embedded-agent-helpers/messaging-dedupe.js";

/** Re-exported API for src/agents, starting with pick Fallback Thinking Level. */
export { pickFallbackThinkingLevel } from "./embedded-agent-helpers/thinking.js";

/** Re-exported API for src/agents. */
export {
  mergeConsecutiveUserTurns,
  validateAnthropicTurns,
  validateGeminiTurns,
} from "./embedded-agent-helpers/turns.js";
/** Re-exported API for src/agents, starting with Embedded Context File. */
export type { EmbeddedContextFile, FailoverReason } from "./embedded-agent-helpers/types.js";

/** Re-exported API for src/agents, starting with Tool Call Id Mode. */
export type { ToolCallIdMode } from "./tool-call-id.js";
/** Re-exported API for src/agents, starting with is Valid Cloud Code Assist Tool Id. */
export { isValidCloudCodeAssistToolId, sanitizeToolCallId } from "./tool-call-id.js";
