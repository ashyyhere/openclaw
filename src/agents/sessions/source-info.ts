/** Source metadata attached to loaded session resources. */
import type { PathMetadata } from "./package-manager.js";

/** Shared type for Source Scope in src/agents/sessions. */
export type SourceScope = "user" | "project" | "temporary";
/** Shared type for Source Origin in src/agents/sessions. */
export type SourceOrigin = "package" | "top-level";

/** Shared type for Source Info in src/agents/sessions. */
export interface SourceInfo {
  path: string;
  source: string;
  scope: SourceScope;
  origin: SourceOrigin;
  baseDir?: string;
}

/** Creates source info for a package-discovered resource path. */
export function createSourceInfo(path: string, metadata: PathMetadata): SourceInfo {
  return {
    path,
    source: metadata.source,
    scope: metadata.scope,
    origin: metadata.origin,
    baseDir: metadata.baseDir,
  };
}

/** Creates source info for synthetic or temporary resources. */
export function createSyntheticSourceInfo(
  path: string,
  options: {
    source: string;
    scope?: SourceScope;
    origin?: SourceOrigin;
    baseDir?: string;
  },
): SourceInfo {
  return {
    path,
    source: options.source,
    scope: options.scope ?? "temporary",
    origin: options.origin ?? "top-level",
    baseDir: options.baseDir,
  };
}
