// Channel account summary and allowlist formatting helpers.
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { normalizeStringEntries } from "../shared/string-normalization.js";
import { isRecord } from "../utils.js";
import { projectSafeChannelAccountSnapshotFields } from "./account-snapshot-fields.js";
import type { ChannelAccountSnapshot } from "./plugins/types.core.js";
import type { ChannelPlugin } from "./plugins/types.plugin.js";

/** Build a safe account snapshot for channel status output. */
export function buildChannelAccountSnapshot(params: {
  plugin: ChannelPlugin;
  account: unknown;
  cfg: OpenClawConfig;
  accountId: string;
  enabled: boolean;
  configured: boolean;
}): ChannelAccountSnapshot {
  const described = params.plugin.config.describeAccount?.(params.account, params.cfg);
  return {
    enabled: params.enabled,
    configured: params.configured,
    ...projectSafeChannelAccountSnapshotFields(params.account),
    ...described,
    accountId: params.accountId,
  };
}

/** Format channel allowFrom entries through plugin-specific display hooks when present. */
export function formatChannelAllowFrom(params: {
  plugin: ChannelPlugin;
  cfg: OpenClawConfig;
  accountId?: string | null;
  allowFrom: Array<string | number>;
}): string[] {
  if (params.plugin.config.formatAllowFrom) {
    return params.plugin.config.formatAllowFrom({
      cfg: params.cfg,
      accountId: params.accountId,
      allowFrom: params.allowFrom,
    });
  }
  return normalizeStringEntries(params.allowFrom);
}

/** Resolve whether an account is enabled by plugin config and account data. */
export function resolveChannelAccountEnabled(params: {
  plugin: ChannelPlugin;
  account: unknown;
  cfg: OpenClawConfig;
}): boolean {
  if (params.plugin.config.isEnabled) {
    return params.plugin.config.isEnabled(params.account, params.cfg);
  }
  const enabled = isRecord(params.account) ? params.account.enabled : undefined;
  return enabled !== false;
}

/** Resolve whether an account is configured by plugin config and account data. */
export async function resolveChannelAccountConfigured(params: {
  plugin: ChannelPlugin;
  account: unknown;
  cfg: OpenClawConfig;
  readAccountConfiguredField?: boolean;
}): Promise<boolean> {
  if (params.plugin.config.isConfigured) {
    return await params.plugin.config.isConfigured(params.account, params.cfg);
  }
  if (params.readAccountConfiguredField) {
    const configured = isRecord(params.account) ? params.account.configured : undefined;
    return configured !== false;
  }
  return true;
}
