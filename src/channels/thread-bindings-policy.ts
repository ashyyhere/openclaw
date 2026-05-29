/** Resolves whether channel thread binding requires native thread context. */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { normalizeAccountId } from "../routing/session-key.js";
import { normalizeLowercaseStringOrEmpty } from "../shared/string-coerce.js";
import {
  resolveThreadBindingLifecycle as resolveSharedThreadBindingLifecycle,
  type ThreadBindingLifecycleRecord,
} from "../shared/thread-binding-lifecycle.js";
import { getLoadedChannelPlugin } from "./plugins/index.js";
import { resolveBundledChannelThreadBindingDefaultPlacement } from "./plugins/thread-binding-api.js";

/** Re-exported API for src/channels. */
export {
  resolveThreadBindingLifecycle,
  type ThreadBindingLifecycleRecord,
} from "../shared/thread-binding-lifecycle.js";

const DEFAULT_THREAD_BINDING_IDLE_HOURS = 24;
const DEFAULT_THREAD_BINDING_MAX_AGE_HOURS = 0;

type SessionThreadBindingsConfigShape = {
  enabled?: unknown;
  idleHours?: unknown;
  maxAgeHours?: unknown;
  spawnSessions?: unknown;
  spawnSubagentSessions?: unknown;
  spawnAcpSessions?: unknown;
  defaultSpawnContext?: unknown;
};

type ChannelThreadBindingsContainerShape = {
  threadBindings?: SessionThreadBindingsConfigShape;
  accounts?: Record<string, { threadBindings?: SessionThreadBindingsConfigShape } | undefined>;
};

/** Shared type for Thread Binding Spawn Kind in src/channels. */
export type ThreadBindingSpawnKind = "subagent" | "acp";

/** Shared type for Thread Binding Spawn Policy in src/channels. */
export type ThreadBindingSpawnPolicy = {
  channel: string;
  accountId: string;
  enabled: boolean;
  spawnEnabled: boolean;
  defaultSpawnContext: ThreadBindingSpawnContext;
};

/** Shared type for Thread Binding Spawn Context in src/channels. */
export type ThreadBindingSpawnContext = "isolated" | "fork";

function normalizeChannelId(value: string | undefined | null): string {
  return normalizeLowercaseStringOrEmpty(value);
}

/** Reused helper for supports Automatic Thread Binding Spawn behavior in src/channels. */
export function supportsAutomaticThreadBindingSpawn(channel: string): boolean {
  return resolveDefaultTopLevelPlacement(channel) === "child";
}

/** Reused helper for requires Native Thread Context For Thread Here behavior in src/channels. */
export function requiresNativeThreadContextForThreadHere(channel: string): boolean {
  return resolveDefaultTopLevelPlacement(channel) === "child";
}

/** Reused helper for resolve Thread Binding Placement For Current Context behavior in src/channels. */
export function resolveThreadBindingPlacementForCurrentContext(params: {
  channel: string;
  threadId?: string;
}): "current" | "child" {
  if (resolveDefaultTopLevelPlacement(params.channel) !== "child") {
    return "current";
  }
  return params.threadId ? "current" : "child";
}

function resolveDefaultTopLevelPlacement(channel: string): "current" | "child" {
  const normalized = normalizeChannelId(channel);
  if (!normalized) {
    return "current";
  }
  return (
    getLoadedChannelPlugin(normalized)?.conversationBindings?.defaultTopLevelPlacement ??
    resolveBundledChannelThreadBindingDefaultPlacement(normalized) ??
    "current"
  );
}

function normalizeBoolean(value: unknown): boolean | undefined {
  if (typeof value !== "boolean") {
    return undefined;
  }
  return value;
}

function normalizeThreadBindingHours(raw: unknown): number | undefined {
  if (typeof raw !== "number" || !Number.isFinite(raw)) {
    return undefined;
  }
  if (raw < 0) {
    return undefined;
  }
  return raw;
}

/** Reused helper for resolve Thread Binding Idle Timeout Ms behavior in src/channels. */
export function resolveThreadBindingIdleTimeoutMs(params: {
  channelIdleHoursRaw: unknown;
  sessionIdleHoursRaw: unknown;
}): number {
  const idleHours =
    normalizeThreadBindingHours(params.channelIdleHoursRaw) ??
    normalizeThreadBindingHours(params.sessionIdleHoursRaw) ??
    DEFAULT_THREAD_BINDING_IDLE_HOURS;
  return Math.floor(idleHours * 60 * 60 * 1000);
}

/** Reused helper for resolve Thread Binding Max Age Ms behavior in src/channels. */
export function resolveThreadBindingMaxAgeMs(params: {
  channelMaxAgeHoursRaw: unknown;
  sessionMaxAgeHoursRaw: unknown;
}): number {
  const maxAgeHours =
    normalizeThreadBindingHours(params.channelMaxAgeHoursRaw) ??
    normalizeThreadBindingHours(params.sessionMaxAgeHoursRaw) ??
    DEFAULT_THREAD_BINDING_MAX_AGE_HOURS;
  return Math.floor(maxAgeHours * 60 * 60 * 1000);
}

/** Reused helper for resolve Thread Binding Effective Expires At behavior in src/channels. */
export function resolveThreadBindingEffectiveExpiresAt(params: {
  record: ThreadBindingLifecycleRecord;
  defaultIdleTimeoutMs: number;
  defaultMaxAgeMs: number;
}): number | undefined {
  return resolveSharedThreadBindingLifecycle(params).expiresAt;
}

