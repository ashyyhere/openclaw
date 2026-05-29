// logging redact identifier helpers and runtime behavior.
import crypto from "node:crypto";
import { normalizeOptionalString } from "../shared/string-coerce.js";

/** Reused helper for sha256 Hex Prefix behavior in src/logging. */
export function sha256HexPrefix(value: string, len = 12): string {
  const safeLen = Number.isFinite(len) ? Math.max(1, Math.floor(len)) : 12;
  return crypto.createHash("sha256").update(value).digest("hex").slice(0, safeLen);
}

/** Reused helper for redact Identifier behavior in src/logging. */
export function redactIdentifier(value: string | undefined, opts?: { len?: number }): string {
  const trimmed = normalizeOptionalString(value);
  if (!trimmed) {
    return "-";
  }
  return `sha256:${sha256HexPrefix(trimmed, opts?.len ?? 12)}`;
}
