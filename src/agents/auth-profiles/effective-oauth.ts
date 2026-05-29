/** Resolves the effective OAuth credential from managed and fallback sources. */
import { readManagedExternalCliCredential } from "./external-cli-sync.js";
import { resolveEffectiveOAuthCredential as resolveManagedOAuthCredential } from "./oauth-manager.js";
import type { OAuthCredential } from "./types.js";

/** Reused helper for resolve Effective OAuth Credential behavior in src/agents/auth-profiles. */
export function resolveEffectiveOAuthCredential(params: {
  profileId: string;
  credential: OAuthCredential;
}): OAuthCredential {
  return resolveManagedOAuthCredential({
    profileId: params.profileId,
    credential: params.credential,
    readBootstrapCredential: ({ profileId, credential }) =>
      readManagedExternalCliCredential({
        profileId,
        credential,
      }),
  });
}