/** Reused helper for resolve Thread Bindings Enabled behavior in src/channels. */
export function resolveThreadBindingsEnabled(params: {
  channelEnabledRaw: unknown;
  sessionEnabledRaw: unknown;
}): boolean {
  return (
    normalizeBoolean(params.channelEnabledRaw) ?? normalizeBoolean(params.sessionEnabledRaw) ?? true
  );
}

function resolveChannelThreadBindings(params: {
  cfg: OpenClawConfig;
  channel: string;
  accountId: string;
}): {
  root?: SessionThreadBindingsConfigShape;
  account?: SessionThreadBindingsConfigShape;
} {
  const channels = params.cfg.channels as Record<string, unknown> | undefined;
  const channelConfig = channels?.[params.channel] as
    | ChannelThreadBindingsContainerShape
    | undefined;
  const accountConfig = channelConfig?.accounts?.[params.accountId];
  return {
    root: channelConfig?.threadBindings,
    account: accountConfig?.threadBindings,
  };
}

function resolveSpawnFlagKey(
  kind: ThreadBindingSpawnKind,
): "spawnSubagentSessions" | "spawnAcpSessions" {
  return kind === "subagent" ? "spawnSubagentSessions" : "spawnAcpSessions";
}

function normalizeSpawnContext(value: unknown): ThreadBindingSpawnContext | undefined {
  return value === "isolated" || value === "fork" ? value : undefined;
}

/** Reused helper for resolve Thread Binding Spawn Policy behavior in src/channels. */
export function resolveThreadBindingSpawnPolicy(params: {
  cfg: OpenClawConfig;
  channel: string;
  accountId?: string;
  kind: ThreadBindingSpawnKind;
}): ThreadBindingSpawnPolicy {
  const channel = normalizeChannelId(params.channel);
  const accountId = normalizeAccountId(params.accountId);
  const { root, account } = resolveChannelThreadBindings({
    cfg: params.cfg,
    channel,
    accountId,
  });
  const enabled =
    normalizeBoolean(account?.enabled) ??
    normalizeBoolean(root?.enabled) ??
    normalizeBoolean(params.cfg.session?.threadBindings?.enabled) ??
    true;
  const spawnFlagKey = resolveSpawnFlagKey(params.kind);
  const spawnEnabledRaw =
    normalizeBoolean(account?.[spawnFlagKey]) ??
    normalizeBoolean(account?.spawnSessions) ??
    normalizeBoolean(root?.[spawnFlagKey]) ??
    normalizeBoolean(root?.spawnSessions) ??
    normalizeBoolean(params.cfg.session?.threadBindings?.spawnSessions);
  const spawnEnabled = spawnEnabledRaw ?? true;
  const defaultSpawnContext =
    normalizeSpawnContext(account?.defaultSpawnContext) ??
    normalizeSpawnContext(root?.defaultSpawnContext) ??
    normalizeSpawnContext(params.cfg.session?.threadBindings?.defaultSpawnContext) ??
    "fork";
  return {
    channel,
    accountId,
    enabled,
    spawnEnabled,
    defaultSpawnContext,
  };
}

/** Reused helper for resolve Thread Binding Idle Timeout Ms For Channel behavior in src/channels. */
export function resolveThreadBindingIdleTimeoutMsForChannel(params: {
  cfg: OpenClawConfig;
  channel: string;
  accountId?: string;
}): number {
  const { root, account } = resolveThreadBindingChannelScope(params);
  return resolveThreadBindingIdleTimeoutMs({
    channelIdleHoursRaw: account?.idleHours ?? root?.idleHours,
    sessionIdleHoursRaw: params.cfg.session?.threadBindings?.idleHours,
  });
}

/** Reused helper for resolve Thread Binding Max Age Ms For Channel behavior in src/channels. */
export function resolveThreadBindingMaxAgeMsForChannel(params: {
  cfg: OpenClawConfig;
  channel: string;
  accountId?: string;
}): number {
  const { root, account } = resolveThreadBindingChannelScope(params);
  return resolveThreadBindingMaxAgeMs({
    channelMaxAgeHoursRaw: account?.maxAgeHours ?? root?.maxAgeHours,
    sessionMaxAgeHoursRaw: params.cfg.session?.threadBindings?.maxAgeHours,
  });
}

function resolveThreadBindingChannelScope(params: {
  cfg: OpenClawConfig;
  channel: string;
  accountId?: string;
}) {
  const channel = normalizeChannelId(params.channel);
  const accountId = normalizeAccountId(params.accountId);
  return resolveChannelThreadBindings({
    cfg: params.cfg,
    channel,
    accountId,
  });
}

/** Reused helper for format Thread Binding Disabled Error behavior in src/channels. */
export function formatThreadBindingDisabledError(params: {
  channel: string;
  accountId: string;
  kind: ThreadBindingSpawnKind;
}): string {
  return `Thread bindings are disabled for ${params.channel} (set channels.${params.channel}.threadBindings.enabled=true to override for this account, or session.threadBindings.enabled=true globally).`;
}

/** Reused helper for format Thread Binding Spawn Disabled Error behavior in src/channels. */
export function formatThreadBindingSpawnDisabledError(params: {
  channel: string;
  accountId: string;
  kind: ThreadBindingSpawnKind;
}): string {
  return `Thread-bound session spawns are disabled for ${params.channel} (set channels.${params.channel}.threadBindings.spawnSessions=true to enable).`;
}
