// plugins/runtime runtime web channel plugin helpers and runtime behavior.
import type { AgentToolResult } from "../../agents/runtime/index.js";
import type { ChannelAgentTool } from "../../channels/plugins/types.core.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import {
  getDefaultLocalRoots as getDefaultLocalRootsImpl,
  loadWebMedia as loadWebMediaImpl,
  loadWebMediaRaw as loadWebMediaRawImpl,
  optimizeImageToJpeg as optimizeImageToJpegImpl,
} from "../../media/web-media.js";
import type { PollInput } from "../../polls.js";
import {
  createPluginModuleLoaderCache,
  type PluginModuleLoaderCache,
} from "../plugin-module-loader-cache.js";
import type { PluginOrigin } from "../plugin-origin.types.js";
import {
  loadPluginBoundaryModule,
  resolvePluginRuntimeRecordByEntryBaseNames,
  resolvePluginRuntimeModulePath,
} from "./runtime-plugin-boundary.js";

type WebChannelPluginRecord = {
  origin?: PluginOrigin;
  rootDir?: string;
  source: string;
};

type WebChannelLightRuntimeModule = {
  getActiveWebListener: (accountId?: string | null) => unknown;
  getWebAuthAgeMs: (authDir?: string) => number | null;
  logWebSelfId: (authDir?: string, runtime?: unknown, includeChannelPrefix?: boolean) => void;
  logoutWeb: (params: {
    authDir?: string;
    isLegacyAuthDir?: boolean;
    runtime?: unknown;
  }) => Promise<boolean>;
  readWebSelfId: (authDir?: string) => {
    e164: string | null;
    jid: string | null;
    lid: string | null;
  };
  webAuthExists: (authDir?: string) => Promise<boolean>;
  createWhatsAppLoginTool: () => ChannelAgentTool;
  formatError: (error: unknown) => string;
  getStatusCode: (error: unknown) => number | undefined;
  pickWebChannel: (pref: string, authDir?: string) => Promise<string>;
  resolveDefaultWebAuthDir?: () => string;
  WA_WEB_AUTH_DIR?: string;
};

type WebChannelHeavyRuntimeModule = {
  loginWeb: (
    verbose: boolean,
    waitForConnection?: (sock: unknown) => Promise<void>,
    runtime?: unknown,
    accountId?: string,
  ) => Promise<void>;
  sendMessageWhatsApp: (
    to: string,
    body: string,
    options: {
      verbose: boolean;
      cfg?: OpenClawConfig;
      mediaUrl?: string;
      mediaAccess?: {
        localRoots?: readonly string[];
        readFile?: (filePath: string) => Promise<Buffer>;
      };
      mediaLocalRoots?: readonly string[];
      mediaReadFile?: (filePath: string) => Promise<Buffer>;
      gifPlayback?: boolean;
      accountId?: string;
    },
  ) => Promise<{ messageId: string; toJid: string }>;
  sendPollWhatsApp: (
    to: string,
    poll: PollInput,
    options: { verbose: boolean; accountId?: string; cfg?: OpenClawConfig },
  ) => Promise<{ messageId: string; toJid: string }>;
  sendReactionWhatsApp: (
    chatJid: string,
    messageId: string,
    emoji: string,
    options: {
      verbose: boolean;
      fromMe?: boolean;
      participant?: string;
      accountId?: string;
    },
  ) => Promise<void>;
  createWaSocket: (
    printQr: boolean,
    verbose: boolean,
    opts?: { authDir?: string; onQr?: (qr: string) => void },
  ) => Promise<unknown>;
  handleWhatsAppAction: (
    params: Record<string, unknown>,
    cfg: OpenClawConfig,
  ) => Promise<AgentToolResult<unknown>>;
  monitorWebChannel: (...args: unknown[]) => Promise<unknown>;
  monitorWebInbox: (...args: unknown[]) => Promise<unknown>;
  startWebLoginWithQr: (...args: unknown[]) => Promise<unknown>;
  waitForWaConnection: (sock: unknown) => Promise<void>;
  waitForWebLogin: (...args: unknown[]) => Promise<unknown>;
  extractMediaPlaceholder: (...args: unknown[]) => unknown;
  extractText: (...args: unknown[]) => unknown;
};

type WebChannelRuntimeModuleKind = "heavy" | "light";
type CachedWebChannelRuntimeModule = {
  modulePath: string;
  module: WebChannelHeavyRuntimeModule | WebChannelLightRuntimeModule;
};

const webChannelRuntimeModuleCache = new Map<
  WebChannelRuntimeModuleKind,
  CachedWebChannelRuntimeModule
>();

const moduleLoaders: PluginModuleLoaderCache = createPluginModuleLoaderCache();

