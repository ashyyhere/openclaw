/** Validates and normalizes CLI profile names. */
import { normalizeLowercaseStringOrEmpty } from "../shared/string-coerce.js";

const PROFILE_NAME_RE = /^[a-z0-9][a-z0-9_-]{0,63}$/i;

/** Reused helper for is Valid Profile Name behavior in src/cli. */
export function isValidProfileName(value: string): boolean {
  if (!value) {
    return false;
  }
  // Keep it path-safe + shell-friendly.
  return PROFILE_NAME_RE.test(value);
}

/** Reused helper for normalize Profile Name behavior in src/cli. */
export function normalizeProfileName(raw?: string | null): string | null {
  const profile = raw?.trim();
  if (!profile) {
    return null;
  }
  if (normalizeLowercaseStringOrEmpty(profile) === "default") {
    return null;
  }
  if (!isValidProfileName(profile)) {
    return null;
  }
  return profile;
}
