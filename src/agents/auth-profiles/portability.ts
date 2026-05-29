/** Decides which auth profile credentials are safe to copy between agents. */
import { AUTH_STORE_VERSION } from "./constants.js";
import type { AuthProfileCredential, AuthProfileSecretsStore, AuthProfileStore } from "./types.js";

/** Shared type for Auth Profile Portability Reason in src/agents/auth-profiles. */
export type AuthProfilePortabilityReason =
  | "portable-static-credential"
  | "non-portable-oauth-refresh-token"
  | "credential-opted-out"
  | "oauth-provider-opted-in";

/** Shared type for Auth Profile Portability in src/agents/auth-profiles. */
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

/** Reused helper for resolve Auth Profile Portability behavior in src/agents/auth-profiles. */
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

/** Reused helper for is Auth Profile Credential Portable For Agent Copy behavior in src/agents/auth-profiles. */
export function isAuthProfileCredentialPortableForAgentCopy(
  credential: AuthProfileCredential,
): boolean {
  return resolveAuthProfilePortability(credential).portable;
}

/** Reused helper for build Portable Auth Profile Secrets Store For Agent Copy behavior in src/agents/auth-profiles. */
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
