// Manual facade. Keep loader boundary explicit.
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

/** Shared type for this surface in src/plugin-sdk. */
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

/** Reused constant for build Qa Target behavior in src/plugin-sdk. */
export const buildQaTarget: FacadeModule["buildQaTarget"] = ((...args) =>
  loadFacadeModule().buildQaTarget(...args)) as FacadeModule["buildQaTarget"];

/** Reused constant for format Qa Target behavior in src/plugin-sdk. */
export const formatQaTarget: FacadeModule["buildQaTarget"] = ((...args) =>
  loadFacadeModule().buildQaTarget(...args)) as FacadeModule["buildQaTarget"];

/** Reused constant for create Qa Bus Thread behavior in src/plugin-sdk. */
export const createQaBusThread: FacadeModule["createQaBusThread"] = ((...args) =>
  loadFacadeModule().createQaBusThread(...args)) as FacadeModule["createQaBusThread"];

/** Reused constant for delete Qa Bus Message behavior in src/plugin-sdk. */
export const deleteQaBusMessage: FacadeModule["deleteQaBusMessage"] = ((...args) =>
  loadFacadeModule().deleteQaBusMessage(...args)) as FacadeModule["deleteQaBusMessage"];

/** Reused constant for edit Qa Bus Message behavior in src/plugin-sdk. */
export const editQaBusMessage: FacadeModule["editQaBusMessage"] = ((...args) =>
  loadFacadeModule().editQaBusMessage(...args)) as FacadeModule["editQaBusMessage"];

/** Reused constant for get Qa Bus State behavior in src/plugin-sdk. */
export const getQaBusState: FacadeModule["getQaBusState"] = ((...args) =>
  loadFacadeModule().getQaBusState(...args)) as FacadeModule["getQaBusState"];

/** Reused constant for inject Qa Bus Inbound Message behavior in src/plugin-sdk. */
export const injectQaBusInboundMessage: FacadeModule["injectQaBusInboundMessage"] = ((...args) =>
  loadFacadeModule().injectQaBusInboundMessage(
    ...args,
  )) as FacadeModule["injectQaBusInboundMessage"];

/** Reused constant for normalize Qa Target behavior in src/plugin-sdk. */
export const normalizeQaTarget: FacadeModule["normalizeQaTarget"] = ((...args) =>
  loadFacadeModule().normalizeQaTarget(...args)) as FacadeModule["normalizeQaTarget"];

/** Reused constant for parse Qa Target behavior in src/plugin-sdk. */
export const parseQaTarget: FacadeModule["parseQaTarget"] = ((...args) =>
  loadFacadeModule().parseQaTarget(...args)) as FacadeModule["parseQaTarget"];

/** Reused constant for poll Qa Bus behavior in src/plugin-sdk. */
export const pollQaBus: FacadeModule["pollQaBus"] = ((...args) =>
  loadFacadeModule().pollQaBus(...args)) as FacadeModule["pollQaBus"];

/** Reused constant for qa Channel Plugin behavior in src/plugin-sdk. */
export const qaChannelPlugin: FacadeModule["qaChannelPlugin"] = createLazyFacadeObjectValue(
  () => loadFacadeModule().qaChannelPlugin,
);

/** Reused constant for react To Qa Bus Message behavior in src/plugin-sdk. */
export const reactToQaBusMessage: FacadeModule["reactToQaBusMessage"] = ((...args) =>
  loadFacadeModule().reactToQaBusMessage(...args)) as FacadeModule["reactToQaBusMessage"];

/** Reused constant for read Qa Bus Message behavior in src/plugin-sdk. */
export const readQaBusMessage: FacadeModule["readQaBusMessage"] = ((...args) =>
  loadFacadeModule().readQaBusMessage(...args)) as FacadeModule["readQaBusMessage"];

/** Reused constant for search Qa Bus Messages behavior in src/plugin-sdk. */
export const searchQaBusMessages: FacadeModule["searchQaBusMessages"] = ((...args) =>
  loadFacadeModule().searchQaBusMessages(...args)) as FacadeModule["searchQaBusMessages"];

/** Reused constant for send Qa Bus Message behavior in src/plugin-sdk. */
export const sendQaBusMessage: FacadeModule["sendQaBusMessage"] = ((...args) =>
  loadFacadeModule().sendQaBusMessage(...args)) as FacadeModule["sendQaBusMessage"];

/** Reused constant for set Qa Channel Runtime behavior in src/plugin-sdk. */
export const setQaChannelRuntime: FacadeModule["setQaChannelRuntime"] = ((...args) =>
  loadFacadeModule().setQaChannelRuntime(...args)) as FacadeModule["setQaChannelRuntime"];
