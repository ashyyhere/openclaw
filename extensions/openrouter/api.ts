// extensions/openrouter api helpers and runtime behavior.
/** Re-exported openrouter plugin public API, starting with build Open Router Image Generation Provider. */
export { buildOpenRouterImageGenerationProvider } from "./image-generation-provider.js";
/** Re-exported openrouter plugin public API, starting with build Open Router Music Generation Provider. */
export { buildOpenRouterMusicGenerationProvider } from "./music-generation-provider.js";
/** Re-exported openrouter plugin public API. */
export {
  buildOpenrouterProvider,
  isOpenRouterProxyReasoningUnsupportedModel,
} from "./provider-catalog.js";
/** Re-exported openrouter plugin public API, starting with build Open Router Speech Provider. */
export { buildOpenRouterSpeechProvider } from "./speech-provider.js";
/** Re-exported openrouter plugin public API. */
export {
  applyOpenrouterConfig,
  applyOpenrouterProviderConfig,
  OPENROUTER_DEFAULT_MODEL_REF,
} from "./onboard.js";
