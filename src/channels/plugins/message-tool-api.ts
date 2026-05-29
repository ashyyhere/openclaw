// Message tool API exposed by channel plugins.
import { loadBundledPluginPublicArtifactModuleSync } from "../../plugins/public-surface-loader.js";
import type { ChannelMessageActionAdapter, ChannelMessageToolDiscovery } from "./types.public.js";

/** Shared type for Channel Message Tool Discovery Adapter in src/channels/plugins. */
export type ChannelMessageToolDiscoveryAdapter = Pick<
  ChannelMessageActionAdapter,
  "describeMessageTool"
>;

type MessageToolApi = {
  describeMessageTool?: ChannelMessageToolDiscoveryAdapter["describeMessageTool"];
};

const MESSAGE_TOOL_API_ARTIFACT_BASENAME = "message-tool-api.js";
const MISSING_PUBLIC_SURFACE_PREFIX = "Unable to resolve bundled plugin public surface ";

function loadBundledChannelMessageToolApi(channelId: string): MessageToolApi | undefined {
  const cacheKey = channelId.trim();
  try {
    return loadBundledPluginPublicArtifactModuleSync<MessageToolApi>({
      dirName: cacheKey,
      artifactBasename: MESSAGE_TOOL_API_ARTIFACT_BASENAME,
    });
  } catch (error) {
    if (error instanceof Error && error.message.startsWith(MISSING_PUBLIC_SURFACE_PREFIX)) {
      return undefined;
    }
    throw error;
  }
}

/** Reused helper for resolve Bundled Channel Message Tool Discovery Adapter behavior in src/channels/plugins. */
export function resolveBundledChannelMessageToolDiscoveryAdapter(
  channelId: string,
): ChannelMessageToolDiscoveryAdapter | undefined {
  const describeMessageTool = loadBundledChannelMessageToolApi(channelId)?.describeMessageTool;
  if (typeof describeMessageTool !== "function") {
    return undefined;
  }
  return { describeMessageTool };
}

/** Reused helper for describe Bundled Channel Message Tool behavior in src/channels/plugins. */
export function describeBundledChannelMessageTool(params: {
  channelId: string;
  context: Parameters<NonNullable<ChannelMessageToolDiscoveryAdapter["describeMessageTool"]>>[0];
}): ChannelMessageToolDiscovery | null | undefined {
  const describeMessageTool = loadBundledChannelMessageToolApi(
    params.channelId,
  )?.describeMessageTool;
  if (typeof describeMessageTool !== "function") {
    return undefined;
  }
  return describeMessageTool(params.context) ?? null;
}
