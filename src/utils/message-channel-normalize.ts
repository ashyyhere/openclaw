// Normalizes channel ids and separates deliverable chat channels from gateway-only internal channels.
import { CHANNEL_IDS } from "../channels/ids.js";
import { listRegisteredChannelPluginIds } from "../channels/registry.js";
import { uniqueStrings } from "../shared/string-normalization.js";
import {
  INTERNAL_MESSAGE_CHANNEL,
  type InternalMessageChannel,
} from "./message-channel-constants.js";
import { normalizeMessageChannel as normalizeMessageChannelCore } from "./message-channel-core.js";

type ChannelId = string & { readonly __openclawChannelIdBrand?: never };

/** Channel id that can be delivered through a bundled or registered chat channel. */
export type DeliverableMessageChannel = ChannelId;

/** Channel id accepted by the gateway, including internal webchat. */
export type GatewayMessageChannel = DeliverableMessageChannel;

/** Normalizes user/plugin channel text into the canonical lowercase channel id form. */
export function normalizeMessageChannel(raw?: string | null): string | undefined {
  return normalizeMessageChannelCore(raw);
}

const listPluginChannelIds = (): string[] => {
  return listRegisteredChannelPluginIds();
};

/** Lists bundled and currently registered plugin channels that can receive delivery. */
export const listDeliverableMessageChannels = (): ChannelId[] =>
  uniqueStrings([...CHANNEL_IDS, ...listPluginChannelIds()]) as ChannelId[];

const listGatewayMessageChannels = (): GatewayMessageChannel[] => [
  ...listDeliverableMessageChannels(),
  INTERNAL_MESSAGE_CHANNEL,
];

/** Checks whether a channel is accepted by gateway protocol handlers. */
export function isGatewayMessageChannel(value: string): value is GatewayMessageChannel {
  return listGatewayMessageChannels().includes(value as GatewayMessageChannel);
}

/** Checks whether a channel can be sent through a real channel implementation. */
export function isDeliverableMessageChannel(value: string): value is DeliverableMessageChannel {
  return listDeliverableMessageChannels().includes(value as DeliverableMessageChannel);
}

/** Normalizes and validates a raw gateway channel value. */
export function resolveGatewayMessageChannel(
  raw?: string | null,
): GatewayMessageChannel | undefined {
  const normalized = normalizeMessageChannel(raw);
  if (!normalized) {
    return undefined;
  }
  return isGatewayMessageChannel(normalized) ? normalized : undefined;
}

/** Resolves a primary channel with fallback, returning the first normalized value. */
export function resolveMessageChannel(
  primary?: string | null,
  fallback?: string | null,
): string | undefined {
  return normalizeMessageChannel(primary) ?? normalizeMessageChannel(fallback);
}

/** Re-export internal channel type for callers that only need normalization types. */
export type { InternalMessageChannel };
