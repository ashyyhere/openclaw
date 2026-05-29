// Channel config write target resolution and mutation helpers.
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { normalizeLowercaseStringOrEmpty } from "../../shared/string-coerce.js";
import {
  authorizeConfigWriteShared,
  canBypassConfigWritePolicyShared,
  formatConfigWriteDeniedMessageShared,
  resolveChannelConfigWritesShared,
  resolveConfigWriteTargetFromPathShared,
  resolveExplicitConfigWriteTargetShared,
  type ConfigWriteAuthorizationResultLike,
  type ConfigWriteScopeLike,
  type ConfigWriteTargetLike,
} from "./config-write-policy-shared.js";
import type { ChannelId } from "./types.core.js";
/** Shared type for Config Write Scope in src/channels/plugins. */
export type ConfigWriteScope = ConfigWriteScopeLike;
/** Shared type for Config Write Target in src/channels/plugins. */
export type ConfigWriteTarget = ConfigWriteTargetLike;
/** Shared type for Config Write Authorization Result in src/channels/plugins. */
export type ConfigWriteAuthorizationResult = ConfigWriteAuthorizationResultLike;

function isInternalConfigWriteMessageChannel(channel?: string | null): boolean {
  return normalizeLowercaseStringOrEmpty(channel) === "webchat";
}

/** Reused helper for resolve Channel Config Writes behavior in src/channels/plugins. */
export function resolveChannelConfigWrites(params: {
  cfg: OpenClawConfig;
  channelId?: ChannelId | null;
  accountId?: string | null;
}): boolean {
  return resolveChannelConfigWritesShared(params);
}

/** Reused helper for authorize Config Write behavior in src/channels/plugins. */
export function authorizeConfigWrite(params: {
  cfg: OpenClawConfig;
  origin?: ConfigWriteScope;
  target?: ConfigWriteTarget;
  allowBypass?: boolean;
}): ConfigWriteAuthorizationResult {
  return authorizeConfigWriteShared(params);
}

/** Reused helper for resolve Explicit Config Write Target behavior in src/channels/plugins. */
export function resolveExplicitConfigWriteTarget(scope: ConfigWriteScope): ConfigWriteTarget {
  return resolveExplicitConfigWriteTargetShared(scope);
}

/** Reused helper for resolve Config Write Target From Path behavior in src/channels/plugins. */
export function resolveConfigWriteTargetFromPath(path: string[]): ConfigWriteTarget {
  return resolveConfigWriteTargetFromPathShared({
    path,
    normalizeChannelId: (raw) => normalizeLowercaseStringOrEmpty(raw) as ChannelId,
  });
}

/** Reused helper for can Bypass Config Write Policy behavior in src/channels/plugins. */
export function canBypassConfigWritePolicy(params: {
  channel?: string | null;
  gatewayClientScopes?: string[] | null;
}): boolean {
  return canBypassConfigWritePolicyShared({
    ...params,
    isInternalMessageChannel: isInternalConfigWriteMessageChannel,
  });
}

/** Reused helper for format Config Write Denied Message behavior in src/channels/plugins. */
export function formatConfigWriteDeniedMessage(params: {
  result: Exclude<ConfigWriteAuthorizationResult, { allowed: true }>;
  fallbackChannelId?: ChannelId | null;
}): string {
  return formatConfigWriteDeniedMessageShared(params);
}
