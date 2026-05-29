// sessions session label helpers and runtime behavior.
/** Reused constant for SESSION LABEL MAX LENGTH behavior in src/sessions. */
export const SESSION_LABEL_MAX_LENGTH = 512;

/** Shared type for Parsed Session Label in src/sessions. */
export type ParsedSessionLabel = { ok: true; label: string } | { ok: false; error: string };

/** Reused helper for parse Session Label behavior in src/sessions. */
export function parseSessionLabel(raw: unknown): ParsedSessionLabel {
  if (typeof raw !== "string") {
    return { ok: false, error: "invalid label: must be a string" };
  }
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: false, error: "invalid label: empty" };
  }
  if (trimmed.length > SESSION_LABEL_MAX_LENGTH) {
    return {
      ok: false,
      error: `invalid label: too long (max ${SESSION_LABEL_MAX_LENGTH})`,
    };
  }
  return { ok: true, label: trimmed };
}
