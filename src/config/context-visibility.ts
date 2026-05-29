// config context visibility helpers and runtime behavior.
import { resolveAccountEntry } from "../routing/account-lookup.js";
import { normalizeAccountId } from "../routing/session-key.js";
import type { OpenClawConfig } from "./config.js";
import type { ContextVisibilityMode } from "./types.base.js";

type ChannelContextVisibilityConfig = {
  contextVisibility?: ContextVisibilityMode;
  accounts?: Record<string, { contextVisibility?: ContextVisibilityMode }>;
};

type ContextVisibilityDefaultsConfig = {
  channels?: {
    defaults?: {
      contextVisibility?: ContextVisibilityMode;
    };
  };
};

/** Reused helper for resolve Default Context Visibility behavior in src/config. */
export function resolveDefaultContextVisibility(
  cfg: ContextVisibilityDefaultsConfig,
): ContextVisibilityMode | undefined {
  return cfg.channels?.defaults?.contextVisibility;
}

/** Reused helper for resolve Channel Context Visibility Mode behavior in src/config. */
export function resolveChannelContextVisibilityMode(params: {
  cfg: OpenClawConfig;
  channel: string;
  accountId?: string | null;
  configuredContextVisibility?: ContextVisibilityMode;
}): ContextVisibilityMode {
  if (params.configuredContextVisibility) {
    return params.configuredContextVisibility;
  }
  const channelConfig = params.cfg.channels?.[params.channel] as
    | ChannelContextVisibilityConfig
    | undefined;
  const accountId = normalizeAccountId(params.accountId);
  const accountMode = resolveAccountEntry(channelConfig?.accounts, accountId)?.contextVisibility;
  return (
    accountMode ??
    channelConfig?.contextVisibility ??
    resolveDefaultContextVisibility(params.cfg) ??
    "all"
  );
}
