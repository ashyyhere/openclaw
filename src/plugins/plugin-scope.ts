// Normalizes optional plugin-id scopes for cache keys, registry filters, and diagnostics.
import { normalizeStringEntries } from "../shared/string-normalization.js";

/** Optional sorted plugin-id list; `undefined` means unscoped, while `[]` means explicitly empty. */
export type PluginIdScope = readonly string[] | undefined;

/** Normalize user/plugin supplied scope ids into a stable sorted set. */
export function normalizePluginIdScope(ids?: readonly unknown[]): string[] | undefined {
  if (ids === undefined) {
    return undefined;
  }
  return Array.from(
    new Set(normalizeStringEntries(ids.filter((id): id is string => typeof id === "string"))),
  ).toSorted();
}

/** Distinguish "no scope provided" from an explicit empty scope. */
export function hasExplicitPluginIdScope(ids?: readonly string[]): boolean {
  return ids !== undefined;
}

/** Check whether a scope can match at least one plugin id. */
export function hasNonEmptyPluginIdScope(ids?: readonly string[]): boolean {
  return ids !== undefined && ids.length > 0;
}

/** Convert an optional scope into a lookup set, preserving `null` for unscoped callers. */
export function createPluginIdScopeSet(ids?: readonly string[]): ReadonlySet<string> | null {
  if (ids === undefined) {
    return null;
  }
  return new Set(ids);
}

/** Stable cache-key representation that keeps unscoped distinct from explicit lists. */
export function serializePluginIdScope(ids?: readonly string[]): string {
  return ids === undefined ? "__unscoped__" : JSON.stringify(ids);
}
