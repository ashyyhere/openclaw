// Authorization helpers for config writes initiated from chat.
import {
  authorizeConfigWrite,
  canBypassConfigWritePolicy,
  formatConfigWriteDeniedMessage,
} from "../../channels/plugins/config-writes.js";
import type { ChannelId } from "../../channels/plugins/types.public.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";

/** Reused helper for resolve Config Write Denied Text behavior in src/auto-reply/reply. */
export function resolveConfigWriteDeniedText(params: {
  cfg: OpenClawConfig;
  channel?: string | null;
  originChannelId: ChannelId | null;
  originAccountId?: string;
  gatewayClientScopes?: string[];
  target: Parameters<typeof authorizeConfigWrite>[0]["target"];
  fallbackChannelId?: ChannelId | null;
}): string | null {
  const writeAuth = authorizeConfigWrite({
    cfg: params.cfg,
    origin: { channelId: params.originChannelId, accountId: params.originAccountId },
    target: params.target,
    allowBypass: canBypassConfigWritePolicy({
      channel: params.channel ?? "",
      gatewayClientScopes: params.gatewayClientScopes,
    }),
  });
  if (writeAuth.allowed) {
    return null;
  }
  return formatConfigWriteDeniedMessage({
    result: writeAuth,
    fallbackChannelId: params.fallbackChannelId ?? params.originChannelId,
  });
}
