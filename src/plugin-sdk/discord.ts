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
/** Channel plugin type kept for legacy Discord subpath consumers. */
export type { ChannelPlugin } from "./channel-core.js";
/** OpenClaw config type kept for legacy Discord subpath consumers. */
export type { OpenClawConfig } from "./config-types.js";
/** Core plugin API/runtime types kept for legacy Discord subpath consumers. */
export type { OpenClawPluginApi, PluginRuntime } from "./channel-plugin-common.js";

/** Generic channel plugin config/account helpers kept on the legacy Discord facade. */
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
/** Channel status helpers forwarded for legacy Discord status integrations. */
export {
  buildComputedAccountStatusSnapshot,
  buildTokenChannelStatusSummary,
  projectCredentialSnapshotFields,
  resolveConfiguredFromCredentialStatuses,
} from "./channel-status.js";
/** Discord config schema forwarded from the bundled channel config artifact. */
export { DiscordConfigSchema } from "./bundled-channel-config-schema.js";

/** Discord channel account config shape from the canonical OpenClaw config. */
export type DiscordAccountConfig = NonNullable<NonNullable<OpenClawConfig["channels"]>["discord"]>;

/** Legacy Discord component message spec accepted by the facade. */
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

/** Built Discord component payload returned by the legacy builder facade. */
export type DiscordComponentBuildResult = {
  components: unknown[];
  entries: unknown[];
  modals: unknown[];
};

/** Options accepted when editing or sending Discord component messages. */
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

/** Minimal Discord message result returned by component send/edit helpers. */
export type DiscordComponentSendResult = {
  id?: string;
  channel_id?: string;
  [key: string]: unknown;
};

/** Resolved Discord account credentials and config returned by account helpers. */
export type ResolvedDiscordAccount = {
  accountId: string;
  enabled: boolean;
  name?: string;
  token: string;
  tokenSource: "env" | "config" | "none";
  config: DiscordAccountConfig;
};

/** Result of normalizing a Discord outbound message target. */
export type DiscordOutboundTargetResolution =
  | { ok: true; to: string }
  | { ok: false; error: Error };

/** Runtime target type stored in Discord thread binding records. */
export type ThreadBindingTargetKind = "subagent" | "acp";

/** Discord thread-to-runtime binding record exposed through the compatibility facade. */
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

/** Lazy legacy facade for Discord onboarding setup adapters. */
export const discordOnboardingAdapter = createLazyFacadeObjectValue(
  () => loadDiscordApiFacadeModule().discordOnboardingAdapter ?? {},
);

/** Collects Discord account status issues through the bundled public API facade. */
export function collectDiscordStatusIssues(
  accounts: ChannelAccountSnapshot[],
): ChannelStatusIssue[] {
  return loadDiscordApiFacadeModule().collectDiscordStatusIssues(accounts);
}

/** Builds a Discord component message through the bundled public API facade. */
export const buildDiscordComponentMessage: DiscordApiFacadeModule["buildDiscordComponentMessage"] =
  ((...args) =>
    loadDiscordApiFacadeModule().buildDiscordComponentMessage(
      ...args,
    )) as DiscordApiFacadeModule["buildDiscordComponentMessage"];

/** Inspects one configured Discord account through the bundled public API facade. */
export function inspectDiscordAccount(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}): unknown {
  return loadDiscordApiFacadeModule().inspectDiscordAccount(params);
}

/** Lists configured Discord account ids through the bundled public API facade. */
export function listDiscordAccountIds(cfg: OpenClawConfig): string[] {
  return loadDiscordApiFacadeModule().listDiscordAccountIds(cfg);
}

/** Lists Discord directory groups from config through the bundled public API facade. */
export function listDiscordDirectoryGroupsFromConfig(
  params: DirectoryConfigParams,
): unknown[] | Promise<unknown[]> {
  return loadDiscordApiFacadeModule().listDiscordDirectoryGroupsFromConfig(params);
}

/** Lists Discord directory peers from config through the bundled public API facade. */
export function listDiscordDirectoryPeersFromConfig(
  params: DirectoryConfigParams,
): unknown[] | Promise<unknown[]> {
  return loadDiscordApiFacadeModule().listDiscordDirectoryPeersFromConfig(params);
}

/** Checks whether a raw value resembles a Discord messaging target id. */
export function looksLikeDiscordTargetId(raw: string): boolean {
  return loadDiscordApiFacadeModule().looksLikeDiscordTargetId(raw);
}

/** Normalizes a Discord messaging target without resolving account config. */
export function normalizeDiscordMessagingTarget(raw: string): string | undefined {
  return loadDiscordApiFacadeModule().normalizeDiscordMessagingTarget(raw);
}

/** Normalizes a Discord outbound target and returns a typed error on failure. */
export function normalizeDiscordOutboundTarget(to?: string): DiscordOutboundTargetResolution {
  return loadDiscordApiFacadeModule().normalizeDiscordOutboundTarget(to);
}

/** Resolves the default Discord account id from config. */
export function resolveDefaultDiscordAccountId(cfg: OpenClawConfig): string {
  return loadDiscordApiFacadeModule().resolveDefaultDiscordAccountId(cfg);
}

/** Resolves Discord account config and credentials through the bundled facade. */
export function resolveDiscordAccount(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}): ResolvedDiscordAccount {
  return loadDiscordApiFacadeModule().resolveDiscordAccount(params);
}

/** Resolves Discord group mention requirements for a channel group context. */
export function resolveDiscordGroupRequireMention(
  params: ChannelGroupContext,
): boolean | undefined {
  return loadDiscordApiFacadeModule().resolveDiscordGroupRequireMention(params);
}

/** Resolves Discord group tool policy for a channel group context. */
export function resolveDiscordGroupToolPolicy(params: ChannelGroupContext): unknown {
  return loadDiscordApiFacadeModule().resolveDiscordGroupToolPolicy(params);
}

/** Collects Discord audit channel ids through the runtime facade. */
export function collectDiscordAuditChannelIds(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}): unknown {
  return loadDiscordRuntimeFacadeModule().collectDiscordAuditChannelIds(params);
}

/** Edits a Discord component message through the runtime facade. */
export const editDiscordComponentMessage: DiscordRuntimeFacadeModule["editDiscordComponentMessage"] =
  ((...args) =>
    loadDiscordRuntimeFacadeModule().editDiscordComponentMessage(
      ...args,
    )) as DiscordRuntimeFacadeModule["editDiscordComponentMessage"];

/** Registers a built Discord component message with the runtime facade. */
export const registerBuiltDiscordComponentMessage: DiscordRuntimeFacadeModule["registerBuiltDiscordComponentMessage"] =
  ((...args) =>
    loadDiscordRuntimeFacadeModule().registerBuiltDiscordComponentMessage(
      ...args,
    )) as DiscordRuntimeFacadeModule["registerBuiltDiscordComponentMessage"];

/** Auto-binds a spawned subagent to a Discord thread through the runtime facade. */
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

/** Lists Discord thread bindings for a target session key. */
export function listThreadBindingsBySessionKey(params: {
  targetSessionKey: string;
  accountId?: string;
  targetKind?: ThreadBindingTargetKind;
}): ThreadBindingRecord[] {
  return loadDiscordRuntimeFacadeModule().listThreadBindingsBySessionKey(params);
}

/** Removes Discord thread bindings for a target session key. */
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
