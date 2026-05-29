// extensions/video-generation-core api helpers and runtime behavior.
/** Re-exported video-generation-core plugin public API, starting with Auth Profile Store. */
export type { AuthProfileStore } from "openclaw/plugin-sdk/video-generation-core";
/** Re-exported video-generation-core plugin public API. */
export {
  buildNoCapabilityModelConfiguredMessage,
  createSubsystemLogger,
  describeFailoverError,
  getProviderEnvVars,
  getVideoGenerationProvider,
  isFailoverError,
  listVideoGenerationProviders,
  parseVideoGenerationModelRef,
  resolveAgentModelFallbackValues,
  resolveAgentModelPrimaryValue,
  resolveCapabilityModelCandidates,
  throwCapabilityGenerationFailure,
} from "openclaw/plugin-sdk/video-generation-core";
/** Re-exported video-generation-core plugin public API. */
export type {
  FallbackAttempt,
  GeneratedVideoAsset,
  OpenClawConfig,
  VideoGenerationIgnoredOverride,
  VideoGenerationMode,
  VideoGenerationModeCapabilities,
  VideoGenerationProvider,
  VideoGenerationProviderCapabilities,
  VideoGenerationProviderConfiguredContext,
  VideoGenerationProviderPlugin,
  VideoGenerationRequest,
  VideoGenerationResolution,
  VideoGenerationResult,
  VideoGenerationSourceAsset,
  VideoGenerationTransformCapabilities,
} from "openclaw/plugin-sdk/video-generation-core";
