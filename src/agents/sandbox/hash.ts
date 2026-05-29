/** Hash helper shared by sandbox config fingerprinting. */
import crypto from "node:crypto";

/** Returns a hex SHA-256 digest for stable config hashes. */
export function hashTextSha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}
