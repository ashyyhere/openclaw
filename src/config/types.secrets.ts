// Secret input contracts and coercion helpers for env/file/exec SecretRef config.
import { isRecord } from "../utils.js";

/** Supported backing store families for configured secret references. */
export type SecretRefSource = "env" | "file" | "exec"; // pragma: allowlist secret

/**
 * Stable identifier for a secret in a configured source.
 * Examples:
 * - env source: provider "default", id "OPENAI_API_KEY"
 * - file source: provider "mounted-json", id "/providers/openai/apiKey"
 * - exec source: provider "vault", id "openai/api-key"
 */
export type SecretRef = {
  source: SecretRefSource;
  provider: string;
  id: string;
};

/** Secret-bearing config input; may be an inline value or unresolved reference. */
export type SecretInput = string | SecretRef;
/** Provider alias used when legacy or shorthand refs omit an explicit provider. */
export const DEFAULT_SECRET_PROVIDER_ALIAS = "default"; // pragma: allowlist secret
/** Allowed env-var id syntax for env-backed secret refs. */
export const ENV_SECRET_REF_ID_RE = /^[A-Z][A-Z0-9_]{0,127}$/;
/** Legacy inline marker for env secret refs. */
export const LEGACY_SECRETREF_ENV_MARKER_PREFIX = "secretref-env:"; // pragma: allowlist secret
/** Older env secret marker retained for config migration and parsing. */
export const LEGACY_DOUBLE_UNDERSCORE_ENV_MARKER_PREFIX = "__env__:"; // pragma: allowlist secret
const ENV_SECRET_TEMPLATE_RE = /^\$\{([A-Z][A-Z0-9_]{0,127})\}$/;
const ENV_SECRET_SHORTHAND_RE = /^\$([A-Z][A-Z0-9_]{0,127})$/;
/** Resolution mode for callers that either require a value or only inspect state. */
export type SecretInputStringResolutionMode = "strict" | "inspect";
/** Result of resolving a secret input to an inline string or unresolved ref state. */
export type SecretInputStringResolution =
  | { status: "available"; value: string; ref: null }
  | { status: "configured_unavailable"; value: undefined; ref: SecretRef }
  | { status: "missing"; value: undefined; ref: null };
type SecretDefaults = {
  env?: string;
  file?: string;
  exec?: string;
};

/** Returns whether a value is a valid env secret ref identifier. */
export function isValidEnvSecretRefId(value: string): boolean {
  return ENV_SECRET_REF_ID_RE.test(value);
}

/** Type guard for fully qualified SecretRef objects. */
export function isSecretRef(value: unknown): value is SecretRef {
  if (!isRecord(value)) {
    return false;
  }
  if (Object.keys(value).length !== 3) {
    return false;
  }
  return (
    (value.source === "env" || value.source === "file" || value.source === "exec") &&
    typeof value.provider === "string" &&
    value.provider.trim().length > 0 &&
    typeof value.id === "string" &&
    value.id.trim().length > 0
  );
}

function isLegacySecretRefWithoutProvider(
  value: unknown,
): value is { source: SecretRefSource; id: string } {
  if (!isRecord(value)) {
    return false;
  }
  return (
    (value.source === "env" || value.source === "file" || value.source === "exec") &&
    typeof value.id === "string" &&
    value.id.trim().length > 0 &&
    value.provider === undefined
  );
}

/** Parses `$ENV_NAME` and `${ENV_NAME}` shorthand into env SecretRefs. */
export function parseEnvTemplateSecretRef(
  value: unknown,
  provider = DEFAULT_SECRET_PROVIDER_ALIAS,
): SecretRef | null {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  const match = ENV_SECRET_TEMPLATE_RE.exec(trimmed) ?? ENV_SECRET_SHORTHAND_RE.exec(trimmed);
  if (!match) {
    return null;
  }
  return {
    source: "env",
    provider: provider.trim() || DEFAULT_SECRET_PROVIDER_ALIAS,
    id: match[1],
  };
}

/** Parses legacy env marker strings into env SecretRefs. */
export function parseLegacySecretRefEnvMarker(
  value: unknown,
  provider = DEFAULT_SECRET_PROVIDER_ALIAS,
): SecretRef | null {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  const prefix = trimmed.startsWith(LEGACY_SECRETREF_ENV_MARKER_PREFIX)
    ? LEGACY_SECRETREF_ENV_MARKER_PREFIX
    : trimmed.startsWith(LEGACY_DOUBLE_UNDERSCORE_ENV_MARKER_PREFIX)
      ? LEGACY_DOUBLE_UNDERSCORE_ENV_MARKER_PREFIX
      : undefined;
  if (!prefix) {
    return null;
  }
  const id = trimmed.slice(prefix.length);
  if (!ENV_SECRET_REF_ID_RE.test(id)) {
    return null;
  }
  return {
    source: "env",
    provider: provider.trim() || DEFAULT_SECRET_PROVIDER_ALIAS,
    id,
  };
}

/** Coerces supported legacy, shorthand, and object shapes into a SecretRef. */
export function coerceSecretRef(value: unknown, defaults?: SecretDefaults): SecretRef | null {
  if (isSecretRef(value)) {
    return value;
  }
  const legacyEnvMarker = parseLegacySecretRefEnvMarker(value, defaults?.env);
  if (legacyEnvMarker) {
    return legacyEnvMarker;
  }
  if (isLegacySecretRefWithoutProvider(value)) {
    const provider =
      value.source === "env"
        ? (defaults?.env ?? DEFAULT_SECRET_PROVIDER_ALIAS)
        : value.source === "file"
          ? (defaults?.file ?? DEFAULT_SECRET_PROVIDER_ALIAS)
          : (defaults?.exec ?? DEFAULT_SECRET_PROVIDER_ALIAS);
    return {
      source: value.source,
      provider,
      id: value.id,
    };
  }
  const envTemplate = parseEnvTemplateSecretRef(value, defaults?.env);
  if (envTemplate) {
    return envTemplate;
  }
  return null;
}

