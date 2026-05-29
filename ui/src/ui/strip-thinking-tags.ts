// ui/src/ui strip thinking tags helpers and runtime behavior.
import { stripAssistantInternalScaffolding } from "../../../src/shared/text/assistant-visible-text.js";

/** Reused helper for strip Thinking Tags behavior in ui/src/ui. */
export function stripThinkingTags(value: string): string {
  return stripAssistantInternalScaffolding(value);
}
