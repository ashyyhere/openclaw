// Lazy public SDK facade for the bundled QA channel and QA bus protocol helpers.
import type { ChannelPlugin } from "../channels/plugins/types.plugin.js";
import {
  createLazyFacadeObjectValue,
  loadBundledPluginPublicSurfaceModuleSync,
} from "./facade-loader.js";
import type {
  QaBusAttachment,
  QaBusInboundMessageInput,
  QaBusMessage,
  QaBusPollResult,
  QaBusSearchMessagesInput,
  QaBusStateSnapshot,
  QaBusThread,
  QaBusToolCall,
} from "./qa-channel-protocol.js";

/** QA bus protocol types re-exported for plugin and test callers. */
export type * from "./qa-channel-protocol.js";

type QaTargetParts = {
  chatType: "direct" | "channel";
  conversationId: string;
  threadId?: string;
};

type FacadeModule = {
  buildQaTarget: (params: QaTargetParts & { threadId?: string | null }) => string;
  formatQaTarget: (params: QaTargetParts & { threadId?: string | null }) => string;
  createQaBusThread: (params: {
    baseUrl: string;
    accountId: string;
    conversationId: string;
    title: string;
    createdBy?: string;
  }) => Promise<{ thread: QaBusThread }>;
  deleteQaBusMessage: (params: {
    baseUrl: string;
    accountId: string;
    messageId: string;
  }) => Promise<{ message: QaBusMessage }>;
  editQaBusMessage: (params: {
    baseUrl: string;
    accountId: string;
    messageId: string;
    text: string;
  }) => Promise<{ message: QaBusMessage }>;
  getQaBusState: (baseUrl: string) => Promise<QaBusStateSnapshot>;
  injectQaBusInboundMessage: (params: {
    baseUrl: string;
    input: QaBusInboundMessageInput;
  }) => Promise<{ message: QaBusMessage }>;
  normalizeQaTarget: (raw: string) => string | undefined;
  parseQaTarget: (raw: string) => QaTargetParts;
  pollQaBus: (params: {
    baseUrl: string;
    accountId: string;
    cursor: number;
    timeoutMs: number;
    signal?: AbortSignal;
  }) => Promise<QaBusPollResult>;
  qaChannelPlugin: ChannelPlugin;
  reactToQaBusMessage: (params: {
    baseUrl: string;
    accountId: string;
    messageId: string;
    emoji: string;
    senderId?: string;
  }) => Promise<{ message: QaBusMessage }>;
  readQaBusMessage: (params: {
    baseUrl: string;
    accountId: string;
    messageId: string;
  }) => Promise<{ message: QaBusMessage }>;
  searchQaBusMessages: (params: {
    baseUrl: string;
    input: QaBusSearchMessagesInput;
  }) => Promise<{ messages: QaBusMessage[] }>;
  sendQaBusMessage: (params: {
    baseUrl: string;
    accountId: string;
    to: string;
    text: string;
    senderId?: string;
    senderName?: string;
    threadId?: string;
    replyToId?: string;
    attachments?: QaBusAttachment[];
    toolCalls?: QaBusToolCall[];
  }) => Promise<{ message: QaBusMessage }>;
  setQaChannelRuntime: (runtime: unknown) => void;
};

function loadFacadeModule(): FacadeModule {
  return loadBundledPluginPublicSurfaceModuleSync<FacadeModule>({
    dirName: "qa-channel",
    artifactBasename: "api.js",
  });
}

/** Builds a canonical QA target string from chat/conversation/thread parts. */
export const buildQaTarget: FacadeModule["buildQaTarget"] = ((...args) =>
  loadFacadeModule().buildQaTarget(...args)) as FacadeModule["buildQaTarget"];

/** Formats a QA target for user-facing channel display. */
export const formatQaTarget: FacadeModule["buildQaTarget"] = ((...args) =>
  loadFacadeModule().buildQaTarget(...args)) as FacadeModule["buildQaTarget"];

/** Creates a QA bus thread through the bundled channel runtime. */
export const createQaBusThread: FacadeModule["createQaBusThread"] = ((...args) =>
  loadFacadeModule().createQaBusThread(...args)) as FacadeModule["createQaBusThread"];

/** Deletes a QA bus message and returns the updated message state. */
export const deleteQaBusMessage: FacadeModule["deleteQaBusMessage"] = ((...args) =>
  loadFacadeModule().deleteQaBusMessage(...args)) as FacadeModule["deleteQaBusMessage"];

/** Edits a QA bus message through the bundled channel runtime. */
export const editQaBusMessage: FacadeModule["editQaBusMessage"] = ((...args) =>
  loadFacadeModule().editQaBusMessage(...args)) as FacadeModule["editQaBusMessage"];

/** Reads the current QA bus state snapshot. */
export const getQaBusState: FacadeModule["getQaBusState"] = ((...args) =>
  loadFacadeModule().getQaBusState(...args)) as FacadeModule["getQaBusState"];

/** Injects an inbound QA bus message for channel and integration tests. */
export const injectQaBusInboundMessage: FacadeModule["injectQaBusInboundMessage"] = ((...args) =>
  loadFacadeModule().injectQaBusInboundMessage(
    ...args,
  )) as FacadeModule["injectQaBusInboundMessage"];

/** Normalizes raw QA target text when it can be parsed. */
export const normalizeQaTarget: FacadeModule["normalizeQaTarget"] = ((...args) =>
  loadFacadeModule().normalizeQaTarget(...args)) as FacadeModule["normalizeQaTarget"];

/** Parses a QA target into chat, conversation, and optional thread parts. */
export const parseQaTarget: FacadeModule["parseQaTarget"] = ((...args) =>
  loadFacadeModule().parseQaTarget(...args)) as FacadeModule["parseQaTarget"];

/** Polls QA bus events for an account from a cursor. */
export const pollQaBus: FacadeModule["pollQaBus"] = ((...args) =>
  loadFacadeModule().pollQaBus(...args)) as FacadeModule["pollQaBus"];

/** Lazy channel plugin descriptor exposed through the SDK facade. */
export const qaChannelPlugin: FacadeModule["qaChannelPlugin"] = createLazyFacadeObjectValue(
  () => loadFacadeModule().qaChannelPlugin,
);

/** Applies an emoji reaction to a QA bus message. */
export const reactToQaBusMessage: FacadeModule["reactToQaBusMessage"] = ((...args) =>
  loadFacadeModule().reactToQaBusMessage(...args)) as FacadeModule["reactToQaBusMessage"];

/** Reads one QA bus message by id. */
export const readQaBusMessage: FacadeModule["readQaBusMessage"] = ((...args) =>
  loadFacadeModule().readQaBusMessage(...args)) as FacadeModule["readQaBusMessage"];

/** Searches QA bus messages using the protocol query shape. */
export const searchQaBusMessages: FacadeModule["searchQaBusMessages"] = ((...args) =>
  loadFacadeModule().searchQaBusMessages(...args)) as FacadeModule["searchQaBusMessages"];

/** Sends a QA bus message with optional reply, attachment, and tool-call data. */
export const sendQaBusMessage: FacadeModule["sendQaBusMessage"] = ((...args) =>
  loadFacadeModule().sendQaBusMessage(...args)) as FacadeModule["sendQaBusMessage"];

/** Installs the QA channel runtime used by the facade methods. */
export const setQaChannelRuntime: FacadeModule["setQaChannelRuntime"] = ((...args) =>
  loadFacadeModule().setQaChannelRuntime(...args)) as FacadeModule["setQaChannelRuntime"];
