// Public channel utility facade for gateway client identity, channel normalization, and markdown support checks.
import {
  GATEWAY_CLIENT_MODES,
  GATEWAY_CLIENT_NAMES,
  type GatewayClientMode,
  type GatewayClientName,
  normalizeGatewayClientMode,
  normalizeGatewayClientName,
} from "../../packages/gateway-protocol/src/client-info.js";
import { listBundledChannelCatalogEntries } from "../channels/bundled-channel-catalog-read.js";
import { getChatChannelMeta } from "../channels/chat-meta.js";
import { getRegisteredChannelPluginMeta, normalizeChatChannelId } from "../channels/registry.js";
/** Re-export message-channel normalization helpers from the narrow module. */
export {
  isDeliverableMessageChannel,
  isGatewayMessageChannel,
  listDeliverableMessageChannels,
  normalizeMessageChannel,
  resolveGatewayMessageChannel,
  resolveMessageChannel,
  type DeliverableMessageChannel,
  type GatewayMessageChannel,
} from "./message-channel-normalize.js";
/** Re-export internal channel constants from the narrow module. */
export {
  INTERNAL_MESSAGE_CHANNEL,
  INTERNAL_NON_DELIVERY_CHANNELS,
  isInternalNonDeliveryChannel,
  type InternalMessageChannel,
} from "./message-channel-constants.js";
import {
  INTERNAL_MESSAGE_CHANNEL,
  type InternalMessageChannel,
} from "./message-channel-constants.js";
import { normalizeMessageChannel } from "./message-channel-normalize.js";

/** Re-export gateway client enum constants. */
export { GATEWAY_CLIENT_NAMES, GATEWAY_CLIENT_MODES };
/** Re-export gateway client identity types. */
export type { GatewayClientName, GatewayClientMode };
/** Re-export gateway client normalization helpers. */
export { normalizeGatewayClientName, normalizeGatewayClientMode };

type GatewayClientInfoLike = {
  mode?: string | null;
  id?: string | null;
};

/** Checks whether a gateway client info block represents the CLI. */
export function isGatewayCliClient(client?: GatewayClientInfoLike | null): boolean {
  return normalizeGatewayClientMode(client?.mode) === GATEWAY_CLIENT_MODES.CLI;
}

/** Checks whether a gateway client is one of the operator UIs. */
export function isOperatorUiClient(client?: GatewayClientInfoLike | null): boolean {
  const clientId = normalizeGatewayClientName(client?.id);
  return clientId === GATEWAY_CLIENT_NAMES.CONTROL_UI || clientId === GATEWAY_CLIENT_NAMES.TUI;
}

/** Checks whether a gateway client is specifically the browser-based control UI. */
export function isBrowserOperatorUiClient(client?: GatewayClientInfoLike | null): boolean {
  const clientId = normalizeGatewayClientName(client?.id);
  return clientId === GATEWAY_CLIENT_NAMES.CONTROL_UI;
}

/** Checks whether a raw channel resolves to the canonical internal channel. */
export function isInternalMessageChannel(raw?: string | null): raw is InternalMessageChannel {
  return normalizeMessageChannel(raw) === INTERNAL_MESSAGE_CHANNEL;
}

/** Checks whether gateway client metadata identifies webchat delivery. */
export function isWebchatClient(client?: GatewayClientInfoLike | null): boolean {
  const mode = normalizeGatewayClientMode(client?.mode);
  if (mode === GATEWAY_CLIENT_MODES.WEBCHAT) {
    return true;
  }
  return normalizeGatewayClientName(client?.id) === GATEWAY_CLIENT_NAMES.WEBCHAT_UI;
}

/** Resolves bundled/plugin metadata to decide whether a channel supports markdown output. */
export function isMarkdownCapableMessageChannel(raw?: string | null): boolean {
  const channel = normalizeMessageChannel(raw);
  if (!channel) {
    return false;
  }
  if (channel === INTERNAL_MESSAGE_CHANNEL || channel === "tui") {
    return true;
  }
  const builtInChannel = normalizeChatChannelId(channel);
  if (builtInChannel) {
    const builtInMeta = getChatChannelMeta(builtInChannel);
    if (builtInMeta) {
      return builtInMeta.markdownCapable === true;
    }
    const catalogMeta = listBundledChannelCatalogEntries().find(
      (entry) => entry.id === builtInChannel,
    );
    if (catalogMeta) {
      return catalogMeta.channel.markdownCapable === true;
    }
  }
  return getRegisteredChannelPluginMeta(channel)?.markdownCapable === true;
}