function resolveWebChannelPluginRecord(): WebChannelPluginRecord {
  return resolvePluginRuntimeRecordByEntryBaseNames(["light-runtime-api", "runtime-api"], () => {
    throw new Error(
      "web channel plugin runtime is unavailable: missing plugin that provides light-runtime-api and runtime-api",
    );
  }) as WebChannelPluginRecord;
}

function resolveWebChannelRuntimeModulePath(
  record: WebChannelPluginRecord,
  entryBaseName: "light-runtime-api" | "runtime-api",
): string {
  const modulePath = resolvePluginRuntimeModulePath(record, entryBaseName, () => {
    throw new Error(`web channel plugin runtime is unavailable: missing ${entryBaseName}`);
  });
  if (!modulePath) {
    throw new Error(`web channel plugin runtime is unavailable: missing ${entryBaseName}`);
  }
  return modulePath;
}

function loadCurrentHeavyModuleSync(): WebChannelHeavyRuntimeModule {
  const record = resolveWebChannelPluginRecord();
  const modulePath = resolveWebChannelRuntimeModulePath(record, "runtime-api");
  return loadPluginBoundaryModule<WebChannelHeavyRuntimeModule>(modulePath, moduleLoaders, {
    origin: record.origin,
  });
}

function getCachedWebChannelRuntimeModule<T extends CachedWebChannelRuntimeModule["module"]>(
  kind: WebChannelRuntimeModuleKind,
  modulePath: string,
  load: () => T,
): T {
  const cached = webChannelRuntimeModuleCache.get(kind);
  if (cached?.modulePath === modulePath) {
    return cached.module as T;
  }
  const loaded = load();
  webChannelRuntimeModuleCache.set(kind, { modulePath, module: loaded });
  return loaded;
}

function loadWebChannelLightModule(): WebChannelLightRuntimeModule {
  const record = resolveWebChannelPluginRecord();
  const modulePath = resolveWebChannelRuntimeModulePath(record, "light-runtime-api");
  return getCachedWebChannelRuntimeModule("light", modulePath, () =>
    loadPluginBoundaryModule<WebChannelLightRuntimeModule>(modulePath, moduleLoaders, {
      origin: record.origin,
    }),
  );
}

async function loadWebChannelHeavyModule(): Promise<WebChannelHeavyRuntimeModule> {
  const record = resolveWebChannelPluginRecord();
  const modulePath = resolveWebChannelRuntimeModulePath(record, "runtime-api");
  return getCachedWebChannelRuntimeModule("heavy", modulePath, () =>
    loadPluginBoundaryModule<WebChannelHeavyRuntimeModule>(modulePath, moduleLoaders, {
      origin: record.origin,
    }),
  );
}

function getLightExport<K extends keyof WebChannelLightRuntimeModule>(
  exportName: K,
): NonNullable<WebChannelLightRuntimeModule[K]> {
  const loaded = loadWebChannelLightModule();
  const value = loaded[exportName];
  if (value == null) {
    throw new Error(`web channel plugin runtime is missing export '${exportName}'`);
  }
  return value as NonNullable<WebChannelLightRuntimeModule[K]>;
}

async function getHeavyExport<K extends keyof WebChannelHeavyRuntimeModule>(
  exportName: K,
): Promise<NonNullable<WebChannelHeavyRuntimeModule[K]>> {
  const loaded = await loadWebChannelHeavyModule();
  const value = loaded[exportName];
  if (value == null) {
    throw new Error(`web channel plugin runtime is missing export '${exportName}'`);
  }
  return value as NonNullable<WebChannelHeavyRuntimeModule[K]>;
}

/** Reused helper for get Active Web Listener behavior in src/plugins/runtime. */
export function getActiveWebListener(
  ...args: Parameters<WebChannelLightRuntimeModule["getActiveWebListener"]>
): ReturnType<WebChannelLightRuntimeModule["getActiveWebListener"]> {
  return getLightExport("getActiveWebListener")(...args);
}

/** Reused helper for get Web Auth Age Ms behavior in src/plugins/runtime. */
export function getWebAuthAgeMs(
  ...args: Parameters<WebChannelLightRuntimeModule["getWebAuthAgeMs"]>
): ReturnType<WebChannelLightRuntimeModule["getWebAuthAgeMs"]> {
  return getLightExport("getWebAuthAgeMs")(...args);
}

/** Reused helper for log Web Self Id behavior in src/plugins/runtime. */
export function logWebSelfId(
  ...args: Parameters<WebChannelLightRuntimeModule["logWebSelfId"]>
): ReturnType<WebChannelLightRuntimeModule["logWebSelfId"]> {
  return getLightExport("logWebSelfId")(...args);
}

