/** Generates random setup tokens for command flows. */
import crypto from "node:crypto";

/** Reused helper for random Token behavior in src/commands. */
export function randomToken(): string {
  return crypto.randomBytes(24).toString("hex");
}
