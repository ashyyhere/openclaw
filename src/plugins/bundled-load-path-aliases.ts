// Bundled plugin load path alias helpers. Maps packaged dist extension paths
// to legacy source-style extension paths for compatibility diagnostics/loading.
import path from "node:path";
import { isPathInside } from "./path-safety.js";

/** Whether an alias points at the packaged path or its legacy equivalent. */
export type BundledPluginLoadPathAliasKind = "current" | "legacy";

/** One candidate load path for a bundled plugin. */
export type BundledPluginLoadPathAlias = {
  kind: BundledPluginLoadPathAliasKind;
  path: string;
};

/** Parsed packaged bundled plugin path under dist extension roots. */
export type PackagedBundledPluginPath = {
  packageRoot: string;
  bundledRoot: string;
  bundledLeaf: string;
};

/** Parsed legacy bundled plugin path under the source-style extensions root. */
export type LegacyBundledPluginPath = {
  packageRoot: string;
  legacyRoot: string;
  bundledLeaf: string;
};

const PACKAGED_BUNDLED_ROOTS = [
  path.join("dist", "extensions"),
  path.join("dist-runtime", "extensions"),
] as const;

/** Normalizes bundled lookup paths while trimming trailing separators. */
export function normalizeBundledLookupPath(targetPath: string): string {
  const normalized = path.normalize(targetPath);
  const root = path.parse(normalized).root;
  let trimmed = normalized;
  while (trimmed.length > root.length && (trimmed.endsWith(path.sep) || trimmed.endsWith("/"))) {
    trimmed = trimmed.slice(0, -1);
  }
  return trimmed;
}

function findPackagedBundledRoot(localPath: string): {
  packageRoot: string;
  bundledRoot: string;
} | null {
  const normalized = normalizeBundledLookupPath(localPath);
  for (const packagedRoot of PACKAGED_BUNDLED_ROOTS) {
    const marker = `${path.sep}${packagedRoot}`;
    const markerIndex = normalized.lastIndexOf(marker);
    if (markerIndex === -1) {
      continue;
    }
    const markerEnd = markerIndex + marker.length;
    if (normalized.length !== markerEnd && normalized[markerEnd] !== path.sep) {
      continue;
    }
    return {
      packageRoot: normalized.slice(0, markerIndex),
      bundledRoot: normalized.slice(0, markerEnd),
    };
  }
  return null;
}

/** Parses a packaged bundled plugin path into package root, root, and leaf. */
export function parsePackagedBundledPluginPath(
  localPath: string,
): PackagedBundledPluginPath | null {
  const packaged = findPackagedBundledRoot(localPath);
  if (!packaged) {
    return null;
  }
  const normalized = normalizeBundledLookupPath(localPath);
  if (normalized === packaged.bundledRoot) {
    return null;
  }
  return {
    ...packaged,
    bundledLeaf: normalized.slice(packaged.bundledRoot.length + path.sep.length),
  };
}

/** Builds the legacy extensions path corresponding to a packaged bundled path. */
export function buildLegacyBundledPath(localPath: string): string | null {
  const packaged = parsePackagedBundledPluginPath(localPath);
  if (!packaged) {
    return null;
  }
  return path.join(packaged.packageRoot, "extensions", packaged.bundledLeaf);
}

/** Builds the legacy extensions root corresponding to a packaged bundled root. */
export function buildLegacyBundledRootPath(localPath: string): string | null {
  const packaged = findPackagedBundledRoot(localPath);
  return packaged ? path.join(packaged.packageRoot, "extensions") : null;
}

/** Parses a legacy bundled plugin path into package root, root, and leaf. */
export function parseLegacyBundledPluginPath(localPath: string): LegacyBundledPluginPath | null {
  const normalized = normalizeBundledLookupPath(localPath);
  const marker = `${path.sep}extensions`;
  const markerIndex = normalized.lastIndexOf(marker);
  if (markerIndex === -1) {
    return null;
  }
  const markerEnd = markerIndex + marker.length;
  if (normalized.length === markerEnd || normalized[markerEnd] !== path.sep) {
    return null;
  }
  return {
    packageRoot: normalized.slice(0, markerIndex),
    legacyRoot: normalized.slice(0, markerEnd),
    bundledLeaf: normalized.slice(markerEnd + path.sep.length),
  };
}

/** Builds current and legacy load aliases for a packaged bundled plugin path. */
export function buildBundledPluginLoadPathAliases(localPath: string): BundledPluginLoadPathAlias[] {
  const legacyPath = buildLegacyBundledPath(localPath);
  if (!legacyPath) {
    return [];
  }
  return [
    { kind: "current", path: localPath },
    { kind: "legacy", path: legacyPath },
  ];
}

function isSameOrInside(baseDir: string, targetPath: string): boolean {
  const base = path.resolve(normalizeBundledLookupPath(baseDir));
  const target = path.resolve(normalizeBundledLookupPath(targetPath));
  return target === base || isPathInside(base, target);
}

/** Classifies a load path as current or legacy for a packaged bundled root. */
export function resolvePackagedBundledLoadPathAlias(params: {
  bundledRoot?: string;
  loadPath: string;
}): BundledPluginLoadPathAlias | null {
  if (!params.bundledRoot) {
    return null;
  }
  const packaged = findPackagedBundledRoot(params.bundledRoot);
  if (!packaged) {
    return null;
  }
  const legacyRoot = path.join(packaged.packageRoot, "extensions");
  if (isSameOrInside(params.bundledRoot, params.loadPath)) {
    return { kind: "current", path: params.loadPath };
  }
  if (isSameOrInside(legacyRoot, params.loadPath)) {
    return { kind: "legacy", path: params.loadPath };
  }
  return null;
}
