// infra pairing token helpers and runtime behavior.
import { randomBytes } from "node:crypto";
import { safeEqualSecret } from "../security/secret-equal.js";

/** Reused constant for PAIRING TOKEN BYTES behavior in src/infra. */
export const PAIRING_TOKEN_BYTES = 32;

/** Reused helper for generate Pairing Token behavior in src/infra. */
export function generatePairingToken(): string {
  return randomBytes(PAIRING_TOKEN_BYTES).toString("base64url");
}

/** Reused helper for verify Pairing Token behavior in src/infra. */
export function verifyPairingToken(provided: string, expected: string): boolean {
  if (provided.trim().length === 0 || expected.trim().length === 0) {
    return false;
  }
  return safeEqualSecret(provided, expected);
}
