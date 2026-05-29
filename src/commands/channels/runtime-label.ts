/** Resolves human-readable channel runtime labels for command output. */
import { getBundledChannelSetupPlugin } from "../../channels/plugins/bundled.js";
import { getChannelPlugin, getLoadedChannelPlugin } from "../../channels/plugins/index.js";
import type { ChatChannel } from "./shared.js";

/** Reused constant for channel Label behavior in src/commands/channels. */
export const channelLabel = (channel: ChatChannel) => {
  const plugin =
    getLoadedChannelPlugin(channel) ??
    getBundledChannelSetupPlugin(channel) ??
    getChannelPlugin(channel);
  return plugin?.meta.label ?? channel;
};
