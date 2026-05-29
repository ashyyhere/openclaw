// Shared types for packages/memory-host-sdk/src/host embeddings types behavior.
import type { OpenClawConfig, SecretInput } from "../engine-foundation.js";
import type { EmbeddingInput } from "./embedding-inputs.js";

/** Public type describing Embedding Provider for packages/memory-host-sdk. */
export type EmbeddingProvider = {
  id: string;
  model: string;
  maxInputTokens?: number;
  embedQuery: (text: string, options?: EmbeddingProviderCallOptions) => Promise<number[]>;
  embedBatch: (texts: string[], options?: EmbeddingProviderCallOptions) => Promise<number[][]>;
  embedBatchInputs?: (
    inputs: EmbeddingInput[],
    options?: EmbeddingProviderCallOptions,
  ) => Promise<number[][]>;
  close?: () => Promise<void> | void;
};

/** Public type describing Embedding Provider Call Options for packages/memory-host-sdk. */
export type EmbeddingProviderCallOptions = {
  signal?: AbortSignal;
};

/** Public type describing Embedding Provider Id for packages/memory-host-sdk. */
export type EmbeddingProviderId = string;
/** Public type describing Embedding Provider Request for packages/memory-host-sdk. */
export type EmbeddingProviderRequest = string;
/** Public type describing Embedding Provider Fallback for packages/memory-host-sdk. */
export type EmbeddingProviderFallback = string;

/** Public type describing Gemini Task Type for packages/memory-host-sdk. */
export type GeminiTaskType =
  | "RETRIEVAL_QUERY"
  | "RETRIEVAL_DOCUMENT"
  | "SEMANTIC_SIMILARITY"
  | "CLASSIFICATION"
  | "CLUSTERING"
  | "QUESTION_ANSWERING"
  | "FACT_VERIFICATION";

/** Public type describing Embedding Provider Options for packages/memory-host-sdk. */
export type EmbeddingProviderOptions = {
  config: OpenClawConfig;
  agentDir?: string;
  provider?: EmbeddingProviderRequest;
  remote?: {
    baseUrl?: string;
    apiKey?: SecretInput;
    headers?: Record<string, string>;
  };
  model: string;
  inputType?: string;
  queryInputType?: string;
  documentInputType?: string;
  fallback?: EmbeddingProviderFallback;
  local?: {
    modelPath?: string;
    modelCacheDir?: string;
    /**
     * Context size passed to node-llama-cpp `createEmbeddingContext`.
     * Default: 4096, chosen to cover typical memory-search chunks (128–512 tokens)
     * while keeping non-weight VRAM bounded.
     * Set `"auto"` to let node-llama-cpp use the model's trained maximum — not
     * recommended for 8B+ models (e.g. Qwen3-Embedding-8B: up to 40 960 tokens → ~32 GB VRAM).
     */
    contextSize?: number | "auto";
  };
  /** Provider-specific output vector dimensions for supported embedding families. */
  outputDimensionality?: number;
  /** Gemini: override the default task type sent with embedding requests. */
  taskType?: GeminiTaskType;
};
