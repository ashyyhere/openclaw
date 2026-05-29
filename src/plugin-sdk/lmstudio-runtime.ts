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

/** Shared type for Lmstudio Model Wire in src/plugin-sdk. */
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

/** Shared type for Lmstudio Model Base in src/plugin-sdk. */
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

/** Shared type for Fetch Lmstudio Models Result in src/plugin-sdk. */
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
/** Reused constant for LMSTUDIO DEFAULT BASE URL behavior in src/plugin-sdk. */
export const LMSTUDIO_DEFAULT_BASE_URL: FacadeModule["LMSTUDIO_DEFAULT_BASE_URL"] =
  "http://localhost:1234";
/** Reused constant for LMSTUDIO DEFAULT INFERENCE BASE URL behavior in src/plugin-sdk. */
export const LMSTUDIO_DEFAULT_INFERENCE_BASE_URL: FacadeModule["LMSTUDIO_DEFAULT_INFERENCE_BASE_URL"] = `${LMSTUDIO_DEFAULT_BASE_URL}/v1`;
/** Reused constant for LMSTUDIO DEFAULT EMBEDDING MODEL behavior in src/plugin-sdk. */
export const LMSTUDIO_DEFAULT_EMBEDDING_MODEL: FacadeModule["LMSTUDIO_DEFAULT_EMBEDDING_MODEL"] =
  "text-embedding-nomic-embed-text-v1.5";
/** Reused constant for LMSTUDIO PROVIDER LABEL behavior in src/plugin-sdk. */
export const LMSTUDIO_PROVIDER_LABEL: FacadeModule["LMSTUDIO_PROVIDER_LABEL"] = "LM Studio";
/** Reused constant for LMSTUDIO DEFAULT API KEY ENV VAR behavior in src/plugin-sdk. */
export const LMSTUDIO_DEFAULT_API_KEY_ENV_VAR: FacadeModule["LMSTUDIO_DEFAULT_API_KEY_ENV_VAR"] =
  "LM_API_TOKEN";
/** Reused constant for LMSTUDIO LOCAL API KEY PLACEHOLDER behavior in src/plugin-sdk. */
export const LMSTUDIO_LOCAL_API_KEY_PLACEHOLDER: FacadeModule["LMSTUDIO_LOCAL_API_KEY_PLACEHOLDER"] =
  "lmstudio-local";
/** Reused constant for LMSTUDIO MODEL PLACEHOLDER behavior in src/plugin-sdk. */
export const LMSTUDIO_MODEL_PLACEHOLDER: FacadeModule["LMSTUDIO_MODEL_PLACEHOLDER"] =
  "model-key-from-api-v1-models";
/** Reused constant for LMSTUDIO DEFAULT LOAD CONTEXT LENGTH behavior in src/plugin-sdk. */
export const LMSTUDIO_DEFAULT_LOAD_CONTEXT_LENGTH: FacadeModule["LMSTUDIO_DEFAULT_LOAD_CONTEXT_LENGTH"] = 64000;
/** Reused constant for LMSTUDIO DEFAULT MODEL ID behavior in src/plugin-sdk. */
export const LMSTUDIO_DEFAULT_MODEL_ID: FacadeModule["LMSTUDIO_DEFAULT_MODEL_ID"] =
  "qwen/qwen3.5-9b";
/** Reused constant for LMSTUDIO PROVIDER ID behavior in src/plugin-sdk. */
export const LMSTUDIO_PROVIDER_ID: FacadeModule["LMSTUDIO_PROVIDER_ID"] = "lmstudio";

/** Reused constant for resolve Lmstudio Reasoning Capability behavior in src/plugin-sdk. */
export const resolveLmstudioReasoningCapability: FacadeModule["resolveLmstudioReasoningCapability"] =
  createLazyFacadeRuntimeValue(loadFacadeModule, "resolveLmstudioReasoningCapability");
