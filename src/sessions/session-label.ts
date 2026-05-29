// Validates user-visible labels attached to sessions.
/** Maximum stored session label length after trimming. */
export const SESSION_LABEL_MAX_LENGTH = 512;

/** Result from parsing and validating a requested session label. */
export type ParsedSessionLabel = { ok: true; label: string } | { ok: false; error: string };

/** Validates and trims a session label for persistence. */
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
