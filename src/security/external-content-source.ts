// security external content source helpers and runtime behavior.
import { normalizeLowercaseStringOrEmpty } from "../shared/string-coerce.js";

/** Shared type for Hook External Content Source in src/security. */
export type HookExternalContentSource = "gmail" | "webhook";

/** Reused helper for resolve Hook External Content Source behavior in src/security. */
export function resolveHookExternalContentSource(
  sessionKey: string,
): HookExternalContentSource | undefined {
  const normalized = normalizeLowercaseStringOrEmpty(sessionKey);
  if (normalized.startsWith("hook:gmail:")) {
    return "gmail";
  }
  if (normalized.startsWith("hook:webhook:") || normalized.startsWith("hook:")) {
    return "webhook";
  }
  return undefined;
}

/** Reused helper for map Hook External Content Source behavior in src/security. */
export function mapHookExternalContentSource(
  source: HookExternalContentSource,
): "email" | "webhook" {
  return source === "gmail" ? "email" : "webhook";
}

/** Reused helper for is External Hook Session behavior in src/security. */
export function isExternalHookSession(sessionKey: string): boolean {
  return resolveHookExternalContentSource(sessionKey) !== undefined;
}
