// utils message channel helpers and runtime behavior.
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
/** Re-exported API for src/utils. */
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
/** Re-exported API for src/utils. */
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

/** Re-exported API for src/utils, starting with GATEWAY CLIENT NAMES. */
export { GATEWAY_CLIENT_NAMES, GATEWAY_CLIENT_MODES };
/** Re-exported API for src/utils, starting with Gateway Client Name. */
export type { GatewayClientName, GatewayClientMode };
/** Re-exported API for src/utils, starting with normalize Gateway Client Name. */
export { normalizeGatewayClientName, normalizeGatewayClientMode };

type GatewayClientInfoLike = {
  mode?: string | null;
  id?: string | null;
};

/** Reused helper for is Gateway Cli Client behavior in src/utils. */
export function isGatewayCliClient(client?: GatewayClientInfoLike | null): boolean {
  return normalizeGatewayClientMode(client?.mode) === GATEWAY_CLIENT_MODES.CLI;
}

/** Reused helper for is Operator Ui Client behavior in src/utils. */
export function isOperatorUiClient(client?: GatewayClientInfoLike | null): boolean {
  const clientId = normalizeGatewayClientName(client?.id);
  return clientId === GATEWAY_CLIENT_NAMES.CONTROL_UI || clientId === GATEWAY_CLIENT_NAMES.TUI;
}

/** Reused helper for is Browser Operator Ui Client behavior in src/utils. */
export function isBrowserOperatorUiClient(client?: GatewayClientInfoLike | null): boolean {
  const clientId = normalizeGatewayClientName(client?.id);
  return clientId === GATEWAY_CLIENT_NAMES.CONTROL_UI;
}

/** Reused helper for is Internal Message Channel behavior in src/utils. */
export function isInternalMessageChannel(raw?: string | null): raw is InternalMessageChannel {
  return normalizeMessageChannel(raw) === INTERNAL_MESSAGE_CHANNEL;
}

/** Reused helper for is Webchat Client behavior in src/utils. */
export function isWebchatClient(client?: GatewayClientInfoLike | null): boolean {
  const mode = normalizeGatewayClientMode(client?.mode);
  if (mode === GATEWAY_CLIENT_MODES.WEBCHAT) {
    return true;
  }
  return normalizeGatewayClientName(client?.id) === GATEWAY_CLIENT_NAMES.WEBCHAT_UI;
}

/** Reused helper for is Markdown Capable Message Channel behavior in src/utils. */
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
