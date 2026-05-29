// Shared string normalization helpers for memory host config and IO boundaries.
/** Returns a trimmed non-empty string, or null for non-strings and blank values. */
export function normalizeNullableString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

/** Returns a trimmed non-empty string, or undefined when no string is usable. */
export function normalizeOptionalString(value: unknown): string | undefined {
  return normalizeNullableString(value) ?? undefined;
}

/** Normalizes optional string input to lowercase for ids and enum-like config. */
export function normalizeOptionalLowercaseString(value: unknown): string | undefined {
  return normalizeOptionalString(value)?.toLowerCase();
}

/** Lowercases optional string input and falls back to an empty string. */
export function normalizeLowercaseStringOrEmpty(value: unknown): string {
  return normalizeOptionalLowercaseString(value) ?? "";
}

/** Converts an unknown array into trimmed non-empty string entries. */
export function normalizeStringEntries(values: ReadonlyArray<unknown>): string[] {
  return values.map((value) => normalizeOptionalString(String(value)) ?? "").filter(Boolean);
}

/** Deduplicates strings while preserving first-seen order. */
export function uniqueStrings(values: Iterable<string>): string[] {
  return [...new Set(values)];
}
