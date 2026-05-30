/** Builds external CLI auth discovery scopes for providers and config status. */
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { normalizeTrimmedStringList } from "../../shared/string-normalization.js";
import {
  resolveExternalCliAuthScopeFromConfig,
  type ExternalCliAuthScope,
} from "./external-cli-scope.js";

/** Scope describing when external CLI auth discovery is allowed. */
export type ExternalCliAuthDiscovery =
  | {
      mode: "none";
      allowKeychainPrompt?: false;
      config?: OpenClawConfig;
    }
  | {
      mode: "existing";
      allowKeychainPrompt?: boolean;
      config?: OpenClawConfig;
    }
  | {
      mode: "scoped";
      allowKeychainPrompt?: boolean;
      config?: OpenClawConfig;
      providerIds?: Iterable<string>;
      profileIds?: Iterable<string>;
    };

type ProviderAuthDiscoveryParams = {
  cfg?: OpenClawConfig;
  provider: string;
  profileId?: string;
  preferredProfile?: string;
  allowKeychainPrompt?: boolean;
};

type ConfigStatusDiscoveryParams = {
  cfg: OpenClawConfig;
  allowKeychainPrompt?: false;
};

type ProviderSetDiscoveryParams = {
  cfg?: OpenClawConfig;
  providers: Iterable<string>;
  allowKeychainPrompt?: false;
};

function normalizeStringList(values: Iterable<string | undefined>): string[] {
  return normalizeTrimmedStringList([...values]);
}

/** Disables external CLI auth discovery for a caller. */
export function externalCliDiscoveryNone(params?: {
  config?: OpenClawConfig;
}): ExternalCliAuthDiscovery {
  return {
    mode: "none",
    allowKeychainPrompt: false,
    ...(params?.config ? { config: params.config } : {}),
  };
}

/** Allows discovery against existing configured external CLI credentials. */
export function externalCliDiscoveryExisting(params?: {
  config?: OpenClawConfig;
  allowKeychainPrompt?: boolean;
}): ExternalCliAuthDiscovery {
  return {
    mode: "existing",
    ...(params?.allowKeychainPrompt !== undefined
      ? { allowKeychainPrompt: params.allowKeychainPrompt }
      : {}),
    ...(params?.config ? { config: params.config } : {}),
  };
}

/** Allows external CLI auth discovery for selected providers or profiles. */
export function externalCliDiscoveryScoped(params: {
  config?: OpenClawConfig;
  providerIds?: Iterable<string>;
  profileIds?: Iterable<string>;
  allowKeychainPrompt?: boolean;
}): ExternalCliAuthDiscovery {
  return {
    mode: "scoped",
    ...(params.allowKeychainPrompt !== undefined
      ? { allowKeychainPrompt: params.allowKeychainPrompt }
      : {}),
    ...(params.config ? { config: params.config } : {}),
    ...(params.providerIds ? { providerIds: params.providerIds } : {}),
    ...(params.profileIds ? { profileIds: params.profileIds } : {}),
  };
}

/** Builds CLI discovery scope for one provider auth lookup. */
export function externalCliDiscoveryForProviderAuth(
  params: ProviderAuthDiscoveryParams,
): ExternalCliAuthDiscovery {
  const profileIds = normalizeStringList([params.profileId, params.preferredProfile]);
  return externalCliDiscoveryScoped({
    config: params.cfg,
    allowKeychainPrompt: params.allowKeychainPrompt ?? false,
    providerIds: [params.provider],
    ...(profileIds.length > 0 ? { profileIds } : {}),
  });
}

/** Builds CLI discovery scope from config status surfaces. */
export function externalCliDiscoveryForConfigStatus(
  params: ConfigStatusDiscoveryParams,
): ExternalCliAuthDiscovery {
  const scope = resolveExternalCliAuthScopeFromConfig(params.cfg);
  return externalCliDiscoveryFromScope({
    cfg: params.cfg,
    scope,
    allowKeychainPrompt: params.allowKeychainPrompt ?? false,
  });
}

/** Builds CLI discovery scope for a set of provider ids. */
export function externalCliDiscoveryForProviders(
  params: ProviderSetDiscoveryParams,
): ExternalCliAuthDiscovery {
  const providers = normalizeStringList(params.providers);
  if (providers.length === 0) {
    return externalCliDiscoveryNone({ config: params.cfg });
  }
  return externalCliDiscoveryScoped({
    config: params.cfg,
    allowKeychainPrompt: params.allowKeychainPrompt ?? false,
    providerIds: providers,
  });
}

function externalCliDiscoveryFromScope(params: {
  cfg: OpenClawConfig;
  scope: ExternalCliAuthScope | undefined;
  allowKeychainPrompt: false;
}): ExternalCliAuthDiscovery {
  if (!params.scope) {
    return externalCliDiscoveryNone({ config: params.cfg });
  }
  return externalCliDiscoveryScoped({
    config: params.cfg,
    allowKeychainPrompt: params.allowKeychainPrompt,
    providerIds: params.scope.providerIds,
    profileIds: params.scope.profileIds,
  });
}
