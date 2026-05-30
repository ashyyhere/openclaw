// Shared string normalization helpers for loosely typed config and API values.
/** Returns a value only when it is already a string. */
export function readStringValue(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

/** Trims a string and collapses missing or empty values to null. */
export function normalizeNullableString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

/** Trims a string and collapses missing or empty values to undefined. */
export function normalizeOptionalString(value: unknown): string | undefined {
  return normalizeNullableString(value) ?? undefined;
}

/** Stringifies primitive scalar values before optional string normalization. */
export function normalizeStringifiedOptionalString(value: unknown): string | undefined {
  if (typeof value === "string") {
    return normalizeOptionalString(value);
  }
  if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
    return normalizeOptionalString(String(value));
  }
  return undefined;
}

/** Normalizes an optional array of scalar entries into non-empty strings. */
export function normalizeStringifiedEntries(values?: ReadonlyArray<unknown>): string[] {
  return (values ?? [])
    .map((entry) => normalizeStringifiedOptionalString(entry))
    .filter((entry): entry is string => Boolean(entry));
}

/** Normalizes an optional string and lowercases it with the default locale-insensitive rules. */
export function normalizeOptionalLowercaseString(value: unknown): string | undefined {
  return normalizeOptionalString(value)?.toLowerCase();
}

/** Returns a lowercase normalized string or an empty string when missing. */
export function normalizeLowercaseStringOrEmpty(value: unknown): string {
  return normalizeOptionalLowercaseString(value) ?? "";
}

/** Parses common fast-mode enable/disable strings into booleans. */
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

/** Lowercases a string without trimming or otherwise changing whitespace. */
export function lowercasePreservingWhitespace(value: string): string {
  return value.toLowerCase();
}

/** Locale-lowercases a string without trimming or otherwise changing whitespace. */
export function localeLowercasePreservingWhitespace(value: string): string {
  return value.toLocaleLowerCase();
}

/** Resolves either a direct string or an object's primary string field. */
export function resolvePrimaryStringValue(value: unknown): string | undefined {
  if (typeof value === "string") {
    return normalizeOptionalString(value);
  }
  if (!value || typeof value !== "object") {
    return undefined;
  }
  return normalizeOptionalString((value as { primary?: unknown }).primary);
}

/** Normalizes thread identifiers while preserving finite numeric ids. */
export function normalizeOptionalThreadValue(value: unknown): string | number | undefined {
  if (typeof value === "number") {
    return Number.isFinite(value) ? Math.trunc(value) : undefined;
  }
  return normalizeOptionalString(value);
}

/** Normalizes an optional thread/id value and returns its string representation. */
export function normalizeOptionalStringifiedId(value: unknown): string | undefined {
  const normalized = normalizeOptionalThreadValue(value);
  return normalized == null ? undefined : String(normalized);
}

/** Type guard for values that normalize to a non-empty string. */
export function hasNonEmptyString(value: unknown): value is string {
  return normalizeOptionalString(value) !== undefined;
}
