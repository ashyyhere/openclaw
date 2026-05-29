/** Public SDK facade for host browser executable and version inspection. */
import { loadBundledPluginPublicSurfaceModuleSync } from "./facade-loader.js";

/** Browser executable candidate found on the local host. */
export type BrowserExecutable = {
  kind: "brave" | "canary" | "chromium" | "chrome" | "custom" | "edge";
  path: string;
};

type BrowserHostInspectionSurface = {
  resolveGoogleChromeExecutableForPlatform: (platform: NodeJS.Platform) => BrowserExecutable | null;
  readBrowserVersion: (executablePath: string) => string | null;
  parseBrowserMajorVersion: (rawVersion: string | null | undefined) => number | null;
};

let cachedBrowserHostInspectionSurface: BrowserHostInspectionSurface | undefined;

function loadBrowserHostInspectionSurface(): BrowserHostInspectionSurface {
  // Host inspection implementation is browser-plugin owned; cache the loaded facade to avoid
  // repeated public-surface resolution on config/status paths.
  cachedBrowserHostInspectionSurface ??=
    loadBundledPluginPublicSurfaceModuleSync<BrowserHostInspectionSurface>({
      dirName: "browser",
      artifactBasename: "browser-host-inspection.js",
    });
  return cachedBrowserHostInspectionSurface;
}

/** Resolve the default Google Chrome executable for one Node platform. */
export function resolveGoogleChromeExecutableForPlatform(
  platform: NodeJS.Platform,
): BrowserExecutable | null {
  return loadBrowserHostInspectionSurface().resolveGoogleChromeExecutableForPlatform(platform);
}

/** Read a browser executable version string, returning null when inspection is unavailable. */
export function readBrowserVersion(executablePath: string): string | null {
  return loadBrowserHostInspectionSurface().readBrowserVersion(executablePath);
}

/** Parse the major browser version from raw executable output. */
export function parseBrowserMajorVersion(rawVersion: string | null | undefined): number | null {
  return loadBrowserHostInspectionSurface().parseBrowserMajorVersion(rawVersion);
}
