// QA Lab runtime API barrel exposes the SDK and QA bus surface used by fixtures.
/** Commander command type used by QA Lab CLI composition. */
export type { Command } from "commander";
/** OpenClaw config contract type accepted by QA Lab runtime helpers. */
export type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
/** Plugin entry factory re-exported so fixtures can build isolated QA plugins. */
export { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
/** CLI gateway caller used by QA Lab commands that exercise a live gateway. */
export { callGatewayFromCli } from "openclaw/plugin-sdk/gateway-runtime";
/** Plugin runtime type used by QA Lab extension entrypoints. */
export type { PluginRuntime } from "openclaw/plugin-sdk/runtime-store";
/** Default model selector used by QA Lab provider and transport lanes. */
export { defaultQaRuntimeModelForMode } from "./model-selection.runtime.js";
/** QA bus helpers re-exported for scenario fixtures and live transport harnesses. */
export {
  buildQaTarget,
  createQaBusThread,
  deleteQaBusMessage,
  editQaBusMessage,
  getQaBusState,
  injectQaBusInboundMessage,
  normalizeQaTarget,
  parseQaTarget,
  pollQaBus,
  qaChannelPlugin,
  reactToQaBusMessage,
  readQaBusMessage,
  searchQaBusMessages,
  sendQaBusMessage,
  setQaChannelRuntime,
} from "openclaw/plugin-sdk/qa-channel";
/** QA bus protocol types shared by fixtures, transports, and report generation. */
export type {
  QaBusAttachment,
  QaBusConversation,
  QaBusCreateThreadInput,
  QaBusDeleteMessageInput,
  QaBusEditMessageInput,
  QaBusEvent,
  QaBusInboundMessageInput,
  QaBusMessage,
  QaBusOutboundMessageInput,
  QaBusPollInput,
  QaBusPollResult,
  QaBusReactToMessageInput,
  QaBusReadMessageInput,
  QaBusSearchMessagesInput,
  QaBusStateSnapshot,
  QaBusThread,
  QaBusToolCall,
  QaBusWaitForInput,
} from "./protocol.js";
