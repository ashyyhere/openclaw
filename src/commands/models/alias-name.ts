// Normalizes user-defined model aliases for config storage and lookup.
/** Reused helper for normalize Alias behavior in src/commands/models. */
export function normalizeAlias(alias: string): string {
  const trimmed = alias.trim();
  if (!trimmed) {
    throw new Error("Alias cannot be empty.");
  }
  if (!/^[A-Za-z0-9_.:-]+$/.test(trimmed)) {
    throw new Error("Alias must use letters, numbers, dots, underscores, colons, or dashes.");
  }
  return trimmed;
}
