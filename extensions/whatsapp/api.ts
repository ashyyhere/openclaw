// extensions/whatsapp api helpers and runtime behavior.
/** Re-exported whatsapp plugin public API, starting with whatsapp Plugin. */
export { whatsappPlugin } from "./src/channel.js";
/** Re-exported whatsapp plugin public API, starting with whatsapp Setup Plugin. */
export { whatsappSetupPlugin } from "./src/channel.setup.js";
/** Re-exported whatsapp plugin public API. */
export {
  DEFAULT_WHATSAPP_MEDIA_MAX_MB,
  hasAnyWhatsAppAuth,
  listEnabledWhatsAppAccounts,
  listWhatsAppAccountIds,
  listWhatsAppAuthDirs,
  resolveDefaultWhatsAppAccountId,
  type ResolvedWhatsAppAccount,
  resolveWhatsAppAccount,
  resolveWhatsAppAuthDir,
  resolveWhatsAppMediaMaxBytes,
} from "./src/accounts.js";
/** Re-exported whatsapp plugin public API, starting with DEFAULT WEB MEDIA BYTES. */
export { DEFAULT_WEB_MEDIA_BYTES } from "./src/auto-reply/constants.js";
/** Re-exported whatsapp plugin public API, starting with whatsapp Command Policy. */
export { whatsappCommandPolicy } from "./src/command-policy.js";
/** Re-exported whatsapp plugin public API. */
export {
  resolveWhatsAppGroupRequireMention,
  resolveWhatsAppGroupToolPolicy,
} from "./src/group-policy.js";
/** Re-exported whatsapp plugin public API, starting with WHATSAPP LEGACY OUTBOUND SEND DEP KEYS. */
export { WHATSAPP_LEGACY_OUTBOUND_SEND_DEP_KEYS } from "./src/outbound-send-deps.js";
/** Re-exported whatsapp plugin public API. */
export {
  assertWebChannel,
  isSelfChatMode,
  jidToE164,
  markdownToWhatsApp,
  normalizeE164,
  resolveJidToE164,
  resolveUserPath,
  toWhatsappJid,
  toWhatsappJidWithLid,
  type JidToE164Options,
  type WebChannel,
} from "./src/text-runtime.js";
/** Re-exported whatsapp plugin public API. */
export {
  type WebChannelHealthState,
  type WebChannelStatus,
  type WebInboundMsg,
  type WebMonitorTuning,
} from "./src/auto-reply/types.js";
/** Re-exported whatsapp plugin public API. */
export {
  type ActiveWebListener,
  type ActiveWebSendOptions,
  type WebInboundMessage,
  type WebListenerCloseReason,
  type WhatsAppStructuredContactContext,
} from "./src/inbound/types.js";
/** Re-exported whatsapp plugin public API. */
export {
  listWhatsAppDirectoryGroupsFromConfig,
  listWhatsAppDirectoryPeersFromConfig,
} from "./src/directory-config.js";
/** Re-exported whatsapp plugin public API, starting with resolve Whats App Outbound Target. */
export { resolveWhatsAppOutboundTarget } from "./src/resolve-outbound-target.js";
/** Re-exported whatsapp plugin public API. */
export {
  isWhatsAppGroupJid,
  normalizeWhatsAppAllowFromEntries,
  isWhatsAppUserTarget,
  looksLikeWhatsAppTargetId,
  normalizeWhatsAppMessagingTarget,
  normalizeWhatsAppTarget,
} from "./src/normalize-target.js";
/** Re-exported whatsapp plugin public API, starting with resolve Whats App Group Intro Hint. */
export { resolveWhatsAppGroupIntroHint } from "./src/runtime-api.js";
/** Re-exported whatsapp plugin public API, starting with testing. */
export { testing as whatsappAccessControlTesting } from "./src/inbound/access-control.js";
/** Re-exported whatsapp plugin public API. */
export {
  startWhatsAppQaDriverSession,
  type WhatsAppQaDriverObservedMessage,
  type WhatsAppQaDriverSession,
} from "./src/qa-driver.runtime.js";
