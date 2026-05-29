// packages/memory-host-sdk/src/host embedding provider adapter utils helpers and runtime behavior.
import { normalizeLowercaseStringOrEmpty } from "./string-utils.js";

/** Public helper for is Missing Embedding Api Key Error behavior in packages/memory-host-sdk. */
export function isMissingEmbeddingApiKeyError(err: unknown): boolean {
  return err instanceof Error && err.message.includes("No API key found for provider");
}

/** Public helper for sanitize Embedding Cache Headers behavior in packages/memory-host-sdk. */
export function sanitizeEmbeddingCacheHeaders(
  headers: Record<string, string>,
  excludedHeaderNames: string[],
): Array<[string, string]> {
  const excluded = new Set(
    excludedHeaderNames.map((name) => normalizeLowercaseStringOrEmpty(name)),
  );
  return Object.entries(headers)
    .filter(([key]) => !excluded.has(normalizeLowercaseStringOrEmpty(key)))
    .toSorted(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => [key, value]);
}

/** Public helper for map Batch Embeddings By Index behavior in packages/memory-host-sdk. */
export function mapBatchEmbeddingsByIndex(
  byCustomId: Map<string, number[]>,
  count: number,
): number[][] {
  const embeddings: number[][] = [];
  for (let index = 0; index < count; index += 1) {
    embeddings.push(byCustomId.get(String(index)) ?? []);
  }
  return embeddings;
}
