// infra system message helpers and runtime behavior.
/** Reused constant for SYSTEM MARK behavior in src/infra. */
export const SYSTEM_MARK = "⚙️";

function normalizeSystemText(value: string): string {
  return value.trim();
}

/** Reused helper for has System Mark behavior in src/infra. */
export function hasSystemMark(text: string): boolean {
  return normalizeSystemText(text).startsWith(SYSTEM_MARK);
}

/** Reused helper for prefix System Message behavior in src/infra. */
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
