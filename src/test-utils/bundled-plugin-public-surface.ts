// test-utils bundled plugin public surface helpers and runtime behavior.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  loadBundledPluginPublicSurfaceModule,
  loadBundledPluginPublicSurfaceModuleSync,
} from "../plugin-sdk/facade-loader.js";
import { resolveBundledPluginsDir } from "../plugins/bundled-dir.js";
import {
  findBundledPluginMetadataById,
  type BundledPluginMetadata,
} from "../plugins/bundled-plugin-metadata.js";
import {
  getCachedPluginSourceModuleLoader,
  type PluginModuleLoaderCache,
} from "../plugins/plugin-module-loader-cache.js";
import { normalizeBundledPluginArtifactSubpath } from "../plugins/public-surface-runtime.js";
import { resolveLoaderPackageRoot } from "../plugins/sdk-alias.js";
import { uniqueStrings } from "../shared/string-normalization.js";

const OPENCLAW_PACKAGE_ROOT =
  resolveLoaderPackageRoot({
    modulePath: fileURLToPath(import.meta.url),
    moduleUrl: import.meta.url,
  }) ?? fileURLToPath(new URL("../..", import.meta.url));

type BundledPluginPublicSurfaceMetadata = Pick<BundledPluginMetadata, "dirName">;
const sourceModuleLoaders: PluginModuleLoaderCache = new Map();

function isSafeBundledPluginDirName(pluginId: string): boolean {
  return /^[a-z0-9][a-z0-9._-]*$/u.test(pluginId);
}

function readPluginManifestId(pluginDir: string): string | undefined {
  try {
    const manifestPath = path.join(pluginDir, "openclaw.plugin.json");
    const parsed = JSON.parse(fs.readFileSync(manifestPath, "utf-8")) as { id?: unknown };
    return typeof parsed.id === "string" ? parsed.id : undefined;
  } catch {
    return undefined;
  }
}

function findBundledPluginMetadataFast(
  pluginId: string,
): BundledPluginPublicSurfaceMetadata | undefined {
  if (!isSafeBundledPluginDirName(pluginId)) {
    return undefined;
  }
  const rawRoots = [
    resolveBundledPluginsDir(),
    path.resolve(OPENCLAW_PACKAGE_ROOT, "extensions"),
    path.resolve(OPENCLAW_PACKAGE_ROOT, "dist-runtime", "extensions"),
    path.resolve(OPENCLAW_PACKAGE_ROOT, "dist", "extensions"),
  ].filter((entry): entry is string => Boolean(entry));
  const roots = uniqueStrings(rawRoots);

  for (const root of roots) {
    const pluginDir = path.join(root, pluginId);
    if (readPluginManifestId(pluginDir) === pluginId) {
      return { dirName: pluginId };
    }
  }
  return undefined;
}

function findBundledPluginMetadata(pluginId: string): BundledPluginPublicSurfaceMetadata {
  const metadata =
    findBundledPluginMetadataFast(pluginId) ?? findBundledPluginMetadataById(pluginId);
  if (!metadata) {
    throw new Error(`Unknown bundled plugin id: ${pluginId}`);
  }
  return metadata;
}

function readPackageName(packageDir: string): string | undefined {
  try {
    const packageJsonPath = path.join(packageDir, "package.json");
    const parsed = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8")) as { name?: unknown };
    return typeof parsed.name === "string" ? parsed.name : undefined;
  } catch {
    return undefined;
  }
}

function resolveWorkspacePackageDir(packageName: string): string {
  const rawRoots = [
    resolveBundledPluginsDir(),
    path.resolve(OPENCLAW_PACKAGE_ROOT, "extensions"),
    path.resolve(OPENCLAW_PACKAGE_ROOT, "dist-runtime", "extensions"),
    path.resolve(OPENCLAW_PACKAGE_ROOT, "dist", "extensions"),
  ].filter((entry): entry is string => Boolean(entry));
  const roots = uniqueStrings(rawRoots);

  for (const root of roots) {
    let entries: string[];
    try {
      entries = fs.readdirSync(root);
    } catch {
      continue;
    }
    for (const entry of entries) {
      const packageDir = path.join(root, entry);
      if (readPackageName(packageDir) === packageName) {
        return packageDir;
      }
    }
  }
  throw new Error(`Unknown workspace package: ${packageName}`);
}

