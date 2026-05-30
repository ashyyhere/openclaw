// Normalizes package tag inputs relative to known package names.
import { normalizeOptionalString } from "../shared/string-coerce.js";

/** Returns the explicit tag portion from `pkg@tag`, or the raw tag when unqualified. */
export function normalizePackageTagInput(
  value: string | undefined | null,
  packageNames: readonly string[],
): string | null {
  const trimmed = normalizeOptionalString(value);
  if (!trimmed) {
    return null;
  }

  for (const packageName of packageNames) {
    if (trimmed === packageName) {
      return null;
    }
    const prefix = `${packageName}@`;
    if (trimmed.startsWith(prefix)) {
      const tag = trimmed.slice(prefix.length).trim();
      return tag ? tag : null;
    }
  }

  return trimmed;
}
