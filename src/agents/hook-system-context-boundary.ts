/** Wraps plugin-injected system context in a stable prompt boundary. */
import { normalizeStructuredPromptSection } from "./prompt-cache-stability.js";

const HOOK_SYSTEM_CONTEXT_HEADER =
  "OpenClaw plugin-injected system context. This block is not workspace file content.";

/** Normalize and wrap plugin system context for safe prompt injection. */
export function wrapPluginSystemContextSection(value?: string): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const normalized = normalizeStructuredPromptSection(value);
  if (!normalized) {
    return undefined;
  }
  return `---\n\n${HOOK_SYSTEM_CONTEXT_HEADER}\n\n${normalized}\n\n---`;
}
