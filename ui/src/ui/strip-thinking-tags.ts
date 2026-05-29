// Browser-facing wrapper for assistant-visible text cleanup.
import { stripAssistantInternalScaffolding } from "../../../src/shared/text/assistant-visible-text.js";

/** Remove internal thinking/scaffolding tags before rendering assistant text. */
export function stripThinkingTags(value: string): string {
  return stripAssistantInternalScaffolding(value);
}
