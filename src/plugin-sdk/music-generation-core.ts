/**
 * @deprecated Public SDK subpath has no bundled extension production imports.
 * Prefer plugin-owned music provider surfaces until a current shared contract
 * is needed by bundled extensions.
 */

export type { AuthProfileStore } from "../agents/auth-profiles/types.js";
/** Model fallback attempt type reused by music providers. */
export type { FallbackAttempt } from "../agents/model-fallback.types.js";
/** OpenClaw config type accepted by music provider setup/runtime helpers. */
export type { OpenClawConfig } from "../config/types.openclaw.js";
/** Plugin contract type for music generation providers. */
export type { MusicGenerationProviderPlugin } from "../plugins/types.js";
/** Music generation provider, request, result, and asset types. */
export type {
  GeneratedMusicAsset,
  MusicGenerationOutputFormat,
  MusicGenerationProvider,
  MusicGenerationProviderCapabilities,
  MusicGenerationRequest,
  MusicGenerationResult,
  MusicGenerationSourceImage,
} from "../music-generation/types.js";

/** Failover error helpers reused by provider-facing music generation code. */
export { describeFailoverError, isFailoverError } from "../agents/failover-error.js";
/** Agent model fallback selection helpers for provider routing. */
export {
  resolveAgentModelFallbackValues,
  resolveAgentModelPrimaryValue,
} from "../config/model-input.js";
/** Subsystem logger factory for music generation providers. */
export { createSubsystemLogger } from "../logging/subsystem.js";
/** Parser for provider/model refs used by music generation requests. */
export { parseMusicGenerationModelRef } from "../music-generation/model-ref.js";
/** Music generation provider registry accessors. */
export {
  getMusicGenerationProvider,
  listMusicGenerationProviders,
} from "../music-generation/provider-registry.js";
/** Provider environment variable resolver for music credentials. */
export { getProviderEnvVars } from "../secrets/provider-env-vars.js";
