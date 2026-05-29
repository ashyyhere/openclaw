// extensions/google runtime api helpers and runtime behavior.
/** Re-exported google plugin public API. */
export {
  DEFAULT_GOOGLE_API_BASE_URL,
  createGoogleThinkingPayloadWrapper,
  createGoogleThinkingStreamWrapper,
  isGoogleGemini3FlashModel,
  isGoogleGemini3ProModel,
  isGoogleGemini3ThinkingLevelModel,
  isGoogleThinkingRequiredModel,
  normalizeGoogleApiBaseUrl,
  normalizeGoogleModelId,
  parseGeminiAuth,
  buildGoogleGenerativeAiParams,
  createGoogleGenerativeAiTransportStreamFn,
  resolveGoogleGemini3ThinkingLevel,
  resolveGoogleGenerativeAiHttpRequestConfig,
  sanitizeGoogleThinkingPayload,
  stripInvalidGoogleThinkingBudget,
} from "./api.js";
/** Re-exported google plugin public API, starting with Google Thinking Input Level. */
export type { GoogleThinkingInputLevel, GoogleThinkingLevel } from "./api.js";
