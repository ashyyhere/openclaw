// OpenAI prompt-cache key helpers.
/** Maximum prompt-cache key length accepted by OpenAI-compatible APIs. */
export const OPENAI_PROMPT_CACHE_KEY_MAX_LENGTH = 64;

/** Clamp a prompt-cache key by Unicode code point count. */
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
