// config types access groups helpers and runtime behavior.
/** Shared type for Discord Channel Audience Access Group in src/config. */
export type DiscordChannelAudienceAccessGroup = {
  /**
   * Discord dynamic audience backed by the users who can currently view a guild
   * channel.
   */
  type: "discord.channelAudience";
  /** Guild ID that owns the channel. */
  guildId: string;
  /** Channel ID whose effective ViewChannel permission defines the audience. */
  channelId: string;
  /** Audience predicate. Defaults to canViewChannel. */
  membership?: "canViewChannel";
};

/** Shared type for Message Senders Access Group in src/config. */
export type MessageSendersAccessGroup = {
  /**
   * Static sender allowlists that can be referenced by any message channel via
   * accessGroup:<name>.
   */
  type: "message.senders";
  /** Sender entries by channel id, plus optional "*" entries shared by all channels. */
  members: Record<string, string[]>;
};

/** Shared type for Access Group Config in src/config. */
export type AccessGroupConfig = DiscordChannelAudienceAccessGroup | MessageSendersAccessGroup;

/** Shared type for Access Groups Config in src/config. */
export type AccessGroupsConfig = Record<string, AccessGroupConfig>;
