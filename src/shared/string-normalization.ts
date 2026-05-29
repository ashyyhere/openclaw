// shared string normalization helpers and runtime behavior.
import { normalizeOptionalLowercaseString, normalizeOptionalString } from "./string-coerce.js";

/** Reused helper for normalize String Entries behavior in src/shared. */
export function normalizeStringEntries(list?: ReadonlyArray<unknown>) {
  return (list ?? []).map((entry) => normalizeOptionalString(String(entry)) ?? "").filter(Boolean);
}

/** Reused helper for normalize String Entries Lower behavior in src/shared. */
export function normalizeStringEntriesLower(list?: ReadonlyArray<unknown>) {
  return normalizeStringEntries(list).map((entry) => normalizeOptionalLowercaseString(entry) ?? "");
}

/** Reused helper for unique Values behavior in src/shared. */
export function uniqueValues<T>(values: Iterable<T>): T[] {
  return [...new Set(values)];
}

/** Reused helper for unique Strings behavior in src/shared. */
export function uniqueStrings(values: Iterable<string>): string[] {
  return uniqueValues(values);
}

/** Reused helper for sort Unique Strings behavior in src/shared. */
export function sortUniqueStrings(values: Iterable<string>): string[] {
  return uniqueStrings(values).toSorted((left, right) =>
    left < right ? -1 : left > right ? 1 : 0,
  );
}

/** Reused helper for normalize Unique String Entries behavior in src/shared. */
export function normalizeUniqueStringEntries(values?: Iterable<unknown>): string[] {
  return uniqueStrings(normalizeStringEntries(values ? [...values] : undefined));
}

/** Reused helper for normalize Unique String Entries Lower behavior in src/shared. */
export function normalizeUniqueStringEntriesLower(values?: Iterable<unknown>): string[] {
  return uniqueStrings(
    normalizeStringEntriesLower(values ? [...values] : undefined).filter(Boolean),
  );
}

/** Reused helper for normalize Sorted Unique String Entries behavior in src/shared. */
export function normalizeSortedUniqueStringEntries(values?: Iterable<unknown>): string[] {
  return sortUniqueStrings(normalizeUniqueStringEntries(values));
}

/** Reused helper for normalize Trimmed String List behavior in src/shared. */
export function normalizeTrimmedStringList(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.flatMap((entry) => {
    const normalized = normalizeOptionalString(entry);
    return normalized ? [normalized] : [];
  });
}

/** Reused helper for normalize Unique Trimmed String List behavior in src/shared. */
export function normalizeUniqueTrimmedStringList(value: unknown): string[] {
  return uniqueStrings(normalizeTrimmedStringList(value));
}

/** Reused helper for normalize Sorted Unique Trimmed String List behavior in src/shared. */
export function normalizeSortedUniqueTrimmedStringList(value: unknown): string[] {
  return sortUniqueStrings(normalizeTrimmedStringList(value));
}

/** Reused helper for normalize Optional Trimmed String List behavior in src/shared. */
export function normalizeOptionalTrimmedStringList(value: unknown): string[] | undefined {
  const normalized = normalizeTrimmedStringList(value);
  return normalized.length > 0 ? normalized : undefined;
}

/** Reused helper for normalize Array Backed Trimmed String List behavior in src/shared. */
export function normalizeArrayBackedTrimmedStringList(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }
  return normalizeTrimmedStringList(value);
}

/** Reused helper for normalize Single Or Trimmed String List behavior in src/shared. */
export function normalizeSingleOrTrimmedStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return normalizeTrimmedStringList(value);
  }
  const normalized = normalizeOptionalString(value);
  return normalized ? [normalized] : [];
}

/** Reused helper for normalize Unique Single Or Trimmed String List behavior in src/shared. */
export function normalizeUniqueSingleOrTrimmedStringList(value: unknown): string[] {
  return uniqueStrings(normalizeSingleOrTrimmedStringList(value));
}

/** Reused helper for normalize Csv Or Loose String List behavior in src/shared. */
export function normalizeCsvOrLooseStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return normalizeStringEntries(value);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeSlugInput(raw?: string | null) {
  return (normalizeOptionalLowercaseString(raw) ?? "").normalize("NFC");
}

/** Reused helper for normalize Hyphen Slug behavior in src/shared. */
export function normalizeHyphenSlug(raw?: string | null) {
  const trimmed = normalizeSlugInput(raw);
  if (!trimmed) {
    return "";
  }
  const dashed = trimmed.replace(/\s+/g, "-");
  const cleaned = dashed.replace(/[^\p{L}\p{M}\p{N}#@._+-]+/gu, "-");
  return cleaned.replace(/-{2,}/g, "-").replace(/^[-.]+|[-.]+$/g, "");
}

/** Reused helper for normalize At Hash Slug behavior in src/shared. */
export function normalizeAtHashSlug(raw?: string | null) {
  const trimmed = normalizeSlugInput(raw);
  if (!trimmed) {
    return "";
  }
  const withoutPrefix = trimmed.replace(/^[@#]+/, "");
  const dashed = withoutPrefix.replace(/[\s_]+/g, "-");
  const cleaned = dashed.replace(/[^\p{L}\p{M}\p{N}-]+/gu, "-");
  return cleaned.replace(/-{2,}/g, "-").replace(/^-+|-+$/g, "");
}
