// Shared image-generation implementation helpers for bundled and third-party plugins.

/** Auth profile store contract used by image providers for credential lookup. */
export type { AuthProfileStore } from "../agents/auth-profiles/types.js";
/** Fallback attempt metadata shared with media-generation provider flows. */
export type { FallbackAttempt } from "../agents/model-fallback.types.js";
/** Plugin registration contract for image-generation providers. */
export type { ImageGenerationProviderPlugin } from "../plugins/types.js";
/** Public image-generation provider, request, result, and asset contracts. */
export type {
  GeneratedImageAsset,
  ImageGenerationProvider,
  ImageGenerationProviderConfiguredContext,
  ImageGenerationProviderOptions,
  ImageGenerationResolution,
  ImageGenerationRequest,
  ImageGenerationResult,
  ImageGenerationSourceImage,
} from "../image-generation/types.js";
/** Core OpenClaw config shape used by provider setup and runtime helpers. */
export type { OpenClawConfig } from "../config/types.openclaw.js";

/** Failover error helpers used when provider retries exhaust candidates. */
export { describeFailoverError, isFailoverError } from "../agents/failover-error.js";
/** Shared media-generation failure and model-candidate helpers. */
export {
  buildNoCapabilityModelConfiguredMessage,
  resolveCapabilityModelCandidates,
  throwCapabilityGenerationFailure,
} from "../media-generation/runtime-shared.js";
/** Agent model fallback helpers reused by image provider selection. */
export {
  resolveAgentModelFallbackValues,
  resolveAgentModelPrimaryValue,
} from "../config/model-input.js";
/** Image-generation provider registry lookup helpers. */
export {
  getImageGenerationProvider,
  listImageGenerationProviders,
} from "../image-generation/provider-registry.js";
/** Parses provider/model refs accepted by image-generation requests. */
export { parseImageGenerationModelRef } from "../image-generation/model-ref.js";
/** Creates subsystem-scoped loggers for provider implementations. */
export { createSubsystemLogger } from "../logging/subsystem.js";
/** Normalizes Google preview model ids for provider routing. */
export { normalizeGooglePreviewModelId as normalizeGoogleModelId } from "./provider-model-shared.js";
/** Reads provider-specific environment variable names from secret metadata. */
export { getProviderEnvVars } from "../secrets/provider-env-vars.js";
/** Default OpenAI image model used by image-generation provider helpers. */
export const OPENAI_DEFAULT_IMAGE_MODEL = "gpt-image-2";

type ImageGenerationCoreAuthRuntimeModule =
  typeof import("./image-generation-core.auth.runtime.js");

let imageGenerationCoreAuthRuntimePromise:
  | Promise<ImageGenerationCoreAuthRuntimeModule>
  | undefined;

async function loadImageGenerationCoreAuthRuntime(): Promise<ImageGenerationCoreAuthRuntimeModule> {
  imageGenerationCoreAuthRuntimePromise ??= import("./image-generation-core.auth.runtime.js");
  return imageGenerationCoreAuthRuntimePromise;
}

/** Lazily resolves an API key for a provider without loading auth runtime at import time. */
export async function resolveApiKeyForProvider(
  ...args: Parameters<ImageGenerationCoreAuthRuntimeModule["resolveApiKeyForProvider"]>
): Promise<Awaited<ReturnType<ImageGenerationCoreAuthRuntimeModule["resolveApiKeyForProvider"]>>> {
  const runtime = await loadImageGenerationCoreAuthRuntime();
  return runtime.resolveApiKeyForProvider(...args);
}
