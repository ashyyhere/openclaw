// Runtime boundary for cron/isolated-agent delivery target runtime behavior.
import type { ChannelId } from "../../channels/plugins/types.public.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { resolveOutboundChannelPlugin } from "../../infra/outbound/channel-resolution.js";
import {
  resolveOutboundSessionRoute,
  type OutboundSessionRoute,
} from "../../infra/outbound/outbound-session.js";
import {
  resolveChannelTarget,
  type ResolvedMessagingTarget,
} from "../../infra/outbound/target-resolver.js";
/** Re-exported API for src/cron/isolated-agent, starting with get Loaded Channel Plugin For Read. */
export { getLoadedChannelPluginForRead } from "../../channels/plugins/registry-loaded-read.js";
/** Re-exported API for src/cron/isolated-agent, starting with map Allow From Entries. */
export { mapAllowFromEntries } from "../../plugin-sdk/channel-config-helpers.js";
/** Re-exported API for src/cron/isolated-agent, starting with resolve First Bound Account Id. */
export { resolveFirstBoundAccountId } from "../../routing/bound-account-read.js";

/** Reused helper for resolve Channel Target For Delivery behavior in src/cron/isolated-agent. */
export async function resolveChannelTargetForDelivery(params: {
  cfg: OpenClawConfig;
  channel: ChannelId;
  input: string;
  accountId?: string | null;
}): Promise<{ ok: true; target: ResolvedMessagingTarget } | { ok: false; error: Error }> {
  resolveOutboundChannelPlugin({
    channel: params.channel,
    cfg: params.cfg,
    allowBootstrap: true,
  });
  try {
    return await resolveChannelTarget({
      cfg: params.cfg,
      channel: params.channel,
      input: params.input,
      accountId: params.accountId,
      unknownTargetMode: "normalized",
    });
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err : new Error(String(err)),
    };
  }
}

/** Reused helper for resolve Outbound Session Route For Delivery behavior in src/cron/isolated-agent. */
export async function resolveOutboundSessionRouteForDelivery(params: {
  cfg: OpenClawConfig;
  channel: ChannelId;
  agentId: string;
  accountId?: string | null;
  target: string;
  resolvedTarget?: ResolvedMessagingTarget;
  threadId?: string | number | null;
  currentSessionKey?: string;
}): Promise<OutboundSessionRoute | null> {
  resolveOutboundChannelPlugin({
    channel: params.channel,
    cfg: params.cfg,
    allowBootstrap: true,
  });
  return await resolveOutboundSessionRoute(params);
}

/** Reused helper for channel Can Resolve Outbound Session Route behavior in src/cron/isolated-agent. */
export function channelCanResolveOutboundSessionRoute(params: {
  cfg: OpenClawConfig;
  channel: ChannelId;
}): boolean {
  return Boolean(
    resolveOutboundChannelPlugin({
      channel: params.channel,
      cfg: params.cfg,
      allowBootstrap: true,
    })?.messaging?.resolveOutboundSessionRoute,
  );
}