// oxlint-disable-next-line typescript/no-unnecessary-type-parameters -- Test loaders use caller-supplied module surface types.
type BundledPluginPublicSurfaceLoader = <T extends object>(params: {
  pluginId: string;
  artifactBasename: string;
}) => T;

type AsyncBundledPluginPublicSurfaceLoader = <T extends object>(params: {
  pluginId: string;
  artifactBasename: string;
}) => Promise<T>;

// oxlint-disable-next-line typescript/no-unnecessary-type-parameters -- Test loaders use caller-supplied module surface types.
type BundledPluginPublicArtifactLoader = <T extends object>(pluginId: string) => T;

/** Reused constant for load Bundled Plugin Public Surface Sync behavior in src/test-utils. */
export const loadBundledPluginPublicSurfaceSync: BundledPluginPublicSurfaceLoader = (params) => {
  const metadata = findBundledPluginMetadata(params.pluginId);
  return loadBundledPluginPublicSurfaceModuleSync({
    dirName: metadata.dirName,
    artifactBasename: normalizeBundledPluginArtifactSubpath(params.artifactBasename),
  });
};

/** Reused helper for load Bundled Plugin Public Surface Source Sync behavior in src/test-utils. */
export function loadBundledPluginPublicSurfaceSourceSync(params: {
  pluginId: string;
  artifactBasename: string;
}): object {
  const modulePath = resolveVitestSourceModulePath(
    resolveBundledPluginPublicModulePath({
      pluginId: params.pluginId,
      artifactBasename: params.artifactBasename,
    }),
  );
  const loader = getCachedPluginSourceModuleLoader({
    cache: sourceModuleLoaders,
    modulePath,
    importerUrl: import.meta.url,
    loaderFilename: import.meta.url,
    pluginSdkResolution: "src",
  });
  return loader(modulePath) as object;
}

/** Reused constant for load Bundled Plugin Public Surface behavior in src/test-utils. */
export const loadBundledPluginPublicSurface: AsyncBundledPluginPublicSurfaceLoader = (params) => {
  const metadata = findBundledPluginMetadata(params.pluginId);
  return loadBundledPluginPublicSurfaceModule({
    dirName: metadata.dirName,
    artifactBasename: normalizeBundledPluginArtifactSubpath(params.artifactBasename),
  });
};

/** Reused constant for load Bundled Plugin Api Sync behavior in src/test-utils. */
export const loadBundledPluginApiSync: BundledPluginPublicArtifactLoader = (pluginId) => {
  return loadBundledPluginPublicSurfaceSync({
    pluginId,
    artifactBasename: "api.js",
  });
};

/** Reused constant for load Bundled Plugin Contract Api Sync behavior in src/test-utils. */
export const loadBundledPluginContractApiSync: BundledPluginPublicArtifactLoader = (pluginId) => {
  return loadBundledPluginPublicSurfaceSync({
    pluginId,
    artifactBasename: "contract-api.js",
  });
};

/** Reused constant for load Bundled Plugin Runtime Api Sync behavior in src/test-utils. */
export const loadBundledPluginRuntimeApiSync: BundledPluginPublicArtifactLoader = (pluginId) => {
  return loadBundledPluginPublicSurfaceSync({
    pluginId,
    artifactBasename: "runtime-api.js",
  });
};

/** Reused constant for load Bundled Plugin Test Api Sync behavior in src/test-utils. */
export const loadBundledPluginTestApiSync: BundledPluginPublicArtifactLoader = (pluginId) => {
  return loadBundledPluginPublicSurfaceSync({
    pluginId,
    artifactBasename: "test-api.js",
  });
};

