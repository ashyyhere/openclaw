// infra approval native target key helpers and runtime behavior.
import type { ChannelApprovalNativeTarget } from "../channels/plugins/approval-native.types.js";
import { channelRouteDedupeKey } from "../plugin-sdk/channel-route.js";

/** Reused helper for build Channel Approval Native Target Key behavior in src/infra. */
export function buildChannelApprovalNativeTargetKey(target: ChannelApprovalNativeTarget): string {
  return channelRouteDedupeKey({
    to: target.to,
    threadId: target.threadId,
  });
}
