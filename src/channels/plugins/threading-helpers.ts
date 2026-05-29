/** Builds channel threading adapters from static or scoped config values. */
import type { ReplyToMode } from "../../config/types.base.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { ChannelThreadingAdapter } from "./types.core.js";

type ReplyToModeResolver = NonNullable<ChannelThreadingAdapter["resolveReplyToMode"]>;

/** Reused helper for create Static Reply To Mode Resolver behavior in src/channels/plugins. */
export function createStaticReplyToModeResolver(mode: ReplyToMode): ReplyToModeResolver {
  return () => mode;
}

/** Reused helper for create Top Level Channel Reply To Mode Resolver behavior in src/channels/plugins. */
export function createTopLevelChannelReplyToModeResolver(channelId: string): ReplyToModeResolver {
  return ({ cfg }) => {
    const channelConfig = (
      cfg.channels as Record<string, { replyToMode?: ReplyToMode }> | undefined
    )?.[channelId];
    return channelConfig?.replyToMode ?? "off";
  };
}

/** Reused helper for create Scoped Account Reply To Mode Resolver behavior in src/channels/plugins. */
export function createScopedAccountReplyToModeResolver<TAccount>(params: {
  resolveAccount: (cfg: OpenClawConfig, accountId?: string | null) => TAccount;
  resolveReplyToMode: (
    account: TAccount,
    chatType?: string | null,
  ) => ReplyToMode | null | undefined;
  fallback?: ReplyToMode;
}): ReplyToModeResolver {
  return ({ cfg, accountId, chatType }) =>
    params.resolveReplyToMode(params.resolveAccount(cfg, accountId), chatType) ??
    params.fallback ??
    "off";
}
