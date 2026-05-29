// Public media-understanding helpers and types for provider plugins.

/** Re-exported API for src/plugin-sdk. */
export type {
  AudioTranscriptionRequest,
  AudioTranscriptionResult,
  ImageDescriptionRequest,
  ImageDescriptionResult,
  ImagesDescriptionInput,
  ImagesDescriptionRequest,
  ImagesDescriptionResult,
  MediaUnderstandingProvider,
  StructuredExtractionImageInput,
  StructuredExtractionInput,
  StructuredExtractionRequest,
  StructuredExtractionResult,
  StructuredExtractionTextInput,
  VideoDescriptionRequest,
  VideoDescriptionResult,
} from "../media-understanding/types.js";

/** Re-exported API for src/plugin-sdk. */
export {
  describeImageWithModel,
  describeImageWithModelPayloadTransform,
  describeImagesWithModel,
  describeImagesWithModelPayloadTransform,
} from "../media-understanding/image-runtime.js";
/** Re-exported API for src/plugin-sdk. */
export {
  buildOpenAiCompatibleVideoRequestBody,
  coerceOpenAiCompatibleVideoText,
  resolveMediaUnderstandingString,
  type OpenAiCompatibleVideoPayload,
} from "../media-understanding/openai-compatible-video.ts";
/** Re-exported API for src/plugin-sdk, starting with transcribe Open Ai Compatible Audio. */
export { transcribeOpenAiCompatibleAudio } from "../media-understanding/openai-compatible-audio.js";
