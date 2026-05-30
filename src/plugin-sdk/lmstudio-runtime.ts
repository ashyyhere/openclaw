// Manual facade. Keep loader boundary explicit.
import type {
  ModelDefinitionConfig,
  ModelProviderConfig,
  OpenClawConfig,
} from "../config/types.js";
import {
  createLazyFacadeValue as createLazyFacadeRuntimeValue,
  loadBundledPluginPublicSurfaceModuleSync,
} from "./facade-runtime.js";

type LmstudioReasoningCapabilityWire = {
  allowed_options?: unknown;
  default?: unknown;
};

/** Raw model entry returned by the LM Studio `/api/v0/models` endpoint. */
export type LmstudioModelWire = {
  type?: "llm" | "embedding";
  key?: string;
  display_name?: string;
  max_context_length?: number;
  format?: "gguf" | "mlx" | null;
  capabilities?: {
    vision?: boolean;
    trained_for_tool_use?: boolean;
    reasoning?: LmstudioReasoningCapabilityWire;
  };
  loaded_instances?: Array<{
    id?: string;
    config?: {
      context_length?: number;
    } | null;
  } | null>;
};

/** Normalized LM Studio model metadata used by OpenClaw provider catalogs. */
export type LmstudioModelBase = {
  id: string;
  displayName: string;
  format: "gguf" | "mlx" | null;
  vision: boolean;
  trainedForToolUse: boolean;
  loaded: boolean;
  reasoning: boolean;
  input: Array<"text" | "image">;
  cost: ModelDefinitionConfig["cost"];
  contextWindow: number;
  contextTokens: number;
  maxTokens: number;
};

/** Result shape for probing a local or remote LM Studio model server. */
export type FetchLmstudioModelsResult = {
  reachable: boolean;
  status?: number;
  models: LmstudioModelWire[];
  error?: unknown;
};

type FacadeModule = {
  LMSTUDIO_DEFAULT_BASE_URL: string;
  LMSTUDIO_DEFAULT_INFERENCE_BASE_URL: string;
  LMSTUDIO_DEFAULT_EMBEDDING_MODEL: string;
  LMSTUDIO_PROVIDER_LABEL: string;
  LMSTUDIO_DEFAULT_API_KEY_ENV_VAR: string;
  LMSTUDIO_LOCAL_API_KEY_PLACEHOLDER: string;
  LMSTUDIO_MODEL_PLACEHOLDER: string;
  LMSTUDIO_DEFAULT_LOAD_CONTEXT_LENGTH: number;
  LMSTUDIO_DEFAULT_MODEL_ID: string;
  LMSTUDIO_PROVIDER_ID: string;
  resolveLmstudioReasoningCapability: (entry: Pick<LmstudioModelWire, "capabilities">) => boolean;
  resolveLoadedContextWindow: (entry: Pick<LmstudioModelWire, "loaded_instances">) => number | null;
  resolveLmstudioServerBase: (configuredBaseUrl?: string) => string;
  resolveLmstudioInferenceBase: (configuredBaseUrl?: string) => string;
  normalizeLmstudioProviderConfig: (provider: ModelProviderConfig) => ModelProviderConfig;
  fetchLmstudioModels: (params?: {
    baseUrl?: string;
    apiKey?: string;
    headers?: Record<string, string>;
    ssrfPolicy?: unknown;
    timeoutMs?: number;
    fetchImpl?: typeof fetch;
  }) => Promise<FetchLmstudioModelsResult>;
  mapLmstudioWireEntry: (entry: LmstudioModelWire) => LmstudioModelBase | null;
  discoverLmstudioModels: (params?: {
    config?: OpenClawConfig;
    baseUrl?: string;
    apiKey?: string;
    headers?: Record<string, string>;
  }) => Promise<ModelDefinitionConfig[]>;
  ensureLmstudioModelLoaded: (params: Record<string, unknown>) => Promise<unknown>;
  buildLmstudioAuthHeaders: (params: {
    apiKey?: string;
    json?: boolean;
    headers?: Record<string, string>;
  }) => Record<string, string> | undefined;
  resolveLmstudioConfiguredApiKey: (params: {
    config?: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    path?: string;
  }) => Promise<string | undefined>;
  resolveLmstudioProviderHeaders: (params: {
    config?: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    headers?: unknown;
    path?: string;
  }) => Promise<Record<string, string> | undefined>;
  resolveLmstudioRequestContext: (params: {
    config?: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    headers?: unknown;
    providerHeaders?: unknown;
    path?: string;
  }) => Promise<{
    apiKey?: string;
    headers?: Record<string, string>;
  }>;
  resolveLmstudioRuntimeApiKey: (params: {
    config?: OpenClawConfig;
    agentDir?: string;
    env?: NodeJS.ProcessEnv;
    headers?: unknown;
  }) => Promise<string | undefined>;
};

