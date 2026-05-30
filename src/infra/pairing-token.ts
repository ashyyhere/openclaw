// Generates and verifies operator pairing tokens.
import { randomBytes } from "node:crypto";
import { safeEqualSecret } from "../security/secret-equal.js";

/** Number of random bytes used for generated pairing tokens. */
export const PAIRING_TOKEN_BYTES = 32;

/** Generates a URL-safe random pairing token. */
export function generatePairingToken(): string {
  return randomBytes(PAIRING_TOKEN_BYTES).toString("base64url");
}

/** Compares provided and expected pairing tokens with constant-time equality. */
export function verifyPairingToken(provided: string, expected: string): boolean {
  if (provided.trim().length === 0 || expected.trim().length === 0) {
    return false;
  }
  return safeEqualSecret(provided, expected);
}
