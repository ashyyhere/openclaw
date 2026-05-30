import { loadActivatedBundledPluginPublicSurfaceModuleSync } from "./facade-runtime.js";

type BrowserNodeHostFacadeModule = {
  runBrowserProxyCommand(paramsJSON?: string | null): Promise<string>;
};

function loadFacadeModule(): BrowserNodeHostFacadeModule {
  return loadActivatedBundledPluginPublicSurfaceModuleSync<BrowserNodeHostFacadeModule>({
    dirName: "browser",
    artifactBasename: "runtime-api.js",
  });
}

/** Run a serialized browser proxy command through the activated browser runtime facade. */
export async function runBrowserProxyCommand(paramsJSON?: string | null): Promise<string> {
  return await loadFacadeModule().runBrowserProxyCommand(paramsJSON);
}
