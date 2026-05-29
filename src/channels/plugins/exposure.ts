// Channel plugin exposure helpers for public metadata.
import type { ChannelMeta } from "./types.core.js";

/** Reused helper for resolve Channel Exposure behavior in src/channels/plugins. */
export function resolveChannelExposure(
  meta: Pick<ChannelMeta, "exposure" | "showConfigured" | "showInSetup">,
) {
  return {
    configured: meta.exposure?.configured ?? meta.showConfigured ?? true,
    setup: meta.exposure?.setup ?? meta.showInSetup ?? true,
    docs: meta.exposure?.docs ?? true,
  };
}

/** Reused helper for is Channel Visible In Configured Lists behavior in src/channels/plugins. */
export function isChannelVisibleInConfiguredLists(
  meta: Pick<ChannelMeta, "exposure" | "showConfigured" | "showInSetup">,
): boolean {
  return resolveChannelExposure(meta).configured;
}

/** Reused helper for is Channel Visible In Setup behavior in src/channels/plugins. */
export function isChannelVisibleInSetup(
  meta: Pick<ChannelMeta, "exposure" | "showConfigured" | "showInSetup">,
): boolean {
  return resolveChannelExposure(meta).setup;
}
