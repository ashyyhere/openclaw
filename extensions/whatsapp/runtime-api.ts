// extensions/whatsapp runtime api helpers and runtime behavior.
/** Re-exported whatsapp plugin public API. */
export {
  getActiveWebListener,
  resolveWebAccountId,
  type ActiveWebListener,
  type ActiveWebSendOptions,
} from "./src/active-listener.js";
/** Re-exported whatsapp plugin public API, starting with handle Whats App Action. */
export { handleWhatsAppAction, whatsAppActionRuntime } from "./src/action-runtime.js";
/** Re-exported whatsapp plugin public API, starting with create Whats App Login Tool. */
export { createWhatsAppLoginTool } from "./src/agent-tools-login.js";
/** Re-exported whatsapp plugin public API. */
export {
  formatWhatsAppWebAuthStatusState,
  getWebAuthAgeMs,
  hasWebCredsSync,
  logWebSelfId,
  logoutWeb,
  pickWebChannel,
  readCredsJsonRaw,
  readWebAuthExistsBestEffort,
  readWebAuthExistsForDecision,
  readWebAuthSnapshot,
  readWebAuthSnapshotBestEffort,
  readWebAuthState,
  readWebSelfId,
  readWebSelfIdentity,
  readWebSelfIdentityForDecision,
  resolveDefaultWebAuthDir,
  resolveWebCredsBackupPath,
  resolveWebCredsPath,
  restoreCredsFromBackupIfNeeded,
  webAuthExists,
  WA_WEB_AUTH_DIR,
  WHATSAPP_AUTH_UNSTABLE_CODE,
  WhatsAppAuthUnstableError,
  type WhatsAppWebAuthState,
} from "./src/auth-store.js";
/** Re-exported whatsapp plugin public API. */
export {
  DEFAULT_WEB_MEDIA_BYTES,
  HEARTBEAT_PROMPT,
  HEARTBEAT_TOKEN,
  monitorWebChannel,
  SILENT_REPLY_TOKEN,
  stripHeartbeatToken,
  type WebChannelStatus,
  type WebMonitorTuning,
} from "./src/auto-reply.js";
/** Re-exported whatsapp plugin public API. */
export {
  extractContactContext,
  extractLocationData,
  extractMediaPlaceholder,
  extractText,
  monitorWebInbox,
  resetWebInboundDedupe,
  type WebInboundMessage,
  type WebListenerCloseReason,
} from "./src/inbound.js";
/** Re-exported whatsapp plugin public API, starting with login Web. */
export { loginWeb } from "./src/login.js";
/** Re-exported whatsapp plugin public API. */
export {
  getDefaultLocalRoots,
  loadWebMedia,
  loadWebMediaRaw,
  LocalMediaAccessError,
  optimizeImageToJpeg,
  optimizeImageToPng,
  type LocalMediaAccessErrorCode,
  type WebMediaResult,
} from "./src/media.js";
/** Re-exported whatsapp plugin public API. */
export {
  sendMessageWhatsApp,
  sendPollWhatsApp,
  sendReactionWhatsApp,
  sendTypingWhatsApp,
} from "./src/send.js";
/** Re-exported whatsapp plugin public API. */
export {
  createWaSocket,
  formatError,
  getStatusCode,
  newConnectionId,
  waitForCredsSaveQueue,
  waitForCredsSaveQueueWithTimeout,
  waitForWaConnection,
  writeCredsJsonAtomically,
  type CredsQueueWaitResult,
} from "./src/session.js";
/** Re-exported whatsapp plugin public API, starting with set Whats App Runtime. */
export { setWhatsAppRuntime } from "./src/runtime.js";
/** Re-exported whatsapp plugin public API, starting with start Web Login With Qr. */
export { startWebLoginWithQr, waitForWebLogin } from "./login-qr-runtime.js";
