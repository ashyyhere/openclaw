/** Public SDK facade for resolving browser config and named browser profiles. */
import path from "node:path";
import type { BrowserConfig, BrowserProfileConfig, OpenClawConfig } from "../config/config.js";
import type { SsrFPolicy } from "../infra/net/ssrf.js";
import { resolvePreferredOpenClawTmpDir } from "../infra/tmp-openclaw-dir.js";
import { loadBundledPluginPublicSurfaceModuleSync } from "./facade-loader.js";

/** Default browser feature enablement when config does not override it. */
export const DEFAULT_OPENCLAW_BROWSER_ENABLED = true;
/** Reused constant for DEFAULT BROWSER EVALUATE ENABLED behavior in src/plugin-sdk. */
export const DEFAULT_BROWSER_EVALUATE_ENABLED = true;
/** Reused constant for DEFAULT OPENCLAW BROWSER COLOR behavior in src/plugin-sdk. */
export const DEFAULT_OPENCLAW_BROWSER_COLOR = "#FF4500";
/** Reused constant for DEFAULT OPENCLAW BROWSER PROFILE NAME behavior in src/plugin-sdk. */
export const DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME = "openclaw";
/** Reused constant for DEFAULT BROWSER DEFAULT PROFILE NAME behavior in src/plugin-sdk. */
export const DEFAULT_BROWSER_DEFAULT_PROFILE_NAME = "openclaw";
/** Reused constant for DEFAULT BROWSER ACTION TIMEOUT MS behavior in src/plugin-sdk. */
export const DEFAULT_BROWSER_ACTION_TIMEOUT_MS = 60_000;
/** Reused constant for DEFAULT AI SNAPSHOT MAX CHARS behavior in src/plugin-sdk. */
export const DEFAULT_AI_SNAPSHOT_MAX_CHARS = 80_000;
/** Reused constant for DEFAULT UPLOAD DIR behavior in src/plugin-sdk. */
export const DEFAULT_UPLOAD_DIR = path.join(resolvePreferredOpenClawTmpDir(), "uploads");

/** Normalized browser tab cleanup policy used by maintenance workers. */
export type ResolvedBrowserTabCleanupConfig = {
  enabled: boolean;
  idleMinutes: number;
  maxTabsPerSession: number;
  sweepMinutes: number;
};

/** Fully normalized browser config used by bridge, runtime, and setup flows. */
export type ResolvedBrowserConfig = {
  enabled: boolean;
  evaluateEnabled: boolean;
  controlPort: number;
  cdpPortRangeStart: number;
  cdpPortRangeEnd: number;
  cdpProtocol: "http" | "https";
  cdpHost: string;
  cdpIsLoopback: boolean;
  remoteCdpTimeoutMs: number;
  remoteCdpHandshakeTimeoutMs: number;
  localLaunchTimeoutMs: number;
  localCdpReadyTimeoutMs: number;
  actionTimeoutMs: number;
  color: string;
  executablePath?: string;
  headless: boolean;
  noSandbox: boolean;
  attachOnly: boolean;
  defaultProfile: string;
  profiles: Record<string, BrowserProfileConfig>;
  tabCleanup: ResolvedBrowserTabCleanupConfig;
  ssrfPolicy?: SsrFPolicy;
  extraArgs: string[];
};

/** Resolved browser profile with concrete CDP endpoint and launch/attach behavior. */
export type ResolvedBrowserProfile = {
  name: string;
  cdpPort: number;
  cdpUrl: string;
  cdpHost: string;
  cdpIsLoopback: boolean;
  userDataDir?: string;
  color: string;
  driver: "openclaw" | "existing-session";
  headless?: boolean;
  attachOnly: boolean;
};

type BrowserProfilesSurface = {
  resolveBrowserConfig: (
    cfg: BrowserConfig | undefined,
    rootConfig?: OpenClawConfig,
  ) => ResolvedBrowserConfig;
  resolveProfile: (
    resolved: ResolvedBrowserConfig,
    profileName: string,
  ) => ResolvedBrowserProfile | null;
};

let cachedBrowserProfilesSurface: BrowserProfilesSurface | undefined;

function loadBrowserProfilesSurface(): BrowserProfilesSurface {
  // Profile normalization is browser-plugin owned; keep this SDK facade lazy and process-cached.
  cachedBrowserProfilesSurface ??= loadBundledPluginPublicSurfaceModuleSync<BrowserProfilesSurface>(
    {
      dirName: "browser",
      artifactBasename: "browser-profiles.js",
    },
  );
  return cachedBrowserProfilesSurface;
}

/** Resolve raw browser config into defaults, ports, profile map, and cleanup policy. */
export function resolveBrowserConfig(
  cfg: BrowserConfig | undefined,
  rootConfig?: OpenClawConfig,
): ResolvedBrowserConfig {
  return loadBrowserProfilesSurface().resolveBrowserConfig(cfg, rootConfig);
}

/** Resolve a named browser profile from normalized browser config. */
export function resolveProfile(
  resolved: ResolvedBrowserConfig,
  profileName: string,
): ResolvedBrowserProfile | null {
  return loadBrowserProfilesSurface().resolveProfile(resolved, profileName);
}
