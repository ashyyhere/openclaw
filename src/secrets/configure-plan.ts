// secrets configure plan helpers and runtime behavior.
import { isDeepStrictEqual } from "node:util";
import type { AuthProfileStore } from "../agents/auth-profiles/types.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import {
  resolveSecretInputRef,
  type SecretProviderConfig,
  type SecretRef,
} from "../config/types.secrets.js";
import { parseConfigPathArrayIndex } from "../shared/path-array-index.js";
import type { SecretsApplyPlan } from "./plan.js";
import { isRecord } from "./shared.js";
import {
  discoverAuthProfileSecretTargets,
  discoverConfigSecretTargets,
} from "./target-registry.js";

/** Shared type for Configure Candidate in src/secrets. */
export type ConfigureCandidate = {
  type: string;
  path: string;
  pathSegments: string[];
  label: string;
  configFile: "openclaw.json" | "auth-profiles.json";
  expectedResolvedValue: "string" | "string-or-object";
  existingRef?: SecretRef;
  isDerived?: boolean;
  agentId?: string;
  providerId?: string;
  accountId?: string;
  authProfileProvider?: string;
};

/** Shared type for Configure Selected Target in src/secrets. */
export type ConfigureSelectedTarget = ConfigureCandidate & {
  ref: SecretRef;
};

/** Shared type for Configure Provider Changes in src/secrets. */
export type ConfigureProviderChanges = {
  upserts: Record<string, SecretProviderConfig>;
  deletes: string[];
};

function getSecretProviders(config: OpenClawConfig): Record<string, SecretProviderConfig> {
  if (!isRecord(config.secrets?.providers)) {
    return {};
  }
  return config.secrets.providers;
}

/** Reused helper for build Configure Candidates behavior in src/secrets. */
export function buildConfigureCandidates(config: OpenClawConfig): ConfigureCandidate[] {
  return buildConfigureCandidatesForScope({ config });
}

function configureCandidateSortKey(candidate: ConfigureCandidate): string {
  if (candidate.configFile === "auth-profiles.json") {
    const agentId = candidate.agentId ?? "";
    return `auth-profiles:${agentId}:${candidate.path}`;
  }
  return `openclaw:${candidate.path}`;
}

function resolveAuthProfileProvider(
  store: AuthProfileStore,
  pathSegments: string[],
): string | undefined {
  const profileId = pathSegments[1];
  if (!profileId) {
    return undefined;
  }
  const profile = store.profiles?.[profileId];
  if (!isRecord(profile) || typeof profile.provider !== "string") {
    return undefined;
  }
  const provider = profile.provider.trim();
  return provider.length > 0 ? provider : undefined;
}

/** Reused helper for build Configure Candidates For Scope behavior in src/secrets. */
export function buildConfigureCandidatesForScope(params: {
  config: OpenClawConfig;
  authoredOpenClawConfig?: OpenClawConfig;
  authProfiles?: {
    agentId: string;
    store: AuthProfileStore;
  };
}): ConfigureCandidate[] {
  const authoredConfig = params.authoredOpenClawConfig ?? params.config;

  const hasPathInAuthoredConfig = (pathSegments: string[]): boolean =>
    hasPath(authoredConfig, pathSegments);

  const openclawCandidates = discoverConfigSecretTargets(params.config)
    .filter((entry) => entry.entry.includeInConfigure)
    .map((entry) => {
      const resolved = resolveSecretInputRef({
        value: entry.value,
        refValue: entry.refValue,
        defaults: params.config.secrets?.defaults,
      });
      const pathExists = hasPathInAuthoredConfig(entry.pathSegments);
      const refPathExists = entry.refPathSegments
        ? hasPathInAuthoredConfig(entry.refPathSegments)
        : false;
      return Object.assign(
        {
          type: entry.entry.targetType,
          path: entry.path,
          pathSegments: [...entry.pathSegments],
          label: entry.path,
          configFile: `openclaw.json` as const,
          expectedResolvedValue: entry.entry.expectedResolvedValue,
        },
        resolved.ref ? { existingRef: resolved.ref } : {},
        pathExists || refPathExists ? {} : { isDerived: true },
        entry.providerId ? { providerId: entry.providerId } : {},
        entry.accountId ? { accountId: entry.accountId } : {},
      );
    });

  const authCandidates =
    params.authProfiles === undefined
      ? []
      : discoverAuthProfileSecretTargets(params.authProfiles.store)
          .filter((entry) => entry.entry.includeInConfigure)
          .map((entry) => {
            const authProfiles = params.authProfiles;
            if (!authProfiles) {
              throw new Error("Missing auth profile scope for configure candidate discovery.");
            }
            const authProfileProvider = resolveAuthProfileProvider(
              authProfiles.store,
              entry.pathSegments,
            );
            const resolved = resolveSecretInputRef({
              value: entry.value,
              refValue: entry.refValue,
              defaults: params.config.secrets?.defaults,
            });
            return Object.assign(
              {
                type: entry.entry.targetType,
                path: entry.path,
                pathSegments: [...entry.pathSegments],
                label: `${entry.path} (auth profile, agent ${authProfiles.agentId})`,
                configFile: `auth-profiles.json` as const,
                expectedResolvedValue: entry.entry.expectedResolvedValue,
              },
              resolved.ref ? { existingRef: resolved.ref } : {},
              { agentId: authProfiles.agentId },
              authProfileProvider ? { authProfileProvider } : {},
            );
          });

  return [...openclawCandidates, ...authCandidates].toSorted((a, b) =>
    configureCandidateSortKey(a).localeCompare(configureCandidateSortKey(b)),
  );
}

