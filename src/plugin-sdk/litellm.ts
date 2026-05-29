// Manual facade. Keep loader boundary explicit.
import type { ModelDefinitionConfig, OpenClawConfig } from "../config/types.js";
import { loadBundledPluginPublicSurfaceModuleSync } from "./facade-loader.js";

type FacadeModule = {
  applyLitellmConfig: (cfg: OpenClawConfig) => OpenClawConfig;
  applyLitellmProviderConfig: (cfg: OpenClawConfig) => OpenClawConfig;
  buildLitellmModelDefinition: () => ModelDefinitionConfig;
  LITELLM_BASE_URL: string;
  LITELLM_DEFAULT_MODEL_ID: string;
  LITELLM_DEFAULT_MODEL_REF: string;
};

function loadFacadeModule(): FacadeModule {
  return loadBundledPluginPublicSurfaceModuleSync<FacadeModule>({
    dirName: "litellm",
    artifactBasename: "api.js",
  });
}
/** Reused constant for apply Litellm Config behavior in src/plugin-sdk. */
export const applyLitellmConfig: FacadeModule["applyLitellmConfig"] = ((...args) =>
  loadFacadeModule()["applyLitellmConfig"](...args)) as FacadeModule["applyLitellmConfig"];
/** Reused constant for apply Litellm Provider Config behavior in src/plugin-sdk. */
export const applyLitellmProviderConfig: FacadeModule["applyLitellmProviderConfig"] = ((...args) =>
  loadFacadeModule()["applyLitellmProviderConfig"](
    ...args,
  )) as FacadeModule["applyLitellmProviderConfig"];
/** Reused constant for build Litellm Model Definition behavior in src/plugin-sdk. */
export const buildLitellmModelDefinition: FacadeModule["buildLitellmModelDefinition"] = ((
  ...args
) =>
  loadFacadeModule()["buildLitellmModelDefinition"](
    ...args,
  )) as FacadeModule["buildLitellmModelDefinition"];
/** Reused constant for LITELLM BASE URL behavior in src/plugin-sdk. */
export const LITELLM_BASE_URL: FacadeModule["LITELLM_BASE_URL"] =
  loadFacadeModule()["LITELLM_BASE_URL"];
/** Reused constant for LITELLM DEFAULT MODEL ID behavior in src/plugin-sdk. */
export const LITELLM_DEFAULT_MODEL_ID: FacadeModule["LITELLM_DEFAULT_MODEL_ID"] =
  loadFacadeModule()["LITELLM_DEFAULT_MODEL_ID"];
/** Reused constant for LITELLM DEFAULT MODEL REF behavior in src/plugin-sdk. */
export const LITELLM_DEFAULT_MODEL_REF: FacadeModule["LITELLM_DEFAULT_MODEL_REF"] =
  loadFacadeModule()["LITELLM_DEFAULT_MODEL_REF"];
