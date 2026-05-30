// Shared provider-facing HTTP helpers. Keep generic transport utilities here so
// capability SDKs do not depend on each other.

/** Provider HTTP error helpers for status validation, limited reads, and diagnostics. */
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
/** Shared media-provider HTTP helpers for uploads, polling, deadlines, and config cleanup. */
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
/** Operation deadline and timeout types used by provider HTTP helpers. */
export type {
  ProviderOperationDeadline,
  ProviderOperationTimeoutMs,
} from "../media-understanding/shared.js";
/** Retry executor and default transient retry config for provider operations. */
export {
  executeProviderOperationWithRetry,
  providerOperationRetryConfig,
} from "../provider-runtime/operation-retry.js";
/** Retry stage and option types for provider operation retries. */
export type {
  ProviderOperationRetryStage,
  TransientProviderRetryConfig,
  TransientProviderRetryOptions,
  TransientProviderRetryParams,
} from "../provider-runtime/operation-retry.js";
/** Provider request policy and capability types resolved from endpoint metadata. */
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
/** Provider request override types for auth, proxy, TLS, and transport settings. */
export type {
  ProviderRequestAuthOverride,
  ProviderRequestProxyOverride,
  ProviderRequestTlsOverride,
  ProviderRequestTransportOverrides,
} from "../agents/provider-request-config.js";
/** Resolve provider request headers from auth and transport override config. */
export { resolveProviderRequestHeaders } from "../agents/provider-request-config.js";
/** Resolve endpoint, capability, and attribution policy for provider HTTP calls. */
export {
  resolveProviderEndpoint,
  resolveProviderRequestCapabilities,
  resolveProviderRequestPolicy,
} from "../agents/provider-attribution.js";
