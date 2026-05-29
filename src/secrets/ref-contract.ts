// secrets ref contract helpers and runtime behavior.
import {
  DEFAULT_SECRET_PROVIDER_ALIAS,
  type SecretRef,
  type SecretRefSource,
} from "../config/types.secrets.js";

const FILE_SECRET_REF_SEGMENT_PATTERN = /^(?:[^~]|~0|~1)*$/;
/** Reused constant for SECRET PROVIDER ALIAS PATTERN behavior in src/secrets. */
export const SECRET_PROVIDER_ALIAS_PATTERN = /^[a-z][a-z0-9_-]{0,63}$/;
const EXEC_SECRET_REF_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/#-]{0,255}$/;

/** Reused constant for SINGLE VALUE FILE REF ID behavior in src/secrets. */
export const SINGLE_VALUE_FILE_REF_ID = "value";
/** Reused constant for FILE SECRET REF ID ABSOLUTE JSON SCHEMA PATTERN behavior in src/secrets. */
export const FILE_SECRET_REF_ID_ABSOLUTE_JSON_SCHEMA_PATTERN = "^/";
/** Reused constant for FILE SECRET REF ID INVALID ESCAPE JSON SCHEMA PATTERN behavior in src/secrets. */
export const FILE_SECRET_REF_ID_INVALID_ESCAPE_JSON_SCHEMA_PATTERN = "~(?:[^01]|$)";
/** Reused constant for EXEC SECRET REF ID JSON SCHEMA PATTERN behavior in src/secrets. */
export const EXEC_SECRET_REF_ID_JSON_SCHEMA_PATTERN =
  "^(?!.*(?:^|/)\\.{1,2}(?:/|$))[A-Za-z0-9][A-Za-z0-9._:/#-]{0,255}$";

/** Shared type for Exec Secret Ref Id Validation Reason in src/secrets. */
export type ExecSecretRefIdValidationReason = "pattern" | "traversal-segment";

/** Shared type for Exec Secret Ref Id Validation Result in src/secrets. */
export type ExecSecretRefIdValidationResult =
  | { ok: true }
  | {
      ok: false;
      reason: ExecSecretRefIdValidationReason;
    };

/** Shared type for Secret Ref Defaults Carrier in src/secrets. */
export type SecretRefDefaultsCarrier = {
  secrets?: {
    defaults?: {
      env?: string;
      file?: string;
      exec?: string;
    };
    providers?: Record<string, { source?: string }>;
  };
};

/** Reused helper for secret Ref Key behavior in src/secrets. */
export function secretRefKey(ref: SecretRef): string {
  return `${ref.source}:${ref.provider}:${ref.id}`;
}

/** Reused helper for resolve Default Secret Provider Alias behavior in src/secrets. */
export function resolveDefaultSecretProviderAlias(
  config: SecretRefDefaultsCarrier,
  source: SecretRefSource,
  options?: { preferFirstProviderForSource?: boolean },
): string {
  const configured =
    source === "env"
      ? config.secrets?.defaults?.env
      : source === "file"
        ? config.secrets?.defaults?.file
        : config.secrets?.defaults?.exec;
  if (configured?.trim()) {
    return configured.trim();
  }

  if (options?.preferFirstProviderForSource) {
    const providers = config.secrets?.providers;
    if (providers) {
      for (const [providerName, provider] of Object.entries(providers)) {
        if (provider?.source === source) {
          return providerName;
        }
      }
    }
  }

  return DEFAULT_SECRET_PROVIDER_ALIAS;
}

/** Reused helper for is Valid File Secret Ref Id behavior in src/secrets. */
export function isValidFileSecretRefId(value: string): boolean {
  if (value === SINGLE_VALUE_FILE_REF_ID) {
    return true;
  }
  if (!value.startsWith("/")) {
    return false;
  }
  return value
    .slice(1)
    .split("/")
    .every((segment) => FILE_SECRET_REF_SEGMENT_PATTERN.test(segment));
}

/** Reused helper for is Valid Secret Provider Alias behavior in src/secrets. */
export function isValidSecretProviderAlias(value: string): boolean {
  return SECRET_PROVIDER_ALIAS_PATTERN.test(value);
}

/** Reused helper for validate Exec Secret Ref Id behavior in src/secrets. */
export function validateExecSecretRefId(value: string): ExecSecretRefIdValidationResult {
  if (!EXEC_SECRET_REF_ID_PATTERN.test(value)) {
    return { ok: false, reason: "pattern" };
  }
  for (const segment of value.split("/")) {
    if (segment === "." || segment === "..") {
      return { ok: false, reason: "traversal-segment" };
    }
  }
  return { ok: true };
}

/** Reused helper for is Valid Exec Secret Ref Id behavior in src/secrets. */
export function isValidExecSecretRefId(value: string): boolean {
  return validateExecSecretRefId(value).ok;
}

/** Reused helper for format Exec Secret Ref Id Validation Message behavior in src/secrets. */
export function formatExecSecretRefIdValidationMessage(): string {
  return [
    "Exec secret reference id must match /^[A-Za-z0-9][A-Za-z0-9._:/#-]{0,255}$/",
    'and must not include "." or ".." path segments',
    '(example: "vault/openai/api-key" or "aws/secret#json_key").',
  ].join(" ");
}
