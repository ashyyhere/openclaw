import { parseGenerationModelRef } from "../../packages/media-generation-core/src/model-ref.js";

/** Reused helper for parse Image Generation Model Ref behavior in src/image-generation. */
export function parseImageGenerationModelRef(
  raw: string | undefined,
): { provider: string; model: string } | null {
  return parseGenerationModelRef(raw);
}
