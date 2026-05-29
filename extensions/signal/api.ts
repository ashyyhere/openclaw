// extensions/signal api helpers and runtime behavior.
/** Re-exported signal plugin public API, starting with signal Plugin. */
export { signalPlugin } from "./src/channel.js";
/** Re-exported signal plugin public API, starting with signal Setup Plugin. */
export { signalSetupPlugin } from "./src/channel.setup.js";
/** Re-exported signal plugin public API. */
export {
  listEnabledSignalAccounts,
  listSignalAccountIds,
  resolveDefaultSignalAccountId,
  type ResolvedSignalAccount,
  resolveSignalAccount,
} from "./src/accounts.js";
/** Re-exported signal plugin public API. */
export {
  markdownToSignalText,
  markdownToSignalTextChunks,
  type SignalFormattedText,
  type SignalTextStyleRange,
} from "./src/format.js";
/** Re-exported signal plugin public API. */
export {
  formatSignalPairingIdLine,
  formatSignalSenderDisplay,
  formatSignalSenderId,
  isSignalSenderAllowed,
  looksLikeUuid,
  normalizeSignalAllowRecipient,
  resolveSignalPeerId,
  resolveSignalRecipient,
  resolveSignalSender,
  type SignalSender,
} from "./src/identity.js";
/** Re-exported signal plugin public API. */
export {
  extractSignalCliArchive,
  installSignalCli,
  looksLikeArchive,
  type NamedAsset,
  pickAsset,
  type ReleaseAsset,
  type SignalInstallResult,
} from "./src/install-signal-cli.js";
/** Re-exported signal plugin public API, starting with signal Message Actions. */
export { signalMessageActions } from "./src/message-actions.js";
/** Re-exported signal plugin public API, starting with type. */
export { type MonitorSignalOpts, monitorSignalProvider } from "./src/monitor.js";
/** Re-exported signal plugin public API, starting with looks Like Signal Target Id. */
export { looksLikeSignalTargetId, normalizeSignalMessagingTarget } from "./src/normalize.js";
/** Re-exported signal plugin public API. */
export {
  type ResolvedSignalOutboundTarget,
  resolveSignalOutboundTarget,
} from "./src/outbound-session.js";
/** Re-exported signal plugin public API, starting with probe Signal. */
export { probeSignal, type SignalProbe } from "./src/probe.js";
/** Re-exported signal plugin public API. */
export {
  type ResolvedSignalReactionLevel,
  resolveSignalReactionLevel,
  type SignalReactionLevel,
} from "./src/reaction-level.js";
/** Re-exported signal plugin public API. */
export {
  removeReactionSignal,
  sendReactionSignal,
  type SignalReactionOpts,
  type SignalReactionResult,
} from "./src/send-reactions.js";
/** Re-exported signal plugin public API. */
export {
  sendMessageSignal,
  sendReadReceiptSignal,
  sendTypingSignal,
  type SignalReceiptType,
  type SignalRpcOpts,
  type SignalSendOpts,
  type SignalSendResult,
} from "./src/send.js";
/** Re-exported signal plugin public API, starting with normalize Signal Account Input. */
export { normalizeSignalAccountInput } from "./src/setup-core.js";
