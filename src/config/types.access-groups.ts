// Access group config contracts for dynamic Discord audiences and static sender allowlists.
/** Dynamic access group backed by Discord channel visibility. */
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

/** Static sender allowlist access group usable by message channels. */
export type MessageSendersAccessGroup = {
  /**
   * Static sender allowlists that can be referenced by any message channel via
   * accessGroup:<name>.
   */
  type: "message.senders";
  /** Sender entries by channel id, plus optional "*" entries shared by all channels. */
  members: Record<string, string[]>;
};

/** Supported access group definition shape. */
export type AccessGroupConfig = DiscordChannelAudienceAccessGroup | MessageSendersAccessGroup;

/** Named access groups keyed by config-visible group id. */
export type AccessGroupsConfig = Record<string, AccessGroupConfig>;
