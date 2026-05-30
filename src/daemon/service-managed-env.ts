/** Tracks managed environment keys embedded in daemon service definitions. */
import { normalizeEnvVarKey } from "../infra/host-env-security.js";
import { sortUniqueStrings } from "../shared/string-normalization.js";
import type { GatewayServiceEnvironmentValueSource } from "./service-types.js";

const MANAGED_SERVICE_ENV_KEYS_VAR = "OPENCLAW_SERVICE_MANAGED_ENV_KEYS";

type ServiceEnvCommand = {
  environment?: Record<string, string | undefined>;
  environmentValueSources?: Record<string, GatewayServiceEnvironmentValueSource | undefined>;
} | null;

function normalizeServiceEnvKey(key: string): string | null {
  return normalizeEnvVarKey(key, { portable: true })?.toUpperCase() ?? null;
}

/** Checks whether a service env value is present inline in the service command. */
export function hasInlineEnvironmentSource(
  source: GatewayServiceEnvironmentValueSource | undefined,
): boolean {
  return source === undefined || source === "inline" || source === "inline-and-file";
}

/** Checks whether a service env value is sourced only from an env file. */
export function isEnvironmentFileOnlySource(
  source: GatewayServiceEnvironmentValueSource | undefined,
): boolean {
  return source === "file";
}

/** Checks whether a service env value is sourced from an env file. */
export function hasEnvironmentFileSource(
  source: GatewayServiceEnvironmentValueSource | undefined,
): boolean {
  return source === "file" || source === "inline-and-file";
}

function parseManagedServiceEnvKeys(value: string | undefined): Set<string> {
  const keys = new Set<string>();
  for (const entry of value?.split(",") ?? []) {
    const key = normalizeServiceEnvKey(entry.trim());
    if (key) {
      keys.add(key);
    }
  }
  return keys;
}

/** Formats managed service env keys into the tracking env var value. */
export function formatManagedServiceEnvKeys(
  managedEnvironment: Record<string, string | undefined>,
  options?: { omitKeys?: Iterable<string> },
): string | undefined {
  const omitKeys = new Set(
    [...(options?.omitKeys ?? [])].flatMap((key) => {
      const normalized = normalizeServiceEnvKey(key);
      return normalized ? [normalized] : [];
    }),
  );
  const keys = Object.keys(managedEnvironment)
    .flatMap((key) => {
      const normalized = normalizeServiceEnvKey(key);
      if (!normalized || omitKeys.has(normalized)) {
        return [];
      }
      return [normalized];
    })
    .toSorted();
  return keys.length > 0 ? keys.join(",") : undefined;
}

/** Reads the managed service env key set from a service environment map. */
export function readManagedServiceEnvKeysFromEnvironment(
  environment: Record<string, string | undefined> | undefined,
): Set<string> {
  if (!environment) {
    return new Set();
  }
  for (const [rawKey, rawValue] of Object.entries(environment)) {
    if (normalizeServiceEnvKey(rawKey) === MANAGED_SERVICE_ENV_KEYS_VAR) {
      return parseManagedServiceEnvKeys(rawValue);
    }
  }
  return new Set();
}

function deleteManagedServiceEnvKeys(
  environment: Record<string, string | undefined>,
  keys: Iterable<string>,
): void {
  const normalizedKeys = new Set(
    [...keys].flatMap((key) => {
      const normalized = normalizeServiceEnvKey(key);
      return normalized ? [normalized] : [];
    }),
  );
  if (normalizedKeys.size === 0) {
    return;
  }
  for (const rawKey of Object.keys(environment)) {
    const key = normalizeServiceEnvKey(rawKey);
    if (key && normalizedKeys.has(key)) {
      delete environment[rawKey];
    }
  }
}

/** Writes the managed service env tracking key after removing stale variants. */
export function writeManagedServiceEnvKeysToEnvironment(
  environment: Record<string, string | undefined>,
  value: string | undefined,
): void {
  if (!value) {
    return;
  }
  deleteManagedServiceEnvKeys(environment, parseManagedServiceEnvKeys(value));
  environment[MANAGED_SERVICE_ENV_KEYS_VAR] = value;
}

function readEnvironmentValueSource(
  command: ServiceEnvCommand,
  normalizedKey: string,
): GatewayServiceEnvironmentValueSource | undefined {
  for (const [rawKey, source] of Object.entries(command?.environmentValueSources ?? {})) {
    if (normalizeServiceEnvKey(rawKey) === normalizedKey) {
      return source;
    }
  }
  return undefined;
}

/** Lists managed env keys that are still stored inline in a service command. */
export function collectInlineManagedServiceEnvKeys(
  command: ServiceEnvCommand,
  expectedManagedKeys?: Iterable<string>,
): string[] {
  if (!command?.environment) {
    return [];
  }
  const managedKeys = parseManagedServiceEnvKeys(command.environment[MANAGED_SERVICE_ENV_KEYS_VAR]);
  for (const key of expectedManagedKeys ?? []) {
    const normalized = normalizeServiceEnvKey(key);
    if (normalized) {
      managedKeys.add(normalized);
    }
  }
  if (managedKeys.size === 0) {
    return [];
  }
  const inlineKeys: string[] = [];
  for (const [rawKey, value] of Object.entries(command.environment)) {
    if (typeof value !== "string" || !value.trim()) {
      continue;
    }
    const normalized = normalizeServiceEnvKey(rawKey);
    if (!normalized || !managedKeys.has(normalized)) {
      continue;
    }
    if (normalized === MANAGED_SERVICE_ENV_KEYS_VAR) {
      continue;
    }
    if (!hasInlineEnvironmentSource(readEnvironmentValueSource(command, normalized))) {
      continue;
    }
    inlineKeys.push(normalized);
  }
  return sortUniqueStrings(inlineKeys);
}
