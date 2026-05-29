// plugins memory embedding providers helpers and runtime behavior.
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { SecretInput } from "../config/types.secrets.js";
import type { EmbeddingInput } from "../memory-host-sdk/host/embedding-inputs.js";

/** Shared type for Memory Embedding Batch Chunk in src/plugins. */
export type MemoryEmbeddingBatchChunk = {
  text: string;
  embeddingInput?: EmbeddingInput;
};

/** Shared type for Memory Embedding Batch Options in src/plugins. */
export type MemoryEmbeddingBatchOptions = {
  agentId: string;
  chunks: MemoryEmbeddingBatchChunk[];
  wait: boolean;
  concurrency: number;
  pollIntervalMs: number;
  timeoutMs: number;
  debug: (message: string, data?: Record<string, unknown>) => void;
};

/** Shared type for Memory Embedding Provider Call Options in src/plugins. */
export type MemoryEmbeddingProviderCallOptions = {
  signal?: AbortSignal;
};

/** Shared type for Memory Embedding Provider Runtime in src/plugins. */
export type MemoryEmbeddingProviderRuntime = {
  id: string;
  cacheKeyData?: Record<string, unknown>;
  inlineQueryTimeoutMs?: number;
  inlineBatchTimeoutMs?: number;
  batchEmbed?: (options: MemoryEmbeddingBatchOptions) => Promise<number[][] | null>;
};

/** Shared type for Memory Embedding Provider in src/plugins. */
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

/** Shared type for Memory Embedding Provider Create Options in src/plugins. */
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

/** Shared type for Memory Embedding Provider Create Result in src/plugins. */
export type MemoryEmbeddingProviderCreateResult = {
  provider: MemoryEmbeddingProvider | null;
  runtime?: MemoryEmbeddingProviderRuntime;
};

/** Shared type for Memory Embedding Provider Adapter in src/plugins. */
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

/** Shared type for Registered Memory Embedding Provider in src/plugins. */
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

/** Reused helper for register Memory Embedding Provider behavior in src/plugins. */
export function registerMemoryEmbeddingProvider(
  adapter: MemoryEmbeddingProviderAdapter,
  options?: { ownerPluginId?: string },
): void {
  getMemoryEmbeddingProviders().set(adapter.id, {
    adapter,
    ownerPluginId: options?.ownerPluginId,
  });
}

/** Reused helper for get Registered Memory Embedding Provider behavior in src/plugins. */
export function getRegisteredMemoryEmbeddingProvider(
  id: string,
): RegisteredMemoryEmbeddingProvider | undefined {
  return getMemoryEmbeddingProviders().get(id);
}

/** Reused helper for get Memory Embedding Provider behavior in src/plugins. */
export function getMemoryEmbeddingProvider(id: string): MemoryEmbeddingProviderAdapter | undefined {
  return getMemoryEmbeddingProviders().get(id)?.adapter;
}

/** Reused helper for list Registered Memory Embedding Providers behavior in src/plugins. */
export function listRegisteredMemoryEmbeddingProviders(): RegisteredMemoryEmbeddingProvider[] {
  return Array.from(getMemoryEmbeddingProviders().values());
}

/** Reused helper for list Memory Embedding Providers behavior in src/plugins. */
export function listMemoryEmbeddingProviders(): MemoryEmbeddingProviderAdapter[] {
  return listRegisteredMemoryEmbeddingProviders().map((entry) => entry.adapter);
}

/** Reused helper for restore Memory Embedding Providers behavior in src/plugins. */
export function restoreMemoryEmbeddingProviders(adapters: MemoryEmbeddingProviderAdapter[]): void {
  getMemoryEmbeddingProviders().clear();
  for (const adapter of adapters) {
    registerMemoryEmbeddingProvider(adapter);
  }
}

/** Reused helper for restore Registered Memory Embedding Providers behavior in src/plugins. */
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

/** Reused helper for clear Memory Embedding Providers behavior in src/plugins. */
export function clearMemoryEmbeddingProviders(): void {
  getMemoryEmbeddingProviders().clear();
}

/** Reused constant for reset Memory Embedding Providers behavior in src/plugins. */
export const resetMemoryEmbeddingProviders = clearMemoryEmbeddingProviders;
