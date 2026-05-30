// Plugin registry and contracts for memory embedding provider adapters.
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { SecretInput } from "../config/types.secrets.js";
import type { EmbeddingInput } from "../memory-host-sdk/host/embedding-inputs.js";

/** Text chunk plus optional structured input for batch embedding. */
export type MemoryEmbeddingBatchChunk = {
  text: string;
  embeddingInput?: EmbeddingInput;
};

/** Options passed to runtime-owned batch embedding jobs. */
export type MemoryEmbeddingBatchOptions = {
  agentId: string;
  chunks: MemoryEmbeddingBatchChunk[];
  wait: boolean;
  concurrency: number;
  pollIntervalMs: number;
  timeoutMs: number;
  debug: (message: string, data?: Record<string, unknown>) => void;
};

/** Per-call cancellation options for embedding providers. */
export type MemoryEmbeddingProviderCallOptions = {
  signal?: AbortSignal;
};

/** Optional runtime hooks and cache metadata for an embedding provider. */
export type MemoryEmbeddingProviderRuntime = {
  id: string;
  cacheKeyData?: Record<string, unknown>;
  inlineQueryTimeoutMs?: number;
  inlineBatchTimeoutMs?: number;
  batchEmbed?: (options: MemoryEmbeddingBatchOptions) => Promise<number[][] | null>;
};

/** Concrete embedding provider instance used by memory indexing/querying. */
export type MemoryEmbeddingProvider = {
  id: string;
  model: string;
  maxInputTokens?: number;
  embedQuery: (text: string, options?: MemoryEmbeddingProviderCallOptions) => Promise<number[]>;
  embedBatch: (
    texts: string[],
    options?: MemoryEmbeddingProviderCallOptions,
  ) => Promise<number[][]>;
  embedBatchInputs?: (
    inputs: EmbeddingInput[],
    options?: MemoryEmbeddingProviderCallOptions,
  ) => Promise<number[][]>;
  close?: () => Promise<void> | void;
};

/** Configuration passed to provider adapters when creating an embedder. */
export type MemoryEmbeddingProviderCreateOptions = {
  config: OpenClawConfig;
  agentDir?: string;
  provider?: string;
  fallback?: string;
  remote?: {
    baseUrl?: string;
    apiKey?: SecretInput;
    headers?: Record<string, string>;
  };
  model: string;
  inputType?: string;
  queryInputType?: string;
  documentInputType?: string;
  local?: {
    modelPath?: string;
    modelCacheDir?: string;
    contextSize?: number | "auto";
  };
  outputDimensionality?: number;
  taskType?:
    | "RETRIEVAL_QUERY"
    | "RETRIEVAL_DOCUMENT"
    | "SEMANTIC_SIMILARITY"
    | "CLASSIFICATION"
    | "CLUSTERING"
    | "QUESTION_ANSWERING"
    | "FACT_VERIFICATION";
};

/** Result of resolving a provider adapter into a concrete embedder. */
export type MemoryEmbeddingProviderCreateResult = {
  provider: MemoryEmbeddingProvider | null;
  runtime?: MemoryEmbeddingProviderRuntime;
};

/** Registration contract implemented by a memory embedding provider plugin. */
export type MemoryEmbeddingProviderAdapter = {
  id: string;
  defaultModel?: string;
  transport?: "local" | "remote";
  authProviderId?: string;
  autoSelectPriority?: number;
  allowExplicitWhenConfiguredAuto?: boolean;
  supportsMultimodalEmbeddings?: (params: { model: string }) => boolean;
  create: (
    options: MemoryEmbeddingProviderCreateOptions,
  ) => Promise<MemoryEmbeddingProviderCreateResult>;
  formatSetupError?: (err: unknown) => string;
  shouldContinueAutoSelection?: (err: unknown) => boolean;
};

/** Embedding provider adapter plus owning plugin metadata. */
export type RegisteredMemoryEmbeddingProvider = {
  adapter: MemoryEmbeddingProviderAdapter;
  ownerPluginId?: string;
};

const MEMORY_EMBEDDING_PROVIDERS_KEY = Symbol.for("openclaw.memoryEmbeddingProviders");

function getMemoryEmbeddingProviders(): Map<string, RegisteredMemoryEmbeddingProvider> {
  const globalStore = globalThis as Record<PropertyKey, unknown>;
  const existing = globalStore[MEMORY_EMBEDDING_PROVIDERS_KEY];
  if (existing instanceof Map) {
    return existing as Map<string, RegisteredMemoryEmbeddingProvider>;
  }
  const created = new Map<string, RegisteredMemoryEmbeddingProvider>();
  globalStore[MEMORY_EMBEDDING_PROVIDERS_KEY] = created;
  return created;
}

/** Registers or replaces a memory embedding provider adapter. */
export function registerMemoryEmbeddingProvider(
  adapter: MemoryEmbeddingProviderAdapter,
  options?: { ownerPluginId?: string },
): void {
  getMemoryEmbeddingProviders().set(adapter.id, {
    adapter,
    ownerPluginId: options?.ownerPluginId,
  });
}

/** Returns a registered embedding provider entry with owner metadata. */
export function getRegisteredMemoryEmbeddingProvider(
  id: string,
): RegisteredMemoryEmbeddingProvider | undefined {
  return getMemoryEmbeddingProviders().get(id);
}

/** Returns only the embedding provider adapter for a provider id. */
export function getMemoryEmbeddingProvider(id: string): MemoryEmbeddingProviderAdapter | undefined {
  return getMemoryEmbeddingProviders().get(id)?.adapter;
}

/** Lists registered embedding provider entries with owner metadata. */
export function listRegisteredMemoryEmbeddingProviders(): RegisteredMemoryEmbeddingProvider[] {
  return Array.from(getMemoryEmbeddingProviders().values());
}

/** Lists registered embedding provider adapters without owner metadata. */
export function listMemoryEmbeddingProviders(): MemoryEmbeddingProviderAdapter[] {
  return listRegisteredMemoryEmbeddingProviders().map((entry) => entry.adapter);
}

/** Replaces registry contents with adapter-only entries. */
export function restoreMemoryEmbeddingProviders(adapters: MemoryEmbeddingProviderAdapter[]): void {
  getMemoryEmbeddingProviders().clear();
  for (const adapter of adapters) {
    registerMemoryEmbeddingProvider(adapter);
  }
}

/** Replaces registry contents while preserving owner plugin metadata. */
export function restoreRegisteredMemoryEmbeddingProviders(
  entries: RegisteredMemoryEmbeddingProvider[],
): void {
  getMemoryEmbeddingProviders().clear();
  for (const entry of entries) {
    registerMemoryEmbeddingProvider(entry.adapter, {
      ownerPluginId: entry.ownerPluginId,
    });
  }
}

/** Clears all registered memory embedding providers from this process. */
export function clearMemoryEmbeddingProviders(): void {
  getMemoryEmbeddingProviders().clear();
}

/** Test alias for clearing memory embedding provider registrations. */
export const resetMemoryEmbeddingProviders = clearMemoryEmbeddingProviders;
