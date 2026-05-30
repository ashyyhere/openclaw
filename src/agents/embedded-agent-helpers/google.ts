import { isGemma4ModelId } from "../../shared/google-models.js";
import { sanitizeGoogleTurnOrdering } from "./bootstrap.js";

/** Detects Google-backed model API ids that need Google turn handling. */
export function isGoogleModelApi(api?: string | null): boolean {
  return api === "google-gemini-cli" || api === "google-generative-ai";
}

/** Detects Gemma 4 models whose reasoning blocks must be stripped. */
export function isGemma4ModelRequiringReasoningStrip(modelId?: string | null): boolean {
  return isGemma4ModelId(modelId);
}

/** Google turn-order sanitizer used before embedded-agent provider calls. */
export { sanitizeGoogleTurnOrdering };
