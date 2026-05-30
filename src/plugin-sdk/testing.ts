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
/** Channel contract assertions and outbound mock helpers for plugin tests. */
export {
  expectChannelInboundContextContract,
  expectChannelTurnDispatchResultContract,
  primeChannelOutboundSendMock,
} from "../channels/plugins/contracts/test-helpers.js";
/** Outbound payload contract test suite and harness parameter type. */
export {
  installChannelOutboundPayloadContractSuite,
  type OutboundPayloadHarnessParams,
} from "../channels/plugins/contracts/outbound-payload-testkit.js";
/** Inbound dispatch capture mock for channel contract tests. */
export { buildDispatchInboundCaptureMock } from "../channels/plugins/contracts/inbound-testkit.js";
/** CLI runtime capture utilities for command tests. */
export {
  createCliRuntimeCapture,
  firstWrittenJsonArg,
  spyRuntimeErrors,
  spyRuntimeJson,
  spyRuntimeLogs,
} from "../cli/test-runtime-capture.js";
/** CLI mock runtime types used by command test captures. */
export type { CliMockOutputRuntime, CliRuntimeCapture } from "../cli/test-runtime-capture.js";
/** Override the default channel plugin registry in tests. */
export { setDefaultChannelPluginRegistryForTests } from "../commands/channel-test-registry.js";
/** Public channel account snapshot DTO used by test fixtures. */
export type { ChannelAccountSnapshot } from "../channels/plugins/types.public.js";
/** Channel gateway adapter context type for contract tests. */
export type { ChannelGatewayContext } from "../channels/plugins/types.adapters.js";
/** OpenClaw config type used by plugin test fixtures. */
export type { OpenClawConfig } from "../config/config.js";
/** Semver helpers used by plugin compatibility tests. */
export { isAtLeast, parseSemver } from "../infra/runtime-guard.js";
/** Gateway request helper for integration-style plugin tests. */
export { callGateway } from "../gateway/call.js";
/** @deprecated Direct outbound delivery is runtime substrate; use channel message runtime helpers. */
export { deliverOutboundPayloads } from "../infra/outbound/deliver.js";
/** Plugin registry constructors and record type for tests. */
export {
  createEmptyPluginRegistry,
  createPluginRegistry,
  type PluginRecord,
} from "../plugins/registry.js";
/** Provider and web provider contract registry helpers for tests. */
export {
  providerContractLoadError,
  pluginRegistrationContractRegistry,
  resolveProviderContractProvidersForPluginIds,
  resolveWebFetchProviderContractEntriesForPluginId,
  resolveWebSearchProviderContractEntriesForPluginId,
} from "../plugins/contracts/registry.js";
/** Manifest registry loader used by plugin discovery tests. */
export { loadPluginManifestRegistry } from "../plugins/manifest-registry.js";
/** Minimum host-version parser used by plugin compatibility tests. */
export { parseMinHostVersionRequirement } from "../plugins/min-host-version.js";
/** Provider contract resolver backed by bundled public artifacts. */
export { resolveBundledExplicitProviderContractsFromPublicArtifacts } from "../plugins/provider-contract-public-artifacts.js";
/** Provider runtime catalog expectations for Codex/OpenAI plugin tests. */
export {
  expectAugmentedCodexCatalog,
  expectedAugmentedOpenaiCodexCatalogEntriesWithGpt55,
  expectedOpenaiPluginCodexCatalogEntriesWithGpt55,
  expectCodexMissingAuthHint,
} from "../plugins/provider-runtime.test-support.js";
/** Global hook runner lifecycle helpers for tests. */
export {
  initializeGlobalHookRunner,
  resetGlobalHookRunner,
} from "../plugins/hook-runner-global.js";
/** Register a temporary plugin hook in tests. */
export { addTestHook } from "../plugins/hooks.test-helpers.js";
/** Runtime sidecar path constants and uniqueness assertion for package tests. */
export {
  assertUniqueValues,
  BUNDLED_RUNTIME_SIDECAR_PATHS,
} from "../plugins/runtime-sidecar-paths.js";
/** Create plugin status records for registry/status tests. */
export { createPluginRecord } from "../plugins/status.test-helpers.js";
/** Web provider public artifact resolvers for bundled plugin tests. */
export {
  resolveBundledExplicitWebFetchProvidersFromPublicArtifacts,
  resolveBundledExplicitWebSearchProvidersFromPublicArtifacts,
} from "../plugins/web-provider-public-artifacts.explicit.js";
/** Active plugin registry/runtime reset helpers for tests. */
export {
  getActivePluginRegistry,
  releasePinnedPluginChannelRegistry,
  resetPluginRuntimeStateForTest,
  setActivePluginRegistry,
} from "../plugins/runtime.js";
/** Facade runtime import list and reset helpers for tests. */
export {
  listImportedBundledPluginFacadeIds,
  resetFacadeRuntimeStateForTest,
} from "./facade-runtime.js";
/** Capture plugin registration output without activating the full runtime. */
export { capturePluginRegistration } from "../plugins/captured-registration.js";
/** Execute provider catalog hooks in tests. */
export { runProviderCatalog } from "../plugins/provider-discovery.js";
/** Provider wizard option helpers and test resolver override. */
export {
  buildProviderPluginMethodChoice,
  resolveProviderModelPickerEntries,
  resolveProviderWizardOptions,
  setProviderWizardProvidersResolverForTest,
} from "../plugins/provider-wizard.js";
/** Resolve provider plugin auth choices in runtime tests. */
export { resolveProviderPluginChoice } from "../plugins/provider-auth-choice.runtime.js";
/** Plugin runtime type used by captured registrations. */
export type { PluginRuntime } from "../plugins/runtime/types.js";
/** Plugin hook registration type used by hook tests. */
export type { PluginHookRegistration } from "../plugins/hook-types.js";
/** Runtime environment type used by plugin test helpers. */
export type { RuntimeEnv } from "../runtime.js";
/** Vitest-compatible mock function type. */
export type { MockFn } from "../test-utils/vitest-mock-fn.js";
/** Media understanding auth/fetch test helpers. */
export {
  createAuthCaptureJsonFetch,
  createRequestCaptureJsonFetch,
  installPinnedHostnameTestHooks,
} from "../media-understanding/audio.test-helpers.ts";
/** Live agent test message/profile helpers. */
export {
  createSingleUserPromptMessage,
  extractNonEmptyAssistantText,
  isLiveProfileKeyModeEnabled,
  isLiveTestEnabled,
} from "../agents/live-test-helpers.js";
/** Sandbox fixture context for agent tests. */
export { createSandboxTestContext } from "../agents/sandbox/test-fixtures.js";
/** Skill fixture writer for end-to-end tests. */
export { writeSkill } from "../skills/test-support/e2e-test-helpers.js";
/** Agent message fixture builders and cast helper. */
export {
  castAgentMessage,
  makeAgentAssistantMessage,
  makeAgentUserMessage,
} from "../agents/test-helpers/agent-message-fixtures.js";
/** Collect live provider API keys for live-lane tests. */
export { collectProviderApiKeys } from "../agents/live-auth-keys.js";
/** Model-not-found error matcher for live tests. */
export { isModelNotFoundErrorMessage } from "../agents/live-model-errors.js";
/** Provider failover error classification matchers. */
export {
  isAuthErrorMessage,
  isBillingErrorMessage,
  isOverloadedErrorMessage,
  isServerErrorMessage,
  isTimeoutErrorMessage,
} from "../agents/embedded-agent-helpers/failover-matches.js";
/** Load shell environment for generation-provider live tests when enabled. */
export { maybeLoadShellEnvForGenerationProviders } from "../test-utils/generation-live-test-helpers.js";
/** ACP manager testing facade kept for legacy imports. */
export { testing, testing as __testing } from "../acp/control-plane/manager.js";
/** Named ACP manager testing facade for newer tests. */
export { testing as acpManagerTesting } from "../acp/control-plane/manager.js";
/** ACP runtime adapter contract suite runner. */
export { runAcpRuntimeAdapterContract } from "../acp/runtime/adapter-contract.testkit.js";
/** ACP command handler for command-level tests. */
export { handleAcpCommand } from "../auto-reply/reply/commands-acp.js";
/** Spawn command test parameter builder. */
export { buildCommandTestParams } from "../auto-reply/reply/commands-spawn.test-harness.js";
/** System event inspection/reset helpers for tests. */
export { peekSystemEvents, resetSystemEventsForTest } from "../infra/system-events.js";
/** Boolean-like environment value parser. */
export { isTruthyEnvValue } from "../infra/env.js";
/** Shell environment applied-key inspection helper. */
export { getShellEnvAppliedKeys } from "../infra/shell-env.js";
/** Minimal PNG encoder helpers for media tests. */
export { encodePngRgba, fillPixel } from "../media/png-encode.js";
/** Media generation live-test parsing and redaction helpers. */
export {
  parseLiveCsvFilter as parseCsvFilter,
  parseProviderModelMap,
  redactLiveApiKey,
} from "../media-generation/live-test-helpers.js";
/** Music generation live-test model/auth helpers. */
export {
  DEFAULT_LIVE_MUSIC_MODELS,
  resolveConfiguredLiveMusicModels,
  resolveLiveMusicAuthStore,
} from "../music-generation/live-test-helpers.js";
/** Video generation live-test model/auth/resolution helpers. */
export {
  canRunBufferBackedImageToVideoLiveLane,
  canRunBufferBackedVideoToVideoLiveLane,
  DEFAULT_LIVE_VIDEO_MODELS,
  resolveConfiguredLiveVideoModels,
  resolveLiveVideoAuthStore,
  resolveLiveVideoResolution,
} from "../video-generation/live-test-helpers.js";
/** Video generation duration normalization helper. */
export { normalizeVideoGenerationDuration } from "../video-generation/duration-support.js";
/** Video generation model reference parser. */
export { parseVideoGenerationModelRef } from "../video-generation/model-ref.js";
/** Video generation provider/request types used by tests. */
export type {
  GeneratedVideoAsset,
  VideoGenerationMode,
  VideoGenerationModeCapabilities,
  VideoGenerationProvider,
  VideoGenerationRequest,
} from "../video-generation/types.js";
/** HTTP test response/request helpers. */
export { jsonResponse, requestBodyText, requestUrl } from "../test-helpers/http.js";
/** SSRF hostname pinning mock helper. */
export { mockPinnedHostnameResolution } from "../test-helpers/ssrf.js";
/** Channel plugin registry/test plugin fixtures. */
export { createOutboundTestPlugin, createTestRegistry } from "../test-utils/channel-plugins.js";
/** Windows command shim fixture helper. */
export { createWindowsCmdShimFixture } from "../test-helpers/windows-cmd-shim.js";
/** Shared target-resolution error-case suite installer. */
export { installCommonResolveTargetErrorCases } from "../test-helpers/resolve-target-error-cases.js";
export { sanitizeTerminalText } from "../../packages/terminal-core/src/safe-text.js";
export { withStateDirEnv } from "../test-helpers/state-dir-env.js";
/** Markdown/code chunk assertion helpers. */
export { countLines, hasBalancedFences } from "../test-utils/chunk-test-helpers.js";
/** Gateway auth token persistence assertion helper. */
export { expectGeneratedTokenPersistedToGatewayAuth } from "../test-utils/auth-token-assertions.js";
/** Environment capture and temporary override helpers. */
export { captureEnv, withEnv, withEnvAsync } from "../test-utils/env.js";
/** Fetch mock with preconnect support and its type. */
export { withFetchPreconnect, type FetchMock } from "../test-utils/fetch-mock.js";
/** Mock Node server response helper. */
export { createMockServerResponse } from "../test-utils/mock-http-response.js";
/** Provider plugin registration fixtures and assertions. */
export {
  registerProviderPlugin,
  registerProviderPlugins,
  registerSingleProviderPlugin,
  requireRegisteredProvider,
  type RegisteredProviderCollections,
} from "../test-utils/plugin-registration.js";
/** Temporary home-directory environment fixture. */
export { createTempHomeEnv, type TempHomeEnv } from "../test-utils/temp-home.js";
/** Temporary directory fixture helper. */
export { withTempDir } from "../test-utils/temp-dir.js";
/** Typed table-case helper for tests. */
export { typedCases } from "../test-utils/typed-cases.js";
/** Provider usage fetch mock and response factory. */
export { createProviderUsageFetch, makeResponse } from "../test-utils/provider-usage-fetch.js";
/** Fake-time helpers for tests. */
export { useFrozenTime, useRealTime } from "../test-utils/frozen-time.js";
/** Runtime env fixture constructors for plugin tests. */
export {
  createNonExitingRuntimeEnv,
  createNonExitingTypedRuntimeEnv,
  createRuntimeEnv,
  createTypedRuntimeEnv,
} from "../test-utils/plugin-runtime-env.js";
/** Plugin setup wizard fixture helpers and prompter type. */
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
/** Mock plugin registry helper for hook tests. */
export { createMockPluginRegistry } from "../plugins/hooks.test-helpers.js";
/** Plugin API builder for registration tests. */
export { buildPluginApi } from "../plugins/api-builder.js";
/** Captured plugin registration fixture and type. */
export {
  createCapturedPluginRegistration,
  type CapturedPluginRegistration,
} from "../plugins/captured-registration.js";
/** Runtime task-flow fixture helper. */
export { createRuntimeTaskFlow } from "../plugins/runtime/runtime-taskflow.js";