/** Reused helper for resolve Bundled Plugin Public Module Path behavior in src/test-utils. */
export function resolveBundledPluginPublicModulePath(params: {
  pluginId: string;
  artifactBasename: string;
}): string {
  const metadata = findBundledPluginMetadata(params.pluginId);
  return path.resolve(
    OPENCLAW_PACKAGE_ROOT,
    "extensions",
    metadata.dirName,
    normalizeBundledPluginArtifactSubpath(params.artifactBasename),
  );
}

function resolveVitestSourceModulePath(targetPath: string): string {
  if (!targetPath.endsWith(".js")) {
    return targetPath;
  }
  const sourcePath = `${targetPath.slice(0, -".js".length)}.ts`;
  return pathExists(sourcePath) ? sourcePath : targetPath;
}

function pathExists(filePath: string): boolean {
  try {
    return Boolean(filePath) && path.isAbsolute(filePath) && fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}

/** Reused helper for resolve Relative Bundled Plugin Public Module Id behavior in src/test-utils. */
export function resolveRelativeBundledPluginPublicModuleId(params: {
  fromModuleUrl: string;
  pluginId: string;
  artifactBasename: string;
}): string {
  const fromFilePath = fileURLToPath(params.fromModuleUrl);
  const targetPath = resolveVitestSourceModulePath(
    resolveBundledPluginPublicModulePath({
      pluginId: params.pluginId,
      artifactBasename: params.artifactBasename,
    }),
  );
  const relativePath = path
    .relative(path.dirname(fromFilePath), targetPath)
    .replaceAll(path.sep, "/");
  return relativePath.startsWith(".") ? relativePath : `./${relativePath}`;
}

/** Reused helper for resolve Relative Extension Public Module Id behavior in src/test-utils. */
export function resolveRelativeExtensionPublicModuleId(params: {
  fromModuleUrl: string;
  dirName: string;
  artifactBasename: string;
}): string {
  const fromFilePath = fileURLToPath(params.fromModuleUrl);
  const targetPath = resolveVitestSourceModulePath(
    path.resolve(OPENCLAW_PACKAGE_ROOT, "extensions", params.dirName, params.artifactBasename),
  );
  const relativePath = path
    .relative(path.dirname(fromFilePath), targetPath)
    .replaceAll(path.sep, "/");
  return relativePath.startsWith(".") ? relativePath : `./${relativePath}`;
}

/** Reused helper for resolve Relative Workspace Package Public Module Id behavior in src/test-utils. */
export function resolveRelativeWorkspacePackagePublicModuleId(params: {
  fromModuleUrl: string;
  packageName: string;
  artifactBasename: string;
}): string {
  const fromFilePath = fileURLToPath(params.fromModuleUrl);
  const targetPath = resolveVitestSourceModulePath(
    path.resolve(
      resolveWorkspacePackageDir(params.packageName),
      normalizeBundledPluginArtifactSubpath(params.artifactBasename),
    ),
  );
  const relativePath = path
    .relative(path.dirname(fromFilePath), targetPath)
    .replaceAll(path.sep, "/");
  const normalizedRelativePath = relativePath.startsWith(".") ? relativePath : `./${relativePath}`;
  if (path.resolve(path.dirname(fromFilePath), normalizedRelativePath) !== targetPath) {
    return pathToFileURL(targetPath).href;
  }
  return normalizedRelativePath;
}

/** Reused helper for resolve Workspace Package Public Module Url behavior in src/test-utils. */
export function resolveWorkspacePackagePublicModuleUrl(params: {
  packageName: string;
  artifactBasename: string;
}): string {
  const targetPath = resolveVitestSourceModulePath(
    path.resolve(
      resolveWorkspacePackageDir(params.packageName),
      normalizeBundledPluginArtifactSubpath(params.artifactBasename),
    ),
  );
  return pathToFileURL(targetPath).href;
}
