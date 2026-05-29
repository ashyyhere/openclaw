// extensions/google api helpers and runtime behavior.
import {
  resolveProviderHttpRequestConfig,
  type ProviderRequestTransportOverrides,
} from "openclaw/plugin-sdk/provider-http";
import { parseGeminiAuth } from "./gemini-auth.js";
/** Re-exported google plugin public API, starting with parse Gemini Auth. */
export { parseGeminiAuth };
/** Re-exported google plugin public API, starting with apply Google Gemini Model Default. */
export { applyGoogleGeminiModelDefault, GOOGLE_GEMINI_DEFAULT_MODEL } from "./onboard.js";
import {
  DEFAULT_GOOGLE_API_BASE_URL,
  normalizeGoogleGenerativeAiBaseUrl,
} from "./provider-policy.js";
/** Re-exported google plugin public API, starting with normalize Antigravity Model Id. */
export { normalizeAntigravityModelId, normalizeGoogleModelId } from "./model-id.js";
/** Re-exported google plugin public API. */
export {
  createGoogleThinkingPayloadWrapper,
  createGoogleThinkingStreamWrapper,
  isGoogleGemini3FlashModel,
  isGoogleGemini3ProModel,
  isGoogleGemini3ThinkingLevelModel,
  isGoogleThinkingRequiredModel,
  resolveGoogleGemini3ThinkingLevel,
  sanitizeGoogleThinkingPayload,
  stripInvalidGoogleThinkingBudget,
  type GoogleThinkingInputLevel,
  type GoogleThinkingLevel,
} from "./thinking-api.js";
/** Re-exported google plugin public API. */
export {
  buildGoogleGenerativeAiParams,
  createGoogleGenerativeAiTransportStreamFn,
} from "./transport-stream.js";
/** Re-exported google plugin public API. */
export {
  DEFAULT_GOOGLE_API_BASE_URL,
  isGoogleGenerativeAiApi,
  normalizeGoogleApiBaseUrl,
  normalizeGoogleGenerativeAiBaseUrl,
  normalizeGoogleProviderConfig,
  resolveGoogleGenerativeAiApiOrigin,
  resolveGoogleGenerativeAiTransport,
  shouldNormalizeGoogleGenerativeAiProviderConfig,
  shouldNormalizeGoogleProviderConfig,
} from "./provider-policy.js";
/** Re-exported google plugin public API, starting with build Google Gemini Cli Provider. */
export { buildGoogleGeminiCliProvider } from "./gemini-cli-provider.js";
/** Re-exported google plugin public API, starting with build Google Provider. */
export { buildGoogleProvider } from "./provider-registration.js";

type GoogleGenerativeAiRequestOverrides = ProviderRequestTransportOverrides & {
  allowPrivateNetwork?: boolean;
};

function resolveTrustedGoogleGenerativeAiBaseUrl(baseUrl?: string): string {
  const normalized =
    normalizeGoogleGenerativeAiBaseUrl(baseUrl ?? DEFAULT_GOOGLE_API_BASE_URL) ??
    DEFAULT_GOOGLE_API_BASE_URL;
  let url: URL;
  try {
    url = new URL(normalized);
  } catch {
    throw new Error(
      "Google Generative AI baseUrl must be a valid https URL on generativelanguage.googleapis.com",
    );
  }
  if (
    url.protocol !== "https:" ||
    url.hostname.toLowerCase() !== "generativelanguage.googleapis.com"
  ) {
    throw new Error(
      "Google Generative AI baseUrl must use https://generativelanguage.googleapis.com",
    );
  }
  return normalized;
}

/** Public google plugin helper for resolve Google Generative Ai Http Request Config behavior. */
export function resolveGoogleGenerativeAiHttpRequestConfig(params: {
  apiKey: string;
  baseUrl?: string;
  headers?: Record<string, string>;
  request?: GoogleGenerativeAiRequestOverrides;
  capability: "image" | "audio" | "video";
  transport: "http" | "media-understanding";
}) {
  return resolveProviderHttpRequestConfig({
    baseUrl: resolveTrustedGoogleGenerativeAiBaseUrl(params.baseUrl),
    defaultBaseUrl: DEFAULT_GOOGLE_API_BASE_URL,
    allowPrivateNetwork: params.request?.allowPrivateNetwork,
    headers: params.headers,
    request: params.request,
    defaultHeaders: parseGeminiAuth(params.apiKey).headers,
    provider: "google",
    api: "google-generative-ai",
    capability: params.capability,
    transport: params.transport,
  });
}
