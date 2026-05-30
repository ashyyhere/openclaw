/** Cryptographically secure random helpers for ids, tokens, hex, and ranges. */
import { randomBytes, randomInt, randomUUID } from "node:crypto";

/** Generate a random UUID using the platform crypto provider. */
export function generateSecureUuid(): string {
  return randomUUID();
}

/** Generate a URL-safe random token from secure bytes. */
export function generateSecureToken(bytes = 16): string {
  return randomBytes(bytes).toString("base64url");
}

/** Generate a hex-encoded random token from secure bytes. */
export function generateSecureHex(bytes = 16): string {
  return randomBytes(bytes).toString("hex");
}

/** Returns a cryptographically secure fraction in the range [0, 1). */
export function generateSecureFraction(): number {
  return randomBytes(4).readUInt32BE(0) / 0x1_0000_0000;
}

/** Generate a secure integer from 0 inclusive to max exclusive. */
export function generateSecureInt(maxExclusive: number): number;
/** Generate a secure integer from min inclusive to max exclusive. */
export function generateSecureInt(minInclusive: number, maxExclusive: number): number;
/** Generate a secure integer for the supported one- or two-bound overloads. */
export function generateSecureInt(a: number, b?: number): number {
  return typeof b === "number" ? randomInt(a, b) : randomInt(a);
}
