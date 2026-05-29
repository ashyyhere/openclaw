/**
 * @deprecated Broad compatibility barrel for older plugin tests.
 *
 * New tests should import focused `openclaw/plugin-sdk/*` test subpaths such as
 * `plugin-test-runtime`, `channel-test-helpers`, `test-env`, or `test-fixtures`.
 */

export {
  createAckReactionHandle,
  removeAckReactionAfterReply,
  removeAckReactionHandleAfterReply,
  shouldAckReaction,
} from "../channels/ack-reactions.js";
/** Re-exported API for src/plugin-sdk. */
export {
  expectChannelInboundContextContract,
  expectChannelTurnDispatchResultContract,
  primeChannelOutboundSendMock,
} from "../channels/plugins/contracts/test-helpers.js";
/** Re-exported API for src/plugin-sdk. */
export {
  installChannelOutboundPayloadContractSuite,
  type OutboundPayloadHarnessParams,
} from "../channels/plugins/contracts/outbound-payload-testkit.js";
/** Re-exported API for src/plugin-sdk, starting with build Dispatch Inbound Capture Mock. */
export { buildDispatchInboundCaptureMock } from "../channels/plugins/contracts/inbound-testkit.js";
/** Re-exported API for src/plugin-sdk. */
export {
  createCliRuntimeCapture,
  firstWrittenJsonArg,
  spyRuntimeErrors,
  spyRuntimeJson,
  spyRuntimeLogs,
} from "../cli/test-runtime-capture.js";
/** Re-exported API for src/plugin-sdk, starting with Cli Mock Output Runtime. */
export type { CliMockOutputRuntime, CliRuntimeCapture } from "../cli/test-runtime-capture.js";
/** Re-exported API for src/plugin-sdk, starting with set Default Channel Plugin Registry For Tests. */
export { setDefaultChannelPluginRegistryForTests } from "../commands/channel-test-registry.js";
/** Re-exported API for src/plugin-sdk, starting with Channel Account Snapshot. */
export type { ChannelAccountSnapshot } from "../channels/plugins/types.public.js";
/** Re-exported API for src/plugin-sdk, starting with Channel Gateway Context. */
export type { ChannelGatewayContext } from "../channels/plugins/types.adapters.js";
/** Re-exported API for src/plugin-sdk, starting with Open Claw Config. */
export type { OpenClawConfig } from "../config/config.js";
/** Re-exported API for src/plugin-sdk, starting with is At Least. */
export { isAtLeast, parseSemver } from "../infra/runtime-guard.js";
/** Re-exported API for src/plugin-sdk, starting with call Gateway. */
export { callGateway } from "../gateway/call.js";
/** @deprecated Direct outbound delivery is runtime substrate; use channel message runtime helpers. */
export { deliverOutboundPayloads } from "../infra/outbound/deliver.js";
/** Re-exported API for src/plugin-sdk. */
export {
  createEmptyPluginRegistry,
  createPluginRegistry,
  type PluginRecord,
} from "../plugins/registry.js";
/** Re-exported API for src/plugin-sdk. */
export {
  providerContractLoadError,
  pluginRegistrationContractRegistry,
  resolveProviderContractProvidersForPluginIds,
  resolveWebFetchProviderContractEntriesForPluginId,
  resolveWebSearchProviderContractEntriesForPluginId,
} from "../plugins/contracts/registry.js";
/** Re-exported API for src/plugin-sdk, starting with load Plugin Manifest Registry. */
export { loadPluginManifestRegistry } from "../plugins/manifest-registry.js";
/** Re-exported API for src/plugin-sdk, starting with parse Min Host Version Requirement. */
export { parseMinHostVersionRequirement } from "../plugins/min-host-version.js";
/** Re-exported API for src/plugin-sdk, starting with resolve Bundled Explicit Provider Contracts From Public Artifacts. */
export { resolveBundledExplicitProviderContractsFromPublicArtifacts } from "../plugins/provider-contract-public-artifacts.js";
/** Re-exported API for src/plugin-sdk. */
export {
  expectAugmentedCodexCatalog,
  expectedAugmentedOpenaiCodexCatalogEntriesWithGpt55,
  expectedOpenaiPluginCodexCatalogEntriesWithGpt55,
  expectCodexMissingAuthHint,
} from "../plugins/provider-runtime.test-support.js";
/** Re-exported API for src/plugin-sdk. */
export {
  initializeGlobalHookRunner,
  resetGlobalHookRunner,
} from "../plugins/hook-runner-global.js";
/** Re-exported API for src/plugin-sdk, starting with add Test Hook. */
export { addTestHook } from "../plugins/hooks.test-helpers.js";
/** Re-exported API for src/plugin-sdk. */
export {
  assertUniqueValues,
  BUNDLED_RUNTIME_SIDECAR_PATHS,
} from "../plugins/runtime-sidecar-paths.js";
/** Re-exported API for src/plugin-sdk, starting with create Plugin Record. */
export { createPluginRecord } from "../plugins/status.test-helpers.js";
/** Re-exported API for src/plugin-sdk. */
export {
  resolveBundledExplicitWebFetchProvidersFromPublicArtifacts,
  resolveBundledExplicitWebSearchProvidersFromPublicArtifacts,
} from "../plugins/web-provider-public-artifacts.explicit.js";
/** Re-exported API for src/plugin-sdk. */
export {
  getActivePluginRegistry,
  releasePinnedPluginChannelRegistry,
  resetPluginRuntimeStateForTest,
  setActivePluginRegistry,
} from "../plugins/runtime.js";
/** Re-exported API for src/plugin-sdk. */
export {
  listImportedBundledPluginFacadeIds,
  resetFacadeRuntimeStateForTest,
} from "./facade-runtime.js";
/** Re-exported API for src/plugin-sdk, starting with capture Plugin Registration. */
export { capturePluginRegistration } from "../plugins/captured-registration.js";
/** Re-exported API for src/plugin-sdk, starting with run Provider Catalog. */
export { runProviderCatalog } from "../plugins/provider-discovery.js";
/** Re-exported API for src/plugin-sdk. */
export {
  buildProviderPluginMethodChoice,
  resolveProviderModelPickerEntries,
  resolveProviderWizardOptions,
  setProviderWizardProvidersResolverForTest,
} from "../plugins/provider-wizard.js";
/** Re-exported API for src/plugin-sdk, starting with resolve Provider Plugin Choice. */
export { resolveProviderPluginChoice } from "../plugins/provider-auth-choice.runtime.js";
/** Re-exported API for src/plugin-sdk, starting with Plugin Runtime. */
export type { PluginRuntime } from "../plugins/runtime/types.js";
/** Re-exported API for src/plugin-sdk, starting with Plugin Hook Registration. */
export type { PluginHookRegistration } from "../plugins/hook-types.js";
/** Re-exported API for src/plugin-sdk, starting with Runtime Env. */
export type { RuntimeEnv } from "../runtime.js";
/** Re-exported API for src/plugin-sdk, starting with Mock Fn. */
export type { MockFn } from "../test-utils/vitest-mock-fn.js";
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
/** Re-exported API for src/plugin-sdk, starting with create Sandbox Test Context. */
export { createSandboxTestContext } from "../agents/sandbox/test-fixtures.js";
/** Re-exported API for src/plugin-sdk, starting with write Skill. */
export { writeSkill } from "../skills/test-support/e2e-test-helpers.js";
/** Re-exported API for src/plugin-sdk. */
export {
  castAgentMessage,
  makeAgentAssistantMessage,
  makeAgentUserMessage,
} from "../agents/test-helpers/agent-message-fixtures.js";
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
/** Re-exported API for src/plugin-sdk, starting with testing. */
export { testing, testing as __testing } from "../acp/control-plane/manager.js";
/** Re-exported API for src/plugin-sdk, starting with testing. */
export { testing as acpManagerTesting } from "../acp/control-plane/manager.js";
/** Re-exported API for src/plugin-sdk, starting with run Acp Runtime Adapter Contract. */
export { runAcpRuntimeAdapterContract } from "../acp/runtime/adapter-contract.testkit.js";
/** Re-exported API for src/plugin-sdk, starting with handle Acp Command. */
export { handleAcpCommand } from "../auto-reply/reply/commands-acp.js";
/** Re-exported API for src/plugin-sdk, starting with build Command Test Params. */
export { buildCommandTestParams } from "../auto-reply/reply/commands-spawn.test-harness.js";
/** Re-exported API for src/plugin-sdk, starting with peek System Events. */
export { peekSystemEvents, resetSystemEventsForTest } from "../infra/system-events.js";
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
/** Re-exported API for src/plugin-sdk, starting with create Outbound Test Plugin. */
export { createOutboundTestPlugin, createTestRegistry } from "../test-utils/channel-plugins.js";
/** Re-exported API for src/plugin-sdk, starting with create Windows Cmd Shim Fixture. */
export { createWindowsCmdShimFixture } from "../test-helpers/windows-cmd-shim.js";
/** Re-exported API for src/plugin-sdk, starting with install Common Resolve Target Error Cases. */
export { installCommonResolveTargetErrorCases } from "../test-helpers/resolve-target-error-cases.js";
export { sanitizeTerminalText } from "../../packages/terminal-core/src/safe-text.js";
export { withStateDirEnv } from "../test-helpers/state-dir-env.js";
/** Re-exported API for src/plugin-sdk, starting with count Lines. */
export { countLines, hasBalancedFences } from "../test-utils/chunk-test-helpers.js";
/** Re-exported API for src/plugin-sdk, starting with expect Generated Token Persisted To Gateway Auth. */
export { expectGeneratedTokenPersistedToGatewayAuth } from "../test-utils/auth-token-assertions.js";
/** Re-exported API for src/plugin-sdk, starting with capture Env. */
export { captureEnv, withEnv, withEnvAsync } from "../test-utils/env.js";
/** Re-exported API for src/plugin-sdk, starting with with Fetch Preconnect. */
export { withFetchPreconnect, type FetchMock } from "../test-utils/fetch-mock.js";
/** Re-exported API for src/plugin-sdk, starting with create Mock Server Response. */
export { createMockServerResponse } from "../test-utils/mock-http-response.js";
/** Re-exported API for src/plugin-sdk. */
export {
  registerProviderPlugin,
  registerProviderPlugins,
  registerSingleProviderPlugin,
  requireRegisteredProvider,
  type RegisteredProviderCollections,
} from "../test-utils/plugin-registration.js";
/** Re-exported API for src/plugin-sdk, starting with create Temp Home Env. */
export { createTempHomeEnv, type TempHomeEnv } from "../test-utils/temp-home.js";
/** Re-exported API for src/plugin-sdk, starting with with Temp Dir. */
export { withTempDir } from "../test-utils/temp-dir.js";
/** Re-exported API for src/plugin-sdk, starting with typed Cases. */
export { typedCases } from "../test-utils/typed-cases.js";
/** Re-exported API for src/plugin-sdk, starting with create Provider Usage Fetch. */
export { createProviderUsageFetch, makeResponse } from "../test-utils/provider-usage-fetch.js";
/** Re-exported API for src/plugin-sdk, starting with use Frozen Time. */
export { useFrozenTime, useRealTime } from "../test-utils/frozen-time.js";
/** Re-exported API for src/plugin-sdk. */
export {
  createNonExitingRuntimeEnv,
  createNonExitingTypedRuntimeEnv,
  createRuntimeEnv,
  createTypedRuntimeEnv,
} from "../test-utils/plugin-runtime-env.js";
/** Re-exported API for src/plugin-sdk. */
export {
  createPluginSetupWizardAdapter,
  createPluginSetupWizardConfigure,
  createPluginSetupWizardStatus,
  createQueuedWizardPrompter,
  createSetupWizardAdapter,
  createTestWizardPrompter,
  promptSetupWizardAllowFrom,
  resolveSetupWizardAllowFromEntries,
  resolveSetupWizardGroupAllowlist,
  runSetupWizardConfigure,
  runSetupWizardFinalize,
  runSetupWizardPrepare,
  selectFirstWizardOption,
  type WizardPrompter,
} from "../test-utils/plugin-setup-wizard.js";
/** Re-exported API for src/plugin-sdk, starting with create Mock Plugin Registry. */
export { createMockPluginRegistry } from "../plugins/hooks.test-helpers.js";
/** Re-exported API for src/plugin-sdk, starting with build Plugin Api. */
export { buildPluginApi } from "../plugins/api-builder.js";
/** Re-exported API for src/plugin-sdk. */
export {
  createCapturedPluginRegistration,
  type CapturedPluginRegistration,
} from "../plugins/captured-registration.js";
/** Re-exported API for src/plugin-sdk, starting with create Runtime Task Flow. */
export { createRuntimeTaskFlow } from "../plugins/runtime/runtime-taskflow.js";
