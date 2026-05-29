// sessions session id helpers and runtime behavior.
/** Reused constant for SESSION ID RE behavior in src/sessions. */
export const SESSION_ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Reused helper for looks Like Session Id behavior in src/sessions. */
export function looksLikeSessionId(value: string): boolean {
  return SESSION_ID_RE.test(value.trim());
}
