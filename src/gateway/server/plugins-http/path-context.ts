// gateway/server/plugins-http path context helpers and runtime behavior.
import { normalizeLowercaseStringOrEmpty } from "../../../shared/string-coerce.js";
import {
  PROTECTED_PLUGIN_ROUTE_PREFIXES,
  canonicalizePathForSecurity,
} from "../../security-path.js";

/** Shared type for Plugin Route Path Context in src/gateway/server. */
export type PluginRoutePathContext = {
  pathname: string;
  canonicalPath: string;
  candidates: string[];
  malformedEncoding: boolean;
  decodePassLimitReached: boolean;
  rawNormalizedPath: string;
};

function normalizeProtectedPrefix(prefix: string): string {
  const collapsed = normalizeLowercaseStringOrEmpty(prefix).replace(/\/{2,}/g, "/");
  if (collapsed.length <= 1) {
    return collapsed || "/";
  }
  return collapsed.replace(/\/+$/, "");
}

/** Reused helper for prefix Match Path behavior in src/gateway/server. */
export function prefixMatchPath(pathname: string, prefix: string): boolean {
  return (
    pathname === prefix || pathname.startsWith(`${prefix}/`) || pathname.startsWith(`${prefix}%`)
  );
}

const NORMALIZED_PROTECTED_PLUGIN_ROUTE_PREFIXES =
  PROTECTED_PLUGIN_ROUTE_PREFIXES.map(normalizeProtectedPrefix);

/** Reused helper for is Protected Plugin Route Path From Context behavior in src/gateway/server. */
export function isProtectedPluginRoutePathFromContext(context: PluginRoutePathContext): boolean {
  if (
    context.candidates.some((candidate) =>
      NORMALIZED_PROTECTED_PLUGIN_ROUTE_PREFIXES.some((prefix) =>
        prefixMatchPath(candidate, prefix),
      ),
    )
  ) {
    return true;
  }
  if (!context.malformedEncoding) {
    return false;
  }
  return NORMALIZED_PROTECTED_PLUGIN_ROUTE_PREFIXES.some((prefix) =>
    prefixMatchPath(context.rawNormalizedPath, prefix),
  );
}

/** Reused helper for resolve Plugin Route Path Context behavior in src/gateway/server. */
export function resolvePluginRoutePathContext(pathname: string): PluginRoutePathContext {
  const canonical = canonicalizePathForSecurity(pathname);
  return {
    pathname,
    canonicalPath: canonical.canonicalPath,
    candidates: canonical.candidates,
    malformedEncoding: canonical.malformedEncoding,
    decodePassLimitReached: canonical.decodePassLimitReached,
    rawNormalizedPath: canonical.rawNormalizedPath,
  };
}
