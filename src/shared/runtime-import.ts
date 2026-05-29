// shared runtime import helpers and runtime behavior.
import { toSafeImportPath } from "./import-specifier.js";

/** Re-exported API for src/shared, starting with to Safe Import Path. */
export { toSafeImportPath as toSafeRuntimeImportPath } from "./import-specifier.js";

/** Reused helper for resolve Runtime Import Specifier behavior in src/shared. */
export function resolveRuntimeImportSpecifier(baseUrl: string, parts: readonly string[]): string {
  const joined = parts.join("");
  const safeJoined = toSafeImportPath(joined);
  if (safeJoined !== joined) {
    return safeJoined;
  }
  return new URL(joined, toSafeImportPath(baseUrl)).href;
}

/** Reused helper for import Runtime Module behavior in src/shared. */
export async function importRuntimeModule<T>(
  baseUrl: string,
  parts: readonly string[],
  importModule: (specifier: string) => Promise<unknown> = (specifier) => import(specifier),
): Promise<T> {
  return (await importModule(resolveRuntimeImportSpecifier(baseUrl, parts))) as T;
}
