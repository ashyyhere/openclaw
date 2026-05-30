// Resolves id-like outbound targets through plugin messaging directories.
import type { ChannelDirectoryEntryKind, ChannelId } from "../../channels/plugins/types.public.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { maybeResolvePluginMessagingTarget } from "./target-normalization.js";

/** Plugin-normalized id-like target resolved from a raw user input. */
export type ResolvedIdLikeTarget = {
  to: string;
  kind: ChannelDirectoryEntryKind | "channel";
  display?: string;
  source: "normalized" | "directory";
};

/** Resolves a target only when the plugin can treat it as an id-like destination. */
export async function maybeResolveIdLikeTarget(params: {
  cfg: OpenClawConfig;
  channel: ChannelId;
  input: string;
  accountId?: string | null;
  preferredKind?: ChannelDirectoryEntryKind | "channel";
}): Promise<ResolvedIdLikeTarget | undefined> {
  const target = await maybeResolvePluginMessagingTarget({
    ...params,
    requireIdLike: true,
  });
  if (!target) {
    return undefined;
  }
  return target;
}
