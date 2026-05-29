// Manual facade. Keep loader boundary explicit.
import type { ModelProviderConfig, OpenClawConfig } from "../config/types.js";
import { loadBundledPluginPublicSurfaceModuleSync } from "./facade-loader.js";

type FacadeModule = {
  applyOpenrouterConfig: (cfg: OpenClawConfig) => OpenClawConfig;
  applyOpenrouterProviderConfig: (cfg: OpenClawConfig) => OpenClawConfig;
  buildOpenrouterProvider: () => ModelProviderConfig;
  OPENROUTER_DEFAULT_MODEL_REF: string;
};

function loadFacadeModule(): FacadeModule {
  return loadBundledPluginPublicSurfaceModuleSync<FacadeModule>({
    dirName: "openrouter",
    artifactBasename: "api.js",
  });
}
/** Reused constant for apply Openrouter Config behavior in src/plugin-sdk. */
export const applyOpenrouterConfig: FacadeModule["applyOpenrouterConfig"] = ((...args) =>
  loadFacadeModule()["applyOpenrouterConfig"](...args)) as FacadeModule["applyOpenrouterConfig"];
/** Reused constant for apply Openrouter Provider Config behavior in src/plugin-sdk. */
export const applyOpenrouterProviderConfig: FacadeModule["applyOpenrouterProviderConfig"] = ((
  ...args
) =>
  loadFacadeModule()["applyOpenrouterProviderConfig"](
    ...args,
  )) as FacadeModule["applyOpenrouterProviderConfig"];
/** Reused constant for build Openrouter Provider behavior in src/plugin-sdk. */
export const buildOpenrouterProvider: FacadeModule["buildOpenrouterProvider"] = ((...args) =>
  loadFacadeModule()["buildOpenrouterProvider"](
    ...args,
  )) as FacadeModule["buildOpenrouterProvider"];
/** Reused constant for OPENROUTER DEFAULT MODEL REF behavior in src/plugin-sdk. */
export const OPENROUTER_DEFAULT_MODEL_REF: FacadeModule["OPENROUTER_DEFAULT_MODEL_REF"] =
  loadFacadeModule()["OPENROUTER_DEFAULT_MODEL_REF"];
