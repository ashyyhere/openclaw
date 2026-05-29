/** Typed readers for optional ACP metadata maps. */
import { normalizeOptionalString } from "../shared/string-coerce.js";

function readMetaValue<T>(
  meta: Record<string, unknown> | null | undefined,
  keys: string[],
  normalize: (value: unknown) => T | undefined,
): T | undefined {
  if (!meta) {
    return undefined;
  }
  for (const key of keys) {
    const normalized = normalize(meta[key]);
    if (normalized !== undefined) {
      return normalized;
    }
  }
  return undefined;
}

export function readString(
  meta: Record<string, unknown> | null | undefined,
  keys: string[],
): string | undefined {
  return readMetaValue(meta, keys, normalizeOptionalString);
}

/** Read the first boolean from a metadata record. */
export function readBool(
  meta: Record<string, unknown> | null | undefined,
  keys: string[],
): boolean | undefined {
  return readMetaValue(meta, keys, (value) => (typeof value === "boolean" ? value : undefined));
}

/** Read the first finite number from a metadata record. */
export function readNumber(
  meta: Record<string, unknown> | null | undefined,
  keys: string[],
): number | undefined {
  return readMetaValue(meta, keys, (value) =>
    typeof value === "number" && Number.isFinite(value) ? value : undefined,
  );
}

/** Read the first safe non-negative integer from a metadata record. */
export function readNonNegativeInteger(
  meta: Record<string, unknown> | null | undefined,
  keys: string[],
): number | undefined {
  return readMetaValue(meta, keys, (value) =>
    typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : undefined,
  );
}
