/**
 * @deprecated Public SDK subpath has no bundled extension production imports.
 * Use generic channel SDK subpaths or plugin-local API barrels instead.
 */

import type {
  ChannelAccountSnapshot,
  ChannelGroupContext,
  ChannelStatusIssue,
} from "./channel-contract.js";
import type { ChannelPlugin } from "./channel-core.js";
import type { OpenClawConfig } from "./config-types.js";
import {
  createLazyFacadeObjectValue,
  loadBundledPluginPublicSurfaceModuleSync,
} from "./facade-loader.js";
import { getRuntimeConfig, getRuntimeConfigSnapshot } from "./runtime-config-snapshot.js";

/**
 * @deprecated Compatibility facade for the `openclaw/plugin-sdk/discord` subpath.
 * New channel plugins should use generic channel SDK subpaths.
 */
export type { ChannelMessageActionAdapter, ChannelMessageActionName } from "./channel-contract.js";
/** Re-exported API for src/plugin-sdk, starting with Channel Plugin. */
export type { ChannelPlugin } from "./channel-core.js";
/** Re-exported API for src/plugin-sdk, starting with Open Claw Config. */
export type { OpenClawConfig } from "./config-types.js";
/** Re-exported API for src/plugin-sdk, starting with Open Claw Plugin Api. */
export type { OpenClawPluginApi, PluginRuntime } from "./channel-plugin-common.js";

/** Re-exported API for src/plugin-sdk. */
export {
  DEFAULT_ACCOUNT_ID,
  applyAccountNameToChannelSection,
  buildChannelConfigSchema,
  emptyPluginConfigSchema,
  getChatChannelMeta,
  migrateBaseNameToDefaultAccount,
  normalizeAccountId,
  PAIRING_APPROVED_MESSAGE,
} from "./channel-plugin-common.js";
/** Re-exported API for src/plugin-sdk. */
export {
  buildComputedAccountStatusSnapshot,
  buildTokenChannelStatusSummary,
  projectCredentialSnapshotFields,
  resolveConfiguredFromCredentialStatuses,
} from "./channel-status.js";
/** Re-exported API for src/plugin-sdk, starting with Discord Config Schema. */
export { DiscordConfigSchema } from "./bundled-channel-config-schema.js";

/** Shared type for Discord Account Config in src/plugin-sdk. */
export type DiscordAccountConfig = NonNullable<NonNullable<OpenClawConfig["channels"]>["discord"]>;

/** Shared type for Discord Component Message Spec in src/plugin-sdk. */
export type DiscordComponentMessageSpec = {
  text?: string;
  reusable?: boolean;
  container?: {
    accentColor?: string | number;
    spoiler?: boolean;
  };
  blocks?: unknown[];
  modal?: unknown;
};

/** Shared type for Discord Component Build Result in src/plugin-sdk. */
export type DiscordComponentBuildResult = {
  components: unknown[];
  entries: unknown[];
  modals: unknown[];
};

/** Shared type for Discord Component Send Opts in src/plugin-sdk. */
export type DiscordComponentSendOpts = {
  cfg?: OpenClawConfig;
  accountId?: string;
  replyTo?: string;
  files?: unknown;
  mediaReadFile?: (filePath: string) => Promise<Buffer>;
  filename?: string;
  textLimit?: number;
  maxLinesPerMessage?: number;
  tableMode?: unknown;
  chunkMode?: unknown;
  [key: string]: unknown;
};

/** Shared type for Discord Component Send Result in src/plugin-sdk. */
export type DiscordComponentSendResult = {
  id?: string;
  channel_id?: string;
  [key: string]: unknown;
};

/** Shared type for Resolved Discord Account in src/plugin-sdk. */
export type ResolvedDiscordAccount = {
  accountId: string;
  enabled: boolean;
  name?: string;
  token: string;
  tokenSource: "env" | "config" | "none";
  config: DiscordAccountConfig;
};

/** Shared type for Discord Outbound Target Resolution in src/plugin-sdk. */
export type DiscordOutboundTargetResolution =
  | { ok: true; to: string }
  | { ok: false; error: Error };

/** Shared type for Thread Binding Target Kind in src/plugin-sdk. */
export type ThreadBindingTargetKind = "subagent" | "acp";

/** Shared type for Thread Binding Record in src/plugin-sdk. */
export type ThreadBindingRecord = {
  accountId: string;
  threadId: string;
  channelId?: string;
  targetKind: ThreadBindingTargetKind;
  targetSessionKey: string;
  [key: string]: unknown;
};

type DirectoryConfigParams = {
  cfg: OpenClawConfig;
  accountId?: string | null;
};

type BuildDiscordComponentMessage = (params: {
  spec: DiscordComponentMessageSpec;
  fallbackText?: string;
  sessionKey?: string;
  agentId?: string;
  accountId?: string;
}) => DiscordComponentBuildResult;

type EditDiscordComponentMessage = (
  to: string,
  messageId: string,
  spec: DiscordComponentMessageSpec,
  opts: DiscordComponentSendOpts,
) => Promise<DiscordComponentSendResult>;

