// Config-driven media size ceilings layered over the built-in defaults.
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { maxBytesForKind, type MediaKind } from "./constants.js";

const MB = 1024 * 1024;

/** Resolve the global configured media ceiling, in bytes, when set. */
export function resolveConfiguredMediaMaxBytes(cfg?: OpenClawConfig): number | undefined {
  const configured = cfg?.agents?.defaults?.mediaMaxMb;
  if (typeof configured === "number" && Number.isFinite(configured) && configured > 0) {
    return Math.floor(configured * MB);
  }
  return undefined;
}

/** Resolve the byte ceiling for generated media of a given kind. */
export function resolveGeneratedMediaMaxBytes(cfg: OpenClawConfig | undefined, kind: MediaKind) {
  return resolveConfiguredMediaMaxBytes(cfg) ?? maxBytesForKind(kind);
}

/** Resolve channel/account media ceiling overrides in megabytes. */
export function resolveChannelAccountMediaMaxMb(params: {
  cfg: OpenClawConfig;
  channel?: string | null;
  accountId?: string | null;
}): number | undefined {
  const channelId = params.channel?.trim();
  const accountId = params.accountId?.trim();
  const channelCfg = channelId ? params.cfg.channels?.[channelId] : undefined;
  const channelObj =
    channelCfg && typeof channelCfg === "object"
      ? (channelCfg as Record<string, unknown>)
      : undefined;
  const channelMediaMax =
    typeof channelObj?.mediaMaxMb === "number" ? channelObj.mediaMaxMb : undefined;
  const accountsObj =
    channelObj?.accounts && typeof channelObj.accounts === "object"
      ? (channelObj.accounts as Record<string, unknown>)
      : undefined;
  const accountCfg = accountId && accountsObj ? accountsObj[accountId] : undefined;
  const accountMediaMax =
    accountCfg && typeof accountCfg === "object"
      ? (accountCfg as Record<string, unknown>).mediaMaxMb
      : undefined;
  return (typeof accountMediaMax === "number" ? accountMediaMax : undefined) ?? channelMediaMax;
}
