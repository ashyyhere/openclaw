// config dangerous name matching helpers and runtime behavior.
import { asBoolean } from "../utils/boolean.js";
import type { OpenClawConfig } from "./config.js";

type DangerousNameMatchingConfig = {
  dangerouslyAllowNameMatching?: boolean;
};

type ProviderDangerousNameMatchingScope = {
  prefix: string;
  account: Record<string, unknown>;
  dangerousNameMatchingEnabled: boolean;
  dangerousFlagPath: string;
};

type DangerousNameMatchingResolverInput = {
  providerConfig?: DangerousNameMatchingConfig | null | undefined;
  accountConfig?: DangerousNameMatchingConfig | null | undefined;
};

function asObjectRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

/** Reused helper for is Dangerous Name Matching Enabled behavior in src/config. */
export function isDangerousNameMatchingEnabled(
  config: DangerousNameMatchingConfig | null | undefined,
): boolean {
  return config?.dangerouslyAllowNameMatching === true;
}

/** Reused helper for resolve Dangerous Name Matching Enabled behavior in src/config. */
export function resolveDangerousNameMatchingEnabled(
  input: DangerousNameMatchingResolverInput,
): boolean {
  if (typeof input.accountConfig?.dangerouslyAllowNameMatching === "boolean") {
    return input.accountConfig.dangerouslyAllowNameMatching;
  }
  return isDangerousNameMatchingEnabled(input.providerConfig);
}

/** Reused helper for collect Provider Dangerous Name Matching Scopes behavior in src/config. */
export function collectProviderDangerousNameMatchingScopes(
  cfg: OpenClawConfig,
  provider: string,
): ProviderDangerousNameMatchingScope[] {
  const scopes: ProviderDangerousNameMatchingScope[] = [];
  const channels = asObjectRecord(cfg.channels);
  if (!channels) {
    return scopes;
  }

  const providerCfg = asObjectRecord(channels[provider]);
  if (!providerCfg) {
    return scopes;
  }

  const providerPrefix = `channels.${provider}`;
  const providerDangerousFlagPath = `${providerPrefix}.dangerouslyAllowNameMatching`;
  const providerDangerousNameMatchingEnabled = isDangerousNameMatchingEnabled(providerCfg);

  scopes.push({
    prefix: providerPrefix,
    account: providerCfg,
    dangerousNameMatchingEnabled: providerDangerousNameMatchingEnabled,
    dangerousFlagPath: providerDangerousFlagPath,
  });

  const accounts = asObjectRecord(providerCfg.accounts);
  if (!accounts) {
    return scopes;
  }

  for (const key of Object.keys(accounts)) {
    const account = asObjectRecord(accounts[key]);
    if (!account) {
      continue;
    }

    const accountPrefix = `${providerPrefix}.accounts.${key}`;
    const accountDangerousNameMatching = asBoolean(account.dangerouslyAllowNameMatching);

    scopes.push({
      prefix: accountPrefix,
      account,
      dangerousNameMatchingEnabled:
        accountDangerousNameMatching ?? providerDangerousNameMatchingEnabled,
      dangerousFlagPath:
        accountDangerousNameMatching == null
          ? providerDangerousFlagPath
          : `${accountPrefix}.dangerouslyAllowNameMatching`,
    });
  }

  return scopes;
}
