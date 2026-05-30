// Normalizes TLS SHA-256 fingerprints for comparison.
import { normalizeLowercaseStringOrEmpty } from "../../shared/string-coerce.js";

/** Strips SHA-256 prefixes/separators and lowercases the hex fingerprint. */
export function normalizeFingerprint(input: string): string {
  const trimmed = input.trim();
  const withoutPrefix = trimmed.replace(/^sha-?256\s*:?\s*/i, "");
  return normalizeLowercaseStringOrEmpty(withoutPrefix.replace(/[^a-fA-F0-9]/g, ""));
}
