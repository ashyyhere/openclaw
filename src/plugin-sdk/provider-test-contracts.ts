/** Public SDK barrel for provider contract test suites and assertions. */
export {
  describeGithubCopilotProviderAuthContract,
  describeOpenAICodexProviderAuthContract,
  type ProviderAuthContractPluginLoader,
} from "./test-helpers/provider-auth-contract.js";
/** Provider catalog fixture loaders and assertions for contract tests. */
export {
  expectAugmentedCodexCatalog,
  expectedAugmentedOpenaiCodexCatalogEntriesWithGpt55,
  expectedOpenaiPluginCodexCatalogEntriesWithGpt55,
  expectCodexMissingAuthHint,
  importProviderRuntimeCatalogModule,
  loadBundledPluginPublicSurface,
  loadBundledPluginPublicSurfaceSync,
  type ProviderPlugin,
} from "./test-helpers/provider-catalog.js";
/** Generic provider contract suite entrypoint. */
export { describeProviderContracts } from "./test-helpers/provider-contract.js";
/** Installer helpers for provider, web fetch, and web search contract suites. */
export {
  installProviderPluginContractSuite,
  installWebFetchProviderContractSuite,
  installWebSearchProviderContractSuite,
} from "./test-helpers/provider-contract-suites.js";
/** Provider discovery contract suites for bundled provider plugins. */
export {
  describeCloudflareAiGatewayProviderDiscoveryContract,
  describeGithubCopilotProviderDiscoveryContract,
  describeMinimaxProviderDiscoveryContract,
  describeModelStudioProviderDiscoveryContract,
  describeSglangProviderDiscoveryContract,
  describeVllmProviderDiscoveryContract,
  type ProviderDiscoveryContractPluginLoader,
} from "./test-helpers/provider-discovery-contract.js";
/** Onboarding config fallback fixtures for provider contract tests. */
export {
  EXPECTED_FALLBACKS,
  createConfigWithFallbacks,
  createLegacyProviderConfig,
} from "./test-helpers/onboard-config.js";
/** Dashscope video provider mocks and result assertions. */
export {
  expectDashscopeVideoTaskPoll,
  expectSuccessfulDashscopeVideoResult,
  mockSuccessfulDashscopeVideoTask,
  resetDashscopeVideoProviderMocks,
  type DashscopeVideoProviderMocks,
} from "./test-helpers/dashscope-video-provider.js";
/** Explicit media capability assertions for provider contracts. */
export {
  expectExplicitMusicGenerationCapabilities,
  expectExplicitVideoGenerationCapabilities,
} from "./test-helpers/provider-media-capability-assertions.js";
/** Unified model catalog assertions for provider registrations. */
export {
  expectUnifiedModelCatalogEntries,
  expectUnifiedModelCatalogProviderRegistration,
} from "./test-helpers/unified-model-catalog-contract.js";
/** Provider onboarding assertions for primary and fallback model config. */
export {
  expectProviderOnboardAllowlistAlias,
  expectProviderOnboardMergedLegacyConfig,
  expectProviderOnboardPreservesPrimary,
  expectProviderOnboardPrimaryAndFallbacks,
  expectProviderOnboardPrimaryModel,
} from "./test-helpers/provider-onboard.js";
/** Provider runtime contract suites and plugin loader type. */
export {
  describeAnthropicProviderRuntimeContract,
  describeGithubCopilotProviderRuntimeContract,
  describeGoogleProviderRuntimeContract,
  describeOpenAIProviderRuntimeContract,
  describeOpenRouterProviderRuntimeContract,
  describeVeniceProviderRuntimeContract,
  describeZAIProviderRuntimeContract,
  type ProviderRuntimeContractPluginLoader,
} from "./test-helpers/provider-runtime-contract.js";
/** Provider wizard choice, model picker, and setup option contracts. */
export {
  describeProviderWizardChoiceResolutionContract,
  describeProviderWizardModelPickerContract,
  describeProviderWizardSetupOptionsContract,
} from "./test-helpers/provider-wizard-contract-suites.js";
/** Replay policy assertion for passthrough provider streams. */
export { expectPassthroughReplayPolicy } from "./test-helpers/provider-replay-policy.js";
/** Stream helper that captures thinking-config chunks in tests. */
export { createCapturedThinkingConfigStream } from "./test-helpers/stream-hooks.js";
/** Live STT audio helpers and transcript assertions for provider tests. */
export {
  expectOpenClawLiveTranscriptMarker,
  normalizeTranscriptForMatch,
  OPENCLAW_LIVE_TRANSCRIPT_MARKER_RE,
  runRealtimeSttLiveTest,
  streamAudioForLiveTest,
  synthesizeElevenLabsLiveSpeech,
  waitForLiveExpectation,
} from "./test-helpers/stt-live-audio.js";
/** Web fetch provider contract suite entrypoint. */
export { describeWebFetchProviderContracts } from "./test-helpers/web-fetch-provider-contract.js";
/** Web search provider contract suite entrypoint. */
export { describeWebSearchProviderContracts } from "./test-helpers/web-search-provider-contract.js";
