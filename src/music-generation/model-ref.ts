import { parseGenerationModelRef } from "../../packages/media-generation-core/src/model-ref.js";

/** Reused helper for parse Music Generation Model Ref behavior in src/music-generation. */
export function parseMusicGenerationModelRef(
  raw: string | undefined,
): { provider: string; model: string } | null {
  return parseGenerationModelRef(raw);
}
