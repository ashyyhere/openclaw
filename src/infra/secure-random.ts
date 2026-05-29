// infra secure random helpers and runtime behavior.
import { randomBytes, randomInt, randomUUID } from "node:crypto";

/** Reused helper for generate Secure Uuid behavior in src/infra. */
export function generateSecureUuid(): string {
  return randomUUID();
}

/** Reused helper for generate Secure Token behavior in src/infra. */
export function generateSecureToken(bytes = 16): string {
  return randomBytes(bytes).toString("base64url");
}

/** Reused helper for generate Secure Hex behavior in src/infra. */
export function generateSecureHex(bytes = 16): string {
  return randomBytes(bytes).toString("hex");
}

/** Returns a cryptographically secure fraction in the range [0, 1). */
export function generateSecureFraction(): number {
  return randomBytes(4).readUInt32BE(0) / 0x1_0000_0000;
}

/** Reused helper for generate Secure Int behavior in src/infra. */
export function generateSecureInt(maxExclusive: number): number;
/** Reused helper for generate Secure Int behavior in src/infra. */
export function generateSecureInt(minInclusive: number, maxExclusive: number): number;
/** Reused helper for generate Secure Int behavior in src/infra. */
export function generateSecureInt(a: number, b?: number): number {
  return typeof b === "number" ? randomInt(a, b) : randomInt(a);
}