/** Returns whether config contains either an inline secret value or a SecretRef. */
export function hasConfiguredSecretInput(value: unknown, defaults?: SecretDefaults): boolean {
  if (normalizeSecretInputString(value)) {
    return true;
  }
  return coerceSecretRef(value, defaults) !== null;
}

/** Normalizes non-empty inline secret strings without resolving SecretRefs. */
export function normalizeSecretInputString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function formatSecretRefLabel(ref: SecretRef): string {
  return `${ref.source}:${ref.provider}:${ref.id}`;
}

function createUnresolvedSecretInputError(params: { path: string; ref: SecretRef }): Error {
  return new Error(
    `${params.path}: unresolved SecretRef "${formatSecretRefLabel(params.ref)}". Resolve this command against an active gateway runtime snapshot before reading it.`,
  );
}

/** Throws when a secret input still contains an unresolved SecretRef. */
export function assertSecretInputResolved(params: {
  value: unknown;
  refValue?: unknown;
  defaults?: SecretDefaults;
  path: string;
}): void {
  const { ref } = resolveSecretInputRef({
    value: params.value,
    refValue: params.refValue,
    defaults: params.defaults,
  });
  if (!ref) {
    return;
  }
  throw createUnresolvedSecretInputError({ path: params.path, ref });
}

/** Resolves inline secret strings or reports unresolved SecretRefs by mode. */
export function resolveSecretInputString(params: {
  value: unknown;
  refValue?: unknown;
  defaults?: SecretDefaults;
  path: string;
  mode?: SecretInputStringResolutionMode;
}): SecretInputStringResolution {
  const normalized = normalizeSecretInputString(params.value);
  if (normalized) {
    return {
      status: "available",
      value: normalized,
      ref: null,
    };
  }
  const { ref } = resolveSecretInputRef({
    value: params.value,
    refValue: params.refValue,
    defaults: params.defaults,
  });
  if (!ref) {
    return {
      status: "missing",
      value: undefined,
      ref: null,
    };
  }
  if ((params.mode ?? "strict") === "strict") {
    throw createUnresolvedSecretInputError({ path: params.path, ref });
  }
  return {
    status: "configured_unavailable",
    value: undefined,
    ref,
  };
}

/** Resolves a secret input in strict mode and returns only available strings. */
export function normalizeResolvedSecretInputString(params: {
  value: unknown;
  refValue?: unknown;
  defaults?: SecretDefaults;
  path: string;
}): string | undefined {
  const resolved = resolveSecretInputString({
    ...params,
    mode: "strict",
  });
  if (resolved.status === "available") {
    return resolved.value;
  }
  return undefined;
}

/** Resolves explicit ref fields before inline shorthand refs. */
export function resolveSecretInputRef(params: {
  value: unknown;
  refValue?: unknown;
  defaults?: SecretDefaults;
}): {
  explicitRef: SecretRef | null;
  inlineRef: SecretRef | null;
  ref: SecretRef | null;
} {
  const explicitRef = coerceSecretRef(params.refValue, params.defaults);
  const inlineRef = explicitRef ? null : coerceSecretRef(params.value, params.defaults);
  return {
    explicitRef,
    inlineRef,
    ref: explicitRef ?? inlineRef,
  };
}

/** Env-backed secret provider configuration. */
export type EnvSecretProviderConfig = {
  source: "env";
  /** Optional env var allowlist (exact names). */
  allowlist?: string[];
};

/** File-backed secret provider parsing mode. */
export type FileSecretProviderMode = "singleValue" | "json"; // pragma: allowlist secret

/** File-backed secret provider configuration and read limits. */
export type FileSecretProviderConfig = {
  source: "file";
  path: string;
  mode?: FileSecretProviderMode;
  timeoutMs?: number;
  maxBytes?: number;
  allowInsecurePath?: boolean;
};

export type ManualExecSecretProviderConfig = {
  source: "exec";
  command: string;
  args?: string[];
  timeoutMs?: number;
  noOutputTimeoutMs?: number;
  maxOutputBytes?: number;
  jsonOnly?: boolean;
  env?: Record<string, string>;
  passEnv?: string[];
  trustedDirs?: string[];
  allowInsecurePath?: boolean;
  allowSymlinkCommand?: boolean;
};

export type PluginIntegrationSecretProviderConfig = {
  source: "exec";
  pluginIntegration: {
    pluginId: string;
    integrationId: string;
  };
};

export type ExecSecretProviderConfig =
  | ManualExecSecretProviderConfig
  | PluginIntegrationSecretProviderConfig;

export type SecretProviderConfig =
  | EnvSecretProviderConfig
  | FileSecretProviderConfig
  | ExecSecretProviderConfig;

/** Top-level secret provider defaults and resolution limits. */
export type SecretsConfig = {
  providers?: Record<string, SecretProviderConfig>;
  defaults?: {
    env?: string;
    file?: string;
    exec?: string;
  };
  resolution?: {
    maxProviderConcurrency?: number;
    maxRefsPerProvider?: number;
    maxBatchBytes?: number;
  };
};
