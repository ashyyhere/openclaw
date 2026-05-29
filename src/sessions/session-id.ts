// Recognizes canonical UUID-shaped session ids.
/** Case-insensitive UUID pattern used for session-id lookup tokens. */
export const SESSION_ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Returns true when a string appears to be a bare session UUID. */
export function looksLikeSessionId(value: string): boolean {
  return SESSION_ID_RE.test(value.trim());
}