function loadFacadeModule(): FacadeModule {
  return loadBundledPluginPublicSurfaceModuleSync<FacadeModule>({
    dirName: "lmstudio",
    artifactBasename: "runtime-api.js",
  });
}

// Keep defaults inline so importing the runtime facade stays cold until a helper
// is actually used. These values are part of the public LM Studio contract.
/** Default LM Studio server base URL for local desktop installs. */
export const LMSTUDIO_DEFAULT_BASE_URL: FacadeModule["LMSTUDIO_DEFAULT_BASE_URL"] =
  "http://localhost:1234";
/** Default OpenAI-compatible inference base derived from the LM Studio server. */
export const LMSTUDIO_DEFAULT_INFERENCE_BASE_URL: FacadeModule["LMSTUDIO_DEFAULT_INFERENCE_BASE_URL"] = `${LMSTUDIO_DEFAULT_BASE_URL}/v1`;
/** Default embedding model id used when LM Studio config does not choose one. */
export const LMSTUDIO_DEFAULT_EMBEDDING_MODEL: FacadeModule["LMSTUDIO_DEFAULT_EMBEDDING_MODEL"] =
  "text-embedding-nomic-embed-text-v1.5";
/** Display label for the LM Studio provider. */
export const LMSTUDIO_PROVIDER_LABEL: FacadeModule["LMSTUDIO_PROVIDER_LABEL"] = "LM Studio";
/** Environment variable read for LM Studio API tokens. */
export const LMSTUDIO_DEFAULT_API_KEY_ENV_VAR: FacadeModule["LMSTUDIO_DEFAULT_API_KEY_ENV_VAR"] =
  "LM_API_TOKEN";
/** Placeholder API key accepted by local LM Studio servers that do not require auth. */
export const LMSTUDIO_LOCAL_API_KEY_PLACEHOLDER: FacadeModule["LMSTUDIO_LOCAL_API_KEY_PLACEHOLDER"] =
  "lmstudio-local";
/** Placeholder model id shown until `/api/v0/models` returns concrete models. */
export const LMSTUDIO_MODEL_PLACEHOLDER: FacadeModule["LMSTUDIO_MODEL_PLACEHOLDER"] =
  "model-key-from-api-v1-models";
/** Context length requested when loading LM Studio models without an override. */
export const LMSTUDIO_DEFAULT_LOAD_CONTEXT_LENGTH: FacadeModule["LMSTUDIO_DEFAULT_LOAD_CONTEXT_LENGTH"] = 64000;
/** Default chat model id used by generated LM Studio provider config. */
export const LMSTUDIO_DEFAULT_MODEL_ID: FacadeModule["LMSTUDIO_DEFAULT_MODEL_ID"] =
  "qwen/qwen3.5-9b";
/** Stable provider id for LM Studio runtime and config lookups. */
export const LMSTUDIO_PROVIDER_ID: FacadeModule["LMSTUDIO_PROVIDER_ID"] = "lmstudio";

