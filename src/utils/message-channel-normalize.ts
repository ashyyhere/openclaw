// utils message channel normalize helpers and runtime behavior.
import { CHANNEL_IDS } from "../channels/ids.js";
import { listRegisteredChannelPluginIds } from "../channels/registry.js";
import { uniqueStrings } from "../shared/string-normalization.js";
import {
  INTERNAL_MESSAGE_CHANNEL,
  type InternalMessageChannel,
} from "./message-channel-constants.js";
import { normalizeMessageChannel as normalizeMessageChannelCore } from "./message-channel-core.js";

type ChannelId = string & { readonly __openclawChannelIdBrand?: never };

/** Shared type for Deliverable Message Channel in src/utils. */
export type DeliverableMessageChannel = ChannelId;

/** Shared type for Gateway Message Channel in src/utils. */
export type GatewayMessageChannel = DeliverableMessageChannel;

/** Reused helper for normalize Message Channel behavior in src/utils. */
export function normalizeMessageChannel(raw?: string | null): string | undefined {
  return normalizeMessageChannelCore(raw);
}

const listPluginChannelIds = (): string[] => {
  return listRegisteredChannelPluginIds();
};

/** Reused constant for list Deliverable Message Channels behavior in src/utils. */
export const listDeliverableMessageChannels = (): ChannelId[] =>
  uniqueStrings([...CHANNEL_IDS, ...listPluginChannelIds()]) as ChannelId[];

const listGatewayMessageChannels = (): GatewayMessageChannel[] => [
  ...listDeliverableMessageChannels(),
  INTERNAL_MESSAGE_CHANNEL,
];

/** Reused helper for is Gateway Message Channel behavior in src/utils. */
export function isGatewayMessageChannel(value: string): value is GatewayMessageChannel {
  return listGatewayMessageChannels().includes(value as GatewayMessageChannel);
}

/** Reused helper for is Deliverable Message Channel behavior in src/utils. */
export function isDeliverableMessageChannel(value: string): value is DeliverableMessageChannel {
  return listDeliverableMessageChannels().includes(value as DeliverableMessageChannel);
}

/** Reused helper for resolve Gateway Message Channel behavior in src/utils. */
export function resolveGatewayMessageChannel(
  raw?: string | null,
): GatewayMessageChannel | undefined {
  const normalized = normalizeMessageChannel(raw);
  if (!normalized) {
    return undefined;
  }
  return isGatewayMessageChannel(normalized) ? normalized : undefined;
}

/** Reused helper for resolve Message Channel behavior in src/utils. */
export function resolveMessageChannel(
  primary?: string | null,
  fallback?: string | null,
): string | undefined {
  return normalizeMessageChannel(primary) ?? normalizeMessageChannel(fallback);
}

/** Re-exported API for src/utils, starting with Internal Message Channel. */
export type { InternalMessageChannel };
