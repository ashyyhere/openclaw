// Manual facade. Keep loader boundary explicit.
import type { ModelDefinitionConfig, ModelProviderConfig } from "../config/types.js";
import {
  createLazyFacadeObjectValue,
  loadBundledPluginPublicSurfaceModuleSync,
} from "./facade-loader.js";

type ModelCost = ModelDefinitionConfig["cost"];

type FacadeModule = {
  buildVercelAiGatewayProvider: () => Promise<ModelProviderConfig>;
  discoverVercelAiGatewayModels: () => Promise<ModelDefinitionConfig[]>;
  getStaticVercelAiGatewayModelCatalog: () => ModelDefinitionConfig[];
  VERCEL_AI_GATEWAY_BASE_URL: string;
  VERCEL_AI_GATEWAY_DEFAULT_CONTEXT_WINDOW: number;
  VERCEL_AI_GATEWAY_DEFAULT_COST: ModelCost;
  VERCEL_AI_GATEWAY_DEFAULT_MAX_TOKENS: number;
  VERCEL_AI_GATEWAY_DEFAULT_MODEL_ID: string;
  VERCEL_AI_GATEWAY_DEFAULT_MODEL_REF: string;
  VERCEL_AI_GATEWAY_PROVIDER_ID: string;
};

function loadFacadeModule(): FacadeModule {
  return loadBundledPluginPublicSurfaceModuleSync<FacadeModule>({
    dirName: "vercel-ai-gateway",
    artifactBasename: "api.js",
  });
}
/** Reused constant for build Vercel Ai Gateway Provider behavior in src/plugin-sdk. */
export const buildVercelAiGatewayProvider: FacadeModule["buildVercelAiGatewayProvider"] = ((
  ...args
) =>
  loadFacadeModule()["buildVercelAiGatewayProvider"](
    ...args,
  )) as FacadeModule["buildVercelAiGatewayProvider"];
/** Reused constant for discover Vercel Ai Gateway Models behavior in src/plugin-sdk. */
export const discoverVercelAiGatewayModels: FacadeModule["discoverVercelAiGatewayModels"] = ((
  ...args
) =>
  loadFacadeModule()["discoverVercelAiGatewayModels"](
    ...args,
  )) as FacadeModule["discoverVercelAiGatewayModels"];
/** Reused constant for get Static Vercel Ai Gateway Model Catalog behavior in src/plugin-sdk. */
export const getStaticVercelAiGatewayModelCatalog: FacadeModule["getStaticVercelAiGatewayModelCatalog"] =
  ((...args) =>
    loadFacadeModule()["getStaticVercelAiGatewayModelCatalog"](
      ...args,
    )) as FacadeModule["getStaticVercelAiGatewayModelCatalog"];
/** Reused constant for VERCEL AI GATEWAY BASE URL behavior in src/plugin-sdk. */
export const VERCEL_AI_GATEWAY_BASE_URL: FacadeModule["VERCEL_AI_GATEWAY_BASE_URL"] =
  loadFacadeModule()["VERCEL_AI_GATEWAY_BASE_URL"];
/** Reused constant for VERCEL AI GATEWAY DEFAULT CONTEXT WINDOW behavior in src/plugin-sdk. */
export const VERCEL_AI_GATEWAY_DEFAULT_CONTEXT_WINDOW: FacadeModule["VERCEL_AI_GATEWAY_DEFAULT_CONTEXT_WINDOW"] =
  loadFacadeModule()["VERCEL_AI_GATEWAY_DEFAULT_CONTEXT_WINDOW"];
/** Reused constant for VERCEL AI GATEWAY DEFAULT COST behavior in src/plugin-sdk. */
export const VERCEL_AI_GATEWAY_DEFAULT_COST: FacadeModule["VERCEL_AI_GATEWAY_DEFAULT_COST"] =
  createLazyFacadeObjectValue(
    () => loadFacadeModule()["VERCEL_AI_GATEWAY_DEFAULT_COST"] as object,
  ) as FacadeModule["VERCEL_AI_GATEWAY_DEFAULT_COST"];
/** Reused constant for VERCEL AI GATEWAY DEFAULT MAX TOKENS behavior in src/plugin-sdk. */
export const VERCEL_AI_GATEWAY_DEFAULT_MAX_TOKENS: FacadeModule["VERCEL_AI_GATEWAY_DEFAULT_MAX_TOKENS"] =
  loadFacadeModule()["VERCEL_AI_GATEWAY_DEFAULT_MAX_TOKENS"];
/** Reused constant for VERCEL AI GATEWAY DEFAULT MODEL ID behavior in src/plugin-sdk. */
export const VERCEL_AI_GATEWAY_DEFAULT_MODEL_ID: FacadeModule["VERCEL_AI_GATEWAY_DEFAULT_MODEL_ID"] =
  loadFacadeModule()["VERCEL_AI_GATEWAY_DEFAULT_MODEL_ID"];
/** Reused constant for VERCEL AI GATEWAY DEFAULT MODEL REF behavior in src/plugin-sdk. */
export const VERCEL_AI_GATEWAY_DEFAULT_MODEL_REF: FacadeModule["VERCEL_AI_GATEWAY_DEFAULT_MODEL_REF"] =
  loadFacadeModule()["VERCEL_AI_GATEWAY_DEFAULT_MODEL_REF"];
/** Reused constant for VERCEL AI GATEWAY PROVIDER ID behavior in src/plugin-sdk. */
export const VERCEL_AI_GATEWAY_PROVIDER_ID: FacadeModule["VERCEL_AI_GATEWAY_PROVIDER_ID"] =
  loadFacadeModule()["VERCEL_AI_GATEWAY_PROVIDER_ID"];
