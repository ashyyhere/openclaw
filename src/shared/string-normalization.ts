// Shared string-list, uniqueness, sorting, and slug normalization helpers.
import { normalizeOptionalLowercaseString, normalizeOptionalString } from "./string-coerce.js";

/** Trims/coerces unknown list entries and drops empty strings. */
export function normalizeStringEntries(list?: ReadonlyArray<unknown>) {
  return (list ?? []).map((entry) => normalizeOptionalString(String(entry)) ?? "").filter(Boolean);
}

/** Normalizes list entries to lowercase trimmed strings. */
export function normalizeStringEntriesLower(list?: ReadonlyArray<unknown>) {
  return normalizeStringEntries(list).map((entry) => normalizeOptionalLowercaseString(entry) ?? "");
}

/** Preserves first-seen order while removing duplicate values. */
export function uniqueValues<T>(values: Iterable<T>): T[] {
  return [...new Set(values)];
}

/** Preserves first-seen order while removing duplicate strings. */
export function uniqueStrings(values: Iterable<string>): string[] {
  return uniqueValues(values);
}

/** Deduplicates strings, then returns them in stable lexicographic order. */
export function sortUniqueStrings(values: Iterable<string>): string[] {
  return uniqueStrings(values).toSorted((left, right) =>
    left < right ? -1 : left > right ? 1 : 0,
  );
}

/** Normalizes unknown entries to unique non-empty strings. */
export function normalizeUniqueStringEntries(values?: Iterable<unknown>): string[] {
  return uniqueStrings(normalizeStringEntries(values ? [...values] : undefined));
}

/** Normalizes unknown entries to unique lowercase non-empty strings. */
export function normalizeUniqueStringEntriesLower(values?: Iterable<unknown>): string[] {
  return uniqueStrings(
    normalizeStringEntriesLower(values ? [...values] : undefined).filter(Boolean),
  );
}

/** Normalizes unknown entries to sorted unique non-empty strings. */
export function normalizeSortedUniqueStringEntries(values?: Iterable<unknown>): string[] {
  return sortUniqueStrings(normalizeUniqueStringEntries(values));
}

/** Accepts only arrays and returns trimmed non-empty string values. */
export function normalizeTrimmedStringList(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.flatMap((entry) => {
    const normalized = normalizeOptionalString(entry);
    return normalized ? [normalized] : [];
  });
}

/** Normalizes an array-backed string list and removes duplicates. */
export function normalizeUniqueTrimmedStringList(value: unknown): string[] {
  return uniqueStrings(normalizeTrimmedStringList(value));
}

/** Normalizes an array-backed string list to sorted unique values. */
export function normalizeSortedUniqueTrimmedStringList(value: unknown): string[] {
  return sortUniqueStrings(normalizeTrimmedStringList(value));
}

/** Returns a normalized string list only when at least one value remains. */
export function normalizeOptionalTrimmedStringList(value: unknown): string[] | undefined {
  const normalized = normalizeTrimmedStringList(value);
  return normalized.length > 0 ? normalized : undefined;
}

/** Distinguishes missing/non-array input from an explicitly empty array. */
export function normalizeArrayBackedTrimmedStringList(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }
  return normalizeTrimmedStringList(value);
}

/** Accepts either one scalar string-like value or an array-backed list. */
export function normalizeSingleOrTrimmedStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return normalizeTrimmedStringList(value);
  }
  const normalized = normalizeOptionalString(value);
  return normalized ? [normalized] : [];
}

/** Normalizes scalar-or-array input and removes duplicate values. */
export function normalizeUniqueSingleOrTrimmedStringList(value: unknown): string[] {
  return uniqueStrings(normalizeSingleOrTrimmedStringList(value));
}

/** Accepts arrays or comma-separated strings as loose string-list input. */
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

/** Builds a lowercase NFC slug that keeps letters, numbers, and common symbols. */
export function normalizeHyphenSlug(raw?: string | null) {
  const trimmed = normalizeSlugInput(raw);
  if (!trimmed) {
    return "";
  }
  const dashed = trimmed.replace(/\s+/g, "-");
  const cleaned = dashed.replace(/[^\p{L}\p{M}\p{N}#@._+-]+/gu, "-");
  return cleaned.replace(/-{2,}/g, "-").replace(/^[-.]+|[-.]+$/g, "");
}

/** Builds a lowercase hashtag/handle-style slug without leading @ or #. */
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
