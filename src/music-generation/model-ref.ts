import { parseGenerationModelRef } from "../../packages/media-generation-core/src/model-ref.js";

/** Parses `provider/model` refs for music generation using the shared media-generation rules. */
export function parseMusicGenerationModelRef(
  raw: string | undefined,
): { provider: string; model: string } | null {
  return parseGenerationModelRef(raw);
}
