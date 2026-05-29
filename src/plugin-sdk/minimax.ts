// Manual facade. Keep loader boundary explicit.
type FacadeModule = {
  MINIMAX_DEFAULT_MODEL_ID: string;
  MINIMAX_DEFAULT_MODEL_REF: string;
  MINIMAX_TEXT_MODEL_REFS: readonly string[];
};
import {
  createLazyFacadeArrayValue,
  loadBundledPluginPublicSurfaceModuleSync,
} from "./facade-loader.js";

function loadFacadeModule(): FacadeModule {
  return loadBundledPluginPublicSurfaceModuleSync<FacadeModule>({
    dirName: "minimax",
    artifactBasename: "api.js",
  });
}

/** Reused constant for MINIMAX DEFAULT MODEL ID behavior in src/plugin-sdk. */
export const MINIMAX_DEFAULT_MODEL_ID: FacadeModule["MINIMAX_DEFAULT_MODEL_ID"] =
  loadFacadeModule().MINIMAX_DEFAULT_MODEL_ID;
/** Reused constant for MINIMAX DEFAULT MODEL REF behavior in src/plugin-sdk. */
export const MINIMAX_DEFAULT_MODEL_REF: FacadeModule["MINIMAX_DEFAULT_MODEL_REF"] =
  loadFacadeModule().MINIMAX_DEFAULT_MODEL_REF;
/** Reused constant for MINIMAX TEXT MODEL REFS behavior in src/plugin-sdk. */
export const MINIMAX_TEXT_MODEL_REFS: FacadeModule["MINIMAX_TEXT_MODEL_REFS"] =
  createLazyFacadeArrayValue(
    () => loadFacadeModule().MINIMAX_TEXT_MODEL_REFS as unknown as readonly unknown[],
  ) as FacadeModule["MINIMAX_TEXT_MODEL_REFS"];
