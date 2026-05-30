// Shared video-generation implementation helpers for bundled and third-party plugins.

/** Auth profile store type used by video generation providers. */
export type { AuthProfileStore } from "../agents/auth-profiles/types.js";
/** Fallback attempt metadata shared with capability generation failures. */
export type { FallbackAttempt } from "../agents/model-fallback.types.js";
/** Plugin registration shape for video generation providers. */
export type { VideoGenerationProviderPlugin } from "../plugins/types.js";
/** Core video generation provider contracts re-exported for plugins. */
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
/** OpenClaw config type passed into provider capability/configuration hooks. */
export type { OpenClawConfig } from "../config/types.openclaw.js";

/** Failover error helpers used by video generation fallback flows. */
export { describeFailoverError, isFailoverError } from "../agents/failover-error.js";
/** Shared media-generation capability selection and failure helpers. */
export {
  buildNoCapabilityModelConfiguredMessage,
  resolveCapabilityModelCandidates,
  throwCapabilityGenerationFailure,
} from "../media-generation/runtime-shared.js";
/** Agent model preference helpers for provider/model fallback resolution. */
export {
  resolveAgentModelFallbackValues,
  resolveAgentModelPrimaryValue,
} from "../config/model-input.js";
/** Video generation provider registry accessors. */
export {
  getVideoGenerationProvider,
  listVideoGenerationProviders,
} from "../video-generation/provider-registry.js";
/** Parses provider/model references for video generation models. */
export { parseVideoGenerationModelRef } from "../video-generation/model-ref.js";
/** Logger factory for video generation provider subsystems. */
export { createSubsystemLogger } from "../logging/subsystem.js";
/** Provider environment variable resolver for plugin configuration checks. */
export { getProviderEnvVars } from "../secrets/provider-env-vars.js";
