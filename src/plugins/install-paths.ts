// plugins install paths helpers and runtime behavior.
import path from "node:path";
import {
  resolveSafeInstallDir,
  safeDirName,
  safePathSegmentHashed,
  unscopedPackageName,
} from "../infra/install-safe-path.js";
import { resolveConfigDir, resolveUserPath } from "../utils.js";

/** Reused helper for safe Plugin Install File Name behavior in src/plugins. */
export function safePluginInstallFileName(input: string): string {
  return safeDirName(input);
}

/** Reused helper for encode Plugin Install Dir Name behavior in src/plugins. */
export function encodePluginInstallDirName(pluginId: string): string {
  const trimmed = pluginId.trim();
  if (!trimmed.includes("/")) {
    return safeDirName(trimmed);
  }
  // Scoped plugin ids need a reserved on-disk namespace so they cannot collide
  // with valid unscoped ids that happen to match the hashed slug.
  return `@${safePathSegmentHashed(trimmed)}`;
}

/** Reused helper for validate Plugin Id behavior in src/plugins. */
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

/** Reused helper for matches Expected Plugin Id behavior in src/plugins. */
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

/** Reused helper for resolve Default Plugin Extensions Dir behavior in src/plugins. */
export function resolveDefaultPluginExtensionsDir(
  env: NodeJS.ProcessEnv = process.env,
  homedir?: () => string,
): string {
  return path.join(resolveConfigDir(env, homedir), "extensions");
}

/** Reused helper for resolve Default Plugin Npm Dir behavior in src/plugins. */
export function resolveDefaultPluginNpmDir(
  env: NodeJS.ProcessEnv = process.env,
  homedir?: () => string,
): string {
  return path.join(resolveConfigDir(env, homedir), "npm");
}

/** Reused helper for encode Plugin Npm Project Dir Name behavior in src/plugins. */
export function encodePluginNpmProjectDirName(packageName: string): string {
  const trimmed = packageName.trim();
  if (!trimmed) {
    throw new Error("invalid npm package name: missing");
  }
  return safePathSegmentHashed(trimmed);
}

/** Reused helper for resolve Plugin Npm Projects Dir behavior in src/plugins. */
export function resolvePluginNpmProjectsDir(npmDir?: string): string {
  const npmBase = npmDir ? resolveUserPath(npmDir) : resolveDefaultPluginNpmDir();
  return path.join(npmBase, "projects");
}

/** Reused helper for resolve Plugin Npm Project Dir behavior in src/plugins. */
export function resolvePluginNpmProjectDir(params: {
  packageName: string;
  npmDir?: string;
}): string {
  return path.join(
    resolvePluginNpmProjectsDir(params.npmDir),
    encodePluginNpmProjectDirName(params.packageName),
  );
}

/** Reused helper for resolve Plugin Npm Package Dir behavior in src/plugins. */
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

/** Reused helper for resolve Default Plugin Git Dir behavior in src/plugins. */
export function resolveDefaultPluginGitDir(
  env: NodeJS.ProcessEnv = process.env,
  homedir?: () => string,
): string {
  return path.join(resolveConfigDir(env, homedir), "git");
}

/** Reused helper for resolve Plugin Install Dir behavior in src/plugins. */
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