function hasPath(root: unknown, segments: string[]): boolean {
  if (segments.length === 0) {
    return false;
  }
  let cursor: unknown = root;
  for (let index = 0; index < segments.length; index += 1) {
    const segment = segments[index] ?? "";
    if (Array.isArray(cursor)) {
      const parsedIndex = parseConfigPathArrayIndex(segment);
      if (parsedIndex === undefined || parsedIndex >= cursor.length) {
        return false;
      }
      if (index === segments.length - 1) {
        return true;
      }
      cursor = cursor[parsedIndex];
      continue;
    }
    if (!isRecord(cursor)) {
      return false;
    }
    if (!Object.prototype.hasOwnProperty.call(cursor, segment)) {
      return false;
    }
    if (index === segments.length - 1) {
      return true;
    }
    cursor = cursor[segment];
  }
  return false;
}

/** Reused helper for collect Configure Provider Changes behavior in src/secrets. */
export function collectConfigureProviderChanges(params: {
  original: OpenClawConfig;
  next: OpenClawConfig;
}): ConfigureProviderChanges {
  const originalProviders = getSecretProviders(params.original);
  const nextProviders = getSecretProviders(params.next);

  const upserts: Record<string, SecretProviderConfig> = {};
  const deletes: string[] = [];

  for (const [providerAlias, nextProviderConfig] of Object.entries(nextProviders)) {
    const current = originalProviders[providerAlias];
    if (isDeepStrictEqual(current, nextProviderConfig)) {
      continue;
    }
    upserts[providerAlias] = structuredClone(nextProviderConfig);
  }

  for (const providerAlias of Object.keys(originalProviders)) {
    if (!Object.prototype.hasOwnProperty.call(nextProviders, providerAlias)) {
      deletes.push(providerAlias);
    }
  }

  return {
    upserts,
    deletes: deletes.toSorted(),
  };
}

/** Reused helper for has Configure Plan Changes behavior in src/secrets. */
export function hasConfigurePlanChanges(params: {
  selectedTargets: ReadonlyMap<string, ConfigureSelectedTarget>;
  providerChanges: ConfigureProviderChanges;
}): boolean {
  return (
    params.selectedTargets.size > 0 ||
    Object.keys(params.providerChanges.upserts).length > 0 ||
    params.providerChanges.deletes.length > 0
  );
}

/** Reused helper for build Secrets Configure Plan behavior in src/secrets. */
export function buildSecretsConfigurePlan(params: {
  selectedTargets: ReadonlyMap<string, ConfigureSelectedTarget>;
  providerChanges: ConfigureProviderChanges;
  generatedAt?: string;
}): SecretsApplyPlan {
  return {
    version: 1,
    protocolVersion: 1,
    generatedAt: params.generatedAt ?? new Date().toISOString(),
    generatedBy: "openclaw secrets configure",
    targets: [...params.selectedTargets.values()].map((entry) =>
      Object.assign(
        {
          type: entry.type,
          path: entry.path,
          pathSegments: [...entry.pathSegments],
          ref: entry.ref,
        },
        entry.agentId ? { agentId: entry.agentId } : {},
        entry.providerId ? { providerId: entry.providerId } : {},
        entry.accountId ? { accountId: entry.accountId } : {},
        entry.authProfileProvider ? { authProfileProvider: entry.authProfileProvider } : {},
      ),
    ),
    ...(Object.keys(params.providerChanges.upserts).length > 0
      ? { providerUpserts: params.providerChanges.upserts }
      : {}),
    ...(params.providerChanges.deletes.length > 0
      ? { providerDeletes: params.providerChanges.deletes }
      : {}),
    options: {
      scrubEnv: true,
      scrubAuthProfilesForProviderTargets: true,
      scrubLegacyAuthJson: true,
    },
  };
}
