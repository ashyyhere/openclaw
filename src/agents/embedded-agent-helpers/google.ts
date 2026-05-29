/** Google/Gemma provider helper predicates for embedded-agent runtime. */
import { isGemma4ModelId } from "../../shared/google-models.js";
import { sanitizeGoogleTurnOrdering } from "./bootstrap.js";

/** Reused helper for is Google Model Api behavior in src/agents/embedded-agent-helpers. */
export function isGoogleModelApi(api?: string | null): boolean {
  return api === "google-gemini-cli" || api === "google-generative-ai";
}

/** Reused helper for is Gemma4 Model Requiring Reasoning Strip behavior in src/agents/embedded-agent-helpers. */
export function isGemma4ModelRequiringReasoningStrip(modelId?: string | null): boolean {
  return isGemma4ModelId(modelId);
}

/** Re-exported API for src/agents/embedded-agent-helpers, starting with sanitize Google Turn Ordering. */
export { sanitizeGoogleTurnOrdering };