/** Reused helper for login Web behavior in src/plugins/runtime. */
export function loginWeb(
  ...args: Parameters<WebChannelHeavyRuntimeModule["loginWeb"]>
): ReturnType<WebChannelHeavyRuntimeModule["loginWeb"]> {
  return loadWebChannelHeavyModule().then((loaded) => loaded.loginWeb(...args));
}

/** Reused helper for logout Web behavior in src/plugins/runtime. */
export function logoutWeb(
  ...args: Parameters<WebChannelLightRuntimeModule["logoutWeb"]>
): ReturnType<WebChannelLightRuntimeModule["logoutWeb"]> {
  return getLightExport("logoutWeb")(...args);
}

/** Reused helper for read Web Self Id behavior in src/plugins/runtime. */
export function readWebSelfId(
  ...args: Parameters<WebChannelLightRuntimeModule["readWebSelfId"]>
): ReturnType<WebChannelLightRuntimeModule["readWebSelfId"]> {
  return getLightExport("readWebSelfId")(...args);
}

/** Reused helper for web Auth Exists behavior in src/plugins/runtime. */
export function webAuthExists(
  ...args: Parameters<WebChannelLightRuntimeModule["webAuthExists"]>
): ReturnType<WebChannelLightRuntimeModule["webAuthExists"]> {
  return getLightExport("webAuthExists")(...args);
}

/** Reused helper for send Web Channel Message behavior in src/plugins/runtime. */
export function sendWebChannelMessage(
  ...args: Parameters<WebChannelHeavyRuntimeModule["sendMessageWhatsApp"]>
): ReturnType<WebChannelHeavyRuntimeModule["sendMessageWhatsApp"]> {
  return loadWebChannelHeavyModule().then((loaded) => loaded.sendMessageWhatsApp(...args));
}

/** Reused helper for send Web Channel Poll behavior in src/plugins/runtime. */
export function sendWebChannelPoll(
  ...args: Parameters<WebChannelHeavyRuntimeModule["sendPollWhatsApp"]>
): ReturnType<WebChannelHeavyRuntimeModule["sendPollWhatsApp"]> {
  return loadWebChannelHeavyModule().then((loaded) => loaded.sendPollWhatsApp(...args));
}

/** Reused helper for send Web Channel Reaction behavior in src/plugins/runtime. */
export function sendWebChannelReaction(
  ...args: Parameters<WebChannelHeavyRuntimeModule["sendReactionWhatsApp"]>
): ReturnType<WebChannelHeavyRuntimeModule["sendReactionWhatsApp"]> {
  return loadWebChannelHeavyModule().then((loaded) => loaded.sendReactionWhatsApp(...args));
}

/** Reused helper for create Runtime Web Channel Login Tool behavior in src/plugins/runtime. */
export function createRuntimeWebChannelLoginTool(
  ...args: Parameters<WebChannelLightRuntimeModule["createWhatsAppLoginTool"]>
): ReturnType<WebChannelLightRuntimeModule["createWhatsAppLoginTool"]> {
  return getLightExport("createWhatsAppLoginTool")(...args);
}

/** Reused helper for create Web Channel Socket behavior in src/plugins/runtime. */
export function createWebChannelSocket(
  ...args: Parameters<WebChannelHeavyRuntimeModule["createWaSocket"]>
): ReturnType<WebChannelHeavyRuntimeModule["createWaSocket"]> {
  return loadWebChannelHeavyModule().then((loaded) => loaded.createWaSocket(...args));
}

/** Reused helper for format Error behavior in src/plugins/runtime. */
export function formatError(
  ...args: Parameters<WebChannelLightRuntimeModule["formatError"]>
): ReturnType<WebChannelLightRuntimeModule["formatError"]> {
  return getLightExport("formatError")(...args);
}

/** Reused helper for get Status Code behavior in src/plugins/runtime. */
export function getStatusCode(
  ...args: Parameters<WebChannelLightRuntimeModule["getStatusCode"]>
): ReturnType<WebChannelLightRuntimeModule["getStatusCode"]> {
  return getLightExport("getStatusCode")(...args);
}

/** Reused helper for pick Web Channel behavior in src/plugins/runtime. */
export function pickWebChannel(
  ...args: Parameters<WebChannelLightRuntimeModule["pickWebChannel"]>
): ReturnType<WebChannelLightRuntimeModule["pickWebChannel"]> {
  return getLightExport("pickWebChannel")(...args);
}

/** Reused helper for resolve Web Channel Auth Dir behavior in src/plugins/runtime. */
export function resolveWebChannelAuthDir(): ReturnType<
  NonNullable<WebChannelLightRuntimeModule["resolveDefaultWebAuthDir"]>
