// Channel config contracts for built-in and plugin-owned messaging channels.
import type { ContextVisibilityMode, GroupPolicy } from "./types.base.js";
import type { ChannelBotLoopProtectionConfig } from "./types.bot-loop-protection.js";
import type {
  ChannelHealthMonitorConfig,
  ChannelHeartbeatVisibilityConfig,
} from "./types.channel-health.js";
import type { DiscordConfig } from "./types.discord.js";
import type { GoogleChatConfig } from "./types.googlechat.js";
import type { IMessageConfig } from "./types.imessage.js";
import type { IrcConfig } from "./types.irc.js";
import type { MSTeamsConfig } from "./types.msteams.js";
import type { SignalConfig } from "./types.signal.js";
import type { SlackConfig } from "./types.slack.js";
import type { TelegramConfig } from "./types.telegram.js";
import type { WhatsAppConfig } from "./types.whatsapp.js";

/** Channel health and heartbeat visibility config contracts. */
export type {
  ChannelHealthMonitorConfig,
  ChannelHeartbeatVisibilityConfig,
} from "./types.channel-health.js";
/** Bot loop protection config shared by channel sections. */
export type { ChannelBotLoopProtectionConfig } from "./types.bot-loop-protection.js";

/** Defaults inherited by channel config sections when they omit local policy. */
export type ChannelDefaultsConfig = {
  groupPolicy?: GroupPolicy;
  contextVisibility?: ContextVisibilityMode;
  /** Default heartbeat visibility for all channels. */
  heartbeat?: ChannelHeartbeatVisibilityConfig;
  /** Default pair loop guard settings for channels that support bot loop protection. */
  botLoopProtection?: ChannelBotLoopProtectionConfig;
};

/** Provider/channel model override map. */
export type ChannelModelByChannelConfig = Record<string, Record<string, string>>;

/** Nested channel policy bag for plugin-owned dm/group/room config sections. */
export type ExtensionNestedPolicyConfig = {
  policy?: string;
  allowFrom?: Array<string | number> | ReadonlyArray<string | number>;
  [key: string]: unknown;
};

/**
 * Base type for extension channel config sections.
 * Extensions can use this as a starting point for their channel config.
 */
export type ExtensionChannelConfig = {
  enabled?: boolean;
  allowFrom?: Array<string | number> | ReadonlyArray<string | number>;
  /** Default delivery target for CLI --deliver when no explicit --reply-to is provided. */
  defaultTo?: string | number;
  /** Optional default account id when multiple accounts are configured. */
  defaultAccount?: string;
  dmPolicy?: string;
  groupPolicy?: GroupPolicy;
  contextVisibility?: ContextVisibilityMode;
  healthMonitor?: ChannelHealthMonitorConfig;
  dm?: ExtensionNestedPolicyConfig;
  network?: Record<string, unknown>;
  groups?: Record<string, unknown>;
  rooms?: Record<string, unknown>;
  mediaMaxMb?: number;
  callbackBaseUrl?: string;
  interactions?: { callbackBaseUrl?: string; [key: string]: unknown };
  execApprovals?: Record<string, unknown>;
  threadBindings?: {
    enabled?: boolean;
    spawnSessions?: boolean;
    defaultSpawnContext?: "isolated" | "fork";
    /** @deprecated Use spawnSessions instead. */
    spawnAcpSessions?: boolean;
    /** @deprecated Use spawnSessions instead. */
    spawnSubagentSessions?: boolean;
  };
  botLoopProtection?: ChannelBotLoopProtectionConfig;
  spawnSubagentSessions?: boolean;
  dangerouslyAllowPrivateNetwork?: boolean;
  accounts?: Record<string, unknown>;
  [key: string]: unknown;
};

/** Root channel config section containing defaults, built-ins, and plugin-owned entries. */
export interface ChannelsConfig {
  defaults?: ChannelDefaultsConfig;
  /** Map provider -> channel id -> model override. */
  modelByChannel?: ChannelModelByChannelConfig;
  discord?: DiscordConfig;
  googlechat?: GoogleChatConfig;
  imessage?: IMessageConfig;
  irc?: IrcConfig;
  msteams?: MSTeamsConfig;
  signal?: SignalConfig;
  slack?: SlackConfig;
  telegram?: TelegramConfig;
  whatsapp?: WhatsAppConfig;
  /**
   * Channel sections are plugin-owned and keyed by arbitrary channel ids.
   * Keep the lookup permissive so augmented channel configs remain ergonomic at call sites.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
