/** Public SDK facade for browser control auth resolution and token generation. */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { loadBundledPluginPublicSurfaceModuleSync } from "./facade-loader.js";

/** Browser control credentials safe to pass between config, bridge, and UI surfaces. */
export type BrowserControlAuth = {
  token?: string;
  password?: string;
};

type EnsureBrowserControlAuthParams = {
  cfg: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
};

type EnsureBrowserControlAuthResult = {
  auth: BrowserControlAuth;
  generatedToken?: string;
};

type BrowserControlAuthSurface = {
  resolveBrowserControlAuth: (cfg?: OpenClawConfig, env?: NodeJS.ProcessEnv) => BrowserControlAuth;
  shouldAutoGenerateBrowserAuth: (env: NodeJS.ProcessEnv) => boolean;
  ensureBrowserControlAuth: (
    params: EnsureBrowserControlAuthParams,
  ) => Promise<EnsureBrowserControlAuthResult>;
};

let cachedBrowserControlAuthSurface: BrowserControlAuthSurface | undefined;

function loadBrowserControlAuthSurface(): BrowserControlAuthSurface {
  // Auth policy lives with the browser plugin; cache the facade because plugin metadata is
  // process-stable until explicit reload/install flows.
  cachedBrowserControlAuthSurface ??=
    loadBundledPluginPublicSurfaceModuleSync<BrowserControlAuthSurface>({
      dirName: "browser",
      artifactBasename: "browser-control-auth.js",
    });
  return cachedBrowserControlAuthSurface;
}

/** Resolve configured browser control auth without generating missing credentials. */
export function resolveBrowserControlAuth(
  cfg?: OpenClawConfig,
  env: NodeJS.ProcessEnv = process.env,
): BrowserControlAuth {
  return loadBrowserControlAuthSurface().resolveBrowserControlAuth(cfg, env);
}

/** Return whether this environment should auto-generate browser control credentials. */
export function shouldAutoGenerateBrowserAuth(env: NodeJS.ProcessEnv): boolean {
  return loadBrowserControlAuthSurface().shouldAutoGenerateBrowserAuth(env);
}

/** Resolve browser control auth, generating credentials when browser policy permits it. */
export async function ensureBrowserControlAuth(
  params: EnsureBrowserControlAuthParams,
): Promise<EnsureBrowserControlAuthResult> {
  return await loadBrowserControlAuthSurface().ensureBrowserControlAuth(params);
}
