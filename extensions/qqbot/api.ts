// extensions/qqbot api helpers and runtime behavior.
/** Re-exported qqbot plugin public API, starting with qqbot Plugin. */
export { qqbotPlugin } from "./src/channel.js";
/** Re-exported qqbot plugin public API, starting with qqbot Setup Plugin. */
export { qqbotSetupPlugin } from "./src/channel.setup.js";
/** Re-exported qqbot plugin public API, starting with get Framework Commands. */
export { getFrameworkCommands } from "./src/engine/commands/slash-commands-impl.js";
/** Re-exported qqbot plugin public API, starting with register Channel Tool. */
export { registerChannelTool } from "./src/bridge/tools/channel.js";
/** Re-exported qqbot plugin public API, starting with register Remind Tool. */
export { registerRemindTool } from "./src/bridge/tools/remind.js";
/** Re-exported qqbot plugin public API, starting with register QQBot Tools. */
export { registerQQBotTools } from "./src/bridge/tools/index.js";
/** Re-exported qqbot plugin public API, starting with register QQBot Full. */
export { registerQQBotFull } from "./src/bridge/channel-entry.js";
/** Re-exported qqbot plugin public API. */
export {
  type AudioFormatPolicy,
  type C2CMessageEvent,
  type GroupMessageEvent,
  type GuildMessageEvent,
  type MessageAttachment,
  type QQBotAccountConfig,
  type QQBotConfig,
  type QQBotDmPolicy,
  type QQBotExecApprovalConfig,
  type QQBotGroupPolicy,
  type ResolvedQQBotAccount,
  type WSPayload,
} from "./src/types.js";
/** Re-exported qqbot plugin public API. */
export {
  applyQQBotAccountConfig,
  DEFAULT_ACCOUNT_ID,
  listQQBotAccountIds,
  resolveDefaultQQBotAccountId,
  resolveQQBotAccount,
} from "./src/bridge/config.js";
/** Re-exported qqbot plugin public API. */
export {
  buildMediaTarget,
  checkMessageReplyLimit,
  DEFAULT_MEDIA_SEND_ERROR,
  getMessageReplyConfig,
  getMessageReplyStats,
  type MediaOutboundContext,
  type MediaTargetContext,
  MESSAGE_REPLY_LIMIT,
  OUTBOUND_ERROR_CODES,
  type OutboundContext,
  type OutboundErrorCode,
  type OutboundResult,
  parseTarget,
  recordMessageReply,
  type ReplyLimitResult,
  resolveOutboundMediaPath,
  resolveUserFacingMediaError,
  sendCronMessage,
  sendDocument,
  sendMedia,
  sendPhoto,
  sendProactiveMessage,
  sendText,
  sendVideoMsg,
  sendVoice,
  setOutboundAudioPort,
} from "./src/engine/messaging/outbound.js";
