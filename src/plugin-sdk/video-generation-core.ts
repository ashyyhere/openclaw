// Shared video-generation implementation helpers for bundled and third-party plugins.

/** Re-exported API for src/plugin-sdk, starting with Auth Profile Store. */
export type { AuthProfileStore } from "../agents/auth-profiles/types.js";
/** Re-exported API for src/plugin-sdk, starting with Fallback Attempt. */
export type { FallbackAttempt } from "../agents/model-fallback.types.js";
/** Re-exported API for src/plugin-sdk, starting with Video Generation Provider Plugin. */
export type { VideoGenerationProviderPlugin } from "../plugins/types.js";
/** Re-exported API for src/plugin-sdk. */
export type {
  GeneratedVideoAsset,
  VideoGenerationIgnoredOverride,
  VideoGenerationMode,
  VideoGenerationModeCapabilities,
  VideoGenerationModelCapabilitiesContext,
  VideoGenerationProvider,
  VideoGenerationProviderCapabilities,
  VideoGenerationProviderConfiguredContext,
  VideoGenerationRequest,
  VideoGenerationResolution,
  VideoGenerationResult,
  VideoGenerationSourceAsset,
  VideoGenerationTransformCapabilities,
} from "../video-generation/types.js";
/** Re-exported API for src/plugin-sdk, starting with Open Claw Config. */
export type { OpenClawConfig } from "../config/types.openclaw.js";

/** Re-exported API for src/plugin-sdk, starting with describe Failover Error. */
export { describeFailoverError, isFailoverError } from "../agents/failover-error.js";
/** Re-exported API for src/plugin-sdk. */
export {
  buildNoCapabilityModelConfiguredMessage,
  resolveCapabilityModelCandidates,
  throwCapabilityGenerationFailure,
} from "../media-generation/runtime-shared.js";
/** Re-exported API for src/plugin-sdk. */
export {
  resolveAgentModelFallbackValues,
  resolveAgentModelPrimaryValue,
} from "../config/model-input.js";
/** Re-exported API for src/plugin-sdk. */
export {
  getVideoGenerationProvider,
  listVideoGenerationProviders,
} from "../video-generation/provider-registry.js";
/** Re-exported API for src/plugin-sdk, starting with parse Video Generation Model Ref. */
export { parseVideoGenerationModelRef } from "../video-generation/model-ref.js";
/** Re-exported API for src/plugin-sdk, starting with create Subsystem Logger. */
export { createSubsystemLogger } from "../logging/subsystem.js";
/** Re-exported API for src/plugin-sdk, starting with get Provider Env Vars. */
export { getProviderEnvVars } from "../secrets/provider-env-vars.js";
