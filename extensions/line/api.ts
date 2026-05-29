// extensions/line api helpers and runtime behavior.
/** Re-exported line plugin public API. */
export type {
  ChannelAccountSnapshot,
  ChannelPlugin,
  OpenClawConfig,
  OpenClawPluginApi,
  PluginRuntime,
} from "openclaw/plugin-sdk/core";
/** Re-exported line plugin public API, starting with Reply Payload. */
export type { ReplyPayload } from "openclaw/plugin-sdk/reply-runtime";
/** Re-exported line plugin public API, starting with Resolved Line Account. */
export type { ResolvedLineAccount } from "./runtime-api.js";
/** Re-exported line plugin public API, starting with line Plugin. */
export { linePlugin } from "./src/channel.js";
/** Re-exported line plugin public API, starting with line Setup Plugin. */
export { lineSetupPlugin } from "./src/channel.setup.js";
