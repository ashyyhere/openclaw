import { AUTH_STORE_VERSION } from "./constants.js";
import type { AuthProfileCredential, AuthProfileSecretsStore, AuthProfileStore } from "./types.js";

/** Reason an auth profile credential is or is not portable. */
export type AuthProfilePortabilityReason =
  | "portable-static-credential"
  | "non-portable-oauth-refresh-token"
  | "credential-opted-out"
  | "oauth-provider-opted-in";

/** Portability decision for copying a credential to another agent store. */
export type AuthProfilePortability = {
  portable: boolean;
  reason: AuthProfilePortabilityReason;
};

function hasAgentCopyOverride(credential: AuthProfileCredential): boolean | undefined {
  return typeof credential.copyToAgents === "boolean" ? credential.copyToAgents : undefined;
}

function hasCopyableOAuthMaterial(credential: AuthProfileCredential): boolean {
  if (credential.type !== "oauth") {
    return false;
  }
  return [credential.access, credential.refresh].some(
    (value) => typeof value === "string" && value.trim().length > 0,
  );
}

/** Resolves whether an auth profile credential can be copied to agents. */
export function resolveAuthProfilePortability(
  credential: AuthProfileCredential,
): AuthProfilePortability {
  const override = hasAgentCopyOverride(credential);
  if (override === false) {
    return { portable: false, reason: "credential-opted-out" };
  }
  if (credential.type === "oauth") {
    if (!hasCopyableOAuthMaterial(credential)) {
      return { portable: false, reason: "non-portable-oauth-refresh-token" };
    }
    return override === true
      ? { portable: true, reason: "oauth-provider-opted-in" }
      : { portable: false, reason: "non-portable-oauth-refresh-token" };
  }
  return { portable: true, reason: "portable-static-credential" };
}

/** Checks whether one credential can be copied to another agent store. */
export function isAuthProfileCredentialPortableForAgentCopy(
  credential: AuthProfileCredential,
): boolean {
  return resolveAuthProfilePortability(credential).portable;
}

/** Builds a secrets store containing only credentials portable to agents. */
export function buildPortableAuthProfileSecretsStoreForAgentCopy(store: AuthProfileStore): {
  store: AuthProfileSecretsStore;
  copiedProfileIds: string[];
  skippedProfileIds: string[];
} {
  const copiedProfileIds: string[] = [];
  const skippedProfileIds: string[] = [];
  const profiles = Object.fromEntries(
    Object.entries(store.profiles).flatMap(([profileId, credential]) => {
      if (!isAuthProfileCredentialPortableForAgentCopy(credential)) {
        skippedProfileIds.push(profileId);
        return [];
      }
      copiedProfileIds.push(profileId);
      return [[profileId, credential]];
    }),
  ) as AuthProfileSecretsStore["profiles"];

  return {
    store: { version: AUTH_STORE_VERSION, profiles },
    copiedProfileIds,
    skippedProfileIds,
  };
}
