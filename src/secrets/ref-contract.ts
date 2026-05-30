// Defines secret reference id, provider alias, and default-provider contracts.
import {
  DEFAULT_SECRET_PROVIDER_ALIAS,
  type SecretRef,
  type SecretRefSource,
} from "../config/types.secrets.js";

const FILE_SECRET_REF_SEGMENT_PATTERN = /^(?:[^~]|~0|~1)*$/;
/** Valid provider alias format for secret ref providers. */
export const SECRET_PROVIDER_ALIAS_PATTERN = /^[a-z][a-z0-9_-]{0,63}$/;
const EXEC_SECRET_REF_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/#-]{0,255}$/;

/** Reserved file-secret id for files that contain only one secret value. */
export const SINGLE_VALUE_FILE_REF_ID = "value";
/** JSON schema pattern requiring JSON-pointer file secret ids to be absolute. */
export const FILE_SECRET_REF_ID_ABSOLUTE_JSON_SCHEMA_PATTERN = "^/";
/** JSON schema pattern that rejects invalid JSON-pointer escape sequences. */
export const FILE_SECRET_REF_ID_INVALID_ESCAPE_JSON_SCHEMA_PATTERN = "~(?:[^01]|$)";
/** JSON schema pattern for exec-secret ids with path traversal segments excluded. */
export const EXEC_SECRET_REF_ID_JSON_SCHEMA_PATTERN =
  "^(?!.*(?:^|/)\\.{1,2}(?:/|$))[A-Za-z0-9][A-Za-z0-9._:/#-]{0,255}$";

/** Failure reason returned when an exec secret ref id is invalid. */
export type ExecSecretRefIdValidationReason = "pattern" | "traversal-segment";

/** Validation result for exec secret ref ids. */
export type ExecSecretRefIdValidationResult =
  | { ok: true }
  | {
      ok: false;
      reason: ExecSecretRefIdValidationReason;
    };

/** Minimal config shape needed to resolve default providers for secret refs. */
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

/** Builds a stable cache key for one secret ref. */
export function secretRefKey(ref: SecretRef): string {
  return `${ref.source}:${ref.provider}:${ref.id}`;
}

/** Resolves the provider alias used when a secret ref omits provider. */
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

/** Validates file secret ids, including JSON-pointer paths and single-value refs. */
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

/** Validates a secret provider alias. */
export function isValidSecretProviderAlias(value: string): boolean {
  return SECRET_PROVIDER_ALIAS_PATTERN.test(value);
}

/** Validates exec secret ids and reports pattern or traversal failures. */
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

/** Returns whether an exec secret ref id is valid. */
export function isValidExecSecretRefId(value: string): boolean {
  return validateExecSecretRefId(value).ok;
}

/** Formats the human validation message for invalid exec secret ref ids. */
export function formatExecSecretRefIdValidationMessage(): string {
  return [
    "Exec secret reference id must match /^[A-Za-z0-9][A-Za-z0-9._:/#-]{0,255}$/",
    'and must not include "." or ".." path segments',
    '(example: "vault/openai/api-key" or "aws/secret#json_key").',
  ].join(" ");
}