> {
  const loaded = loadWebChannelLightModule();
  if (loaded.resolveDefaultWebAuthDir) {
    return loaded.resolveDefaultWebAuthDir();
  }
  // Older light runtimes expose the default auth dir as a primitive string.
  // Do not accept string-like objects here; Node path APIs reject them before
  // coercion.
  if (typeof loaded.WA_WEB_AUTH_DIR === "string") {
    return loaded.WA_WEB_AUTH_DIR;
  }
  throw new Error("web channel plugin runtime is missing export 'resolveDefaultWebAuthDir'");
}

/** Reused helper for handle Web Channel Action behavior in src/plugins/runtime. */
export async function handleWebChannelAction(
  ...args: Parameters<WebChannelHeavyRuntimeModule["handleWhatsAppAction"]>
): ReturnType<WebChannelHeavyRuntimeModule["handleWhatsAppAction"]> {
  return (await getHeavyExport("handleWhatsAppAction"))(...args);
}

/** Reused helper for load Web Media behavior in src/plugins/runtime. */
export async function loadWebMedia(
  ...args: Parameters<typeof loadWebMediaImpl>
): ReturnType<typeof loadWebMediaImpl> {
  return await loadWebMediaImpl(...args);
}

/** Reused helper for load Web Media Raw behavior in src/plugins/runtime. */
export async function loadWebMediaRaw(
  ...args: Parameters<typeof loadWebMediaRawImpl>
): ReturnType<typeof loadWebMediaRawImpl> {
  return await loadWebMediaRawImpl(...args);
}

/** Reused helper for monitor Web Channel behavior in src/plugins/runtime. */
export function monitorWebChannel(
  ...args: Parameters<WebChannelHeavyRuntimeModule["monitorWebChannel"]>
): ReturnType<WebChannelHeavyRuntimeModule["monitorWebChannel"]> {
  return loadWebChannelHeavyModule().then((loaded) => loaded.monitorWebChannel(...args));
}

/** Reused helper for monitor Web Inbox behavior in src/plugins/runtime. */
export async function monitorWebInbox(
  ...args: Parameters<WebChannelHeavyRuntimeModule["monitorWebInbox"]>
): ReturnType<WebChannelHeavyRuntimeModule["monitorWebInbox"]> {
  return (await getHeavyExport("monitorWebInbox"))(...args);
}

/** Reused helper for optimize Image To Jpeg behavior in src/plugins/runtime. */
export async function optimizeImageToJpeg(
  ...args: Parameters<typeof optimizeImageToJpegImpl>
): ReturnType<typeof optimizeImageToJpegImpl> {
  return await optimizeImageToJpegImpl(...args);
}

/** Reused helper for start Web Login With Qr behavior in src/plugins/runtime. */
export async function startWebLoginWithQr(
  ...args: Parameters<WebChannelHeavyRuntimeModule["startWebLoginWithQr"]>
): ReturnType<WebChannelHeavyRuntimeModule["startWebLoginWithQr"]> {
  return (await getHeavyExport("startWebLoginWithQr"))(...args);
}

/** Reused helper for wait For Web Channel Connection behavior in src/plugins/runtime. */
export async function waitForWebChannelConnection(
  ...args: Parameters<WebChannelHeavyRuntimeModule["waitForWaConnection"]>
): ReturnType<WebChannelHeavyRuntimeModule["waitForWaConnection"]> {
  return (await getHeavyExport("waitForWaConnection"))(...args);
}

/** Reused helper for wait For Web Login behavior in src/plugins/runtime. */
export async function waitForWebLogin(
  ...args: Parameters<WebChannelHeavyRuntimeModule["waitForWebLogin"]>
): ReturnType<WebChannelHeavyRuntimeModule["waitForWebLogin"]> {
  return (await getHeavyExport("waitForWebLogin"))(...args);
}

/** Reused constant for extract Media Placeholder behavior in src/plugins/runtime. */
export const extractMediaPlaceholder = (
  ...args: Parameters<WebChannelHeavyRuntimeModule["extractMediaPlaceholder"]>
) => loadCurrentHeavyModuleSync().extractMediaPlaceholder(...args);

/** Reused constant for extract Text behavior in src/plugins/runtime. */
export const extractText = (...args: Parameters<WebChannelHeavyRuntimeModule["extractText"]>) =>
  loadCurrentHeavyModuleSync().extractText(...args);

/** Reused helper for get Default Local Roots behavior in src/plugins/runtime. */
export function getDefaultLocalRoots(
  ...args: Parameters<typeof getDefaultLocalRootsImpl>
): ReturnType<typeof getDefaultLocalRootsImpl> {
  return getDefaultLocalRootsImpl(...args);
}
