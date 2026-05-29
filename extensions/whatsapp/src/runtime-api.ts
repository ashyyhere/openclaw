// extensions/whatsapp/src runtime api helpers and runtime behavior.
/** Re-exported whatsapp plugin public API, starting with get Chat Channel Meta. */
export { getChatChannelMeta, type ChannelPlugin } from "openclaw/plugin-sdk/core";
/** Re-exported whatsapp plugin public API, starting with build Channel Config Schema. */
export { buildChannelConfigSchema, WhatsAppConfigSchema } from "../config-api.js";
/** Re-exported whatsapp plugin public API, starting with DEFAULT ACCOUNT ID. */
export { DEFAULT_ACCOUNT_ID } from "openclaw/plugin-sdk/account-id";
/** Re-exported whatsapp plugin public API. */
export {
  formatWhatsAppConfigAllowFromEntries,
  resolveWhatsAppConfigAllowFrom,
  resolveWhatsAppConfigDefaultTo,
} from "./config-accessors.js";
/** Re-exported whatsapp plugin public API. */
export {
  createActionGate,
  jsonResult,
  readReactionParams,
  readStringParam,
  ToolAuthorizationError,
} from "openclaw/plugin-sdk/channel-actions";
/** Re-exported whatsapp plugin public API, starting with normalize E164. */
export { normalizeE164 } from "openclaw/plugin-sdk/account-resolution";
/** Re-exported whatsapp plugin public API, starting with Dm Policy. */
export type { DmPolicy, GroupPolicy } from "openclaw/plugin-sdk/config-contracts";
import type { OpenClawConfig as RuntimeOpenClawConfig } from "openclaw/plugin-sdk/config-contracts";

/** Re-exported whatsapp plugin public API, starting with type. */
export { type ChannelMessageActionName } from "openclaw/plugin-sdk/channel-contract";
/** Re-exported whatsapp plugin public API, starting with load Outbound Media From Url. */
export { loadOutboundMediaFromUrl } from "./outbound-media.runtime.js";
/** Re-exported whatsapp plugin public API. */
export {
  resolveWhatsAppGroupRequireMention,
  resolveWhatsAppGroupToolPolicy,
} from "./group-policy.js";
/** Re-exported whatsapp plugin public API. */
export {
  resolveWhatsAppGroupIntroHint,
  resolveWhatsAppMentionStripRegexes,
} from "./group-intro.js";
/** Re-exported whatsapp plugin public API, starting with create Whats App Outbound Base. */
export { createWhatsAppOutboundBase } from "./outbound-base.js";
/** Re-exported whatsapp plugin public API. */
export {
  isWhatsAppGroupJid,
  isWhatsAppUserTarget,
  looksLikeWhatsAppTargetId,
  normalizeWhatsAppAllowFromEntries,
  normalizeWhatsAppMessagingTarget,
  normalizeWhatsAppTarget,
} from "./normalize-target.js";
/** Re-exported whatsapp plugin public API, starting with resolve Whats App Outbound Target. */
export { resolveWhatsAppOutboundTarget } from "./resolve-outbound-target.js";
/** Re-exported whatsapp plugin public API, starting with resolve Whats App Reaction Level. */
export { resolveWhatsAppReactionLevel } from "./reaction-level.js";

/** Public whatsapp plugin type for Open Claw Config. */
export type OpenClawConfig = RuntimeOpenClawConfig;
/** Re-exported whatsapp plugin public API, starting with Whats App Account Config. */
export type { WhatsAppAccountConfig } from "./account-types.js";

type MonitorWebChannel = typeof import("./channel.runtime.js").monitorWebChannel;

let channelRuntimePromise: Promise<typeof import("./channel.runtime.js")> | null = null;

function loadChannelRuntime() {
  channelRuntimePromise ??= import("./channel.runtime.js");
  return channelRuntimePromise;
}

/** Public whatsapp plugin helper for monitor Web Channel behavior. */
export async function monitorWebChannel(
  ...args: Parameters<MonitorWebChannel>
): ReturnType<MonitorWebChannel> {
  const { monitorWebChannel } = await loadChannelRuntime();
  return await monitorWebChannel(...args);
}
