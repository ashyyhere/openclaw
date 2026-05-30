// Safe path helpers for plugin installs. All public resolvers keep plugin ids
// inside managed OpenClaw directories and avoid package-name path traversal.
import path from "node:path";
import {
  resolveSafeInstallDir,
  safeDirName,
  safePathSegmentHashed,
  unscopedPackageName,
} from "../infra/install-safe-path.js";
import { resolveConfigDir, resolveUserPath } from "../utils.js";

/** Encodes a plugin file basename so a copied single-file plugin is path-safe. */
export function safePluginInstallFileName(input: string): string {
  return safeDirName(input);
}

/** Encodes a plugin id into the managed extensions directory namespace. */
export function encodePluginInstallDirName(pluginId: string): string {
  const trimmed = pluginId.trim();
  if (!trimmed.includes("/")) {
    return safeDirName(trimmed);
  }
  // Scoped plugin ids need a reserved on-disk namespace so they cannot collide
  // with valid unscoped ids that happen to match the hashed slug.
  return `@${safePathSegmentHashed(trimmed)}`;
}

/** Validates OpenClaw plugin ids before using them in config or filesystem paths. */
export function validatePluginId(pluginId: string): string | null {
  const trimmed = pluginId.trim();
  if (!trimmed) {
    return "invalid plugin name: missing";
  }
  if (trimmed.includes("\\")) {
    return "invalid plugin name: path separators not allowed";
  }
  const segments = trimmed.split("/");
  if (segments.some((segment) => !segment)) {
    return "invalid plugin name: malformed scope";
  }
  if (segments.some((segment) => segment === "." || segment === "..")) {
    return "invalid plugin name: reserved path segment";
  }
  if (segments.length === 1) {
    if (trimmed.startsWith("@")) {
      return "invalid plugin name: scoped ids must use @scope/name format";
    }
    return null;
  }
  if (segments.length !== 2) {
    return "invalid plugin name: path separators not allowed";
  }
  if (!segments[0]?.startsWith("@") || segments[0].length < 2) {
    return "invalid plugin name: scoped ids must use @scope/name format";
  }
  return null;
}

/** Checks an installed package id against the expected plugin id for updates. */
export function matchesExpectedPluginId(params: {
  expectedPluginId?: string;
  pluginId: string;
  manifestPluginId?: string;
  npmPluginId: string;
}): boolean {
  if (!params.expectedPluginId) {
    return true;
  }
  if (params.expectedPluginId === params.pluginId) {
    return true;
  }
  // Backward compatibility: older install records keyed scoped npm packages by
  // their unscoped package name. Preserve update-in-place for those records
  // unless the package declares an explicit manifest id override.
  return (
    !params.manifestPluginId &&
    params.pluginId === params.npmPluginId &&
    params.expectedPluginId === unscopedPackageName(params.npmPluginId)
  );
}

/** Resolves the default managed directory for installed plugin extension files. */
export function resolveDefaultPluginExtensionsDir(
  env: NodeJS.ProcessEnv = process.env,
  homedir?: () => string,
): string {
  return path.join(resolveConfigDir(env, homedir), "extensions");
}

/** Resolves the default managed npm root for plugin package installs. */
export function resolveDefaultPluginNpmDir(
  env: NodeJS.ProcessEnv = process.env,
  homedir?: () => string,
): string {
  return path.join(resolveConfigDir(env, homedir), "npm");
}

/** Encodes an npm package name into a stable managed npm project directory. */
export function encodePluginNpmProjectDirName(packageName: string): string {
  const trimmed = packageName.trim();
  if (!trimmed) {
    throw new Error("invalid npm package name: missing");
  }
  return safePathSegmentHashed(trimmed);
}

/** Resolves the parent directory for per-package managed npm projects. */
export function resolvePluginNpmProjectsDir(npmDir?: string): string {
  const npmBase = npmDir ? resolveUserPath(npmDir) : resolveDefaultPluginNpmDir();
  return path.join(npmBase, "projects");
}

/** Resolves the managed npm project directory for one plugin package. */
export function resolvePluginNpmProjectDir(params: {
  packageName: string;
  npmDir?: string;
}): string {
  return path.join(
    resolvePluginNpmProjectsDir(params.npmDir),
    encodePluginNpmProjectDirName(params.packageName),
  );
}

/** Resolves the installed package directory inside its managed npm project. */
export function resolvePluginNpmPackageDir(params: {
  packageName: string;
  npmDir?: string;
}): string {
  return path.join(
    resolvePluginNpmProjectDir(params),
    "node_modules",
    ...params.packageName.split("/"),
  );
}

/** Resolves the default managed checkout root for git-sourced plugins. */
export function resolveDefaultPluginGitDir(
  env: NodeJS.ProcessEnv = process.env,
  homedir?: () => string,
): string {
  return path.join(resolveConfigDir(env, homedir), "git");
}

/** Resolves the managed extension install directory for a plugin id. */
export function resolvePluginInstallDir(pluginId: string, extensionsDir?: string): string {
  const extensionsBase = extensionsDir
    ? resolveUserPath(extensionsDir)
    : resolveDefaultPluginExtensionsDir();
  const pluginIdError = validatePluginId(pluginId);
  if (pluginIdError) {
    throw new Error(pluginIdError);
  }
  const targetDirResult = resolveSafeInstallDir({
    baseDir: extensionsBase,
    id: pluginId,
    invalidNameMessage: "invalid plugin name: path traversal detected",
    nameEncoder: encodePluginInstallDirName,
  });
  if (!targetDirResult.ok) {
    throw new Error(targetDirResult.error);
  }
  return targetDirResult.path;
}