type RegisterBuiltDiscordComponentMessage = (params: {
  buildResult: DiscordComponentBuildResult;
  messageId: string;
}) => void;

type DiscordApiFacadeModule = {
  collectDiscordStatusIssues: (accounts: ChannelAccountSnapshot[]) => ChannelStatusIssue[];
  buildDiscordComponentMessage: BuildDiscordComponentMessage;
  discordOnboardingAdapter?: NonNullable<ChannelPlugin<ResolvedDiscordAccount>["setup"]>;
  inspectDiscordAccount: (params: { cfg: OpenClawConfig; accountId?: string | null }) => unknown;
  listDiscordAccountIds: (cfg: OpenClawConfig) => string[];
  listDiscordDirectoryGroupsFromConfig: (
    params: DirectoryConfigParams,
  ) => unknown[] | Promise<unknown[]>;
  listDiscordDirectoryPeersFromConfig: (
    params: DirectoryConfigParams,
  ) => unknown[] | Promise<unknown[]>;
  looksLikeDiscordTargetId: (raw: string) => boolean;
  normalizeDiscordMessagingTarget: (raw: string) => string | undefined;
  normalizeDiscordOutboundTarget: (to?: string) => DiscordOutboundTargetResolution;
  resolveDefaultDiscordAccountId: (cfg: OpenClawConfig) => string;
  resolveDiscordAccount: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => ResolvedDiscordAccount;
  resolveDiscordGroupRequireMention: (params: ChannelGroupContext) => boolean | undefined;
  resolveDiscordGroupToolPolicy: (params: ChannelGroupContext) => unknown;
};

type DiscordRuntimeFacadeModule = {
  editDiscordComponentMessage: EditDiscordComponentMessage;
  registerBuiltDiscordComponentMessage: RegisterBuiltDiscordComponentMessage;
  autoBindSpawnedDiscordSubagent: (params: {
    cfg: OpenClawConfig;
    accountId?: string;
    channel?: string;
    to?: string;
    threadId?: string | number;
    childSessionKey: string;
    agentId: string;
    label?: string;
    boundBy?: string;
  }) => Promise<ThreadBindingRecord | null>;
  collectDiscordAuditChannelIds: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => unknown;
  listThreadBindingsBySessionKey: (params: {
    targetSessionKey: string;
    accountId?: string;
    targetKind?: ThreadBindingTargetKind;
  }) => ThreadBindingRecord[];
  unbindThreadBindingsBySessionKey: (params: {
    targetSessionKey: string;
    accountId?: string;
    targetKind?: ThreadBindingTargetKind;
    reason?: string;
    sendFarewell?: boolean;
    farewellText?: string;
  }) => ThreadBindingRecord[];
};

function loadDiscordApiFacadeModule(): DiscordApiFacadeModule {
  return loadBundledPluginPublicSurfaceModuleSync<DiscordApiFacadeModule>({
    dirName: "discord",
    artifactBasename: "api.js",
  });
}

function loadDiscordRuntimeFacadeModule(): DiscordRuntimeFacadeModule {
  return loadBundledPluginPublicSurfaceModuleSync<DiscordRuntimeFacadeModule>({
    dirName: "discord",
    artifactBasename: "runtime-api.js",
  });
}

function resolveCompatRuntimeConfig(params: { cfg?: OpenClawConfig }): OpenClawConfig {
  return params.cfg ?? getRuntimeConfigSnapshot() ?? getRuntimeConfig();
}

/** Reused constant for discord Onboarding Adapter behavior in src/plugin-sdk. */
export const discordOnboardingAdapter = createLazyFacadeObjectValue(
  () => loadDiscordApiFacadeModule().discordOnboardingAdapter ?? {},
);

/** Reused helper for collect Discord Status Issues behavior in src/plugin-sdk. */
export function collectDiscordStatusIssues(
  accounts: ChannelAccountSnapshot[],
): ChannelStatusIssue[] {
  return loadDiscordApiFacadeModule().collectDiscordStatusIssues(accounts);
}

/** Reused constant for build Discord Component Message behavior in src/plugin-sdk. */
export const buildDiscordComponentMessage: DiscordApiFacadeModule["buildDiscordComponentMessage"] =
  ((...args) =>
    loadDiscordApiFacadeModule().buildDiscordComponentMessage(
      ...args,
    )) as DiscordApiFacadeModule["buildDiscordComponentMessage"];

/** Reused helper for inspect Discord Account behavior in src/plugin-sdk. */
export function inspectDiscordAccount(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}): unknown {
  return loadDiscordApiFacadeModule().inspectDiscordAccount(params);
}

/** Reused helper for list Discord Account Ids behavior in src/plugin-sdk. */
export function listDiscordAccountIds(cfg: OpenClawConfig): string[] {
  return loadDiscordApiFacadeModule().listDiscordAccountIds(cfg);
}

