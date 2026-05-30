// Process-local registry for embedding provider adapters contributed by plugins.
import type {
  EmbeddingProviderAdapter,
  RegisteredEmbeddingProvider,
} from "./embedding-provider-types.js";
import { openAICompatibleEmbeddingProviderAdapter } from "./openai-compatible-embedding-provider.js";

/** Public embedding provider adapter/runtime types used by plugin implementations. */
export type {
  EmbeddingInput,
  EmbeddingProvider,
  EmbeddingProviderAdapter,
  EmbeddingProviderCallOptions,
  EmbeddingProviderCreateOptions,
  EmbeddingProviderCreateResult,
  EmbeddingProviderRuntime,
  RegisteredEmbeddingProvider,
} from "./embedding-provider-types.js";

const EMBEDDING_PROVIDERS_KEY = Symbol.for("openclaw.embeddingProviders");
const CORE_EMBEDDING_PROVIDERS: RegisteredEmbeddingProvider[] = [
  {
    adapter: openAICompatibleEmbeddingProviderAdapter,
    ownerPluginId: "core",
  },
];

function getEmbeddingProviders(): Map<string, RegisteredEmbeddingProvider> {
  const globalStore = globalThis as Record<PropertyKey, unknown>;
  const existing = globalStore[EMBEDDING_PROVIDERS_KEY];
  if (existing instanceof Map) {
    return existing as Map<string, RegisteredEmbeddingProvider>;
  }
  const created = new Map<string, RegisteredEmbeddingProvider>();
  globalStore[EMBEDDING_PROVIDERS_KEY] = created;
  return created;
}

/** Registers or replaces an embedding provider adapter for the current process. */
export function registerEmbeddingProvider(
  adapter: EmbeddingProviderAdapter,
  options?: { ownerPluginId?: string },
): void {
  getEmbeddingProviders().set(adapter.id, {
    adapter,
    ownerPluginId: options?.ownerPluginId,
  });
}

/** Gets a registered embedding provider with owner metadata, falling back to core providers. */
export function getRegisteredEmbeddingProvider(
  id: string,
): RegisteredEmbeddingProvider | undefined {
  return (
    getEmbeddingProviders().get(id) ??
    CORE_EMBEDDING_PROVIDERS.find((entry) => entry.adapter.id === id)
  );
}

/** Gets only the embedding provider adapter for callers that do not need owner metadata. */
export function getEmbeddingProvider(id: string): EmbeddingProviderAdapter | undefined {
  return getRegisteredEmbeddingProvider(id)?.adapter;
}

/** Lists core and plugin-registered embedding providers with plugin entries overriding duplicates. */
export function listRegisteredEmbeddingProviders(): RegisteredEmbeddingProvider[] {
  const merged = new Map<string, RegisteredEmbeddingProvider>(
    CORE_EMBEDDING_PROVIDERS.map((entry) => [entry.adapter.id, entry]),
  );
  for (const entry of getEmbeddingProviders().values()) {
    merged.set(entry.adapter.id, entry);
  }
  return Array.from(merged.values());
}

/** Lists only embedding provider adapters in effective registration order. */
export function listEmbeddingProviders(): EmbeddingProviderAdapter[] {
  return listRegisteredEmbeddingProviders().map((entry) => entry.adapter);
}

/** Replaces process-local registrations with adapter-only entries, primarily for tests. */
export function restoreEmbeddingProviders(adapters: EmbeddingProviderAdapter[]): void {
  getEmbeddingProviders().clear();
  for (const adapter of adapters) {
    registerEmbeddingProvider(adapter);
  }
}

/** Restores registered embedding providers including owner metadata. */
export function restoreRegisteredEmbeddingProviders(entries: RegisteredEmbeddingProvider[]): void {
  getEmbeddingProviders().clear();
  for (const entry of entries) {
    registerEmbeddingProvider(entry.adapter, {
      ownerPluginId: entry.ownerPluginId,
    });
  }
}

/** Clears process-local embedding provider registrations without removing core providers. */
export function clearEmbeddingProviders(): void {
  getEmbeddingProviders().clear();
}

/** Backwards-compatible test alias for clearing process-local embedding providers. */
export const resetEmbeddingProviders = clearEmbeddingProviders;
