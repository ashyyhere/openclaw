// Channel secret assignment helpers shared by resolvers. They walk top-level and
// account-scoped config surfaces while preserving active/inactive diagnostics.
import { coerceSecretRef } from "../config/types.secrets.js";
import {
  collectSecretInputAssignment,
  hasOwnProperty,
  isChannelAccountEffectivelyEnabled,
  isEnabledFlag,
  type ResolverContext,
  type SecretDefaults,
} from "./runtime-shared.js";
import { isRecord } from "./shared.js";

/** Normalized channel account config plus its effective enabled state. */
export type ChannelAccountEntry = {
  accountId: string;
  account: Record<string, unknown>;
  enabled: boolean;
};

/** Top-level channel/account view used by secret assignment collectors. */
export type ChannelAccountSurface = {
  hasExplicitAccounts: boolean;
  channelEnabled: boolean;
  accounts: ChannelAccountEntry[];
};

/** Predicate used to decide whether an account-scoped secret field is active. */
export type ChannelAccountPredicate = (entry: ChannelAccountEntry) => boolean;

/** Reads one channel config object when present and record-shaped. */
export function getChannelRecord(
  config: { channels?: Record<string, unknown> },
  channelKey: string,
): Record<string, unknown> | undefined {
  const channels = config.channels;
  if (!isRecord(channels)) {
    return undefined;
  }
  const channel = channels[channelKey];
  return isRecord(channel) ? channel : undefined;
}

/** Reads a channel and builds its normalized account surface. */
export function getChannelSurface(
  config: { channels?: Record<string, unknown> },
  channelKey: string,
): { channel: Record<string, unknown>; surface: ChannelAccountSurface } | null {
  const channel = getChannelRecord(config, channelKey);
  if (!channel) {
    return null;
  }
  return {
    channel,
    surface: resolveChannelAccountSurface(channel),
  };
}

/** Normalizes top-level versus explicit account channel config into entries. */
export function resolveChannelAccountSurface(
  channel: Record<string, unknown>,
): ChannelAccountSurface {
  const channelEnabled = isEnabledFlag(channel);
  const accounts = channel.accounts;
  if (!isRecord(accounts) || Object.keys(accounts).length === 0) {
    return {
      hasExplicitAccounts: false,
      channelEnabled,
      accounts: [{ accountId: "default", account: channel, enabled: channelEnabled }],
    };
  }
  const accountEntries: ChannelAccountEntry[] = [];
  for (const [accountId, account] of Object.entries(accounts)) {
    if (!isRecord(account)) {
      continue;
    }
    accountEntries.push({
      accountId,
      account,
      enabled: isChannelAccountEffectivelyEnabled(channel, account),
    });
  }
  return {
    hasExplicitAccounts: true,
    channelEnabled,
    accounts: accountEntries,
  };
}

/** Decides whether a top-level field is active or inherited by enabled accounts. */
export function isBaseFieldActiveForChannelSurface(
  surface: ChannelAccountSurface,
  rootKey: string,
): boolean {
  if (!surface.channelEnabled) {
    return false;
  }
  if (!surface.hasExplicitAccounts) {
    return true;
  }
  return surface.accounts.some(
    ({ account, enabled }) => enabled && !hasOwnProperty(account, rootKey),
  );
}

/** Trims configured string secrets while treating non-strings as absent. */
export function normalizeSecretStringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/** Detects whether a raw config value contains a usable literal or SecretRef. */
export function hasConfiguredSecretInputValue(
  value: unknown,
  defaults: SecretDefaults | undefined,
): boolean {
  return normalizeSecretStringValue(value).length > 0 || coerceSecretRef(value, defaults) !== null;
}

/** Collects a simple string secret from top-level and account channel fields. */
export function collectSimpleChannelFieldAssignments(params: {
  channelKey: string;
  field: string;
  channel: Record<string, unknown>;
  surface: ChannelAccountSurface;
  defaults: SecretDefaults | undefined;
  context: ResolverContext;
  topInactiveReason: string;
  accountInactiveReason: string;
}): void {
  collectSecretInputAssignment({
    value: params.channel[params.field],
    path: `channels.${params.channelKey}.${params.field}`,
    expected: "string",
    defaults: params.defaults,
    context: params.context,
    active: isBaseFieldActiveForChannelSurface(params.surface, params.field),
    inactiveReason: params.topInactiveReason,
    apply: (value) => {
      params.channel[params.field] = value;
    },
  });
  if (!params.surface.hasExplicitAccounts) {
    return;
  }
  for (const { accountId, account, enabled } of params.surface.accounts) {
    if (!hasOwnProperty(account, params.field)) {
      continue;
    }
    collectSecretInputAssignment({
      value: account[params.field],
      path: `channels.${params.channelKey}.accounts.${accountId}.${params.field}`,
      expected: "string",
      defaults: params.defaults,
      context: params.context,
      active: enabled,
      inactiveReason: params.accountInactiveReason,
      apply: (value) => {
        account[params.field] = value;
      },
    });
  }
}

