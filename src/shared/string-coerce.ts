// shared string coerce helpers and runtime behavior.
/** Reused helper for read String Value behavior in src/shared. */
export function readStringValue(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

/** Reused helper for normalize Nullable String behavior in src/shared. */
export function normalizeNullableString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

/** Reused helper for normalize Optional String behavior in src/shared. */
export function normalizeOptionalString(value: unknown): string | undefined {
  return normalizeNullableString(value) ?? undefined;
}

/** Reused helper for normalize Stringified Optional String behavior in src/shared. */
export function normalizeStringifiedOptionalString(value: unknown): string | undefined {
  if (typeof value === "string") {
    return normalizeOptionalString(value);
  }
  if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
    return normalizeOptionalString(String(value));
  }
  return undefined;
}

/** Reused helper for normalize Stringified Entries behavior in src/shared. */
export function normalizeStringifiedEntries(values?: ReadonlyArray<unknown>): string[] {
  return (values ?? [])
    .map((entry) => normalizeStringifiedOptionalString(entry))
    .filter((entry): entry is string => Boolean(entry));
}

/** Reused helper for normalize Optional Lowercase String behavior in src/shared. */
export function normalizeOptionalLowercaseString(value: unknown): string | undefined {
  return normalizeOptionalString(value)?.toLowerCase();
}

/** Reused helper for normalize Lowercase String Or Empty behavior in src/shared. */
export function normalizeLowercaseStringOrEmpty(value: unknown): string {
  return normalizeOptionalLowercaseString(value) ?? "";
}

/** Reused helper for normalize Fast Mode behavior in src/shared. */
export function normalizeFastMode(raw?: string | boolean | null): boolean | undefined {
  if (typeof raw === "boolean") {
    return raw;
  }
  if (!raw) {
    return undefined;
  }
  const key = normalizeLowercaseStringOrEmpty(raw);
  if (["off", "false", "no", "0", "disable", "disabled", "normal"].includes(key)) {
    return false;
  }
  if (["on", "true", "yes", "1", "enable", "enabled", "fast"].includes(key)) {
    return true;
  }
  return undefined;
}

/** Reused helper for lowercase Preserving Whitespace behavior in src/shared. */
export function lowercasePreservingWhitespace(value: string): string {
  return value.toLowerCase();
}

/** Reused helper for locale Lowercase Preserving Whitespace behavior in src/shared. */
export function localeLowercasePreservingWhitespace(value: string): string {
  return value.toLocaleLowerCase();
}

/** Reused helper for resolve Primary String Value behavior in src/shared. */
export function resolvePrimaryStringValue(value: unknown): string | undefined {
  if (typeof value === "string") {
    return normalizeOptionalString(value);
  }
  if (!value || typeof value !== "object") {
    return undefined;
  }
  return normalizeOptionalString((value as { primary?: unknown }).primary);
}

/** Reused helper for normalize Optional Thread Value behavior in src/shared. */
export function normalizeOptionalThreadValue(value: unknown): string | number | undefined {
  if (typeof value === "number") {
    return Number.isFinite(value) ? Math.trunc(value) : undefined;
  }
  return normalizeOptionalString(value);
}

/** Reused helper for normalize Optional Stringified Id behavior in src/shared. */
export function normalizeOptionalStringifiedId(value: unknown): string | undefined {
  const normalized = normalizeOptionalThreadValue(value);
  return normalized == null ? undefined : String(normalized);
}

/** Reused helper for has Non Empty String behavior in src/shared. */
export function hasNonEmptyString(value: unknown): value is string {
  return normalizeOptionalString(value) !== undefined;
}
