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
/** Origin scope for a channel/plugin config write request. */
export type ConfigWriteScope = ConfigWriteScopeLike;
/** Config subtree target resolved for a channel/plugin write. */
export type ConfigWriteTarget = ConfigWriteTargetLike;
/** Authorization result for channel/plugin config writes. */
export type ConfigWriteAuthorizationResult = ConfigWriteAuthorizationResultLike;

function isInternalConfigWriteMessageChannel(channel?: string | null): boolean {
  return normalizeLowercaseStringOrEmpty(channel) === "webchat";
}

/** Resolve whether a channel/account may write config from current config policy. */
export function resolveChannelConfigWrites(params: {
  cfg: OpenClawConfig;
  channelId?: ChannelId | null;
  accountId?: string | null;
}): boolean {
  return resolveChannelConfigWritesShared(params);
}

/** Authorize a config write against origin scope, target, and bypass policy. */
export function authorizeConfigWrite(params: {
  cfg: OpenClawConfig;
  origin?: ConfigWriteScope;
  target?: ConfigWriteTarget;
  allowBypass?: boolean;
}): ConfigWriteAuthorizationResult {
  return authorizeConfigWriteShared(params);
}

/** Resolve the config target implied directly by a write origin scope. */
export function resolveExplicitConfigWriteTarget(scope: ConfigWriteScope): ConfigWriteTarget {
  return resolveExplicitConfigWriteTargetShared(scope);
}

/** Resolve a config write target from a config path array. */
export function resolveConfigWriteTargetFromPath(path: string[]): ConfigWriteTarget {
  return resolveConfigWriteTargetFromPathShared({
    path,
    normalizeChannelId: (raw) => normalizeLowercaseStringOrEmpty(raw) as ChannelId,
  });
}

/** Check whether gateway scopes/internal channel allow bypassing write policy. */
export function canBypassConfigWritePolicy(params: {
  channel?: string | null;
  gatewayClientScopes?: string[] | null;
}): boolean {
  return canBypassConfigWritePolicyShared({
    ...params,
    isInternalMessageChannel: isInternalConfigWriteMessageChannel,
  });
}

/** Format a user-facing denial reason for blocked config writes. */
export function formatConfigWriteDeniedMessage(params: {
  result: Exclude<ConfigWriteAuthorizationResult, { allowed: true }>;
  fallbackChannelId?: ChannelId | null;
}): string {
  return formatConfigWriteDeniedMessageShared(params);
}
