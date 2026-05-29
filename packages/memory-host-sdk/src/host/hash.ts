// packages/memory-host-sdk/src/host hash helpers and runtime behavior.
import crypto from "node:crypto";

/** Public helper for hash Text behavior in packages/memory-host-sdk. */
export function hashText(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}
