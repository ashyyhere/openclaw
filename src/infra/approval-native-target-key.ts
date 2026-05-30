// Builds dedupe keys for native approval delivery targets.
import type { ChannelApprovalNativeTarget } from "../channels/plugins/approval-native.types.js";
import { channelRouteDedupeKey } from "../plugin-sdk/channel-route.js";

/** Builds a stable channel-route key from native approval target fields. */
export function buildChannelApprovalNativeTargetKey(target: ChannelApprovalNativeTarget): string {
  return channelRouteDedupeKey({
    to: target.to,
    threadId: target.threadId,
  });
}
