// packages/memory-host-sdk/src/host embeddings model normalize helpers and runtime behavior.
/** Public helper for normalize Embedding Model With Prefixes behavior in packages/memory-host-sdk. */
export function normalizeEmbeddingModelWithPrefixes(params: {
  model: string;
  defaultModel: string;
  prefixes: string[];
}): string {
  const trimmed = params.model.trim();
  if (!trimmed) {
    return params.defaultModel;
  }
  for (const prefix of params.prefixes) {
    if (trimmed.startsWith(prefix)) {
      return trimmed.slice(prefix.length);
    }
  }
  return trimmed;
}
