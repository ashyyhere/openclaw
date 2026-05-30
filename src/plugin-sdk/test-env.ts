// Focused public test helpers for environment, network, and time fixtures.

/** HTTP capture and hostname pinning fixtures for media-understanding live tests. */
export {
  createAuthCaptureJsonFetch,
  createRequestCaptureJsonFetch,
  installPinnedHostnameTestHooks,
} from "../media-understanding/audio.test-helpers.ts";
/** Shared live-agent prompt, response, and profile-mode assertions. */
export {
  createSingleUserPromptMessage,
  extractNonEmptyAssistantText,
  isLiveProfileKeyModeEnabled,
  isLiveTestEnabled,
} from "../agents/live-test-helpers.js";
/** Collects provider API keys from live-test environment variables. */
export { collectProviderApiKeys } from "../agents/live-auth-keys.js";
/** Detects provider-specific model-missing errors in live test assertions. */
export { isModelNotFoundErrorMessage } from "../agents/live-model-errors.js";
/** Normalized provider failure classifiers used by failover live tests. */
export {
  isAuthErrorMessage,
  isBillingErrorMessage,
  isOverloadedErrorMessage,
  isServerErrorMessage,
  isTimeoutErrorMessage,
} from "../agents/embedded-agent-helpers/failover-matches.js";
/** Loads optional shell env keys needed by generation-provider live lanes. */
export { maybeLoadShellEnvForGenerationProviders } from "../test-utils/generation-live-test-helpers.js";
/** Shared truthy environment parsing for test toggles. */
export { isTruthyEnvValue } from "../infra/env.js";
/** Reports which shell environment keys were applied during live-test setup. */
export { getShellEnvAppliedKeys } from "../infra/shell-env.js";
/** Tiny PNG encoder helpers for generated image fixtures. */
export { encodePngRgba, fillPixel } from "../media/png-encode.js";
/** Media-generation live-test filter, model-map, and key-redaction utilities. */
export {
  parseLiveCsvFilter as parseCsvFilter,
  parseProviderModelMap,
  redactLiveApiKey,
} from "../media-generation/live-test-helpers.js";
/** Music-generation live auth-store and model-selection fixtures. */
export {
  DEFAULT_LIVE_MUSIC_MODELS,
  resolveConfiguredLiveMusicModels,
  resolveLiveMusicAuthStore,
} from "../music-generation/live-test-helpers.js";
/** Video-generation live auth-store, model, resolution, and buffer-lane fixtures. */
export {
  canRunBufferBackedImageToVideoLiveLane,
  canRunBufferBackedVideoToVideoLiveLane,
  DEFAULT_LIVE_VIDEO_MODELS,
  resolveConfiguredLiveVideoModels,
  resolveLiveVideoAuthStore,
  resolveLiveVideoResolution,
} from "../video-generation/live-test-helpers.js";
/** Normalizes duration inputs to the video-generation provider contract. */
export { normalizeVideoGenerationDuration } from "../video-generation/duration-support.js";
/** Parses video-generation model refs used by provider live tests. */
export { parseVideoGenerationModelRef } from "../video-generation/model-ref.js";
/** Video-generation request and provider contract types for plugin tests. */
export type {
  GeneratedVideoAsset,
  VideoGenerationMode,
  VideoGenerationModeCapabilities,
  VideoGenerationProvider,
  VideoGenerationRequest,
} from "../video-generation/types.js";
/** HTTP request/response helpers for lightweight unit fixtures. */
export { jsonResponse, requestBodyText, requestUrl } from "../test-helpers/http.js";
/** SSRF-safe hostname resolution mock for network-bound tests. */
export { mockPinnedHostnameResolution } from "../test-helpers/ssrf.js";
/** Windows command shim fixture for cross-platform process tests. */
export { createWindowsCmdShimFixture } from "../test-helpers/windows-cmd-shim.js";
/** Provider-usage fetch mock and response builder. */
export { createProviderUsageFetch, makeResponse } from "../test-utils/provider-usage-fetch.js";
/** State-directory environment wrapper for config and persistence tests. */
export { withStateDirEnv } from "../test-helpers/state-dir-env.js";
/** Environment capture and scoped mutation helpers for isolated tests. */
export { captureEnv, withEnv, withEnvAsync } from "../test-utils/env.js";
/** Fetch preconnect mock used by network tests that assert warmup behavior. */
export { withFetchPreconnect, type FetchMock } from "../test-utils/fetch-mock.js";
/** Minimal server-response mock for handler tests without a real socket. */
export { createMockServerResponse } from "../test-utils/mock-http-response.js";
/** Temporary HOME fixture for tests that need isolated user state. */
export { createTempHomeEnv, type TempHomeEnv } from "../test-utils/temp-home.js";
/** Temporary directory helper with automatic cleanup. */
export { withTempDir } from "../test-utils/temp-dir.js";
/** Fake-time controls for tests that need deterministic clocks. */
export { useFrozenTime, useRealTime } from "../test-utils/frozen-time.js";
/** HTTP server fixture for plugin SDK request/response tests. */
export { withServer } from "./test-helpers/http-test-server.js";
/** Incoming request mock for testing plugin SDK HTTP handlers. */
export { createMockIncomingRequest } from "./test-helpers/mock-incoming-request.js";
/** Plugin SDK temporary HOME fixture that mirrors external test consumers. */
export { withTempHome } from "./test-helpers/temp-home.js";
