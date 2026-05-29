// Focused public test helpers for environment, network, and time fixtures.

/** Re-exported API for src/plugin-sdk. */
export {
  createAuthCaptureJsonFetch,
  createRequestCaptureJsonFetch,
  installPinnedHostnameTestHooks,
} from "../media-understanding/audio.test-helpers.ts";
/** Re-exported API for src/plugin-sdk. */
export {
  createSingleUserPromptMessage,
  extractNonEmptyAssistantText,
  isLiveProfileKeyModeEnabled,
  isLiveTestEnabled,
} from "../agents/live-test-helpers.js";
/** Re-exported API for src/plugin-sdk, starting with collect Provider Api Keys. */
export { collectProviderApiKeys } from "../agents/live-auth-keys.js";
/** Re-exported API for src/plugin-sdk, starting with is Model Not Found Error Message. */
export { isModelNotFoundErrorMessage } from "../agents/live-model-errors.js";
/** Re-exported API for src/plugin-sdk. */
export {
  isAuthErrorMessage,
  isBillingErrorMessage,
  isOverloadedErrorMessage,
  isServerErrorMessage,
  isTimeoutErrorMessage,
} from "../agents/embedded-agent-helpers/failover-matches.js";
/** Re-exported API for src/plugin-sdk, starting with maybe Load Shell Env For Generation Providers. */
export { maybeLoadShellEnvForGenerationProviders } from "../test-utils/generation-live-test-helpers.js";
/** Re-exported API for src/plugin-sdk, starting with is Truthy Env Value. */
export { isTruthyEnvValue } from "../infra/env.js";
/** Re-exported API for src/plugin-sdk, starting with get Shell Env Applied Keys. */
export { getShellEnvAppliedKeys } from "../infra/shell-env.js";
/** Re-exported API for src/plugin-sdk, starting with encode Png Rgba. */
export { encodePngRgba, fillPixel } from "../media/png-encode.js";
/** Re-exported API for src/plugin-sdk. */
export {
  parseLiveCsvFilter as parseCsvFilter,
  parseProviderModelMap,
  redactLiveApiKey,
} from "../media-generation/live-test-helpers.js";
/** Re-exported API for src/plugin-sdk. */
export {
  DEFAULT_LIVE_MUSIC_MODELS,
  resolveConfiguredLiveMusicModels,
  resolveLiveMusicAuthStore,
} from "../music-generation/live-test-helpers.js";
/** Re-exported API for src/plugin-sdk. */
export {
  canRunBufferBackedImageToVideoLiveLane,
  canRunBufferBackedVideoToVideoLiveLane,
  DEFAULT_LIVE_VIDEO_MODELS,
  resolveConfiguredLiveVideoModels,
  resolveLiveVideoAuthStore,
  resolveLiveVideoResolution,
} from "../video-generation/live-test-helpers.js";
/** Re-exported API for src/plugin-sdk, starting with normalize Video Generation Duration. */
export { normalizeVideoGenerationDuration } from "../video-generation/duration-support.js";
/** Re-exported API for src/plugin-sdk, starting with parse Video Generation Model Ref. */
export { parseVideoGenerationModelRef } from "../video-generation/model-ref.js";
/** Re-exported API for src/plugin-sdk. */
export type {
  GeneratedVideoAsset,
  VideoGenerationMode,
  VideoGenerationModeCapabilities,
  VideoGenerationProvider,
  VideoGenerationRequest,
} from "../video-generation/types.js";
/** Re-exported API for src/plugin-sdk, starting with json Response. */
export { jsonResponse, requestBodyText, requestUrl } from "../test-helpers/http.js";
/** Re-exported API for src/plugin-sdk, starting with mock Pinned Hostname Resolution. */
export { mockPinnedHostnameResolution } from "../test-helpers/ssrf.js";
/** Re-exported API for src/plugin-sdk, starting with create Windows Cmd Shim Fixture. */
export { createWindowsCmdShimFixture } from "../test-helpers/windows-cmd-shim.js";
/** Re-exported API for src/plugin-sdk, starting with create Provider Usage Fetch. */
export { createProviderUsageFetch, makeResponse } from "../test-utils/provider-usage-fetch.js";
/** Re-exported API for src/plugin-sdk, starting with with State Dir Env. */
export { withStateDirEnv } from "../test-helpers/state-dir-env.js";
/** Re-exported API for src/plugin-sdk, starting with capture Env. */
export { captureEnv, withEnv, withEnvAsync } from "../test-utils/env.js";
/** Re-exported API for src/plugin-sdk, starting with with Fetch Preconnect. */
export { withFetchPreconnect, type FetchMock } from "../test-utils/fetch-mock.js";
/** Re-exported API for src/plugin-sdk, starting with create Mock Server Response. */
export { createMockServerResponse } from "../test-utils/mock-http-response.js";
/** Re-exported API for src/plugin-sdk, starting with create Temp Home Env. */
export { createTempHomeEnv, type TempHomeEnv } from "../test-utils/temp-home.js";
/** Re-exported API for src/plugin-sdk, starting with with Temp Dir. */
export { withTempDir } from "../test-utils/temp-dir.js";
/** Re-exported API for src/plugin-sdk, starting with use Frozen Time. */
export { useFrozenTime, useRealTime } from "../test-utils/frozen-time.js";
/** Re-exported API for src/plugin-sdk, starting with with Server. */
export { withServer } from "./test-helpers/http-test-server.js";
/** Re-exported API for src/plugin-sdk, starting with create Mock Incoming Request. */
export { createMockIncomingRequest } from "./test-helpers/mock-incoming-request.js";
/** Re-exported API for src/plugin-sdk, starting with with Temp Home. */
export { withTempHome } from "./test-helpers/temp-home.js";
