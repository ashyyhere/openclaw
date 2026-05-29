// plugins plugin scope helpers and runtime behavior.
import { normalizeStringEntries } from "../shared/string-normalization.js";

/** Shared type for Plugin Id Scope in src/plugins. */
export type PluginIdScope = readonly string[] | undefined;

/** Reused helper for normalize Plugin Id Scope behavior in src/plugins. */
export function normalizePluginIdScope(ids?: readonly unknown[]): string[] | undefined {
  if (ids === undefined) {
    return undefined;
  }
  return Array.from(
    new Set(normalizeStringEntries(ids.filter((id): id is string => typeof id === "string"))),
  ).toSorted();
}

/** Reused helper for has Explicit Plugin Id Scope behavior in src/plugins. */
export function hasExplicitPluginIdScope(ids?: readonly string[]): boolean {
  return ids !== undefined;
}

/** Reused helper for has Non Empty Plugin Id Scope behavior in src/plugins. */
export function hasNonEmptyPluginIdScope(ids?: readonly string[]): boolean {
  return ids !== undefined && ids.length > 0;
}

/** Reused helper for create Plugin Id Scope Set behavior in src/plugins. */
export function createPluginIdScopeSet(ids?: readonly string[]): ReadonlySet<string> | null {
  if (ids === undefined) {
    return null;
  }
  return new Set(ids);
}

/** Reused helper for serialize Plugin Id Scope behavior in src/plugins. */
export function serializePluginIdScope(ids?: readonly string[]): string {
  return ids === undefined ? "__unscoped__" : JSON.stringify(ids);
}
