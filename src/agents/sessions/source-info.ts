/** Source metadata attached to loaded session resources. */
import type { PathMetadata } from "./package-manager.js";

/** Scope that contributed a loaded session resource. */
export type SourceScope = "user" | "project" | "temporary";
/** Whether a resource came from a package or a top-level configured path. */
export type SourceOrigin = "package" | "top-level";

/** Provenance attached to loaded extensions, prompts, skills, and themes. */
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
