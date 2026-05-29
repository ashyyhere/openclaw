/** Shared model context-token cache used by runtime model discovery. */
/** Process-local cache from model id to context token count. */
export const MODEL_CONTEXT_TOKEN_CACHE = new Map<string, number>();

/** Read a cached context-token count for a model id. */
export function lookupCachedContextTokens(modelId?: string): number | undefined {
  if (!modelId) {
    return undefined;
  }
  return MODEL_CONTEXT_TOKEN_CACHE.get(modelId);
}
