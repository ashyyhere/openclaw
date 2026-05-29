/** Runtime SDK bridge for starting and stopping the bundled browser control server. */
import type { Server } from "node:http";
import type { ResolvedBrowserConfig } from "./browser-profiles.js";
import { loadActivatedBundledPluginPublicSurfaceModuleSync } from "./facade-runtime.js";

/** Live browser bridge server plus the resolved browser config it was started with. */
export type BrowserBridge = {
  server: Server;
  port: number;
  baseUrl: string;
  state: {
    resolved: ResolvedBrowserConfig;
  };
};

type BrowserBridgeFacadeModule = {
  startBrowserBridgeServer(params: {
    resolved: ResolvedBrowserConfig;
    host?: string;
    port?: number;
    authToken?: string;
    authPassword?: string;
    onEnsureAttachTarget?: (profile: unknown) => Promise<void>;
    resolveSandboxNoVncToken?: (token: string) => { noVncPort: number; password?: string } | null;
  }): Promise<BrowserBridge>;
  stopBrowserBridgeServer(server: Server): Promise<void>;
};

function loadFacadeModule(): BrowserBridgeFacadeModule {
  // The browser runtime is bundled-plugin owned and relatively heavy; keep this SDK subpath lazy
  // until a caller actually starts or stops a bridge.
  return loadActivatedBundledPluginPublicSurfaceModuleSync<BrowserBridgeFacadeModule>({
    dirName: "browser",
    artifactBasename: "runtime-api.js",
  });
}

/** Start the browser bridge through the activated bundled browser plugin runtime. */
export async function startBrowserBridgeServer(
  params: Parameters<BrowserBridgeFacadeModule["startBrowserBridgeServer"]>[0],
): Promise<BrowserBridge> {
  return await loadFacadeModule().startBrowserBridgeServer(params);
}

/** Stop a browser bridge server through the same bundled runtime facade. */
export async function stopBrowserBridgeServer(server: Server): Promise<void> {
  await loadFacadeModule().stopBrowserBridgeServer(server);
}
