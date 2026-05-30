// Maps external hook session keys to external content source categories.
import { normalizeLowercaseStringOrEmpty } from "../shared/string-coerce.js";

/** Hook-origin sources that need external-content prompt isolation. */
export type HookExternalContentSource = "gmail" | "webhook";

/** Resolve the external content source encoded in a hook session key. */
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

/** Map hook-specific source ids onto external content wrapper sources. */
export function mapHookExternalContentSource(
  source: HookExternalContentSource,
): "email" | "webhook" {
  return source === "gmail" ? "email" : "webhook";
}

/** Return whether a session key belongs to an external hook source. */
export function isExternalHookSession(sessionKey: string): boolean {
  return resolveHookExternalContentSource(sessionKey) !== undefined;
}
