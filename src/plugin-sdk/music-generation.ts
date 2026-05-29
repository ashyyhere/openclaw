// Public music-generation helpers and types for provider plugins.

/** Re-exported API for src/plugin-sdk. */
export type {
  GeneratedMusicAsset,
  MusicGenerationEditCapabilities,
  MusicGenerationMode,
  MusicGenerationModeCapabilities,
  MusicGenerationProvider,
  MusicGenerationProviderCapabilities,
  MusicGenerationRequest,
  MusicGenerationResult,
  MusicGenerationSourceImage,
  MusicGenerationOutputFormat,
} from "../music-generation/types.js";
/** Re-exported API for src/plugin-sdk. */
export {
  downloadGeneratedMusicAsset,
  extractGeneratedMusicFileCandidates,
  generatedMusicAssetFromBase64,
  type GeneratedMusicFileCandidate,
} from "../music-generation/provider-assets.js";
