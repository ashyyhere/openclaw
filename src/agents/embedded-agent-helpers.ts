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
/** Provider error classifiers and UI copy helpers shared by embedded agent runtimes. */
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
/** Stable failure categories used when provider routing decides whether failover is allowed. */
export type { ProviderRuntimeFailureKind } from "./embedded-agent-helpers/errors.js";
/** Text sanitizer for assistant/provider output before it reaches user-visible channels. */
export { sanitizeUserFacingText } from "./embedded-agent-helpers/sanitize-user-facing-text.js";
/** Google-specific model and turn-shape helpers used by provider adapters. */
export { isGoogleModelApi, sanitizeGoogleTurnOrdering } from "./embedded-agent-helpers/google.js";

/** OpenAI response downgraders used when older endpoints cannot accept newer reasoning shapes. */
export {
  downgradeOpenAIFunctionCallReasoningPairs,
  downgradeOpenAIReasoningBlocks,
  normalizeOpenAIResponsesToolCallIds,
} from "./embedded-agent-helpers/openai.js";
/** Image-content normalization helpers for provider message payloads. */
export {
  isEmptyAssistantMessageContent,
  sanitizeSessionMessagesImages,
} from "./embedded-agent-helpers/images.js";
/** Messaging dedupe helpers shared by channel delivery and assistant replay handling. */
export {
  isMessagingToolDuplicate,
  isMessagingToolDuplicateNormalized,
  normalizeTextForComparison,
} from "./embedded-agent-helpers/messaging-dedupe.js";

/** Thinking-level fallback selection for providers with narrower reasoning support. */
export { pickFallbackThinkingLevel } from "./embedded-agent-helpers/thinking.js";

/** Turn validators and normalizers that keep provider transcript contracts intact. */
export {
  mergeConsecutiveUserTurns,
  validateAnthropicTurns,
  validateGeminiTurns,
} from "./embedded-agent-helpers/turns.js";
/** Context-file and failover result shapes shared across embedded agent helpers. */
export type { EmbeddedContextFile, FailoverReason } from "./embedded-agent-helpers/types.js";

/** Tool-call id mode names used by provider-specific id sanitizers. */
export type { ToolCallIdMode } from "./tool-call-id.js";
/** Tool-call id validation and sanitization for providers with strict id formats. */
export { isValidCloudCodeAssistToolId, sanitizeToolCallId } from "./tool-call-id.js";
