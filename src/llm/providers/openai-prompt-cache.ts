// llm/providers openai prompt cache helpers and runtime behavior.
/** Reused constant for OPENAI PROMPT CACHE KEY MAX LENGTH behavior in src/llm/providers. */
export const OPENAI_PROMPT_CACHE_KEY_MAX_LENGTH = 64;

/** Reused helper for clamp Open AIPrompt Cache Key behavior in src/llm/providers. */
export function clampOpenAIPromptCacheKey(key: string | undefined): string | undefined {
  if (key === undefined) {
    return undefined;
  }
  const chars = Array.from(key);
  if (chars.length <= OPENAI_PROMPT_CACHE_KEY_MAX_LENGTH) {
    return key;
  }
  return chars.slice(0, OPENAI_PROMPT_CACHE_KEY_MAX_LENGTH).join("");
}
