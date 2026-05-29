// Shared image-generation implementation helpers for bundled and third-party plugins.

/** Re-exported API for src/plugin-sdk, starting with Auth Profile Store. */
export type { AuthProfileStore } from "../agents/auth-profiles/types.js";
/** Re-exported API for src/plugin-sdk, starting with Fallback Attempt. */
export type { FallbackAttempt } from "../agents/model-fallback.types.js";
/** Re-exported API for src/plugin-sdk, starting with Image Generation Provider Plugin. */
export type { ImageGenerationProviderPlugin } from "../plugins/types.js";
/** Re-exported API for src/plugin-sdk. */
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
  getImageGenerationProvider,
  listImageGenerationProviders,
} from "../image-generation/provider-registry.js";
/** Re-exported API for src/plugin-sdk, starting with parse Image Generation Model Ref. */
export { parseImageGenerationModelRef } from "../image-generation/model-ref.js";
/** Re-exported API for src/plugin-sdk, starting with create Subsystem Logger. */
export { createSubsystemLogger } from "../logging/subsystem.js";
/** Re-exported API for src/plugin-sdk, starting with normalize Google Preview Model Id. */
export { normalizeGooglePreviewModelId as normalizeGoogleModelId } from "./provider-model-shared.js";
/** Re-exported API for src/plugin-sdk, starting with get Provider Env Vars. */
export { getProviderEnvVars } from "../secrets/provider-env-vars.js";
/** Reused constant for OPENAI DEFAULT IMAGE MODEL behavior in src/plugin-sdk. */
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

/** Reused helper for resolve Api Key For Provider behavior in src/plugin-sdk. */
export async function resolveApiKeyForProvider(
  ...args: Parameters<ImageGenerationCoreAuthRuntimeModule["resolveApiKeyForProvider"]>
): Promise<Awaited<ReturnType<ImageGenerationCoreAuthRuntimeModule["resolveApiKeyForProvider"]>>> {
  const runtime = await loadImageGenerationCoreAuthRuntime();
  return runtime.resolveApiKeyForProvider(...args);
}
