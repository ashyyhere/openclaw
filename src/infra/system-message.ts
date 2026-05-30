// Prefixes user-visible internal/system messages consistently.
/** Marker used to identify OpenClaw-generated system messages. */
export const SYSTEM_MARK = "⚙️";

function normalizeSystemText(value: string): string {
  return value.trim();
}

/** Returns whether text already starts with the system marker. */
export function hasSystemMark(text: string): boolean {
  return normalizeSystemText(text).startsWith(SYSTEM_MARK);
}

/** Adds the system marker unless the message is empty or already marked. */
export function prefixSystemMessage(text: string): string {
  const normalized = normalizeSystemText(text);
  if (!normalized) {
    return normalized;
  }
  if (hasSystemMark(normalized)) {
    return normalized;
  }
  return `${SYSTEM_MARK} ${normalized}`;
}
