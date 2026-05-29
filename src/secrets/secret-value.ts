// secrets secret value helpers and runtime behavior.
import { isNonEmptyString, isRecord } from "./shared.js";

/** Shared type for Secret Expected Resolved Value in src/secrets. */
export type SecretExpectedResolvedValue = "string" | "string-or-object"; // pragma: allowlist secret

/** Reused helper for is Expected Resolved Secret Value behavior in src/secrets. */
export function isExpectedResolvedSecretValue(
  value: unknown,
  expected: SecretExpectedResolvedValue,
): boolean {
  if (expected === "string") {
    return isNonEmptyString(value);
  }
  return isNonEmptyString(value) || isRecord(value);
}

/** Reused helper for has Configured Plaintext Secret Value behavior in src/secrets. */
export function hasConfiguredPlaintextSecretValue(
  value: unknown,
  expected: SecretExpectedResolvedValue,
): boolean {
  if (expected === "string") {
    return isNonEmptyString(value);
  }
  return isNonEmptyString(value) || (isRecord(value) && Object.keys(value).length > 0);
}

/** Reused helper for assert Expected Resolved Secret Value behavior in src/secrets. */
export function assertExpectedResolvedSecretValue(params: {
  value: unknown;
  expected: SecretExpectedResolvedValue;
  errorMessage: string;
}): void {
  if (!isExpectedResolvedSecretValue(params.value, params.expected)) {
    throw new Error(params.errorMessage);
  }
}
