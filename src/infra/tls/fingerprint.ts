// infra/tls fingerprint helpers and runtime behavior.
import { normalizeLowercaseStringOrEmpty } from "../../shared/string-coerce.js";

/** Reused helper for normalize Fingerprint behavior in src/infra/tls. */
export function normalizeFingerprint(input: string): string {
  const trimmed = input.trim();
  const withoutPrefix = trimmed.replace(/^sha-?256\s*:?\s*/i, "");
  return normalizeLowercaseStringOrEmpty(withoutPrefix.replace(/[^a-fA-F0-9]/g, ""));
}