/** Reused constant for resolve Loaded Context Window behavior in src/plugin-sdk. */
export const resolveLoadedContextWindow: FacadeModule["resolveLoadedContextWindow"] =
  createLazyFacadeRuntimeValue(loadFacadeModule, "resolveLoadedContextWindow");
/** Reused constant for resolve Lmstudio Server Base behavior in src/plugin-sdk. */
export const resolveLmstudioServerBase: FacadeModule["resolveLmstudioServerBase"] =
  createLazyFacadeRuntimeValue(loadFacadeModule, "resolveLmstudioServerBase");
/** Reused constant for resolve Lmstudio Inference Base behavior in src/plugin-sdk. */
export const resolveLmstudioInferenceBase: FacadeModule["resolveLmstudioInferenceBase"] =
  createLazyFacadeRuntimeValue(loadFacadeModule, "resolveLmstudioInferenceBase");
/** Reused constant for normalize Lmstudio Provider Config behavior in src/plugin-sdk. */
export const normalizeLmstudioProviderConfig: FacadeModule["normalizeLmstudioProviderConfig"] =
  createLazyFacadeRuntimeValue(loadFacadeModule, "normalizeLmstudioProviderConfig");
/** Reused constant for fetch Lmstudio Models behavior in src/plugin-sdk. */
export const fetchLmstudioModels: FacadeModule["fetchLmstudioModels"] =
  createLazyFacadeRuntimeValue(loadFacadeModule, "fetchLmstudioModels");
/** Reused constant for map Lmstudio Wire Entry behavior in src/plugin-sdk. */
export const mapLmstudioWireEntry: FacadeModule["mapLmstudioWireEntry"] =
  createLazyFacadeRuntimeValue(loadFacadeModule, "mapLmstudioWireEntry");
/** Reused constant for discover Lmstudio Models behavior in src/plugin-sdk. */
export const discoverLmstudioModels: FacadeModule["discoverLmstudioModels"] =
  createLazyFacadeRuntimeValue(loadFacadeModule, "discoverLmstudioModels");
/** Reused constant for ensure Lmstudio Model Loaded behavior in src/plugin-sdk. */
export const ensureLmstudioModelLoaded: FacadeModule["ensureLmstudioModelLoaded"] =
  createLazyFacadeRuntimeValue(loadFacadeModule, "ensureLmstudioModelLoaded");
/** Reused constant for build Lmstudio Auth Headers behavior in src/plugin-sdk. */
export const buildLmstudioAuthHeaders: FacadeModule["buildLmstudioAuthHeaders"] =
  createLazyFacadeRuntimeValue(loadFacadeModule, "buildLmstudioAuthHeaders");
/** Reused constant for resolve Lmstudio Configured Api Key behavior in src/plugin-sdk. */
export const resolveLmstudioConfiguredApiKey: FacadeModule["resolveLmstudioConfiguredApiKey"] =
  createLazyFacadeRuntimeValue(loadFacadeModule, "resolveLmstudioConfiguredApiKey");
/** Reused constant for resolve Lmstudio Provider Headers behavior in src/plugin-sdk. */
export const resolveLmstudioProviderHeaders: FacadeModule["resolveLmstudioProviderHeaders"] =
  createLazyFacadeRuntimeValue(loadFacadeModule, "resolveLmstudioProviderHeaders");
/** Reused constant for resolve Lmstudio Request Context behavior in src/plugin-sdk. */
export const resolveLmstudioRequestContext: FacadeModule["resolveLmstudioRequestContext"] =
  createLazyFacadeRuntimeValue(loadFacadeModule, "resolveLmstudioRequestContext");
/** Reused constant for resolve Lmstudio Runtime Api Key behavior in src/plugin-sdk. */
export const resolveLmstudioRuntimeApiKey: FacadeModule["resolveLmstudioRuntimeApiKey"] =
  createLazyFacadeRuntimeValue(loadFacadeModule, "resolveLmstudioRuntimeApiKey");
