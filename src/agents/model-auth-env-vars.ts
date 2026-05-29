/** Provider auth env-var lookup wrappers used by model auth. */
import {
  listKnownProviderAuthEnvVarNames,
  resolveProviderAuthEvidence,
  resolveProviderAuthEnvVarCandidates,
  resolveProviderAuthLookupMaps,
} from "../secrets/provider-env-vars.js";
import type {
  ProviderAuthEvidence,
  ProviderAuthLookupMaps,
  ProviderEnvVarLookupParams,
} from "../secrets/provider-env-vars.js";

/** Resolve provider-to-env-var candidate map. */
export function resolveProviderEnvApiKeyCandidates(
  params?: ProviderEnvVarLookupParams,
): Record<string, readonly string[]> {
  return resolveProviderAuthEnvVarCandidates(params);
}

/** Resolve provider auth evidence entries. */
export function resolveProviderEnvAuthEvidence(
  params?: ProviderEnvVarLookupParams,
): Record<string, readonly ProviderAuthEvidence[]> {
  return resolveProviderAuthEvidence(params);
}

/** Resolve env candidate and auth-evidence lookup maps. */
export function resolveProviderEnvAuthLookupMaps(
  params?: ProviderEnvVarLookupParams,
): ProviderAuthLookupMaps {
  return resolveProviderAuthLookupMaps(params);
}

/** List all provider keys represented in env auth lookup maps. */
export function listProviderEnvAuthLookupKeys(params: {
  envCandidateMap: Readonly<Record<string, readonly string[]>>;
  authEvidenceMap: Readonly<Record<string, readonly ProviderAuthEvidence[]>>;
}): string[] {
  return Array.from(
    new Set([...Object.keys(params.envCandidateMap), ...Object.keys(params.authEvidenceMap)]),
  ).toSorted((a, b) => a.localeCompare(b));
}

/** Resolve sorted provider keys represented by env auth lookup maps. */
export function resolveProviderEnvAuthLookupKeys(params?: ProviderEnvVarLookupParams): string[] {
  const lookupMaps = resolveProviderEnvAuthLookupMaps(params);
  return listProviderEnvAuthLookupKeys({
    envCandidateMap: lookupMaps.envCandidateMap,
    authEvidenceMap: lookupMaps.authEvidenceMap,
  });
}

/** List known provider API key env var names. */
export function listKnownProviderEnvApiKeyNames(): string[] {
  return listKnownProviderAuthEnvVarNames();
}
