import { parseGenerationModelRef } from "../../packages/media-generation-core/src/model-ref.js";

/** Reused helper for parse Video Generation Model Ref behavior in src/video-generation. */
export function parseVideoGenerationModelRef(
  raw: string | undefined,
): { provider: string; model: string } | null {
  return parseGenerationModelRef(raw);
}