/** Reused helper for list Discord Directory Groups From Config behavior in src/plugin-sdk. */
export function listDiscordDirectoryGroupsFromConfig(
  params: DirectoryConfigParams,
): unknown[] | Promise<unknown[]> {
  return loadDiscordApiFacadeModule().listDiscordDirectoryGroupsFromConfig(params);
}

/** Reused helper for list Discord Directory Peers From Config behavior in src/plugin-sdk. */
export function listDiscordDirectoryPeersFromConfig(
  params: DirectoryConfigParams,
): unknown[] | Promise<unknown[]> {
  return loadDiscordApiFacadeModule().listDiscordDirectoryPeersFromConfig(params);
}

/** Reused helper for looks Like Discord Target Id behavior in src/plugin-sdk. */
export function looksLikeDiscordTargetId(raw: string): boolean {
  return loadDiscordApiFacadeModule().looksLikeDiscordTargetId(raw);
}

/** Reused helper for normalize Discord Messaging Target behavior in src/plugin-sdk. */
export function normalizeDiscordMessagingTarget(raw: string): string | undefined {
  return loadDiscordApiFacadeModule().normalizeDiscordMessagingTarget(raw);
}

/** Reused helper for normalize Discord Outbound Target behavior in src/plugin-sdk. */
export function normalizeDiscordOutboundTarget(to?: string): DiscordOutboundTargetResolution {
  return loadDiscordApiFacadeModule().normalizeDiscordOutboundTarget(to);
}

/** Reused helper for resolve Default Discord Account Id behavior in src/plugin-sdk. */
export function resolveDefaultDiscordAccountId(cfg: OpenClawConfig): string {
  return loadDiscordApiFacadeModule().resolveDefaultDiscordAccountId(cfg);
}

/** Reused helper for resolve Discord Account behavior in src/plugin-sdk. */
export function resolveDiscordAccount(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}): ResolvedDiscordAccount {
  return loadDiscordApiFacadeModule().resolveDiscordAccount(params);
}

/** Reused helper for resolve Discord Group Require Mention behavior in src/plugin-sdk. */
export function resolveDiscordGroupRequireMention(
  params: ChannelGroupContext,
): boolean | undefined {
  return loadDiscordApiFacadeModule().resolveDiscordGroupRequireMention(params);
}

/** Reused helper for resolve Discord Group Tool Policy behavior in src/plugin-sdk. */
export function resolveDiscordGroupToolPolicy(params: ChannelGroupContext): unknown {
  return loadDiscordApiFacadeModule().resolveDiscordGroupToolPolicy(params);
}

/** Reused helper for collect Discord Audit Channel Ids behavior in src/plugin-sdk. */
export function collectDiscordAuditChannelIds(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}): unknown {
  return loadDiscordRuntimeFacadeModule().collectDiscordAuditChannelIds(params);
}

/** Reused constant for edit Discord Component Message behavior in src/plugin-sdk. */
export const editDiscordComponentMessage: DiscordRuntimeFacadeModule["editDiscordComponentMessage"] =
  ((...args) =>
    loadDiscordRuntimeFacadeModule().editDiscordComponentMessage(
      ...args,
    )) as DiscordRuntimeFacadeModule["editDiscordComponentMessage"];

/** Reused constant for register Built Discord Component Message behavior in src/plugin-sdk. */
export const registerBuiltDiscordComponentMessage: DiscordRuntimeFacadeModule["registerBuiltDiscordComponentMessage"] =
  ((...args) =>
    loadDiscordRuntimeFacadeModule().registerBuiltDiscordComponentMessage(
      ...args,
    )) as DiscordRuntimeFacadeModule["registerBuiltDiscordComponentMessage"];

/** Reused helper for auto Bind Spawned Discord Subagent behavior in src/plugin-sdk. */
export async function autoBindSpawnedDiscordSubagent(params: {
  cfg?: OpenClawConfig;
  accountId?: string;
  channel?: string;
  to?: string;
  threadId?: string | number;
  childSessionKey: string;
  agentId: string;
  label?: string;
  boundBy?: string;
}): Promise<ThreadBindingRecord | null> {
  return await loadDiscordRuntimeFacadeModule().autoBindSpawnedDiscordSubagent({
    ...params,
    cfg: resolveCompatRuntimeConfig(params),
  });
}

/** Reused helper for list Thread Bindings By Session Key behavior in src/plugin-sdk. */
export function listThreadBindingsBySessionKey(params: {
  targetSessionKey: string;
  accountId?: string;
  targetKind?: ThreadBindingTargetKind;
}): ThreadBindingRecord[] {
  return loadDiscordRuntimeFacadeModule().listThreadBindingsBySessionKey(params);
}

/** Reused helper for unbind Thread Bindings By Session Key behavior in src/plugin-sdk. */
export function unbindThreadBindingsBySessionKey(params: {
  targetSessionKey: string;
  accountId?: string;
  targetKind?: ThreadBindingTargetKind;
  reason?: string;
  sendFarewell?: boolean;
  farewellText?: string;
}): ThreadBindingRecord[] {
  return loadDiscordRuntimeFacadeModule().unbindThreadBindingsBySessionKey(params);
}