/** Lazy facade for reading LM Studio reasoning support from model metadata. */
export const resolveLmstudioReasoningCapability: FacadeModule["resolveLmstudioReasoningCapability"] =
  createLazyFacadeRuntimeValue(loadFacadeModule, "resolveLmstudioReasoningCapability");
/** Lazy facade for resolving the context window of loaded LM Studio instances. */
export const resolveLoadedContextWindow: FacadeModule["resolveLoadedContextWindow"] =
  createLazyFacadeRuntimeValue(loadFacadeModule, "resolveLoadedContextWindow");
/** Lazy facade for normalizing the LM Studio management API base URL. */
export const resolveLmstudioServerBase: FacadeModule["resolveLmstudioServerBase"] =
  createLazyFacadeRuntimeValue(loadFacadeModule, "resolveLmstudioServerBase");
/** Lazy facade for normalizing the LM Studio OpenAI-compatible inference base. */
export const resolveLmstudioInferenceBase: FacadeModule["resolveLmstudioInferenceBase"] =
  createLazyFacadeRuntimeValue(loadFacadeModule, "resolveLmstudioInferenceBase");
/** Lazy facade for filling LM Studio provider config defaults. */
export const normalizeLmstudioProviderConfig: FacadeModule["normalizeLmstudioProviderConfig"] =
  createLazyFacadeRuntimeValue(loadFacadeModule, "normalizeLmstudioProviderConfig");
/** Lazy facade for fetching LM Studio model inventory. */
export const fetchLmstudioModels: FacadeModule["fetchLmstudioModels"] =
  createLazyFacadeRuntimeValue(loadFacadeModule, "fetchLmstudioModels");
/** Lazy facade for mapping LM Studio wire entries into OpenClaw model metadata. */
export const mapLmstudioWireEntry: FacadeModule["mapLmstudioWireEntry"] =
  createLazyFacadeRuntimeValue(loadFacadeModule, "mapLmstudioWireEntry");
/** Lazy facade for discovering LM Studio models from config and runtime probes. */
export const discoverLmstudioModels: FacadeModule["discoverLmstudioModels"] =
  createLazyFacadeRuntimeValue(loadFacadeModule, "discoverLmstudioModels");
/** Lazy facade for loading an LM Studio model before inference. */
export const ensureLmstudioModelLoaded: FacadeModule["ensureLmstudioModelLoaded"] =
  createLazyFacadeRuntimeValue(loadFacadeModule, "ensureLmstudioModelLoaded");
/** Lazy facade for building LM Studio auth and JSON headers. */
export const buildLmstudioAuthHeaders: FacadeModule["buildLmstudioAuthHeaders"] =
  createLazyFacadeRuntimeValue(loadFacadeModule, "buildLmstudioAuthHeaders");
/** Lazy facade for resolving configured LM Studio API keys from config/env. */
export const resolveLmstudioConfiguredApiKey: FacadeModule["resolveLmstudioConfiguredApiKey"] =
  createLazyFacadeRuntimeValue(loadFacadeModule, "resolveLmstudioConfiguredApiKey");
/** Lazy facade for resolving extra LM Studio provider headers. */
export const resolveLmstudioProviderHeaders: FacadeModule["resolveLmstudioProviderHeaders"] =
  createLazyFacadeRuntimeValue(loadFacadeModule, "resolveLmstudioProviderHeaders");
/** Lazy facade for composing LM Studio request auth and headers. */
export const resolveLmstudioRequestContext: FacadeModule["resolveLmstudioRequestContext"] =
  createLazyFacadeRuntimeValue(loadFacadeModule, "resolveLmstudioRequestContext");
/** Lazy facade for resolving the API key available to LM Studio runtime calls. */
export const resolveLmstudioRuntimeApiKey: FacadeModule["resolveLmstudioRuntimeApiKey"] =
  createLazyFacadeRuntimeValue(loadFacadeModule, "resolveLmstudioRuntimeApiKey");
