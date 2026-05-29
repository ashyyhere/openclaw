/**
 * @deprecated Public SDK subpath has no bundled extension production imports.
 * Prefer plugin-owned music provider surfaces until a current shared contract
 * is needed by bundled extensions.
 */

export type { AuthProfileStore } from "../agents/auth-profiles/types.js";
/** Re-exported API for src/plugin-sdk, starting with Fallback Attempt. */
export type { FallbackAttempt } from "../agents/model-fallback.types.js";
/** Re-exported API for src/plugin-sdk, starting with Open Claw Config. */
export type { OpenClawConfig } from "../config/types.openclaw.js";
/** Re-exported API for src/plugin-sdk, starting with Music Generation Provider Plugin. */
export type { MusicGenerationProviderPlugin } from "../plugins/types.js";
/** Re-exported API for src/plugin-sdk. */
export type {
  GeneratedMusicAsset,
  MusicGenerationOutputFormat,
  MusicGenerationProvider,
  MusicGenerationProviderCapabilities,
  MusicGenerationRequest,
  MusicGenerationResult,
  MusicGenerationSourceImage,
} from "../music-generation/types.js";

/** Re-exported API for src/plugin-sdk, starting with describe Failover Error. */
export { describeFailoverError, isFailoverError } from "../agents/failover-error.js";
/** Re-exported API for src/plugin-sdk. */
export {
  resolveAgentModelFallbackValues,
  resolveAgentModelPrimaryValue,
} from "../config/model-input.js";
/** Re-exported API for src/plugin-sdk, starting with create Subsystem Logger. */
export { createSubsystemLogger } from "../logging/subsystem.js";
/** Re-exported API for src/plugin-sdk, starting with parse Music Generation Model Ref. */
export { parseMusicGenerationModelRef } from "../music-generation/model-ref.js";
/** Re-exported API for src/plugin-sdk. */
export {
  getMusicGenerationProvider,
  listMusicGenerationProviders,
} from "../music-generation/provider-registry.js";
/** Re-exported API for src/plugin-sdk, starting with get Provider Env Vars. */
export { getProviderEnvVars } from "../secrets/provider-env-vars.js";
