// Shared types for plugins provider external auth types behavior.
import type { AuthProfileStore, OAuthCredential } from "../agents/auth-profiles/types.js";
import type { ModelProviderAuthMode, ModelProviderConfig } from "../config/types.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";

/** Shared type for Provider Resolve Synthetic Auth Context in src/plugins. */
export type ProviderResolveSyntheticAuthContext = {
  config?: OpenClawConfig;
  provider: string;
  providerConfig?: ModelProviderConfig;
};

/** Shared type for Provider Synthetic Auth Result in src/plugins. */
export type ProviderSyntheticAuthResult = {
  apiKey: string;
  source: string;
  mode: Exclude<ModelProviderAuthMode, "aws-sdk">;
  expiresAt?: number;
};

/** Shared type for Provider Resolve External Auth Profiles Context in src/plugins. */
export type ProviderResolveExternalAuthProfilesContext = {
  config?: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  env: NodeJS.ProcessEnv;
  store: AuthProfileStore;
};

/** Shared type for Provider Resolve External OAuth Profiles Context in src/plugins. */
export type ProviderResolveExternalOAuthProfilesContext =
  ProviderResolveExternalAuthProfilesContext;

/** Shared type for Provider External Auth Profile in src/plugins. */
export type ProviderExternalAuthProfile = {
  profileId: string;
  credential: OAuthCredential;
  persistence?: "runtime-only" | "persisted";
};

/** Shared type for Provider External OAuth Profile in src/plugins. */
export type ProviderExternalOAuthProfile = ProviderExternalAuthProfile;
