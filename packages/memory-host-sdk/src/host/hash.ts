// Stable SHA-256 hashing helper for memory files, chunks, and cache keys.
import crypto from "node:crypto";

/** Hashes text as lowercase SHA-256 hex. */
export function hashText(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}
