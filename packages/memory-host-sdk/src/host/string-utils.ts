// packages/memory-host-sdk/src/host string utils helpers and runtime behavior.
/** Public helper for normalize Nullable String behavior in packages/memory-host-sdk. */
export function normalizeNullableString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

/** Public helper for normalize Optional String behavior in packages/memory-host-sdk. */
export function normalizeOptionalString(value: unknown): string | undefined {
  return normalizeNullableString(value) ?? undefined;
}

/** Public helper for normalize Optional Lowercase String behavior in packages/memory-host-sdk. */
export function normalizeOptionalLowercaseString(value: unknown): string | undefined {
  return normalizeOptionalString(value)?.toLowerCase();
}

/** Public helper for normalize Lowercase String Or Empty behavior in packages/memory-host-sdk. */
export function normalizeLowercaseStringOrEmpty(value: unknown): string {
  return normalizeOptionalLowercaseString(value) ?? "";
}

/** Public helper for normalize String Entries behavior in packages/memory-host-sdk. */
export function normalizeStringEntries(values: ReadonlyArray<unknown>): string[] {
  return values.map((value) => normalizeOptionalString(String(value)) ?? "").filter(Boolean);
}

/** Public helper for unique Strings behavior in packages/memory-host-sdk. */
export function uniqueStrings(values: Iterable<string>): string[] {
  return [...new Set(values)];
}
