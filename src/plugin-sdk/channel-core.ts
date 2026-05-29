/** Public SDK barrel for core channel plugin types and base plugin construction. */
export type {
  ChannelConfigUiHint,
  ChannelPlugin,
  OpenClawConfig,
  OpenClawPluginApi,
  PluginCommandContext,
  PluginRuntime,
  ChannelOutboundSessionRouteParams,
} from "./core.js";

import { createChannelPluginBase as createChannelPluginBaseFromCore } from "./core.js";

/** Reused constant for create Channel Plugin Base behavior in src/plugin-sdk. */
export const createChannelPluginBase: typeof createChannelPluginBaseFromCore = (params) =>
  createChannelPluginBaseFromCore(params);

/** Re-exported API for src/plugin-sdk. */
export {
  buildChannelConfigSchema,
  buildChannelOutboundSessionRoute,
  buildThreadAwareOutboundSessionRoute,
  clearAccountEntryFields,
  createChatChannelPlugin,
  defineChannelPluginEntry,
  defineSetupPluginEntry,
  parseOptionalDelimitedEntries,
  recoverCurrentThreadSessionId,
  stripChannelTargetPrefix,
  stripTargetKindPrefix,
  tryReadSecretFileSync,
} from "./core.js";
