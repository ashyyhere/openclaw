/** Runtime SDK helpers for selecting configured or auto-selectable capability providers. */
import { normalizeOptionalString } from "../shared/string-coerce.js";

/** Provider shape that can participate in automatic selection. */
export type AutoSelectableProvider = {
  id: string;
  autoSelectOrder?: number;
};

/** Result of picking a configured provider or falling back to auto selection. */
export type ProviderSelection<TProvider> = {
  configuredProviderId?: string;
  missingConfiguredProvider: boolean;
  provider: TProvider | undefined;
};

/** Provider plus resolved config, or the precise reason no provider can serve the capability. */
export type ResolvedConfiguredProvider<TProvider, TConfig> =
  | {
      ok: true;
      configuredProviderId?: string;
      provider: TProvider;
      providerConfig: TConfig;
    }
  | {
      ok: false;
      code: "missing-configured-provider" | "no-registered-provider" | "provider-not-configured";
      configuredProviderId?: string;
      provider?: TProvider;
    };

/** Select the configured provider when present, otherwise the lowest auto-select order provider. */
export function selectConfiguredOrAutoProvider<TProvider extends AutoSelectableProvider>(params: {
  configuredProviderId?: string;
  getConfiguredProvider: (providerId: string | undefined) => TProvider | undefined;
  listProviders: () => Iterable<TProvider>;
}): ProviderSelection<TProvider> {
  const configuredProviderId = normalizeOptionalString(params.configuredProviderId);
  const configuredProvider = configuredProviderId
    ? params.getConfiguredProvider(configuredProviderId)
    : undefined;

  if (configuredProviderId && !configuredProvider) {
    return {
      configuredProviderId,
      missingConfiguredProvider: true,
      provider: undefined,
    };
  }

  return {
    configuredProviderId,
    missingConfiguredProvider: false,
    provider: configuredProvider ?? selectFirstAutoProvider(params.listProviders()),
  };
}

/** Merge canonical provider config with selected provider override config. */
export function resolveProviderRawConfig(params: {
  providerId: string;
  configuredProviderId?: string;
  providerConfigs?: Record<string, Record<string, unknown> | undefined>;
}): Record<string, unknown> {
  const canonicalProviderConfig = readProviderConfig(params.providerConfigs, params.providerId);
  const selectedProviderConfig = readProviderConfig(
    params.providerConfigs,
    params.configuredProviderId,
  );

  return {
    ...canonicalProviderConfig,
    ...selectedProviderConfig,
  };
}

/** Resolve a configured capability provider and validate that its provider config is usable. */
export function resolveConfiguredCapabilityProvider<
  TConfig,
  TFullConfig,
  TProvider extends AutoSelectableProvider,
>(params: {
  configuredProviderId?: string;
  providerConfigs?: Record<string, Record<string, unknown> | undefined>;
  cfg: TFullConfig | undefined;
  cfgForResolve: TFullConfig;
  getConfiguredProvider: (providerId: string | undefined) => TProvider | undefined;
  listProviders: () => Iterable<TProvider>;
  resolveProviderConfig: (params: {
    provider: TProvider;
    cfg: TFullConfig;
    rawConfig: Record<string, unknown>;
  }) => TConfig;
  isProviderConfigured: (params: {
    provider: TProvider;
    cfg: TFullConfig | undefined;
    providerConfig: TConfig;
  }) => boolean;
}): ResolvedConfiguredProvider<TProvider, TConfig> {
  const configuredProviderId = normalizeOptionalString(params.configuredProviderId);
  if (configuredProviderId) {
    const provider = params.getConfiguredProvider(configuredProviderId);
    if (!provider) {
      return {
        ok: false,
        code: "missing-configured-provider",
        configuredProviderId,
      };
    }

    return resolveProviderCandidate({
      ...params,
      configuredProviderId,
      provider,
    });
  }

  const providers = [...params.listProviders()].toSorted(compareProviderAutoSelectOrder);
  if (providers.length === 0) {
    return {
      ok: false,
      code: "no-registered-provider",
    };
  }

  let firstUnconfigured: TProvider | undefined;
  for (const provider of providers) {
    const resolution = resolveProviderCandidate({
      ...params,
      provider,
    });
    if (resolution.ok) {
      return resolution;
    }
    firstUnconfigured ??= provider;
  }

  return {
    ok: false,
    code: "provider-not-configured",
    provider: firstUnconfigured,
  };
}

function compareProviderAutoSelectOrder<TProvider extends AutoSelectableProvider>(
  left: TProvider,
  right: TProvider,
): number {
  return (
    (left.autoSelectOrder ?? Number.MAX_SAFE_INTEGER) -
    (right.autoSelectOrder ?? Number.MAX_SAFE_INTEGER)
  );
}

function selectFirstAutoProvider<TProvider extends AutoSelectableProvider>(
  providers: Iterable<TProvider>,
): TProvider | undefined {
  let selected: TProvider | undefined;
  for (const provider of providers) {
    if (!selected || compareProviderAutoSelectOrder(provider, selected) < 0) {
      selected = provider;
    }
  }
  return selected;
}

function readProviderConfig(
  providerConfigs: Record<string, Record<string, unknown> | undefined> | undefined,
  providerId: string | undefined,
): Record<string, unknown> | undefined {
  if (!providerId) {
    return undefined;
  }
  const providerConfig = providerConfigs?.[providerId];
  return providerConfig && typeof providerConfig === "object" ? providerConfig : undefined;
}

function resolveProviderCandidate<
  TConfig,
  TFullConfig,
  TProvider extends AutoSelectableProvider,
>(params: {
  configuredProviderId?: string;
  providerConfigs?: Record<string, Record<string, unknown> | undefined>;
  cfg: TFullConfig | undefined;
  cfgForResolve: TFullConfig;
  provider: TProvider;
  resolveProviderConfig: (params: {
    provider: TProvider;
    cfg: TFullConfig;
    rawConfig: Record<string, unknown>;
  }) => TConfig;
  isProviderConfigured: (params: {
    provider: TProvider;
    cfg: TFullConfig | undefined;
    providerConfig: TConfig;
  }) => boolean;
}): ResolvedConfiguredProvider<TProvider, TConfig> {
  const rawProviderConfig = resolveProviderRawConfig({
    providerId: params.provider.id,
    configuredProviderId: params.configuredProviderId,
    providerConfigs: params.providerConfigs,
  });
  const providerConfig = params.resolveProviderConfig({
    provider: params.provider,
    cfg: params.cfgForResolve,
    rawConfig: rawProviderConfig,
  });

  if (
    !params.isProviderConfigured({ provider: params.provider, cfg: params.cfg, providerConfig })
  ) {
    return {
      ok: false,
      code: "provider-not-configured",
      configuredProviderId: params.configuredProviderId,
      provider: params.provider,
    };
  }

  return {
    ok: true,
    configuredProviderId: params.configuredProviderId,
    provider: params.provider,
    providerConfig,
  };
}