function isConditionalTopLevelFieldActive(params: {
  surface: ChannelAccountSurface;
  activeWithoutAccounts: boolean;
  inheritedAccountActive: ChannelAccountPredicate;
}): boolean {
  if (!params.surface.channelEnabled) {
    return false;
  }
  if (!params.surface.hasExplicitAccounts) {
    return params.activeWithoutAccounts;
  }
  return params.surface.accounts.some(params.inheritedAccountActive);
}

/** Collects a string secret whose active state depends on channel/account rules. */
export function collectConditionalChannelFieldAssignments(params: {
  channelKey: string;
  field: string;
  channel: Record<string, unknown>;
  surface: ChannelAccountSurface;
  defaults: SecretDefaults | undefined;
  context: ResolverContext;
  topLevelActiveWithoutAccounts: boolean;
  topLevelInheritedAccountActive: ChannelAccountPredicate;
  accountActive: ChannelAccountPredicate;
  topInactiveReason: string;
  accountInactiveReason: string | ((entry: ChannelAccountEntry) => string);
}): void {
  collectSecretInputAssignment({
    value: params.channel[params.field],
    path: `channels.${params.channelKey}.${params.field}`,
    expected: "string",
    defaults: params.defaults,
    context: params.context,
    active: isConditionalTopLevelFieldActive({
      surface: params.surface,
      activeWithoutAccounts: params.topLevelActiveWithoutAccounts,
      inheritedAccountActive: params.topLevelInheritedAccountActive,
    }),
    inactiveReason: params.topInactiveReason,
    apply: (value) => {
      params.channel[params.field] = value;
    },
  });
  if (!params.surface.hasExplicitAccounts) {
    return;
  }
  for (const entry of params.surface.accounts) {
    if (!hasOwnProperty(entry.account, params.field)) {
      continue;
    }
    collectSecretInputAssignment({
      value: entry.account[params.field],
      path: `channels.${params.channelKey}.accounts.${entry.accountId}.${params.field}`,
      expected: "string",
      defaults: params.defaults,
      context: params.context,
      active: params.accountActive(entry),
      inactiveReason:
        typeof params.accountInactiveReason === "function"
          ? params.accountInactiveReason(entry)
          : params.accountInactiveReason,
      apply: (value) => {
        entry.account[params.field] = value;
      },
    });
  }
}

/** Collects a nested string secret from top-level and account channel objects. */
export function collectNestedChannelFieldAssignments(params: {
  channelKey: string;
  nestedKey: string;
  field: string;
  channel: Record<string, unknown>;
  surface: ChannelAccountSurface;
  defaults: SecretDefaults | undefined;
  context: ResolverContext;
  topLevelActive: boolean;
  topInactiveReason: string;
  accountActive: ChannelAccountPredicate;
  accountInactiveReason: string | ((entry: ChannelAccountEntry) => string);
}): void {
  const topLevelNested = params.channel[params.nestedKey];
  if (isRecord(topLevelNested)) {
    collectSecretInputAssignment({
      value: topLevelNested[params.field],
      path: `channels.${params.channelKey}.${params.nestedKey}.${params.field}`,
      expected: "string",
      defaults: params.defaults,
      context: params.context,
      active: params.topLevelActive,
      inactiveReason: params.topInactiveReason,
      apply: (value) => {
        topLevelNested[params.field] = value;
      },
    });
  }
  if (!params.surface.hasExplicitAccounts) {
    return;
  }
  for (const entry of params.surface.accounts) {
    const nested = entry.account[params.nestedKey];
    if (!isRecord(nested)) {
      continue;
    }
    collectSecretInputAssignment({
      value: nested[params.field],
      path: `channels.${params.channelKey}.accounts.${entry.accountId}.${params.nestedKey}.${params.field}`,
      expected: "string",
      defaults: params.defaults,
      context: params.context,
      active: params.accountActive(entry),
      inactiveReason:
        typeof params.accountInactiveReason === "function"
          ? params.accountInactiveReason(entry)
          : params.accountInactiveReason,
      apply: (value) => {
        nested[params.field] = value;
      },
    });
  }
}
