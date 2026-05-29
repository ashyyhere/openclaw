/** Public SDK barrel for provider contract test suites and assertions. */
export {
  describeGithubCopilotProviderAuthContract,
  describeOpenAICodexProviderAuthContract,
  type ProviderAuthContractPluginLoader,
} from "./test-helpers/provider-auth-contract.js";
/** Re-exported API for src/plugin-sdk. */
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
/** Re-exported API for src/plugin-sdk, starting with describe Provider Contracts. */
export { describeProviderContracts } from "./test-helpers/provider-contract.js";
/** Re-exported API for src/plugin-sdk. */
export {
  installProviderPluginContractSuite,
  installWebFetchProviderContractSuite,
  installWebSearchProviderContractSuite,
} from "./test-helpers/provider-contract-suites.js";
/** Re-exported API for src/plugin-sdk. */
export {
  describeCloudflareAiGatewayProviderDiscoveryContract,
  describeGithubCopilotProviderDiscoveryContract,
  describeMinimaxProviderDiscoveryContract,
  describeModelStudioProviderDiscoveryContract,
  describeSglangProviderDiscoveryContract,
  describeVllmProviderDiscoveryContract,
  type ProviderDiscoveryContractPluginLoader,
} from "./test-helpers/provider-discovery-contract.js";
/** Re-exported API for src/plugin-sdk. */
export {
  EXPECTED_FALLBACKS,
  createConfigWithFallbacks,
  createLegacyProviderConfig,
} from "./test-helpers/onboard-config.js";
/** Re-exported API for src/plugin-sdk. */
export {
  expectDashscopeVideoTaskPoll,
  expectSuccessfulDashscopeVideoResult,
  mockSuccessfulDashscopeVideoTask,
  resetDashscopeVideoProviderMocks,
  type DashscopeVideoProviderMocks,
} from "./test-helpers/dashscope-video-provider.js";
/** Re-exported API for src/plugin-sdk. */
export {
  expectExplicitMusicGenerationCapabilities,
  expectExplicitVideoGenerationCapabilities,
} from "./test-helpers/provider-media-capability-assertions.js";
/** Re-exported API for src/plugin-sdk. */
export {
  expectUnifiedModelCatalogEntries,
  expectUnifiedModelCatalogProviderRegistration,
} from "./test-helpers/unified-model-catalog-contract.js";
/** Re-exported API for src/plugin-sdk. */
export {
  expectProviderOnboardAllowlistAlias,
  expectProviderOnboardMergedLegacyConfig,
  expectProviderOnboardPreservesPrimary,
  expectProviderOnboardPrimaryAndFallbacks,
  expectProviderOnboardPrimaryModel,
} from "./test-helpers/provider-onboard.js";
/** Re-exported API for src/plugin-sdk. */
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
/** Re-exported API for src/plugin-sdk. */
export {
  describeProviderWizardChoiceResolutionContract,
  describeProviderWizardModelPickerContract,
  describeProviderWizardSetupOptionsContract,
} from "./test-helpers/provider-wizard-contract-suites.js";
/** Re-exported API for src/plugin-sdk, starting with expect Passthrough Replay Policy. */
export { expectPassthroughReplayPolicy } from "./test-helpers/provider-replay-policy.js";
/** Re-exported API for src/plugin-sdk, starting with create Captured Thinking Config Stream. */
export { createCapturedThinkingConfigStream } from "./test-helpers/stream-hooks.js";
/** Re-exported API for src/plugin-sdk. */
export {
  expectOpenClawLiveTranscriptMarker,
  normalizeTranscriptForMatch,
  OPENCLAW_LIVE_TRANSCRIPT_MARKER_RE,
  runRealtimeSttLiveTest,
  streamAudioForLiveTest,
  synthesizeElevenLabsLiveSpeech,
  waitForLiveExpectation,
} from "./test-helpers/stt-live-audio.js";
/** Re-exported API for src/plugin-sdk, starting with describe Web Fetch Provider Contracts. */
export { describeWebFetchProviderContracts } from "./test-helpers/web-fetch-provider-contract.js";
/** Re-exported API for src/plugin-sdk, starting with describe Web Search Provider Contracts. */
export { describeWebSearchProviderContracts } from "./test-helpers/web-search-provider-contract.js";
