// Embedding provider plugin contracts and runtime creation types.
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { SecretInput } from "../config/types.secrets.js";

/** Text or multimodal content accepted by embedding providers. */
export type EmbeddingInput =
  | string
  | {
      text: string;
      parts?: Array<
        { type: "text"; text: string } | { type: "inline-data"; mimeType: string; data: string }
      >;
    };

/** Per-call options passed into embedding provider methods. */
export type EmbeddingProviderCallOptions = {
  signal?: AbortSignal;
  inputType?: "query" | "document" | "semantic" | "classification" | "clustering";
};

/** Runtime metadata returned with an initialized embedding provider. */
export type EmbeddingProviderRuntime = {
  id: string;
  cacheKeyData?: Record<string, unknown>;
  inlineQueryTimeoutMs?: number;
  inlineBatchTimeoutMs?: number;
};

/** Runtime embedding provider instance registered by a plugin. */
export type EmbeddingProvider = {
  id: string;
  model: string;
  dimensions?: number;
  maxInputTokens?: number;
  embed: (input: EmbeddingInput, options?: EmbeddingProviderCallOptions) => Promise<number[]>;
  embedBatch: (
    inputs: EmbeddingInput[],
    options?: EmbeddingProviderCallOptions,
  ) => Promise<number[][]>;
  close?: () => Promise<void> | void;
};

/** Inputs supplied when constructing an embedding provider adapter. */
export type EmbeddingProviderCreateOptions = {
  config: OpenClawConfig;
  agentDir?: string;
  provider?: string;
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
  };
  dimensions?: number;
  taskType?: string;
};

/** Provider instance and runtime metadata returned by adapter creation. */
export type EmbeddingProviderCreateResult = {
  provider: EmbeddingProvider | null;
  runtime?: EmbeddingProviderRuntime;
};

/** Plugin adapter that creates embedding provider instances. */
export type EmbeddingProviderAdapter = {
  id: string;
  defaultModel?: string;
  transport?: "local" | "remote";
  authProviderId?: string;
  create: (options: EmbeddingProviderCreateOptions) => Promise<EmbeddingProviderCreateResult>;
  formatSetupError?: (err: unknown) => string;
};

/** Embedding provider adapter plus owning plugin id. */
export type RegisteredEmbeddingProvider = {
  adapter: EmbeddingProviderAdapter;
  ownerPluginId?: string;
};
