// config web search legacy provider keys helpers and runtime behavior.
/** Reused constant for LEGACY WEB SEARCH PROVIDER CONFIG KEYS behavior in src/config. */
export const LEGACY_WEB_SEARCH_PROVIDER_CONFIG_KEYS = new Set([
  "brave",
  "duckduckgo",
  "exa",
  "firecrawl",
  "gemini",
  "grok",
  "kimi",
  "minimax",
  "ollama",
  "perplexity",
  "searxng",
  "tavily",
]);

/** Reused helper for is Legacy Web Search Provider Config Key behavior in src/config. */
export function isLegacyWebSearchProviderConfigKey(key: string): boolean {
  return LEGACY_WEB_SEARCH_PROVIDER_CONFIG_KEYS.has(key);
}
