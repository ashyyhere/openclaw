// extensions/qqbot runtime api helpers and runtime behavior.
/** Re-exported qqbot plugin public API, starting with Channel Plugin. */
export type { ChannelPlugin, OpenClawPluginApi, PluginRuntime } from "openclaw/plugin-sdk/core";
/** Re-exported qqbot plugin public API, starting with Open Claw Config. */
export type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
/** Re-exported qqbot plugin public API. */
export type {
  OpenClawPluginService,
  OpenClawPluginServiceContext,
  PluginLogger,
} from "openclaw/plugin-sdk/core";
/** Re-exported qqbot plugin public API, starting with Resolved QQBot Account. */
export type { ResolvedQQBotAccount, QQBotAccountConfig } from "./src/types.js";
/** Re-exported qqbot plugin public API, starting with get QQBot Runtime. */
export { getQQBotRuntime, setQQBotRuntime } from "./src/bridge/runtime.js";
