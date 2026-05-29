import { parseGenerationModelRef } from "../../packages/media-generation-core/src/model-ref.js";

/** Parses provider/model refs using the shared media generation grammar. */
export function parseImageGenerationModelRef(
  raw: string | undefined,
): { provider: string; model: string } | null {
  return parseGenerationModelRef(raw);
}
