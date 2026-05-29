// extensions/telegram runtime api helpers and runtime behavior.
/** Re-exported telegram plugin public API, starting with Open Claw Plugin Api. */
export type { OpenClawPluginApi } from "openclaw/plugin-sdk/plugin-entry";
/** Re-exported telegram plugin public API, starting with Channel Message Action Adapter. */
export type { ChannelMessageActionAdapter } from "openclaw/plugin-sdk/channel-contract";
/** Re-exported telegram plugin public API, starting with Telegram Api Override. */
export type { TelegramApiOverride } from "./src/send.js";
/** Re-exported telegram plugin public API. */
export type {
  OpenClawPluginService,
  OpenClawPluginServiceContext,
  PluginLogger,
} from "openclaw/plugin-sdk/plugin-entry";
import type { OpenClawConfig as RuntimeOpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
/** Re-exported telegram plugin public API, starting with Plugin Runtime. */
export type { PluginRuntime } from "openclaw/plugin-sdk/runtime-store";
/** Re-exported telegram plugin public API. */
export type {
  AcpRuntime,
  AcpRuntimeCapabilities,
  AcpRuntimeDoctorReport,
  AcpRuntimeEnsureInput,
  AcpRuntimeEvent,
  AcpRuntimeHandle,
  AcpRuntimeStatus,
  AcpRuntimeTurnInput,
  AcpRuntimeErrorCode,
  AcpSessionUpdateTag,
} from "openclaw/plugin-sdk/acp-runtime";
/** Re-exported telegram plugin public API, starting with Acp Runtime Error. */
export { AcpRuntimeError } from "openclaw/plugin-sdk/acp-runtime";

/** Re-exported telegram plugin public API. */
export {
  emptyPluginConfigSchema,
  formatPairingApproveHint,
  getChatChannelMeta,
} from "openclaw/plugin-sdk/channel-plugin-common";
/** Re-exported telegram plugin public API, starting with clear Account Entry Fields. */
export { clearAccountEntryFields } from "openclaw/plugin-sdk/channel-core";
/** Re-exported telegram plugin public API, starting with build Channel Config Schema. */
export { buildChannelConfigSchema, TelegramConfigSchema } from "./config-api.js";
/** Re-exported telegram plugin public API, starting with DEFAULT ACCOUNT ID. */
export { DEFAULT_ACCOUNT_ID, normalizeAccountId } from "openclaw/plugin-sdk/account-id";
/** Re-exported telegram plugin public API. */
export {
  PAIRING_APPROVED_MESSAGE,
  buildTokenChannelStatusSummary,
  projectCredentialSnapshotFields,
  resolveConfiguredFromCredentialStatuses,
} from "openclaw/plugin-sdk/channel-status";
/** Re-exported telegram plugin public API. */
export {
  jsonResult,
  readNumberParam,
  readReactionParams,
  readStringArrayParam,
  readStringOrNumberParam,
  readStringParam,
  resolvePollMaxSelections,
} from "openclaw/plugin-sdk/channel-actions";
/** Re-exported telegram plugin public API, starting with Telegram Probe. */
export type { TelegramProbe } from "./src/probe.js";
/** Re-exported telegram plugin public API, starting with audit Telegram Group Membership. */
export { auditTelegramGroupMembership, collectTelegramUnmentionedGroupIds } from "./src/audit.js";
/** Re-exported telegram plugin public API, starting with resolve Telegram Runtime Group Policy. */
export { resolveTelegramRuntimeGroupPolicy } from "./src/group-access.js";
/** Re-exported telegram plugin public API. */
export {
  buildTelegramExecApprovalPendingPayload,
  shouldSuppressTelegramExecApprovalForwardingFallback,
} from "./src/exec-approval-forwarding.js";
/** Re-exported telegram plugin public API, starting with telegram Message Actions. */
export { telegramMessageActions } from "./src/channel-actions.js";
/** Re-exported telegram plugin public API, starting with monitor Telegram Provider. */
export { monitorTelegramProvider } from "./src/monitor.js";
/** Re-exported telegram plugin public API, starting with probe Telegram. */
export { probeTelegram } from "./src/probe.js";
/** Re-exported telegram plugin public API. */
export {
  resolveTelegramFetch,
  resolveTelegramTransport,
  shouldRetryTelegramTransportFallback,
} from "./src/fetch.js";
/** Re-exported telegram plugin public API, starting with make Proxy Fetch. */
export { makeProxyFetch } from "./src/proxy.js";
/** Re-exported telegram plugin public API. */
export {
  createForumTopicTelegram,
  deleteMessageTelegram,
  editForumTopicTelegram,
  editMessageReplyMarkupTelegram,
  editMessageTelegram,
  pinMessageTelegram,
  reactMessageTelegram,
  renameForumTopicTelegram,
  sendMessageTelegram,
  sendPollTelegram,
  sendStickerTelegram,
  sendTypingTelegram,
  unpinMessageTelegram,
} from "./src/send.js";
/** Re-exported telegram plugin public API. */
export {
  createTelegramThreadBindingManager,
  getTelegramThreadBindingManager,
  resetTelegramThreadBindingsForTests,
  setTelegramThreadBindingIdleTimeoutBySessionKey,
  setTelegramThreadBindingMaxAgeBySessionKey,
} from "./src/thread-bindings.js";
/** Re-exported telegram plugin public API, starting with resolve Telegram Token. */
export { resolveTelegramToken } from "./src/token.js";
/** Re-exported telegram plugin public API, starting with set Telegram Runtime. */
export { setTelegramRuntime } from "./src/runtime.js";
/** Re-exported telegram plugin public API, starting with Channel Plugin. */
export type { ChannelPlugin } from "openclaw/plugin-sdk/channel-core";
/** Re-exported telegram plugin public API, starting with Open Claw Config. */
export type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
/** Public telegram plugin type for Telegram Account Config. */
export type TelegramAccountConfig = NonNullable<
  NonNullable<RuntimeOpenClawConfig["channels"]>["telegram"]
>;
/** Public telegram plugin type for Telegram Action Config. */
export type TelegramActionConfig = NonNullable<TelegramAccountConfig["actions"]>;
/** Public telegram plugin type for Telegram Network Config. */
export type TelegramNetworkConfig = NonNullable<TelegramAccountConfig["network"]>;
/** Re-exported telegram plugin public API, starting with parse Telegram Topic Conversation. */
export { parseTelegramTopicConversation } from "./src/topic-conversation.js";
/** Re-exported telegram plugin public API, starting with resolve Telegram Poll Visibility. */
export { resolveTelegramPollVisibility } from "./src/poll-visibility.js";
