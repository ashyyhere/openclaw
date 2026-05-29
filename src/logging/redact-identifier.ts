// Produces stable redacted hashes for identifiers that should not be logged raw.
import crypto from "node:crypto";
import { normalizeOptionalString } from "../shared/string-coerce.js";

/** Returns a bounded SHA-256 hex prefix for stable log correlation. */
export function sha256HexPrefix(value: string, len = 12): string {
  const safeLen = Number.isFinite(len) ? Math.max(1, Math.floor(len)) : 12;
  return crypto.createHash("sha256").update(value).digest("hex").slice(0, safeLen);
}

/** Redacts an identifier into a stable `sha256:<prefix>` marker. */
export function redactIdentifier(value: string | undefined, opts?: { len?: number }): string {
  const trimmed = normalizeOptionalString(value);
  if (!trimmed) {
    return "-";
  }
  return `sha256:${sha256HexPrefix(trimmed, opts?.len ?? 12)}`;
}
