// Shared provider-facing HTTP helpers. Keep generic transport utilities here so
// capability SDKs do not depend on each other.

/** Re-exported API for src/plugin-sdk. */
export {
  assertOkOrThrowHttpError,
  assertOkOrThrowProviderError,
  assertProviderBinaryResponseContent,
  createProviderHttpError,
  extractProviderErrorDetail,
  extractProviderRequestId,
  formatProviderErrorPayload,
  formatProviderHttpErrorMessage,
  readProviderBinaryResponse,
  readProviderJsonArrayFieldResponse,
  readProviderJsonObjectResponse,
  readProviderJsonResponse,
  readResponseTextLimited,
  truncateErrorDetail,
} from "../agents/provider-http-errors.js";
/** Re-exported API for src/plugin-sdk. */
export {
  buildAudioTranscriptionFormData,
  createProviderOperationDeadline,
  createProviderOperationTimeoutResolver,
  fetchProviderDownloadResponse,
  fetchProviderOperationResponse,
  fetchWithTimeout,
  fetchWithTimeoutGuarded,
  normalizeBaseUrl,
  pollProviderOperationJson,
  postJsonRequest,
  postMultipartRequest,
  postTranscriptionRequest,
  resolveProviderOperationTimeoutMs,
  resolveProviderHttpRequestConfig,
  resolveAudioTranscriptionUploadFileName,
  requireTranscriptionText,
  sanitizeConfiguredModelProviderRequest,
  waitProviderOperationPollInterval,
} from "../media-understanding/shared.js";
/** Re-exported API for src/plugin-sdk. */
export type {
  ProviderOperationDeadline,
  ProviderOperationTimeoutMs,
} from "../media-understanding/shared.js";
/** Re-exported API for src/plugin-sdk. */
export {
  executeProviderOperationWithRetry,
  providerOperationRetryConfig,
} from "../provider-runtime/operation-retry.js";
/** Re-exported API for src/plugin-sdk. */
export type {
  ProviderOperationRetryStage,
  TransientProviderRetryConfig,
  TransientProviderRetryOptions,
  TransientProviderRetryParams,
} from "../provider-runtime/operation-retry.js";
/** Re-exported API for src/plugin-sdk. */
export type {
  ProviderAttributionPolicy,
  ProviderRequestCapabilities,
  ProviderRequestCapabilitiesInput,
  ProviderRequestCompatibilityFamily,
  ProviderEndpointClass,
  ProviderEndpointResolution,
  ProviderRequestCapability,
  ProviderRequestPolicyInput,
  ProviderRequestPolicyResolution,
  ProviderRequestTransport,
} from "../agents/provider-attribution.js";
/** Re-exported API for src/plugin-sdk. */
export type {
  ProviderRequestAuthOverride,
  ProviderRequestProxyOverride,
  ProviderRequestTlsOverride,
  ProviderRequestTransportOverrides,
} from "../agents/provider-request-config.js";
/** Re-exported API for src/plugin-sdk, starting with resolve Provider Request Headers. */
export { resolveProviderRequestHeaders } from "../agents/provider-request-config.js";
/** Re-exported API for src/plugin-sdk. */
export {
  resolveProviderEndpoint,
  resolveProviderRequestCapabilities,
  resolveProviderRequestPolicy,
} from "../agents/provider-attribution.js";
